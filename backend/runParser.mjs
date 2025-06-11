import { Worker } from 'worker_threads';
import path from 'path';
import fs from 'fs';

const files = process.argv.slice(2).map(f => path.resolve(f));
const worker = new Worker(new URL('./workers/parseWorker.mjs', import.meta.url), {
  workerData: { files }
});

worker.on('message', (graph) => {
  fs.writeFileSync('design_hierarchy.json', JSON.stringify(graph, null, 2), 'utf8');
  console.log('Parsed', graph.length, 'modules');
});
worker.on('error', (err) => {
  console.error('Worker error:', err);
});
worker.on('exit', (code) => {
  if (code !== 0) console.error('Worker exited with code', code);
});
