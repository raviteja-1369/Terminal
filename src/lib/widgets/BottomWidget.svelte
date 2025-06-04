<!-- src/lib/widgets/BottomWidget.svelte -->

<script lang="ts">
  import { lastJournal, lastSleep, lastActivity } from '../store';
</script>

  
<div class="bottom-widget">
  <div class="widget-box">📝 Journal: {$lastJournal}</div>
  <div class="widget-box">😴 Sleep: {$lastSleep}</div>
  <div class="widget-box">🧠 Last Activity: {$lastActivity}</div>
</div>

<style>
  .bottom-widget {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  .widget-box {
    padding: 0.75rem 1.25rem;
    background: rgba(0, 255, 238, 0.05);
    border: 1px solid #00ffee88;
    border-radius: 0.5rem;
    color: #00ffee;
    font-family: 'Orbitron', monospace;
    font-size: 1.1rem;
    box-shadow: 0 0 6px #00ffee66;
    backdrop-filter: blur(3px);
    min-width: 220px;
    text-align: center;
  }
</style>
