export async function sendToPerplexity(userInput: string): Promise<string> {
    const res = await fetch('http://localhost:3001/api/perplexity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar', // or sonar-small-chat
        messages: [
          { role: 'system', content: 'Be precise and concise.' },
          { role: 'user', content: userInput }
        ]
      }),
    });
  
    if (!res.ok) {
      throw new Error('Failed to fetch from local proxy');
    }
  
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || 'No response received.';
  }
  