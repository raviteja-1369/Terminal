<script lang="ts">
    import { analyzeVerilogWithPerplexity } from './api/PerplexityAPI';
    import { fileContent, activeFile } from './stores/editorStore';
  
    // Instead of createEventDispatcher, use callback props
    export let onAiResponse: (data: {prompt: string, response: string, file: string, source: string}) => void = () => {};
  
    let userInput = '';
    let isLoading = false;
  
    async function submitPrompt() {
      const trimmed = userInput.trim();
      if (trimmed.length === 0 || isLoading) return;
  
      isLoading = true;
      
      try {
        const currentCode = $fileContent || '// No code loaded';
        const fileName = $activeFile ? $activeFile.split(/[/\\]/).pop() : 'unknown';
        
        console.log('[PERPLEXITY] Analyzing code with prompt:', trimmed);
        
        const aiResponse = await analyzeVerilogWithPerplexity(currentCode, trimmed);
        
        // Call the callback prop instead of dispatching
        onAiResponse({ 
          prompt: trimmed,
          response: aiResponse,
          file: fileName,
          source: 'perplexity'
        });
        
        userInput = '';
      } catch (error) {
        console.error('[PERPLEXITY] Error:', error);
        onAiResponse({ 
          prompt: trimmed,
          response: `❌ Perplexity Error: ${error.message}`,
          file: 'error',
          source: 'error'
        });
      } finally {
        isLoading = false;
      }
    }
  </script>
  
  <div class="code-prompt-box">
    <div class="prompt-wrapper" class:loading={isLoading}>
      <span class="prompt-arrow">&gt;</span>
      <input
        class="prompt-input"
        type="text"
        placeholder={isLoading ? "🔍 Searching latest Verilog practices..." : "Talk to Perplexity... (e.g., optimize this floating-point unit)"}
        bind:value={userInput}
        disabled={isLoading}
        onkeydown={(e) => e.key === 'Enter' && submitPrompt()}
      />
      {#if isLoading}
        <span class="loading-indicator">🔍</span>
      {:else}
        <span class="perplexity-badge">⚡</span>
      {/if}
    </div>
  </div>
  
  
<style>
  .code-prompt-box {
    width: 100%;
    margin-top: 0rem;
    margin-bottom: 0.5rem;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }

  .prompt-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    background: #0f172a;
    border: 1px solid #00ffee66;
    border-radius: 9999px;
    padding: 0.1rem 1rem;
    gap: 0.75rem;
    box-shadow: 0 0 8px #00ffee44;
    transition: all 0.3s;
  }

  .prompt-wrapper.loading {
    border-color: #9333ea;
    box-shadow: 0 0 12px #9333ea44;
  }

  .prompt-arrow {
    font-family: monospace;
    font-size: 1rem;
    color: #00ffeecc;
  }

  .prompt-input {
    flex-grow: 1;
    background: transparent;
    border: none;
    color: #00ffee;
    font-family: 'Orbitron', monospace;
    font-size: 14px;
    outline: none;
    padding: 0.25rem 0;
  }

  .prompt-input:disabled {
    opacity: 0.7;
  }

  .loading-indicator {
    font-size: 16px;
    animation: pulse 1s infinite;
  }

  .perplexity-badge {
    font-size: 14px;
    color: #9333ea;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
</style>
