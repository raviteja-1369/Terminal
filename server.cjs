/* eslint-disable */
const express = require('express');
const cors    = require('cors');
const fs      = require('fs/promises');
const path    = require('path');
const { Worker } = require('worker_threads');

const app  = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let projectFolder = null;
const safeJoin = (base, target) => {
  const p = path.resolve(base, target);
  if (!p.startsWith(path.resolve(base))) throw new Error('Unsafe path');
  return p;
};

/* ---------- FILE I/O ---------- */

app.post('/api/open', async (req,res) => {
  try {
    const folder = req.body?.path;
    if (!folder) return res.status(400).json({error:'Missing path'});
    const files = (await fs.readdir(folder))
      .filter(f => /\.(v|sv|vh)$/i.test(f));
    if (!files.length) return res.status(404).json({error:'No verilog'});
    projectFolder = path.resolve(folder);
    res.json({files});
  } catch(e){ res.status(500).json({error:e.message}) }
});

app.post('/api/load', async (req,res)=>{
  try{
    if(!projectFolder) return res.status(400).json({error:'No project'});
    const fp = safeJoin(projectFolder, req.body.filename);
    const content = await fs.readFile(fp,'utf8');
    res.json({content});
  }catch(e){res.status(500).json({error:e.message})}
});

app.post('/api/save', async (req,res)=>{
  try{
    if(!projectFolder) return res.status(400).json({error:'No project'});
    const {filename,content} = req.body;
    const fp = safeJoin(projectFolder, filename);
    await fs.writeFile(fp, content,'utf8');
    res.json({success:true});
  }catch(e){res.status(500).json({error:e.message})}
});

/* ---------- PARSING ---------- */

const runWorker = (file) =>
  new Promise((resolve,reject)=>{
    const w = new Worker(
    path.join(__dirname,'backend','workers','parseWorker.mjs'),
    { workerData:{ fullPath:file }, type:'module' }   // <-- add type:'module'
  );
  
    w.once('message', m => m.ok ? resolve(m.result) : reject(new Error(m.error)));
    w.once('error', reject);
  });

app.post('/api/parse-project', async (req,res)=>{
  try{
    if(!projectFolder) return res.status(400).json({error:'No project'});
    const files = req.body.files;               // list from client
    if(!Array.isArray(files)) return res.status(400).json({error:'Need files'});
    const full = files.map(f => safeJoin(projectFolder,f));
    const results = (await Promise.all(full.map(runWorker))).flat();
    await fs.writeFile(
      path.join(projectFolder,'design_hierarchy.json'),
      JSON.stringify(results,null,2)
    );
    res.json({graph:results});
  }catch(e){res.status(500).json({error:e.message})}
});

app.get('/api/status',(_,res)=>res.json({status:'ok', projectFolder}));

app.listen(PORT, ()=>console.log(`🚀 API on http://localhost:${PORT}`));
