<script lang="ts">
  import { sendToPerplexity } from '../ai/perplexity';
  import ResponseLeaf from './ResponseLeaf.svelte';
  import { welcomeText, appMode } from '../store';
  import { routeCommand } from '../CommandRouter'; // <-- import this

  let userInput = "";
  let aiMessage = "";
  let showResponse = false;

 
async function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && userInput.trim()) {
    const trimmed = userInput.trim().toLowerCase();
    if (trimmed === 'practiceq') {
      appMode.set('practiceq');
      userInput = '';
      return;
    }
    if (trimmed === 'mindmap') {
      appMode.set('mindmap');
      userInput = '';
      return;
    }

    showResponse = true;
    aiMessage = "Processing...";

    try {
      const response = await routeCommand(userInput); // <-- use this instead of sendToPerplexity
      aiMessage = response;
    } catch (err) {
      aiMessage = "Error: " + err.message;
    }

    userInput = "";
  }
}

</script>


<div class="welcome-portal">
  <div class="portal-core">
    <h1 class="welcome-heading">{$welcomeText}</h1>
    <p class="mission-subtext">"The day is yours. Build, reflect, evolve."</p>

    <!-- Embedded Input Instead of CommandBox -->
    <div class="command-slot">
      <input
        type="text"
        bind:value={userInput}
        on:keydown={handleKeydown}
        placeholder="> Ask anything..."
        class="terminal-input"
      />
    </div>

    <div class="status-indicators">
      <span>🧠 GPU Project: Active</span>
      <span>🔥 Streak: 3d</span>
    </div>
  </div>
</div>

{#if showResponse}
  <ResponseLeaf message={aiMessage} onClose={() => showResponse = false} />
{/if}

<style>
  .welcome-portal {
    display: flex;
    justify-content: center;
    width: 100%;
    padding-top: 2.5rem;
    z-index: 10;
  }

  .portal-core {
    padding: 2rem 2rem 1.5rem;
    max-width: 420px;
    background: rgba(0, 255, 238, 0.03);
    border: 1px solid #00ffee33;
    clip-path: polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px);
    box-shadow: 0 0 18px #00ffee44, 0 0 30px #00ffee22 inset;
    backdrop-filter: blur(4px) saturate(140%);
    color: #00ffee;
    font-family: 'Orbitron', monospace;
    text-align: center;
  }

  .welcome-heading {
    font-size: 1.7rem;
    margin-bottom: 0.7rem;
    color: #00ffee;
    letter-spacing: 0.07em;
  }

  .mission-subtext {
    font-size: 1.05rem;
    color: #bffcff;
    opacity: 0.8;
    margin-bottom: 1.6rem;
  }

  .command-slot {
    display: flex;
    justify-content: left;
    align-items: center;
    width: 100%;
    padding: 0.7rem 1.0rem;
    margin-bottom: 1.8rem;
  }

  .terminal-input {
    background: transparent;
    color: #00ffee;
    border: none;
    border-bottom: 1px solid #00ffee66;
    font-family: 'Orbitron', monospace;
    font-size: 1rem;
    width: 100%;
    outline: none;
  }

  .status-indicators {
    display: flex;
    justify-content: center;
    gap: 2rem;
    font-size: 0.95rem;
    color: #00ffeebb;
    opacity: 0.8;
  }
</style>
