<!-- src/components/ChatWindow.svelte -->
<script lang="ts">
  export let chatLog: { sender: string; content: string }[] = [];
</script>

<div class="chat-window">
  {#each chatLog as message}
    <div class={`message ${message.sender}`}>
      <div class="bubble">
        <span class="label">{message.sender === 'user' ? 'ME:' : 'Terminal'}</span>
        <span class="text">{message.content}</span>
      </div>
    </div>
  {/each}
</div>

<style>
  .chat-window {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
    overflow-y: auto;
    padding: 1rem;
    color: #ccffff;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.95rem;
  }

  .message.user {
    align-self: flex-end;
  }

  .message.deepseek {
    align-self: flex-start;
  }

  .bubble {
    display: inline-block;
    max-width: 70%;
    padding: 0.75rem 1.25rem;
    border-radius: 1rem;
    background: rgba(0, 255, 255, 0.08);
    border: 1px solid rgba(0, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    box-shadow: 0 0 12px #00ffee55 inset, 0 0 8px #00ffee22;
  }

  .message.user .bubble {
    background: rgba(0, 255, 180, 0.12);
    border: 1px solid rgba(0, 255, 180, 0.2);
  }

  .label {
    font-weight: bold;
    margin-right: 0.5rem;
    color: #00ffee;
    text-shadow: 0 0 4px #00ffee88;
  }

  .text {
    white-space: pre-wrap;
  }
</style>