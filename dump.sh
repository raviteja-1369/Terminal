#!/bin/bash

OUTFILE="important_dump.txt"
> "$OUTFILE"

echo "[+] Dumping core project files to $OUTFILE..."

# Backend
for f in backend/*.js backend/**/*.mjs; do
  echo -e "\n--- FILE: $f ---\n" >> "$OUTFILE"
  cat "$f" >> "$OUTFILE"
done

# Server file
echo -e "\n--- FILE: server.cjs ---\n" >> "$OUTFILE"
cat server.cjs >> "$OUTFILE"

# Frontend logic (TS, Svelte)
find src/lib/ProjectSpace -type f \( -name "*.svelte" -o -name "*.ts" \) | while read f; do
  echo -e "\n--- FILE: $f ---\n" >> "$OUTFILE"
  cat "$f" >> "$OUTFILE"
done

# APIs / Stores / Context / Main logic
for f in src/main.js src/lib/store.ts src/lib/contextBuilder.ts; do
  echo -e "\n--- FILE: $f ---\n" >> "$OUTFILE"
  cat "$f" >> "$OUTFILE"
done

echo "[✓] Done. Output in $OUTFILE"
