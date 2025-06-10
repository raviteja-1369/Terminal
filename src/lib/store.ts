import { writable } from 'svelte/store';

// Progress values for Radial Dials
export const digitalProgress = writable(42); // %
export const analogProgress = writable(68);
export const projectProgress = writable(23);

// Welcome message
export const welcomeText = writable('Welcome back, Ravi');

// Streaks — can be adapted later for real logic
export const streaks = writable({
  digital: 3,
  analog: 2,
  project: 5
});

// Journal, Sleep, and Last Activity placeholders
export const lastJournal = writable("Focus: Placement and GPU today.");
export const lastSleep = writable("6h 45min");
export const lastActivity = writable("FP16 Divider Module at 2:30 PM");

// App mode state — used to route major portal screens
export const appMode = writable<'home' | 'practiceq' | 'mindmap' | 'pspace'>('home');

export type PracticeQuestion = {
  id: number;
  text: string;
  options: string[];
  answer: string;
  explanation: string;
  category: 'digital' | 'analog';
};

export const practiceQuestions = writable<PracticeQuestion[]>([]);
