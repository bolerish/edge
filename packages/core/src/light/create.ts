import type { EdgeStyle } from '../surface/geometry.js';
import { normalizeLightOptions, type LightOptions } from './options.js';
import { createLightSession } from './session.js';
import {
  createSurfaceEntry,
  renderSurfaces,
  restoreSurface,
  type SurfaceEntry,
} from '../surface/output.js';

export interface Registration {
  update(edgeStyle: EdgeStyle): void;
  destroy(): void;
}
export interface LightController {
  mount(document: Document): () => void;
  register(element: HTMLElement, edgeStyle: EdgeStyle): Registration;
  configure(options: LightOptions): void;
  refresh(): void;
}

const FULL_TURN_DEGREES = 360;
const owners = new WeakMap<HTMLElement, object>();

/** Creates an inert controller. Framework adapters own mount and registration lifetimes. */
export function createLight(initial: LightOptions = {}): LightController {
  let options = normalizeLightOptions(initial);
  let document: Document | null = null;
  let session: ReturnType<typeof createLightSession> | null = null;
  let randomDirection: number | null = null;
  const entries = new Set<SurfaceEntry>();
  const dirty = new Set<SurfaceEntry>();
  const owner = {};

  function schedule() {
    session?.schedule();
  }
  function refresh(scrollContainer?: Element) {
    let affected = false;
    for (const entry of entries) {
      if (!scrollContainer || (scrollContainer !== entry.element && scrollContainer.contains(entry.element))) {
        dirty.add(entry);
        affected = true;
      }
    }
    if (affected) schedule();
  }

  return {
    mount(target) {
      if (session) throw new Error('Light already has an active owner');
      if (document && target !== document)
        throw new Error('Light cannot span different documents');
      document = target;
      randomDirection = null;
      const connection = createLightSession(target, {
        getMotion: () => options.motion,
        render: (pointer, fixed) => {
          const staticDirection = options.staticDirection === 'random'
            ? (randomDirection ??= Math.random() * FULL_TURN_DEGREES)
            : options.staticDirection;
          renderSurfaces(entries, dirty, { ...options, staticDirection }, pointer, fixed);
        },
        invalidate: refresh,
      });
      for (const entry of entries) connection.observe(entry.element);
      session = connection;
      refresh();
      return () => {
        if (session !== connection) return;
        session = null;
        connection.stop();
        for (const entry of entries) restoreSurface(entry);
        if (entries.size === 0) document = null;
      };
    },
    register(element, edgeStyle) {
      if (document && element.ownerDocument !== document)
        throw new Error('Surface belongs to a different document');
      if (owners.has(element)) throw new Error('Surface already has an owner');
      document = element.ownerDocument;
      owners.set(element, owner);
      const entry = createSurfaceEntry(element, edgeStyle);
      entries.add(entry);
      dirty.add(entry);
      session?.observe(element);
      schedule();
      let removed = false;
      return {
        update(edgeStyle) {
          if (removed || entry.edgeStyle === edgeStyle) return;
          entry.edgeStyle = edgeStyle;
          schedule();
        },
        destroy() {
          if (removed) return;
          removed = true;
          session?.unobserve(element);
          entries.delete(entry);
          dirty.delete(entry);
          owners.delete(element);
          restoreSurface(entry);
          if (!session && entries.size === 0) document = null;
        },
      };
    },
    configure(next) {
      const replacement = normalizeLightOptions(next);
      if (options.motion !== replacement.motion) session?.clearPointer();
      options = replacement;
      schedule();
    },
    refresh,
  };
}
