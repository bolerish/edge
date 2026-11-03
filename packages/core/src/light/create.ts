import type { Material } from '../surface/geometry.js';
import { normalizeLightOptions, type LightOptions } from './options.js';
import { createLightSession } from './session.js';
import {
  createSurfaceEntry,
  renderSurfaces,
  restoreSurface,
  type SurfaceEntry,
} from '../surface/output.js';

export interface Registration {
  update(material: Material): void;
  destroy(): void;
}
export interface LightController {
  mount(document: Document): () => void;
  register(element: HTMLElement, material: Material): Registration;
  configure(options: LightOptions): void;
  refresh(): void;
}

const owners = new WeakMap<HTMLElement, object>();

/** Creates an inert controller. Framework adapters own mount and registration lifetimes. */
export function createLight(initial: LightOptions = {}): LightController {
  let options = normalizeLightOptions(initial);
  let document: Document | null = null;
  let session: ReturnType<typeof createLightSession> | null = null;
  const entries = new Set<SurfaceEntry>();
  const dirty = new Set<SurfaceEntry>();
  const owner = {};

  function schedule() {
    session?.schedule();
  }
  function refresh() {
    for (const entry of entries) dirty.add(entry);
    schedule();
  }

  return {
    mount(target) {
      if (session) throw new Error('Light already has an active owner');
      if (document && target !== document)
        throw new Error('Light cannot span different documents');
      document = target;
      const connection = createLightSession(target, {
        getMode: () => options.mode,
        render: (pointer, fixed) =>
          renderSurfaces(entries, dirty, options, pointer, fixed),
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
    register(element, material) {
      if (document && element.ownerDocument !== document)
        throw new Error('Surface belongs to a different document');
      if (owners.has(element)) throw new Error('Surface already has an owner');
      document = element.ownerDocument;
      owners.set(element, owner);
      const entry = createSurfaceEntry(element, material);
      entries.add(entry);
      dirty.add(entry);
      session?.observe(element);
      schedule();
      let removed = false;
      return {
        update(material) {
          if (removed || entry.material === material) return;
          entry.material = material;
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
      if (options.mode !== replacement.mode) session?.clearPointer();
      options = replacement;
      schedule();
    },
    refresh,
  };
}
