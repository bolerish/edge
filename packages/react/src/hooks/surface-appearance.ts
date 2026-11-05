import type { getSurfaceProps } from '@bolerish/edge-styles';

type Appearance = ReturnType<typeof getSurfaceProps>;
interface Property {
  value: string;
  priority: string;
  written: string | null;
}

/** Owns only added classes and appearance variables, never geometry or host styles. */
export function bindSurfaceAppearance(element: HTMLElement, initial: Appearance) {
  let appearance = initial;
  let lastClass = element.getAttribute('class');
  const owned = new Set<string>();
  const properties = new Map<string, Property>();
  const observer = new element.ownerDocument.defaultView!.MutationObserver(() => {
    // A child can change its own classes without rendering the hook's parent.
    if (element.getAttribute('class') !== lastClass) sync(appearance);
  });
  function sync(next: Appearance) {
    appearance = next;
    // React can replace the class attribute with caller classes that share atomic tokens.
    // Tokens explicitly retained in that replacement now belong to the caller.
    if (element.getAttribute('class') !== lastClass && [...owned].some(token => !element.classList.contains(token))) {
      for (const token of owned) if (element.classList.contains(token)) owned.delete(token);
    }
    const tokens = new Set((next.className ?? '').split(/\s+/).filter(Boolean));
    for (const token of owned) {
      if (!tokens.has(token)) {
        element.classList.remove(token);
        owned.delete(token);
      }
    }
    for (const token of tokens) {
      if (!element.classList.contains(token)) {
        element.classList.add(token);
        owned.add(token);
      }
    }
    lastClass = element.getAttribute('class');
    for (const [name, nextValue] of Object.entries(next.style)) {
      const value = element.style.getPropertyValue(name);
      const priority = element.style.getPropertyPriority(name);
      let state = properties.get(name);
      if (!state) {
        state = { value, priority, written: null };
        properties.set(name, state);
      }
      if (state.written === null || value !== state.written || priority !== '') {
        state.value = value;
        state.priority = priority;
      }
      if (nextValue !== undefined) {
        const written = String(nextValue);
        if (value !== written || priority !== '') element.style.setProperty(name, written);
        state.written = written;
      } else {
        restore(name, state);
      }
    }
  }
  function restore(name: string, state: Property) {
    if (state.written !== null && element.style.getPropertyValue(name) === state.written && element.style.getPropertyPriority(name) === '') {
      if (state.value) element.style.setProperty(name, state.value, state.priority);
      else element.style.removeProperty(name);
    }
    state.written = null;
  }
  sync(initial);
  observer.observe(element, { attributes: true, attributeFilter: ['class'] });
  return {
    update: sync,
    destroy() {
      observer.disconnect();
      for (const token of owned) element.classList.remove(token);
      for (const [name, state] of properties) restore(name, state);
    },
  };
}
