import { useSyncExternalStore } from 'react';

export interface SitePreferences {
  edgeStyle: 'raised' | 'recessed' | 'matte';
  motion: 'system' | 'dynamic' | 'static';
  staticDirection: 'fixed' | 'random';
  theme: 'light' | 'dark';
}
const storageKey = 'wisp:preferences:v1';
const defaults: Readonly<SitePreferences> = Object.freeze({
  edgeStyle: 'raised',
  motion: 'dynamic',
  staticDirection: 'random',
  theme: 'light',
});
// Only the client snapshot changes. SSR always uses the immutable defaults.
let snapshot: Readonly<SitePreferences> = defaults;
let storedValue: string | null | undefined;
const listeners = new Set<() => void>();

export const motionDescriptions: Record<SitePreferences['motion'], string> = {
  system: 'Respects motion and input preferences.',
  dynamic: 'Follows your pointer, even when reduced motion is enabled.',
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
      edgeStyle:
        'edgeStyle' in value && value.edgeStyle === 'recessed' ? 'recessed' : ('edgeStyle' in value && value.edgeStyle === 'matte') || ('material' in value && value.material === 'matte') ? 'matte' : 'raised',
      motion:
        ('motion' in value && value.motion === 'static') || ('mode' in value && value.mode === 'static')
          ? 'static'
          : 'motion' in value && value.motion === 'system' ? 'system' : 'dynamic',
      staticDirection: 'staticDirection' in value && value.staticDirection === 'fixed' ? 'fixed' : 'random',
      theme: 'theme' in value && value.theme === 'dark' ? 'dark' : 'light',
    });
  } catch {
    return defaults;
  }
}
