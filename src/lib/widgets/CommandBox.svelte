<script lang="ts">
  import { routeCommand } from '../CommandRouter';
  import ResponseLeaf from './ResponseLeaf.svelte';

  let userInput = "";
  let aiMessage = "";
  let showResponse = false;


  import { handleAsk } from '../CommandRouter';

async function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && userInput.trim()) {
    aiMessage = "Processing...";
    try {
      aiMessage = await handleAsk(userInput);
    } catch (err) {
      aiMessage = "Error: " + err.message;
    }
    userInput = "";
  }
}

</script>

<div class="command-box">
  <input
    bind:value={userInput}
    on:keydown={handleKeydown}
    class="input-terminal"
    placeholder="Enter command... (log, plan, ask, etc.)"
  />

  {#if showResponse}
    <ResponseLeaf message={aiMessage} onClose={() => (showResponse = false)} />
  {/if}
</div>

<style>
  .command-box {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .input-terminal {
    width: 100%;
    padding: 0.8rem 1.2rem;
    font-family: 'Fira Code', monospace;
    background: rgba(0, 255, 255, 0.05);
    border: 1px solid rgba(0, 255, 255, 0.4);
    border-radius: 0.5rem;
    color: white;
    font-size: 1rem;
    outline: none;
  }

  .input-terminal::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
</style>
