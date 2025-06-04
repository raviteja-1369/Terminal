<script lang="ts">
  import ChatWindow from './ChatWindow.svelte';
  import InputBar from './InputBar.svelte';
  import ThoughtBox from './ThoughtBox.svelte';
  import { streamFromDeepSeek } from '../../lib/llm';

  let chatLog: { sender: string; content: string; timestamp?: Date }[] = [];
  let thought = "";
  let showThought = false;

  async function handleUserInput(userMessage: string) {
    chatLog = [...chatLog, {
      sender: 'user',
      content: userMessage,
      timestamp: new Date()
    }];

    showThought = true;
    thought = "";

    await streamFromDeepSeek(
      userMessage,
      (chunk) => {
        const lowerChunk = chunk.toLowerCase();

        if (lowerChunk.includes("<think>")) {
          showThought = true;
          const thinkContent = chunk.split(/<think>/i)[1]?.split(/<\/think>/i)[0] ?? "";
          thought = thinkContent;
        } else if (chunk.startsWith("THINK:")) {
          showThought = true;
          thought = chunk.replace("THINK:", "");
        } else if (chunk.startsWith("CHAT:")) {
          // Optional: handle token streaming if you want
        }
      },
      (finalResponse) => {
        showThought = false;
        thought = "";
        chatLog = [...chatLog, {
          sender: 'assistant',
          content: finalResponse,
          timestamp: new Date()
        }];
      }
    );
  }
</script>


<div class="hud-frame">
  <svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <polyline points="2,8 2,2 8,2" stroke="#00ffee" stroke-width="0.6" fill="none" />
    <polyline points="92,2 98,2 98,8" stroke="#00ffee" stroke-width="0.6" fill="none" />
    <polyline points="2,92 2,98 8,98" stroke="#00ffee" stroke-width="0.6" fill="none" />
    <polyline points="92,98 98,98 98,92" stroke="#00ffee" stroke-width="0.6" fill="none" />
  </svg>
</div>

<div class="deepseek-wrapper">
  <div class="pill-label">DEEPSEEK MODE</div>

  <div class="chat-area">
    <ChatWindow {chatLog} />
    {#if showThought}
      <ThoughtBox content={thought} />
    {/if}
  </div>

  <div class="input-area">
    <InputBar onSubmit={handleUserInput} />
  </div>
</div>

<style>
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

  .hud-frame svg {
    width: 100%;
    height: 100%;
  }

  .deepseek-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    padding: 2.5rem 1rem 1rem 1rem;
    gap: 1.5rem;
    box-sizing: border-box;
  }

  .pill-label {
    background: rgba(0, 255, 255, 0.1);
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 9999px;
    padding: 0.6rem 1.8rem;
    color: #00ffee;
    font-size: 1.1rem;
    font-weight: bold;
    letter-spacing: 0.15em;
    text-shadow: 0 0 10px #00ffeeaa;
    box-shadow: 0 0 10px #00ffeeaa inset, 0 0 15px #00ffee99;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease-in-out;
    flex-shrink: 0;
  }

  .chat-area {
    width: 85%;
    max-width: 960px;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    background: rgba(0, 255, 255, 0.08);
    border: 1px solid rgba(0, 255, 255, 0.25);
    border-radius: 1rem;
    padding: 1.25rem;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 35px #00ffee44, 0 0 20px #00ffee55 inset;
    position: relative;
  }

  .chat-area::-webkit-scrollbar {
    width: 8px;
  }

  .chat-area::-webkit-scrollbar-track {
    background: transparent;
  }

  .chat-area::-webkit-scrollbar-thumb {
    background: #00ffee44;
    border-radius: 4px;
  }

  .chat-area::-webkit-scrollbar-thumb:hover {
    background: #00ffee66;
  }

  .input-area {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 1rem;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .chat-area {
      width: 95%;
      padding: 1rem;
    }

    .pill-label {
      font-size: 1rem;
      padding: 0.5rem 1.5rem;
    }
  }
</style>