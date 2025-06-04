<script lang="ts">
  import { lastJournal, lastSleep, lastActivity, streaks } from '../store';
</script>

<div class="status-dock">
  <div class="status-box">📝 {$lastJournal}</div>
  <div class="status-box">😴 {$lastSleep}</div>
  <div class="status-box">🧠 {$lastActivity}</div>
  <div class="status-box">🔥 Digital: {$streaks.digital} days</div>
  <div class="status-box">⚡ Analog: {$streaks.analog} days</div>
  <div class="status-box">🚀 Project: {$streaks.project} days</div>
</div>

<style>
  .status-dock {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 3rem;
    margin-bottom: 2.5rem;
    padding: 0 2rem;
    z-index: 2;
    position: relative;
  }

  .status-box {
    position: relative;
    background: rgba(0, 255, 238, 0.025);
    border: 1px solid #00ffee44;
    color: #00ffee;
    font-family: 'Orbitron', monospace;
    font-size: 1rem;
    padding: 0.6rem 1.5rem;
    clip-path: polygon(
      8px 0%, calc(100% - 8px) 0%, 100% 8px,
      100% calc(100% - 8px), calc(100% - 8px) 100%,
      8px 100%, 0% calc(100% - 8px), 0% 8px
    );
    box-shadow: 0 0 6px #00ffee33;
    transition: box-shadow 0.3s ease, background 0.3s ease;
    backdrop-filter: blur(3px);
    white-space: nowrap;
  }

  .status-box:hover {
    background: rgba(0, 255, 238, 0.06);
    box-shadow: 0 0 8px #00ffee77;
  }
</style>
