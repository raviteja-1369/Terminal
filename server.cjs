const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Worker } = require('worker_threads');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- [ OPEN PROJECT: List .v files ] ---
app.post('/api/open', (req, res) => {
  const folderPath = req.body.path;
  if (!folderPath) return res.status(400).json({ error: 'Missing path' });

  try {
    const files = fs.readdirSync(folderPath)
      .filter(f => /\.(v|sv|vh)$/i.test(f))
      .map(f => path.join(folderPath, f));
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- [ LOAD FILE ] ---
app.post('/api/load', (req, res) => {
  const filename = req.body.filename;
  if (!filename) return res.status(400).json({ error: 'Missing filename' });

  try {
    const content = fs.readFileSync(filename, 'utf8');
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- [ SAVE FILE ] ---
app.post('/api/save', (req, res) => {
  const { filename, content } = req.body;
  if (!filename || content === undefined) {
    return res.status(400).json({ error: 'Missing filename or content' });
  }

  try {
    fs.writeFileSync(filename, content, 'utf8');
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- [ PARSE PROJECT (NEW) ] ---
app.post('/api/parse-project', (req, res) => {
  const { files } = req.body;
  if (!Array.isArray(files)) return res.status(400).json({ error: 'Missing files array' });

  const worker = new Worker(path.join(__dirname, 'backend/workers/parseWorker.mjs'), {
    workerData: { files }
  });


 // server.cjs  – inside worker.on('message', …)
worker.on('message', (graph) => {
  const jsonPath = path.join(process.cwd(), 'design_hierarchy.json');
  fs.writeFileSync(jsonPath, JSON.stringify(graph, null, 2), 'utf8');  // ← correct
  res.json({ graph });
});


  worker.on('error', (err) => {
    console.error('[BACKEND] Worker error:', err);
    res.status(500).json({ error: err.message });
  });

  worker.on('exit', (code) => {
    if (code !== 0) console.warn(`[BACKEND] Worker exited with code ${code}`);
  });
});

// --- [ START SERVER ] ---
app.listen(PORT, () => {
  console.log(`[SERVER] Listening on http://localhost:${PORT}`);
});

