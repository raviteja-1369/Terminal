// src/lib/ProjectSpace/api/FileAPI.ts
const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3001';

/* ---------- OPEN PROJECT ---------- */
export async function openProject(folderPath: string): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/open`, {          // << path fixed
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: folderPath })
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()).files;
}

/* ---------- LOAD / SAVE (paths unchanged) ---------- */
export async function loadFile(filename: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/load`, {          // << path fixed
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename })
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()).content;
}

export async function saveFile(filename: string, content: string) {
  const res = await fetch(`${API_BASE}/api/save`, {          // << path fixed
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, content })
  });
  if (!res.ok) throw new Error(await res.text());
}

/* ---------- PARSE PROJECT ---------- */
export async function parseProject(files: string[]) {
  const res = await fetch(`${API_BASE}/api/parse-project`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ files })
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()).graph;
}
