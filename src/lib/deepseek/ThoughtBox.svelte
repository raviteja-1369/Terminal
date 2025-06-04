<!-- src/components/ThoughtBox.svelte -->
<script lang="ts">
  export let content: string = "";
</script>

<div class="thought-float">
  <span class="typing-label">AI: <span class="typewriter">{content}</span></span>
</div>

<style>
  .thought-float {
    position: absolute;
    top: 5.5rem;
    left: 8%;
    max-width: 400px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.95rem;
    color: #00ffee;
    background: rgba(0, 255, 255, 0.06);
    padding: 0.75rem 1.25rem;
    border-radius: 1rem;
    border: 1px solid rgba(0, 255, 255, 0.25);
    box-shadow: 0 0 12px #00ffee55, 0 0 8px #00ffee22 inset;
    backdrop-filter: blur(16px);
    white-space: pre-wrap;
    animation: fadeIn 0.3s ease-in;
    z-index: 900;
  }

  .typing-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>