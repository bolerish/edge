import { useSyncExternalStore } from 'react';

export function useLocationHash() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}
function getSnapshot() {
  return window.location.hash;
}
function getServerSnapshot() {
  return '';
}
