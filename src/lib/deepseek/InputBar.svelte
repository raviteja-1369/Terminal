<!-- src/components/InputBar.svelte -->
<script lang="ts">
  export let onSubmit: (value: string) => void = () => {};

  let userInput = "";

  function handleSubmit() {
    if (userInput.trim()) {
      onSubmit(userInput);
      userInput = "";
    }
  }
</script>

<div class="input-container">
  <div class="input-bar-wrapper">
    <span class="prompt-symbol">&gt;</span>
    <input
      bind:value={userInput}
      type="text"
      class="input-bar"
      placeholder="Ask DeepSeek anything..."
      on:keydown={(e) => e.key === 'Enter' && handleSubmit()}
    />
  </div>
</div>

<style>
  .input-container {
    width: 85%;
    max-width: 960px;
    margin-top: auto;
    padding: 1rem;
    display: flex;
    justify-content: center;
    backdrop-filter: blur(15px);
  }

  .input-bar-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(0, 255, 255, 0.07);
    border: 1px solid rgba(0, 255, 255, 0.4);
    border-radius: 9999px;
    padding: 0.65rem 1.2rem;
    box-shadow: 0 0 12px #00ffff55 inset, 0 0 6px #00ffee44;
  }

  .prompt-symbol {
    color: #00ffee;
    font-weight: bold;
    font-size: 1.2rem;
    text-shadow: 0 0 5px #00ffee99;
    font-family: 'JetBrains Mono', monospace;
  }

  .input-bar {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #ccffff;
    font-family: 'JetBrains Mono', monospace;
    font-size: 1rem;
  }

  .input-bar::placeholder {
    color: #88ccccaa;
  }
</style>