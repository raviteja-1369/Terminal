// backend/workers/parseWorker.js  (run with worker_threads)
import { parentPort, workerData } from 'worker_threads';
import { parseFile } from '../parseVerilog.js';

(async () => {
  try {
    const result = await parseFile(workerData.fullPath);
    parentPort.postMessage({ ok: true, result });
  } catch (err) {
    parentPort.postMessage({ ok: false, error: err.message });
  }
})();
