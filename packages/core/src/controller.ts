import { getLighting, type Material, type Point, type Rectangle } from './geometry.js';

export interface LightOptions {
  mode?: 'auto' | 'pointer' | 'static';
  radius?: number;
  intensity?: number;
}
export interface Registration { update(material: Material): void; destroy(): void }
export interface LightController {
  mount(document: Document): () => void;
  register(element: HTMLElement, material: Material): Registration;
  configure(options: LightOptions): void;
  refresh(): void;
}

const owners = new WeakMap<HTMLElement, object>();
const outputProperties = ['--wisp-angle', '--wisp-strength'] as const;
interface Entry {
  element: HTMLElement;
  material: Material;
  rect: Rectangle | null;
  output: string | null;
  original: Array<{name: string; value: string; priority: string}>;
}

/** Creates an inert controller. Framework adapters own mount and registration lifetimes. */
export function createLight(initial: LightOptions = {}): LightController {
  let options = normalize(initial);
  let document: Document | null = null;
  let session: ReturnType<typeof activate> | null = null;
  let pointer: Point | null = null;
  const entries = new Set<Entry>();
  const dirty = new Set<Entry>();
  const owner = {};

  function schedule() { session?.schedule(); }
  function refresh() {
    for (const entry of entries) dirty.add(entry);
    schedule();
  }
  function restore(entry: Entry) {
    for (const {name,value,priority} of entry.original) {
      if (value) entry.element.style.setProperty(name,value,priority);
      else entry.element.style.removeProperty(name);
    }
    entry.output = null;
  }
  function activate(target: Document) {
    const view = target.defaultView;
    if (!view) throw new Error('Light requires a browser document');
    let live = true;
    let frame: number | null = null;
    const reduced = view.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = view.matchMedia('(hover: hover) and (pointer: fine)');
    function scheduleFrame() {
      if (live && frame === null) frame = view!.requestAnimationFrame(render);
    }
    function render() {
      frame = null;
      if (!live) return;
      for (const entry of dirty) {
        if (entries.has(entry)) entry.rect = entry.element.getBoundingClientRect();
      }
      dirty.clear();
      const fixed = options.mode === 'static'
        || (options.mode === 'auto' && (reduced.matches || (!fine.matches && !pointer)));
      for (const entry of entries) {
        const rect = entry.rect;
        if (!rect) continue;
        let angle = entry.material === 'recessed' ? 135 : 315;
        let strength = 0;
        if (entry.element.isConnected && rect.width > 0 && rect.height > 0) {
          if (fixed) strength = 0.7 * (entry.material === 'matte' ? 0.3 : 1);
          else if (pointer) ({angle,strength} = getLighting(rect,pointer,options.radius,entry.material));
        }
        const values = [`${angle.toFixed(1)}deg`, (strength * options.intensity).toFixed(3)];
        const output = values.join('|');
        if (entry.output === output) continue;
        outputProperties.forEach((name,index) => {
          const value = values[index];
          if (value !== undefined) entry.element.style.setProperty(name,value);
        });
        entry.output = output;
      }
    }
    function move(event: PointerEvent) {
      if (event.pointerType === 'touch' || options.mode === 'static'
        || (options.mode === 'auto' && reduced.matches)) return;
      pointer = {x:event.clientX,y:event.clientY};
      scheduleFrame();
    }
    function clear() { pointer = null; scheduleFrame(); }
    function out(event: PointerEvent) { if (event.relatedTarget === null) clear(); }
    function invalidate() { if (live) refresh(); }
    function mediaChanged() { pointer = null; scheduleFrame(); }
    const observer = new view.ResizeObserver(invalidate);
    for (const entry of entries) observer.observe(entry.element);
    target.addEventListener('pointermove',move,{passive:true});
    target.addEventListener('pointerout',out,{passive:true});
    target.addEventListener('scroll',invalidate,{capture:true,passive:true});
    target.addEventListener('load',invalidate,true);
    view.addEventListener('resize',invalidate,{passive:true});
    view.addEventListener('blur',clear);
    reduced.addEventListener('change',mediaChanged);
    fine.addEventListener('change',mediaChanged);
    target.fonts?.addEventListener('loadingdone',invalidate);
    void target.fonts?.ready.then(invalidate);
    return {
      schedule: scheduleFrame,
      observe(element: HTMLElement) { observer.observe(element); },
      unobserve(element: HTMLElement) { observer.unobserve(element); },
      stop() {
        if (!live) return;
        live = false;
        if (frame !== null) view.cancelAnimationFrame(frame);
        observer.disconnect();
        target.removeEventListener('pointermove',move);
        target.removeEventListener('pointerout',out);
        target.removeEventListener('scroll',invalidate,true);
        target.removeEventListener('load',invalidate,true);
        view.removeEventListener('resize',invalidate);
        view.removeEventListener('blur',clear);
        reduced.removeEventListener('change',mediaChanged);
        fine.removeEventListener('change',mediaChanged);
        target.fonts?.removeEventListener('loadingdone',invalidate);
      },
    };
  }

  return {
    mount(target) {
      if (session) throw new Error('Light already has an active owner');
      if (document && target !== document) throw new Error('Light cannot span different documents');
      document = target;
      const connection = activate(target);
      session = connection;
      pointer = null;
      refresh();
      return () => {
        if (session !== connection) return;
        session = null;
        connection.stop();
        pointer = null;
        for (const entry of entries) restore(entry);
        if (entries.size === 0) document = null;
      };
    },
    register(element,material) {
      if (document && element.ownerDocument !== document) throw new Error('Surface belongs to a different document');
      if (owners.has(element)) throw new Error('Surface already has an owner');
      document = element.ownerDocument;
      owners.set(element,owner);
      const entry: Entry = {
        element,material,rect:null,output:null,
        original:outputProperties.map(name=>({name,value:element.style.getPropertyValue(name),priority:element.style.getPropertyPriority(name)})),
      };
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
          restore(entry);
          if (!session && entries.size === 0) document = null;
        },
      };
    },
    configure(next) {
      const replacement = normalize(next);
      if (options.mode !== replacement.mode) pointer = null;
      options = replacement;
      schedule();
    },
    refresh,
  };
}

function normalize(options: LightOptions) {
  const mode = options.mode ?? 'auto';
  const radius = options.radius ?? 480;
  const intensity = options.intensity ?? 0.75;
  if (!['auto','pointer','static'].includes(mode)) throw new RangeError('Unknown light mode');
  if (!Number.isFinite(radius) || radius <= 0) throw new RangeError('radius must be positive and finite');
  if (!Number.isFinite(intensity) || intensity < 0 || intensity > 1) throw new RangeError('intensity must be between 0 and 1');
  return {mode,radius,intensity};
}
