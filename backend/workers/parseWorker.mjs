// backend/workers/parseWorker.mjs
import { workerData, parentPort } from 'worker_threads';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import * as WebTreeSitter from 'web-tree-sitter';

const require = createRequire(import.meta.url);
let wasmPath;
try {
  wasmPath = require.resolve('../../parsers/tree-sitter-verilog.wasm');
} catch {
  wasmPath = require.resolve('tree-sitter-verilog/verilog.wasm');
}

await WebTreeSitter.Parser.init();
const Verilog = await WebTreeSitter.Language.load(wasmPath);
const parser = new WebTreeSitter.Parser();
parser.setLanguage(Verilog);

/**
 * Recursively dump a Tree-sitter AST for debugging
 */
function dumpTree(node, indent = 0) {
  const padding = ' '.repeat(indent);
  console.log(padding + node.type + (node.isNamed() ? '' : ' (anon)') + `: "${node.text}"`);
  for (let i = 0; i < node.namedChildCount; i++) {
    dumpTree(node.namedChild(i), indent + 2);
  }
}

/**
 * Enhanced Verilog parser that properly extracts design hierarchy
 */
function parseVerilogFile(src, fileName) {
  const tree = parser.parse(src);
  // Optional debugging: dump the AST for specific files
  if (fileName && fileName.includes('FPADD')) {
    console.log('=== DEBUG AST ===');
    dumpTree(tree.rootNode);
  }
  const modules = [];
  const seenModules = new Set(); // Prevent duplicates

  // Find all module declarations
  const moduleNodes = tree.rootNode.descendantsOfType('module_declaration');
  
  moduleNodes.forEach(moduleNode => {
    const moduleInfo = extractModuleInfo(moduleNode, fileName);
    if (moduleInfo && !seenModules.has(`${moduleInfo.module}_${moduleInfo.file}`)) {
      seenModules.add(`${moduleInfo.module}_${moduleInfo.file}`);
      modules.push(moduleInfo);
    }
  });

  return modules;
}

/**
 * Extract complete module information
 */
function extractModuleInfo(moduleNode, fileName) {
  // Extract module name
  const moduleName = getModuleName(moduleNode);
  if (!moduleName || moduleName === 'unknown') return null;

  // Extract ports with direction and width
  const ports = extractPortsWithDetails(moduleNode);
  
  // Extract module instantiations
  const instances = extractModuleInstances(moduleNode);
  
  // Extract parameters
  const parameters = extractParameters(moduleNode);

  console.log(`[PARSER] Module: ${moduleName} | Ports: ${ports.length} | Instances: ${instances.length}`);

  return {
    module: moduleName,
    file: fileName,
    ports: ports,
    instances: instances,
    parameters: parameters,
    range: {
      start: moduleNode.startPosition.row,
      end: moduleNode.endPosition.row
    }
  };
}

/**
 * Extract module name using multiple strategies
 */
function getModuleName(moduleNode) {
  // Strategy 1: Field name
  let nameNode = moduleNode.childForFieldName('name');
  if (nameNode && nameNode.text) return nameNode.text;

  // Strategy 2: Look for identifier after 'module' keyword
  for (let i = 0; i < moduleNode.childCount; i++) {
    const child = moduleNode.child(i);
    if (child.type === 'identifier') {
      return child.text;
    }
  }

  // Strategy 3: Text parsing fallback
  const moduleText = moduleNode.text;
  const match = moduleText.match(/module\s+(\w+)/);
  return match ? match[1] : null;
}

/**
 * Extract ports with comprehensive details
 */
function extractPortsWithDetails(moduleNode) {
  const ports = [];
  const seenPorts = new Set();

  // Method 1: ANSI-style port declarations
  const ansiPorts = moduleNode.descendantsOfType('ansi_port_declaration');
  ansiPorts.forEach(portNode => {
    const portInfo = parsePortDeclaration(portNode, 'ansi');
    portInfo.forEach(port => {
      if (!seenPorts.has(port.name)) {
        seenPorts.add(port.name);
        ports.push(port);
      }
    });
  });

  // Method 2: Traditional port declarations
  const portDecls = moduleNode.descendantsOfType('port_declaration');
  portDecls.forEach(portNode => {
    const portInfo = parsePortDeclaration(portNode, 'traditional');
    portInfo.forEach(port => {
      if (!seenPorts.has(port.name)) {
        seenPorts.add(port.name);
        ports.push(port);
      }
    });
  });

  // Method 3: Input/output declarations
  ['input_declaration', 'output_declaration', 'inout_declaration'].forEach(declType => {
    const decls = moduleNode.descendantsOfType(declType);
    decls.forEach(declNode => {
      const direction = declType.replace('_declaration', '');
      const identifiers = declNode.descendantsOfType('identifier');
      identifiers.forEach(id => {
        if (!seenPorts.has(id.text)) {
          seenPorts.add(id.text);
          ports.push({
            name: id.text,
            direction: direction,
            width: extractWidth(declNode),
            type: 'wire'
          });
        }
      });
    });
  });

  return ports;
}

/**
 * Parse individual port declarations
 */
function parsePortDeclaration(portNode, style) {
  const ports = [];
  
  // Extract direction
  const direction = extractPortDirection(portNode);
  
  // Extract width/range
  const width = extractWidth(portNode);
  
  // Extract port names (port_identifier or identifier)
  const identifiers = [
    ...portNode.descendantsOfType('port_identifier'),
    ...portNode.descendantsOfType('identifier')
  ];
  identifiers.forEach(id => {
    ports.push({
      name: id.text,
      direction: direction,
      width: width,
      type: extractPortType(portNode),
      style: style
    });
  });

  return ports;
}

/**
 * Extract port direction
 */
function extractPortDirection(portNode) {
  const directions = ['input', 'output', 'inout'];

  // Check direct children
  for (let i = 0; i < portNode.childCount; i++) {
    const child = portNode.child(i);
    if (directions.includes(child.text)) {
      return child.text;
    }
    if (child.type === 'port_direction' && directions.includes(child.text)) {
      return child.text;
    }
  }

  const fieldDir = portNode.childForFieldName('direction');
  if (fieldDir && directions.includes(fieldDir.text)) return fieldDir.text;
  
  // Check in text content
  const text = portNode.text.toLowerCase();
  for (const dir of directions) {
    if (text.includes(dir)) return dir;
  }
  
  return 'unknown';
}

/**
 * Extract port width/range
 */
function extractWidth(node) {
  // Look for range expressions [31:0] / [WIDTH-1:0]
  const ranges = [
    ...node.descendantsOfType('range'),
    ...node.descendantsOfType('range_expression'),
    ...node.descendantsOfType('constant_range')
  ];
  if (ranges.length > 0) {
    return ranges[0].text;
  }

  // Look for packed dimensions
  const packedDims = node.descendantsOfType('packed_dimension');
  if (packedDims.length > 0) {
    return packedDims[0].text;
  }
  
  return '1'; // Default single bit
}

/**
 * Extract port type (wire, reg, logic, etc.)
 */
function extractPortType(portNode) {
  const types = ['wire', 'reg', 'logic', 'bit'];

  for (let i = 0; i < portNode.childCount; i++) {
    const child = portNode.child(i);
    if (types.includes(child.text)) {
      return child.text;
    }
  }

  const dataType = portNode.childForFieldName('data_type');
  if (dataType && types.includes(dataType.text)) return dataType.text;

  return 'wire'; // Default
}

/**
 * Extract module instantiations with connections
 */
function extractModuleInstances(moduleNode) {
  const instances = [];
  
  const instantiations = moduleNode.descendantsOfType('module_instantiation');
  
  instantiations.forEach(instNode => {
    const instanceInfo = parseModuleInstance(instNode);
    if (instanceInfo) {
      instances.push(instanceInfo);
    }
  });

  return instances;
}

/**
 * Parse individual module instance
 */
function parseModuleInstance(instNode) {
  // Extract module type (the module being instantiated)
  const moduleType = extractInstanceModuleType(instNode);
  if (!moduleType) return null;

  // Extract instance name
  const instanceName = extractInstanceName(instNode);
  if (!instanceName) return null;

  // Extract parameter assignments
  const parameters = extractInstanceParameters(instNode);

  // Extract port connections
  const connections = extractPortConnections(instNode);

  return {
    type: moduleType,
    label: instanceName,
    parameters: parameters,
    connections: connections
  };
}

/**
 * Extract module type from instantiation
 */
function extractInstanceModuleType(instNode) {
  // First identifier is usually the module type
  const identifiers = instNode.descendantsOfType('identifier');
  return identifiers.length > 0 ? identifiers[0].text : null;
}

/**
 * Extract instance name
 */
function extractInstanceName(instNode) {
  // Instance name is usually the second identifier
  const identifiers = instNode.descendantsOfType('identifier');
  return identifiers.length > 1 ? identifiers[1].text : null;
}

/**
 * Extract parameter assignments for instance
 */
function extractInstanceParameters(instNode) {
  const parameters = {};
  
  const paramAssignments = instNode.descendantsOfType('named_parameter_assignment');
  paramAssignments.forEach(assignment => {
    const paramName = assignment.childForFieldName('parameter')?.text;
    const paramValue = assignment.childForFieldName('value')?.text;
    
    if (paramName && paramValue) {
      parameters[paramName] = paramValue;
    }
  });

  return parameters;
}

/**
 * Extract port connections for instance
 */
function extractPortConnections(instNode) {
  const named = {};
  const positional = [];

  // Named port connections (.port(signal))
  const namedConns = instNode.descendantsOfType('named_port_connection');
  namedConns.forEach(conn => {
    const portName = conn.childForFieldName('port')?.text;
    const signalName = extractConnectionSignal(conn);

    if (portName && signalName) {
      named[portName] = signalName;
    }
  });

  // Ordered port connections (positional)
  const orderedConns = instNode.descendantsOfType('ordered_port_connection');
  orderedConns.forEach(conn => {
    const signalName = extractConnectionSignal(conn);
    if (signalName) {
      positional.push(signalName);
    }
  });

  if (Object.keys(named).length > 0) return named;
  return positional;
}

/**
 * Extract signal name from connection
 */
function extractConnectionSignal(connNode) {
  // Try expression field
  const expr = connNode.childForFieldName('expression');
  if (expr) return expr.text;

  const sig = connNode.childForFieldName('signal');
  if (sig) return sig.text;
  
  // Look for identifiers
  const identifiers = connNode.descendantsOfType('identifier');
  if (identifiers.length > 0) {
    return identifiers[identifiers.length - 1].text; // Last identifier is usually the signal
  }
  
  return null;
}

/**
 * Extract module parameters
 */
function extractParameters(moduleNode) {
  const parameters = [];
  
  const paramDecls = moduleNode.descendantsOfType('parameter_declaration');
  paramDecls.forEach(paramNode => {
    const assignments = paramNode.descendantsOfType('param_assignment');
    assignments.forEach(assignment => {
      const name = assignment.childForFieldName('parameter')?.text;
      const value = assignment.childForFieldName('value')?.text;
      
      if (name) {
        parameters.push({
          name: name,
          value: value || 'undefined'
        });
      }
    });
  });

  return parameters;
}

/* ---------- Main Execution ---------- */
console.log(`[WORKER] Starting to parse ${workerData.files.length} files...`);

const designHierarchy = [];

for (const filePath of workerData.files) {
  try {
    console.log(`[WORKER] Processing: ${filePath}`);
    const src = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    const modules = parseVerilogFile(src, fileName);
    
    console.log(`[WORKER] Found ${modules.length} unique modules in ${fileName}`);
    designHierarchy.push(...modules);
    
  } catch (e) {
    console.error(`[WORKER] Error parsing ${filePath}:`, e.message);
  }
}

console.log(`[WORKER] Total modules extracted: ${designHierarchy.length}`);

// Send the complete design hierarchy
parentPort.postMessage(designHierarchy);
