// backend/parseVerilog.js
// tiny helper: parse ONE verilog / sv file -> JSON ModuleNode[]
import Parser from 'tree-sitter';
import Verilog from 'tree-sitter-verilog';
import fs from 'fs/promises';

const parser = new Parser();
parser.setLanguage(Verilog);

export async function parseFile(fullPath) {
  const src = await fs.readFile(fullPath, 'utf8');
  const tree = parser.parse(src);
  const modules = [];

  tree.rootNode.children.forEach(node => {
    if (node.type !== 'module_declaration') return;

    const name = node.childForFieldName('name')?.text || 'unknown';
    const ports = { input: [], output: [], inout: [] };
    const instances = [];

    // collect ports
    node.descendantsOfType('port_declaration').forEach(p => {
      const dir = p.child(0)?.text; // input/output/inout
      const id  = p.childForFieldName('name')?.text;
      if (dir && id) ports[dir]?.push(id);
    });

    // collect sub-module instantiations
    node.descendantsOfType('module_instantiation').forEach(inst => {
      const subMod = inst.childForFieldName('name')?.text;
      const label  = inst.childForFieldName('instance')?.text;
      if (!subMod || !label) return;

      const conns = {};
      inst.descendantsOfType('named_port_connection').forEach(c => {
        const port = c.childForFieldName('port')?.text;
        const sig  = c.childForFieldName('signal')?.text;
        if (port && sig) conns[port] = sig;
      });

      instances.push({ label, module: subMod, connections: conns });
    });

    modules.push({
      file: fullPath,
      module: name,
      ports,
      instances,
      range: { start: node.startPosition.row, end: node.endPosition.row }
    });
  });

  return modules;
}
