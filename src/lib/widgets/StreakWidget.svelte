<script lang="ts">
  import { streaks } from '../store';
</script>

  <div class="bottom-widget streak-widget">
    <div class="streak-box">🔥 Digital: {$streaks.digital} days</div>
    <div class="streak-box">⚡ Analog: {$streaks.analog} days</div>
    <div class="streak-box">🚀 Project: {$streaks.project} days</div>
  </div>
  

  <style>
    .streak-widget {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 1.5rem;
    }
  
    .streak-box {
      padding: 0.75rem 1.2rem;
      background: rgba(0, 255, 238, 0.05);
      border: 1px solid #00ffee88;
      color: #00ffee;
      font-family: 'Orbitron', monospace;
      font-size: 1.2rem;
      border-radius: 0.5rem;
      box-shadow: 0 0 6px #00ffee66;
      backdrop-filter: blur(3px);
      min-width: 140px;
      text-align: center;
    }
  </style>
  