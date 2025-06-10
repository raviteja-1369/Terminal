<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { Clock3 } from 'lucide-svelte';
  
    const time = writable('00:00:00');
  
    function formatTime(seconds: number): string {
      const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    }
  
    onMount(() => {
      let seconds = 0;
      const interval = setInterval(() => {
        seconds += 1;
        time.set(formatTime(seconds));
      }, 1000);
      return () => clearInterval(interval);
    });
  </script>
  
  <div class="design-bar">
    <div class="title">PROJECT SPACE</div>
    <div class="timer-group">
      <Clock3 class="clock-icon" />
      <span class="timer">{$time}</span>
    </div>
  </div>
  
  <style>
    .design-bar {
      width: 100%;
      height: 60px;
      background: #111827;
      border-bottom: 1px solid #00ffee44;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;
      color: #00ffee;
      font-family: 'Orbitron', monospace;
      font-size: 14px;
      letter-spacing: 1px;
      box-sizing: border-box;
    }
  
    .title {
      font-size: 18px;
      font-weight: bold;
    }
  
    .timer-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
    }
  
    .clock-icon {
      width: 20px;
      height: 20px;
      stroke: #00ffee;
    }
  
    .timer {
      font-weight: bold;
      font-size: 16px;
    }
  </style>
  