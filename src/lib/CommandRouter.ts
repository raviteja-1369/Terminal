import { memoryData } from './memoryStore';
import type { MemoryEntry } from './memoryStore';
import { sendToStrategist } from './llm';
import { buildPrompt } from './contextBuilder';
import { appMode } from './store';

// Handles direct LLM interaction with Strategist/Codex
export async function handleAsk(input: string, input2: string): Promise<string> {
  switch (input2) {
    case 'as': {
      const res = await sendToStrategist(input);
      return res.trim() || "⚠️ No response. Try asking more clearly.";
    }
    default:
      return "❌ Invalid AI mode. Use 'as', 'ap', 'ad', or 'fast'.";
  }
}

// Utility to get current timestamp
function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// 🔁 Main entry point for routing terminal commands
export async function routeCommand(input: string): Promise<string> {
  if (!input || typeof input !== 'string') return "❌ Invalid command";

  const command = input.trim().toLowerCase();

  // 🔁 Quick route: Load GPU Project Space UI
  if (command === 'pspace') {
    appMode.set('pspace');
    return `🧠 Entering Project Space...`;
  }

  // 🔍 Parse structured commands (e.g., log task something)
  const trimmed = input.trim();
  const [cmdRaw, subCmdRaw, ...rest] = trimmed.split(' ');
  const cmd = cmdRaw.toLowerCase();
  const subCmd = subCmdRaw?.toLowerCase();
  const content = rest.join(' ').trim();
  const timestamp = getCurrentTimestamp();

  // 🛑 Block empty inputs except for 'goal' queries
  if (!content && cmd !== 'goal') return `❌ No content provided for command "${cmd}"`;

  switch (cmd) {
    case 'log':
    case 'plan':
    case 'focus':
    case 'task': {
      // ✅ Store structured memory entry
      const entry: MemoryEntry = { type: cmd as any, content, timestamp };
      memoryData.logs.push(entry);
      return `✅ ${cmd.toUpperCase()} saved: ${content}`;
    }

    case 'goal': {
      switch (subCmd) {
        case 'view': {
          // 🎯 Show goal layers
          if (content === 'main') return `🎯 MAIN GOALS:\n- ` + memoryData.mainGoals.join('\n- ');
          if (content === 'weekly') return `📅 WEEKLY GOALS:\n- ` + memoryData.weeklyGoals.join('\n- ');
          if (content === 'today') return `📋 TODAY'S TASKS:\n- ` + memoryData.todayTasks.join('\n- ');
          return `⚠️ Unknown goal view type. Use: goal view [main|weekly|today]`;
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

    // 🤖 AI Routing Section
    case 'as': case 'ad': case 'ap': case 'fast': {
      const fullPrompt = buildPrompt(content);
      return await handleAsk(fullPrompt, cmd);
    }

    // ❓ Unknown command
    default: {
      return `🤖 Unknown command: "${cmd}". Try: log, plan, focus, task, goal, pspace, as.`;
    }
  }
}
