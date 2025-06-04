// lib/CommandRouter.ts

import { memoryData } from './memoryStore';
import type { MemoryEntry } from './memoryStore';
import { sendToStrategist } from './llm';
import { buildPrompt } from './contextBuilder';


export async function handleAsk(input: string, input2: string): Promise<string> {
  
  switch (input2) {
    
    case 'as' : {
      const res = await sendToStrategist(input);
      return res.trim() || "Nor Response. Try Asking More carefully"
    }
          
    default:
      return "❌ Invalid command. Use 'ad', 'ap', or 'fast'.";
  }
}

function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

export async function routeCommand(input: string): Promise<string> {
  if (!input || typeof input !== 'string') return "❌ Invalid command";

  const trimmed = input.trim();
  const [cmdRaw, subCmdRaw, ...rest] = trimmed.split(' ');
  const cmd = cmdRaw.toLowerCase();
  const subCmd = subCmdRaw?.toLowerCase();
  const content = rest.join(' ').trim();
  const timestamp = getCurrentTimestamp();

  if (!content && cmd !== 'goal') return `❌ No content provided for ${cmd}`;

  switch (cmd) {
    case 'log':
    case 'plan':
    case 'focus':
    case 'task': {
      const entry: MemoryEntry = { type: cmd as any, content, timestamp };
      memoryData.logs.push(entry);
      return `✅ ${cmd.toUpperCase()} saved: ${content}`;
    }

    case 'goal': {
      switch (subCmd) {
        case 'view': {
          if (content === 'main') return `🎯 MAIN GOALS:\n- ` + memoryData.mainGoals.join('\n- ');
          if (content === 'weekly') return `📅 WEEKLY GOALS:\n- ` + memoryData.weeklyGoals.join('\n- ');
          if (content === 'today') return `📋 TODAY'S TASKS:\n- ` + memoryData.todayTasks.join('\n- ');
          return `⚠️ Unknown view type. Use: goal view [main|weekly|today]`;
        }
        case 'today': {
          if (rest[0] === 'add') {
            const task = rest.slice(1).join(' ').trim();
            if (!task) return `❌ No task provided.`;
            memoryData.todayTasks.push(task);
            return `✅ TODAY task added: ${task}`;
          }
          return `⚠️ Invalid today command. Use: goal today add [task]`;
        }
        default:
          return `⚠️ Invalid goal command. Try: goal view [main|weekly|today] or goal today add [task]`;
      }
    }

    case 'as': {
      const fullPrompt = buildPrompt(content);
      return await handleAsk(fullPrompt, 'as');
    }

    case 'ad': {
      const fullPrompt = buildPrompt(content);
      return await handleAsk(fullPrompt, 'ad');
    }

    case 'ap': {
      const fullPrompt = buildPrompt(content);
      return await handleAsk(fullPrompt, 'ap');
    }

    case 'fast': {
      const fullPrompt = buildPrompt(content);
      return await handleAsk(fullPrompt, 'fast');
    }

    default: {
      return `🤖 Unknown command: \"${cmd}\". Try: log, plan, focus, task, goal, ask.`;
    }
  }
}
