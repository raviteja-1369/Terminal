<script lang="ts">
  import WelcomePortal from './widgets/WelcomePortal.svelte';
  import StatusDock from './widgets/StatusDock.svelte';
  import FloatingStream from './widgets/FloatingStream.svelte';
  import ResponseLeaf from './widgets/ResponseLeaf.svelte';
  import PracticeQPortal from './widgets/PracticeQPortal.svelte';
  import MindMapScreen from './widgets/MindMapScreen.svelte';
  import { digitalProgress, analogProgress, projectProgress, appMode } from './store';
  import { sendToPerplexity } from './ai/perplexity';
  import RadialDial from './widgets/RadialDial.svelte';
  import { sendToStrategist } from './llm';

  export let onGotoDeepSeek: () => void = () => {};

  let showResponse = false;
  let aiMessage = "";
  $: digital = $digitalProgress ?? 0;
  $: analog = $analogProgress ?? 0;
  $: project = $projectProgress ?? 0;

  async function handleUserInput(input: string) {
    aiMessage = "Thinking...";
    showResponse = true;
    try {
      const reply = await sendToStrategist(input);
      aiMessage = reply;
    } catch (err) {
      aiMessage = "Error: " + err.message;
    }
  }
</script>

<div class="hud-main-container">
   
  <!-- HUD Neon Frame -->
  <svg class="hud-frame" viewBox="0 0 100 100" preserveAspectRatio="none">
    <polyline points="2,8 2,2 8,2" stroke="#00ffee" stroke-width="0.6" fill="none" />
    <polyline points="92,2 98,2 98,8" stroke="#00ffee" stroke-width="0.6" fill="none" />
    <polyline points="2,92 2,98 8,98" stroke="#00ffee" stroke-width="0.6" fill="none" />
    <polyline points="92,98 98,98 98,92" stroke="#00ffee" stroke-width="0.6" fill="none" />
  </svg>

  <!-- Title Bar -->
  <div class="hud-titlebar">
    <svg class="trapezium-bg" viewBox="0 0 400 75" width="400" height="75">
      <polygon points="40,75 0,0 400,0 360,75" class="trapezium-shape" />
    </svg>
    <div class="hud-title-text">TERMINAL</div>
  </div>
  
  <FloatingStream />
  {#if $appMode === 'home'}
    <!-- Main Row: Welcome + Dials -->
    <div class="hud-core-row">
      <div class="welcome-wrapper">
        <WelcomePortal />
      </div>
      <RadialDial label="Digital" percent={digital} />
      <RadialDial label="Analog" percent={analog} />
      <RadialDial label="Project" percent={project} />
    </div>
  {:else if $appMode === 'practiceq'}
    <PracticeQPortal />
  {:else if $appMode === 'mindmap'}
    <MindMapScreen />
  {/if}
  {#if showResponse}
    <ResponseLeaf message={aiMessage} onClose={() => showResponse = false} />
  {/if}

  <!-- Status Dock -->
  <StatusDock />

  <button class="goto-deepseek" on:click={onGotoDeepSeek}>
    💡 Open DeepSeek AI
  </button>
  
</div>

<style>
  :global(html), :global(body) {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden !important;
    background: #0d1117;
    font-family: 'Orbitron', monospace;
  }

  .hud-main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: 100vh;
    position: relative;
  }

  .hud-frame {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 98;
    pointer-events: none;
    opacity: 0.23;
    filter: drop-shadow(0 0 6px #00ffee) blur(0.3px);
  }

  .hud-titlebar {
    position: relative;
    margin-top: 1.2rem;
    z-index: 50;
  }

  .trapezium-bg {
    position: relative;
    top: 0;
    left: 0;
    width: 400px;
    height: 75px;
  }

  .trapezium-shape {
    fill: rgba(10, 20, 35, 0.73);
    stroke: #00ffee;
    stroke-width: 3.5;
  }

  .hud-title-text {
    position: absolute;
    top: 19px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 2.1rem;
    letter-spacing: 0.23em;
    color: #00ffee;
    font-weight: 800;
  }

  .hud-core-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    margin-top: 13rem;
    margin-bottom: 8rem;
    flex-wrap: wrap;
    width: 100%;
    padding: 0 2rem;
    max-width: 1600px;
    z-index: 10;
  }

  .welcome-wrapper {
    flex-shrink: 0;
    min-width: 320px;
    max-width: 420px;
  }
  .goto-deepseek {
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid #00ffeeaa;
  color: #00ffee;
  font-family: 'Orbitron', monospace;
  font-size: 1rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 0 8px #00ffee55;
}
.goto-deepseek:hover {
  background: rgba(0, 255, 255, 0.2);
  transform: scale(1.03);
}

</style>
