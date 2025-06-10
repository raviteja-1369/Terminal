<script lang="ts">
    // Placeholder for interactive architecture view
    // This will later connect to design.json and support clickable blocks
  </script>
  
  <div class="architecture-view" contenteditable="false">
    <h2>🔧 Architecture Map</h2>
    <div class="arch-grid">
      <div class="block">FETCH</div>
      <div class="block">DECODE</div>
      <div class="block">EXECUTE</div>
      <div class="block">MEMORY</div>
      <div class="block">WB</div>
    </div>
  </div>
  
  <style>
    .architecture-view {
      background: #0f172a;
      border: 1px solid #00ffee33;
      padding: 1rem;
      border-radius: 10px;
      flex-grow: 1;
      resize: vertical;
      overflow: auto;
      min-height: 150px;
    }
  
    .architecture-view h2 {
      margin-top: 0;
      font-size: 16px;
      color: #00ffee;
      font-family: 'Orbitron', monospace;
      text-align: center;
    }
  
    .arch-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
      gap: 0.75rem;
      padding-top: 1rem;
    }
  
    .block {
      background: #1e293b;
      border: 1px solid #00ffee55;
      color: #00ffee;
      padding: 0.75rem;
      text-align: center;
      border-radius: 6px;
      font-size: 13px;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s ease;
    }
  
    .block:hover {
      background: #334155;
    }
  </style>
  