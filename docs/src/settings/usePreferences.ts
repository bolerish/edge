import { useSyncExternalStore } from 'react';
import type { LightOptions } from '@bolerish/edge';

export interface SitePreferences {
  material: 'raised' | 'matte';
  mode: NonNullable<LightOptions['mode']>;
  theme: 'light' | 'dark';
}
const storageKey = 'wisp:preferences:v1';
const defaults: Readonly<SitePreferences> = Object.freeze({
  material: 'raised',
  mode: 'pointer',
  theme: 'light',
});
// Only the client snapshot changes. SSR always uses the immutable defaults.
let snapshot: Readonly<SitePreferences> = defaults;
let storedValue: string | null | undefined;
const listeners = new Set<() => void>();

export const modeDescriptions: Record<SitePreferences['mode'], string> = {
  auto: 'Adapts to your device and motion preferences.',
  pointer: 'Follows your pointer, even when reduced motion is enabled.',
  static: 'Keeps the light direction fixed.',
};

export function usePreferences() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
export function updatePreferences(changes: Partial<SitePreferences>) {
  snapshot = Object.freeze({ ...getSnapshot(), ...changes });
  try {
    const next = JSON.stringify(snapshot);
    window.localStorage.setItem(storageKey, next);
    storedValue = next;
  } catch {
    // The current document still works when browser storage is unavailable.
  }
  notify();
}
function subscribe(onChange: () => void) {
  if (listeners.size === 0) window.addEventListener('storage', notify);
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) window.removeEventListener('storage', notify);
  };
}
function notify() {
  for (const listener of listeners) listener();
}
function getServerSnapshot() {
  return defaults;
}
function getSnapshot() {
  try {
    const next = window.localStorage.getItem(storageKey);
    if (next !== storedValue) {
      storedValue = next;
      snapshot = parsePreferences(next);
    }
  } catch {
    // Retain the in-memory snapshot when storage is blocked.
  }
  return snapshot;
}
function parsePreferences(serialized: string | null): Readonly<SitePreferences> {
  try {
    const value: unknown = JSON.parse(serialized ?? 'null');
    if (value === null || typeof value !== 'object') return defaults;
    return Object.freeze({
      material:
        'material' in value && value.material === 'matte' ? 'matte' : 'raised',
      mode:
        'mode' in value && (value.mode === 'auto' || value.mode === 'static')
          ? value.mode
          : 'pointer',
      theme: 'theme' in value && value.theme === 'dark' ? 'dark' : 'light',
    });
  } catch {
    return defaults;
  }
}
