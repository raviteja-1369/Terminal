<script lang="ts">
    let aiResponses: Array<{prompt: string, response: string, file: string, timestamp: Date, source: string}> = [];
  
    export function addResponse(prompt: string, response: string, file: string, source: string = 'ai') {
      aiResponses = [...aiResponses, { prompt, response, file, timestamp: new Date(), source }];
    }
  
    function formatResponse(text: string): string {
      // Basic markdown-like formatting for citations
      return text
        .replace(/\[(\d+)\]/g, '<sup class="citation">[$1]</sup>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }
  </script>
  
  <div class="ai-assistant">
    <h2>🤖 Co-Strategist</h2>
    <div class="ai-output">
      {#if aiResponses.length === 0}
        <div class="default-tips">
          <p><strong>💡 Tip:</strong> Add hazard detection logic to the decode stage.</p>
          <p><strong>🔍 Insight:</strong> Your memory controller can benefit from burst access alignment.</p>
          <p><strong>⚡ Ready:</strong> Ask Perplexity about your Verilog code for real-time insights!</p>
        </div>
      {:else}
        {#each aiResponses.slice(-3) as response}
          <div class="response-item" class:error={response.source === 'error'}>
            <div class="response-header">
              <div class="question">
                <strong>Q:</strong> {response.prompt}
              </div>
              <div class="meta">
                <span class="file-tag">{response.file}</span>
                <span class="source-tag" class:perplexity={response.source === 'perplexity'}>
                  {response.source === 'perplexity' ? '⚡ Perplexity' : response.source}
                </span>
              </div>
            </div>
            <div class="response-content">
              <strong>A:</strong> {@html formatResponse(response.response)}
            </div>
            <div class="timestamp">
              {response.timestamp.toLocaleTimeString()}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
  
  <style>
    .ai-assistant {
      background: #0f172a;
      border: 1px solid #00ffee33;
      padding: 1rem;
      border-radius: 10px;
      flex-grow: 1;
      resize: vertical;
      overflow: auto;
      min-height: 150px;
    }
  
    .ai-assistant h2 {
      margin-top: 0;
      font-size: 16px;
      color: #00ffee;
      font-family: 'Orbitron', monospace;
      text-align: center;
    }
  
    .ai-output {
      margin-top: 1rem;
      font-size: 13px;
      line-height: 1.6;
      color: #c0ffee;
      font-family: monospace;
    }
  
    .default-tips p {
      margin-bottom: 0.75rem;
      padding: 0.5rem;
      background: #1e293b;
      border-radius: 6px;
      border-left: 3px solid #00ffee;
    }
  
    .response-item {
      margin-bottom: 1rem;
      padding: 0.75rem;
      background: #1e293b;
      border-radius: 6px;
      border-left: 3px solid #9333ea;
    }
  
    .response-item.error {
      border-left-color: #ef4444;
      background: #1e1b1b;
    }
  
    .response-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
      font-size: 12px;
      gap: 0.5rem;
    }
  
    .question {
      flex-grow: 1;
    }
  
    .meta {
      display: flex;
      gap: 0.25rem;
      flex-shrink: 0;
    }
  
    .file-tag {
      background: #00ffee22;
      color: #00ffee;
      padding: 0.1rem 0.3rem;
      border-radius: 3px;
      font-size: 10px;
    }
  
    .source-tag {
      background: #374151;
      color: #9ca3af;
      padding: 0.1rem 0.3rem;
      border-radius: 3px;
      font-size: 10px;
    }
  
    .source-tag.perplexity {
      background: #9333ea22;
      color: #9333ea;
    }
  
    .response-content {
      white-space: pre-wrap;
      margin-bottom: 0.5rem;
    }
  
    .response-content :global(.citation) {
      color: #9333ea;
      font-size: 10px;
    }
  
    .timestamp {
      font-size: 10px;
      color: #6b7280;
      text-align: right;
    }
  </style>
  