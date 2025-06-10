const PERPLEXITY_API_KEY = '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'; // Get from perplexity.ai settings
const PERPLEXITY_BASE_URL = 'https://api.perplexity.ai';

export interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callPerplexity(messages: PerplexityMessage[]): Promise<string> {
  console.log('[PERPLEXITY] Sending request...');
  
  try {
    const response = await fetch(`${PERPLEXITY_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'sonar-pro', // Best model with web search + citations
        messages,
        max_tokens: 500,
        temperature: 0.7,
        frequency_penalty: 1
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Perplexity API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('[PERPLEXITY] Response received, usage:', data.usage);
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('[PERPLEXITY] Error:', error);
    throw error;
  }
}

export async function analyzeVerilogWithPerplexity(code: string, userPrompt: string): Promise<string> {
  const messages: PerplexityMessage[] = [
    {
      role: 'system',
      content: `You are an expert Verilog/SystemVerilog hardware design assistant. Analyze code, suggest optimizations, find bugs, and provide hardware design insights. Use real-time web search to find the latest best practices and cite your sources. Keep responses practical and actionable.`
    },
    {
      role: 'user',
      content: `Here's my Verilog code:\n\n\`\`\`verilog\n${code}\n\`\`\`\n\nUser request: ${userPrompt}\n\nPlease analyze this code and provide insights with citations to current best practices.`
    }
  ];

  return await callPerplexity(messages);
}
