import { memoryData } from './memoryStore';
import { ragChunks } from './ragStore';
import { tonePrefix } from './tonePrefix';

function searchRAG(userPrompt: string): string {
  return ragChunks
    .filter(chunk => userPrompt.toLowerCase().includes(chunk.topic))
    .map(chunk => `From Junior’s memory about ${chunk.topic}: ${chunk.content}`)
    .join('\n');
}


export function buildPrompt(userPrompt: string): string {
  const tonePrefix = "You are Strategist, a reasoning assistant trained to explain game theory in a clear, personal way.";

  const lastLogs = memoryData.logs
    .slice(-3)
    .map(log => `- ${log.type.toUpperCase()}: ${log.content}`)
    .join('\n');


  return `${tonePrefix}

# Instruction
${userPrompt}

# Answer
`;
}
