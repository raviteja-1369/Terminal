<script lang="ts">
    import { onDestroy } from 'svelte';
  
    export let message: string;
    export let onClose: () => void;
  
    let copied = false;
    let displayedText = "";
    let typingInterval: number | null = null;
    let currentIndex = 0;
  
    function copyToClipboard() {
      navigator.clipboard.writeText(message).then(() => {
        copied = true;
        setTimeout(() => copied = false, 1500);
      });
    }
  
    function startTypewriter(text: string) {
      // Clear any existing interval
      if (typingInterval !== null) {
        clearInterval(typingInterval);
        typingInterval = null;
      }
  
      displayedText = "";
      currentIndex = 0;
  
      if (!text) return; // Do nothing if the message is empty
  
      typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          displayedText += text[currentIndex];
          currentIndex++;
        } else {
          if (typingInterval !== null) {
            clearInterval(typingInterval);
            typingInterval = null;
          }
        }
      }, 12); // Adjust typing speed (milliseconds) as needed
    }
  
    // Reactive statement: This block runs whenever 'message' changes
    $: {
      if (message) {
        startTypewriter(message);
      } else {
        // Handle empty message case if needed, e.g., clear displayedText
        displayedText = "";
        if (typingInterval !== null) {
          clearInterval(typingInterval);
          typingInterval = null;
        }
      }
    }
  
    // Ensure the interval is cleared when the component is destroyed
    onDestroy(() => {
      if (typingInterval !== null) {
        clearInterval(typingInterval);
      }
    });
  </script>
  
  <style>
  .response-overlay {
    position: absolute;
    top: calc(50% - 20vh);
    left: calc(30% + 6vw);
    width: 50vw;
    height: 30vh;
    padding: 2rem;
    background: rgba(0, 255, 255, 0.08);
    border: 1px solid rgba(0, 255, 255, 0.4);
    border-radius: 1.5rem;
    backdrop-filter: blur(24px) brightness(1.1);
    -webkit-backdrop-filter: blur(24px) brightness(1.1);
    box-shadow: 0 0 40px rgba(0, 255, 255, 0.3), inset 0 0 30px rgba(0, 255, 255, 0.1);
    color: #ffffff;
    font-family: 'Fira Code', monospace;
    font-size: 0.95rem;
    animation: fadeIn 0.3s ease-out;
    z-index: 999;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .message-content {
    white-space: pre-wrap;
    font-family: 'Fira Code', monospace;
    font-size: 1rem;
    line-height: 1.4;
    overflow-y: auto;
    max-height: 22vh;
  }
  
  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 0.8rem;
    margin-top: 1.5rem;
  }
  
  .btn {
    background: transparent;
    border: 1px solid rgba(0, 255, 255, 0.6);
    color: #00ffee;
    border-radius: 0.5rem;
    padding: 4px 14px;
    font-size: 0.85rem;
    font-family: 'Fira Code', monospace;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(8px);
  }
  
  .btn:hover {
    background: rgba(0, 255, 255, 0.2);
    transform: scale(1.05);
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.97);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  </style>
  
  <div class="response-overlay">
    <div class="message-content">{message}</div>
  
    <div class="buttons">
      <button class="btn" on:click={copyToClipboard}>
        {#if copied}Copied{:else}Copy{/if}
      </button>
      <button class="btn" on:click={onClose}>Close</button>
    </div>
  </div>
  