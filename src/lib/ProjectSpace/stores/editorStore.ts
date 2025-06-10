import { writable } from 'svelte/store';

export const openFiles = writable<string[]>([]);
export const activeFile = writable<string | null>(null);
export const fileContent = writable<string>('// No file open. Click 📂 to open a project.');
export const projectName = writable('GPU');
export const isLoading = writable(false);
