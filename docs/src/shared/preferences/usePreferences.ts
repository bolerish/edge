import { m } from '../../paraglide/messages.js';
import { useSyncExternalStore } from 'react';

export interface SitePreferences {
  edgeStyle: 'raised' | 'recessed' | 'matte';
  motion: 'system' | 'dynamic' | 'static';
  staticDirection: 0 | 90 | 180 | 270 | 315 | 'random';
  direction: 'gather' | 'spread';
  radius: number;
  theme: 'light' | 'dark';
}
const storageKey = 'edge:preferences:v1';
const defaults: Readonly<SitePreferences> = Object.freeze({
  edgeStyle: 'raised',
  motion: 'dynamic',
  staticDirection: 'random',
  direction: 'gather',
  radius: 480,
  theme: 'light',
});
// Only the client snapshot changes. SSR always uses the immutable defaults.
let snapshot: Readonly<SitePreferences> = defaults;
let storedValue: string | null | undefined;
const listeners = new Set<() => void>();

export const motionDescriptions: Record<SitePreferences['motion'], string> = {
  get system() {
    return m.motion_system_hint();
  },
  get dynamic() {
    return m.motion_dynamic_hint();
  },
  get static() {
    return m.motion_static_hint();
  },
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
  applyTheme();
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) window.removeEventListener('storage', notify);
  };
}
function notify() {
  applyTheme();
  for (const listener of listeners) listener();
}
function applyTheme() {
  const theme = getSnapshot().theme;
  if (document.documentElement.dataset.bolerishTheme !== theme)
    document.documentElement.dataset.bolerishTheme = theme;
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
        'edgeStyle' in value && value.edgeStyle === 'recessed'
          ? 'recessed'
          : ('edgeStyle' in value && value.edgeStyle === 'matte') ||
              ('material' in value && value.material === 'matte')
            ? 'matte'
            : 'raised',
      motion:
        ('motion' in value && value.motion === 'static') ||
        ('mode' in value && value.mode === 'static')
          ? 'static'
          : 'motion' in value && value.motion === 'system'
            ? 'system'
            : 'dynamic',
      staticDirection:
        'staticDirection' in value ? parseStaticDirection(value.staticDirection) : 'random',
      direction: 'direction' in value && value.direction === 'spread' ? 'spread' : 'gather',
      radius:
        'radius' in value &&
        typeof value.radius === 'number' &&
        Number.isFinite(value.radius) &&
        value.radius > 0
          ? value.radius
          : 480,
      theme: 'theme' in value && value.theme === 'dark' ? 'dark' : 'light',
    });
  } catch {
    return defaults;
  }
}

function parseStaticDirection(value: unknown): SitePreferences['staticDirection'] {
  if (value === 'fixed') return 315;
  if (value === 0 || value === 90 || value === 180 || value === 270 || value === 315) return value;
  return 'random';
}

const subscribeToHydration = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function usePreferencesReady() {
  return useSyncExternalStore(subscribeToHydration, clientReady, serverReady);
}
