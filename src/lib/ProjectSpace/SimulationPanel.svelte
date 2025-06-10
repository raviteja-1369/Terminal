<script lang="ts">
    // Placeholder for waveform or state probe output
  </script>
  
  <div class="simulation-panel">
    <h2>📈 Simulation Output</h2>
    <div class="sim-frame">
      <p>Waveform output will be displayed here (Verilator JSON or VCD viewer).</p>
    </div>
  </div>
  
  <style>
    .simulation-panel {
      background: #0f172a;
      border: 1px solid #00ffee33;
      padding: 1rem;
      border-radius: 10px;
      height: 100%;
      display: flex;
      flex-direction: column;
      resize: vertical;
      overflow: auto;
      min-height: 200px;
    }
  
    .simulation-panel h2 {
      font-size: 16px;
      font-family: 'Orbitron', monospace;
      color: #00ffee;
      text-align: center;
      margin-top: 0;
    }
  
    .sim-frame {
      flex-grow: 1;
      background: #1e293b;
      border: 1px solid #00ffee55;
      color: #00ffee;
      padding: 1rem;
      border-radius: 6px;
      font-size: 13px;
      font-family: monospace;
    }
  </style>
  