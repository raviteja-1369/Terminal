import { writable } from 'svelte/store';

export const moduleGraph   = writable<Record<string, any>>({});
export const currentModule = writable<string|null>(null);
