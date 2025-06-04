<script lang="ts">
    import { onMount } from 'svelte';
    import { memoryData } from '../memoryStore';
  
    let visibleItems: { text: string; id: number }[] = [];
    let idCounter = 0;
  
    function pickRandomMemory(): string {
     return "💬 TEST — Floating works!";
   }

    function pickRandomMemoryw(): string {
      const all = [
        ...memoryData.logs.map(e => e.content),
        ...memoryData.todayTasks,
        ...memoryData.focusItems
      ];
  
      if (all.length === 0) {
        console.warn("⚠️ No memory to float.");
        return "🧠 No memory data yet. Start logging.";
      }
  
      return all[Math.floor(Math.random() * all.length)];
    }
  
    function addFloatingItem() {
      const text = pickRandomMemory();
      const id = idCounter++;
      visibleItems = [...visibleItems, { text, id }];
  
      setTimeout(() => {
        visibleItems = visibleItems.filter(item => item.id !== id);
      }, 10000);
    }
  
    onMount(() => {
      console.log("🟢 FloatingStream mounted");
      console.log("🧠 Logs:", memoryData.logs);
      console.log("📋 Tasks:", memoryData.todayTasks);
      console.log("🎯 Focus:", memoryData.focusItems);

      addFloatingItem();
      const interval = setInterval(addFloatingItem, 3000);
      return () => clearInterval(interval);
    });
  </script>
  
  <style>
    .stream-container {
      position: fixed;
      top: 10vh;
      width: 100vw;
      pointer-events: none;
      overflow: hidden;
      z-index: 9999;
    }
  
    .floating-text {
      position: absolute;
      left: 100vw;
      white-space: nowrap;
      font-family: 'Fira Code', monospace;
      font-size: 1rem;
      color: rgba(0, 255, 255, 0.75);
      text-shadow: 0 0 6px rgba(0, 255, 255, 0.8);
      animation: scroll-left 12s linear forwards;
    }
  
    @keyframes scroll-left {
      from { left: 100vw; top: calc(5vh + 50px * var(--i)); }
      to { left: -100%; top: calc(5vh + 50px * var(--i)); }
    }
  </style>
  
  <div class="stream-container">
    {#each visibleItems as item, i (item.id)}
      <div class="floating-text" style="--i: {i}">{item.text}</div>
    {/each}
  </div>
  