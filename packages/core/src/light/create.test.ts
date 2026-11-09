// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createLight } from './create.js';

let frames: Map<number, FrameRequestCallback>;
let frameId: number;
let queries: MediaQueryList[];
let observers: Array<{ fire(): void; disconnected: boolean; targets: Set<Element> }>;
function flush() {
  const batch = [...frames.values()];
  frames.clear();
  for (const callback of batch) callback(0);
}
function element() {
  const node = document.createElement('button');
  document.body.append(node);
  const measure = vi.spyOn(node, 'getBoundingClientRect').mockReturnValue({
    left: 100,
    top: 100,
    width: 100,
    height: 100,
    right: 200,
    bottom: 200,
    x: 100,
    y: 100,
    toJSON() {},
  });
  return { node, measure };
}
function point(x = 250, y = 150, pointerType = 'mouse') {
  document.dispatchEvent(
    Object.assign(new Event('pointermove'), {
      clientX: x,
      clientY: y,
      pointerType,
    }),
  );
}
beforeEach(() => {
  document.body.replaceChildren();
  frames = new Map();
  frameId = 0;
  queries = [];
  observers = [];
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++frameId, callback);
    return frameId;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    frames.delete(id);
  });
  vi.stubGlobal('matchMedia', (query: string) => {
    const result = Object.assign(new EventTarget(), {
      media: query,
      matches: query.includes('pointer: fine'),
      onchange: null,
      addListener() {},
      removeListener() {},
    });
    queries.push(result);
    return result;
  });
  vi.stubGlobal(
    'ResizeObserver',
    class {
      state: { fire(): void; disconnected: boolean; targets: Set<Element> };
      constructor(callback: ResizeObserverCallback) {
        this.state = { fire: () => callback([], this), disconnected: false, targets: new Set() };
        observers.push(this.state);
      }
      observe(target: Element) {
        this.state.targets.add(target);
      }
      unobserve(target: Element) {
        this.state.targets.delete(target);
      }
      disconnect() {
        this.state.disconnected = true;
      }
    },
  );
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('queues child registrations, coalesces pointer frames and reuses geometry', () => {
  const light = createLight();
  const { node, measure } = element();
  const entry = light.register(node, 'raised');
  expect(frames.size).toBe(0);
  const stop = light.mount(document);
  flush();
  point();
  point();
  point();
  expect(frames.size).toBe(1);
  flush();
  expect(node.style.getPropertyValue('--edge-angle')).toBe('90.0deg');
  expect(measure).toHaveBeenCalledOnce();
  expect(frames.size).toBe(0);
  point(50, 150);
  flush();
  expect(node.style.getPropertyValue('--edge-angle')).toBe('270.0deg');
  expect(measure).toHaveBeenCalledOnce();
  entry.destroy();
  stop();
});
it('restores values and rewrites static output after stop and restart', () => {
  const light = createLight({ motion: 'static' });
  const { node } = element();
  node.style.setProperty('--edge-angle', '22deg', 'important');
  const entry = light.register(node, 'raised');
  let stop = light.mount(document);
  flush();
  expect(node.style.getPropertyValue('--edge-angle')).toBe('315.0deg');
  stop();
  stop();
  expect(node.style.getPropertyValue('--edge-angle')).toBe('22deg');
  expect(node.style.getPropertyPriority('--edge-angle')).toBe('important');
  stop = light.mount(document);
  flush();
  expect(node.style.getPropertyValue('--edge-angle')).toBe('315.0deg');
  entry.destroy();
  stop();
  expect(node.style.getPropertyValue('--edge-angle')).toBe('22deg');
  expect(observers.every((observer) => observer.disconnected)).toBe(true);
});
it('updates edgeStyle and options without a new pointer and attaches late surfaces', () => {
  const light = createLight({ motion: 'static' });
  const stop = light.mount(document);
  const { node } = element();
  const entry = light.register(node, 'raised');
  expect(frames.size).toBe(1);
  flush();
  entry.update('recessed');
  flush();
  expect(node.style.getPropertyValue('--edge-angle')).toBe('315.0deg');
  light.configure({ motion: 'static', intensity: 0.4 });
  flush();
  expect(node.style.getPropertyValue('--edge-strength')).toBe('0.280');
  entry.destroy();
  stop();
});
it('separates visual and geometry invalidation and refreshes stationary pointers', () => {
  const light = createLight();
  const { node, measure } = element();
  light.register(node, 'raised');
  const stop = light.mount(document);
  point();
  flush();
  document.dispatchEvent(new Event('scroll'));
  flush();
  expect(measure).toHaveBeenCalledTimes(2);
  light.refresh();
  flush();
  expect(measure).toHaveBeenCalledTimes(3);
  stop();
  expect(frames.size).toBe(0);
});
it('rejects duplicate ownership and other documents even before mounting', () => {
  const first = createLight();
  const second = createLight();
  const { node } = element();
  const entry = first.register(node, 'raised');
  expect(() => second.register(node, 'raised')).toThrow('owner');
  const another = document.implementation.createHTMLDocument();
  expect(() => first.register(another.createElement('div'), 'raised')).toThrow('document');
  expect(() => first.mount(another)).toThrow('document');
  entry.destroy();
  entry.destroy();
  const replacement = second.register(node, 'matte');
  replacement.destroy();
});
it('accepts mouse events on hybrid devices and keeps auto reduced-motion static', () => {
  const light = createLight();
  const { node } = element();
  light.register(node, 'raised');
  const stop = light.mount(document);
  flush();
  const fine = queries[1];
  if (!fine) throw new Error('no media query');
  Object.defineProperty(fine, 'matches', { value: false });
  fine.dispatchEvent(new Event('change'));
  flush();
  point();
  flush();
  expect(node.style.getPropertyValue('--edge-angle')).toBe('90.0deg');
  const reduced = queries[0];
  if (!reduced) throw new Error('no media query');
  Object.defineProperty(reduced, 'matches', { value: true });
  reduced.dispatchEvent(new Event('change'));
  point();
  flush();
  expect(node.style.getPropertyValue('--edge-angle')).toBe('315.0deg');
  light.configure({ motion: 'dynamic' });
  point();
  flush();
  expect(node.style.getPropertyValue('--edge-angle')).toBe('90.0deg');
  stop();
});
it('cancels frames and ignores late observer callbacks after stopping', () => {
  const light = createLight();
  const { node } = element();
  const entry = light.register(node, 'raised');
  const stop = light.mount(document);
  point();
  stop();
  expect(frames.size).toBe(0);
  point();
  expect(frames.size).toBe(0);
  for (const observer of observers) observer.fire();
  light.refresh();
  expect(frames.size).toBe(0);
  entry.destroy();
  expect(node.style.getPropertyValue('--edge-strength')).toBe('');
});
it('clears pointer output on window blur and ignores touch movement without a press', () => {
  const light = createLight();
  const { node } = element();
  light.register(node, 'raised');
  const stop = light.mount(document);
  point(250, 150, 'touch');
  flush();
  expect(node.style.getPropertyValue('--edge-strength')).toBe('0.000');
  point();
  flush();
  window.dispatchEvent(new Event('blur'));
  flush();
  expect(node.style.getPropertyValue('--edge-strength')).toBe('0.000');
  stop();
});
it('renders the same light for mouse and touch coordinates, then retains the position on release', () => {
  const light = createLight();
  const { node } = element();
  light.register(node, 'raised');
  const stop = light.mount(document);
  point();
  flush();
  const mouse = node.style.cssText;
  document.dispatchEvent(
    Object.assign(new Event('touchstart'), {
      touches: [{ identifier: 1, clientX: 250, clientY: 150 }],
      changedTouches: [{ identifier: 1, clientX: 250, clientY: 150 }],
    }),
  );
  flush();
  expect(node.style.cssText).toBe(mouse);
  document.dispatchEvent(
    Object.assign(new Event('touchend'), {
      touches: [],
      changedTouches: [{ identifier: 1 }],
    }),
  );
  flush();
  expect(node.style.cssText).toBe(mouse);
  stop();
});
it('validates options atomically', () => {
  expect(() => createLight({ range: 0 })).toThrow(RangeError);
  expect(() => createLight({ intensity: Infinity })).toThrow(RangeError);
  const light = createLight({ motion: 'static' });
  expect(() => light.configure({ range: NaN })).toThrow(RangeError);
});

it('reads all dirty rectangles before writing and skips unchanged output', () => {
  const light = createLight({ motion: 'static' });
  const first = element();
  const second = element();
  const events: string[] = [];
  first.measure.mockImplementation(() => {
    events.push('read');
    return new DOMRect(0, 0, 100, 100);
  });
  second.measure.mockImplementation(() => {
    events.push('read');
    return new DOMRect(100, 0, 100, 100);
  });
  const firstWrite = vi.spyOn(first.node.style, 'setProperty');
  firstWrite.mockImplementation(() => {
    events.push('write');
  });
  vi.spyOn(second.node.style, 'setProperty').mockImplementation(() => {
    events.push('write');
  });
  const a = light.register(first.node, 'raised');
  const b = light.register(second.node, 'matte');
  const stop = light.mount(document);
  flush();
  expect(events.slice(0, 2)).toEqual(['read', 'read']);
  expect(events.slice(2).every((value) => value === 'write')).toBe(true);
  const count = firstWrite.mock.calls.length;
  light.configure({ motion: 'static' });
  flush();
  expect(firstWrite).toHaveBeenCalledTimes(count);
  a.destroy();
  b.destroy();
  stop();
});
it('keeps direction unchanged when the surface becomes recessed', () => {
  const light = createLight({ motion: 'static' });
  const { node } = element();
  const entry = light.register(node, 'raised');
  const stop = light.mount(document);
  flush();
  const write = vi.spyOn(node.style, 'setProperty');
  entry.update('recessed');
  flush();
  expect(write).not.toHaveBeenCalled();
  entry.destroy();
  stop();
});

it('rejects concurrent mounts and documents without a browser window', () => {
  const light = createLight();
  const stop = light.mount(document);
  expect(() => light.mount(document)).toThrow(/active owner/);
  stop();
  expect(() => createLight().mount(document.implementation.createHTMLDocument())).toThrow(
    /browser document/,
  );
});
it('ignores an old cleanup after a new session has started', () => {
  const light = createLight({ motion: 'dynamic' });
  const { node } = element();
  light.register(node, 'raised');
  const previousStop = light.mount(document);
  previousStop();
  const stop = light.mount(document);
  flush();
  previousStop();
  point();
  flush();
  expect(node.style.getPropertyValue('--edge-angle')).toBe('90.0deg');
  stop();
});
it('keeps document ownership until both the session and surfaces are released', () => {
  const other = document.implementation.createHTMLDocument();
  const light = createLight();
  const entry = light.register(element().node, 'raised');
  const stop = light.mount(document);
  stop();
  expect(() => light.mount(other)).toThrow(/different documents/);
  expect(() => light.register(other.createElement('div'), 'raised')).toThrow(/different document/);
  entry.destroy();
  const foreign = light.register(other.createElement('div'), 'raised');
  foreign.destroy();
  const stopEmpty = light.mount(document);
  stopEmpty();
  light.register(other.createElement('div'), 'raised').destroy();
});
it('retains the active document when its last surface is removed', () => {
  const light = createLight();
  const stop = light.mount(document);
  light.register(element().node, 'raised').destroy();
  const other = document.implementation.createHTMLDocument();
  expect(() => light.register(other.createElement('div'), 'raised')).toThrow(/different document/);
  stop();
  light.register(other.createElement('div'), 'raised').destroy();
});
it('schedules late registrations and leaves removed surfaces untouched', () => {
  const light = createLight({ motion: 'static' });
  const stop = light.mount(document);
  flush();
  const { node } = element();
  const entry = light.register(node, 'raised');
  expect(frames.size).toBe(1);
  flush();
  entry.destroy();
  light.refresh();
  flush();
  expect(node.style.getPropertyValue('--edge-strength')).toBe('');
  entry.update('matte');
  expect(frames.size).toBe(0);
  const replacement = createLight().register(node, 'raised');
  entry.destroy();
  expect(() => createLight().register(node, 'raised')).toThrow(/owner/);
  replacement.destroy();
  stop();
});
it('preserves the pointer for same-motion configuration and clears it on motion changes', () => {
  const light = createLight({ motion: 'dynamic' });
  const { node } = element();
  light.register(node, 'raised');
  const stop = light.mount(document);
  point();
  flush();
  light.configure({ motion: 'dynamic', intensity: 0.4 });
  flush();
  expect(node.style.getPropertyValue('--edge-angle')).toBe('90.0deg');
  expect(Number(node.style.getPropertyValue('--edge-strength'))).toBeGreaterThan(0);
  light.configure({ motion: 'system' });
  flush();
  expect(node.style.getPropertyValue('--edge-strength')).toBe('0.000');
  stop();
});
it('clears light only when the pointer exits the document', () => {
  const light = createLight({ motion: 'dynamic' });
  const { node } = element();
  light.register(node, 'raised');
  const stop = light.mount(document);
  point();
  flush();
  document.dispatchEvent(Object.assign(new Event('pointerout'), { relatedTarget: node }));
  flush();
  expect(Number(node.style.getPropertyValue('--edge-strength'))).toBeGreaterThan(0);
  document.dispatchEvent(Object.assign(new Event('pointerout'), { relatedTarget: null }));
  flush();
  expect(node.style.getPropertyValue('--edge-strength')).toBe('0.000');
  stop();
});
it.each([
  [0, 100],
  [100, 0],
])('suppresses output for a surface sized %s by %s', (width, height) => {
  const light = createLight({ motion: 'static' });
  const { node, measure } = element();
  measure.mockReturnValue(new DOMRect(0, 0, width, height));
  light.register(node, 'raised');
  const stop = light.mount(document);
  flush();
  expect(node.style.getPropertyValue('--edge-strength')).toBe('0.000');
  stop();
});
it('suppresses output for detached surfaces', () => {
  const light = createLight({ motion: 'static' });
  const { node } = element();
  light.register(node, 'raised');
  node.remove();
  const stop = light.mount(document);
  flush();
  expect(node.style.getPropertyValue('--edge-strength')).toBe('0.000');
  stop();
});

it('samples a shared static direction once per mount and preserves it on configure', () => {
  const random = vi.spyOn(Math, 'random').mockReturnValueOnce(0.25).mockReturnValueOnce(0.5);
  const light = createLight({ motion: 'static', staticDirection: 'random' });
  const { node } = element();
  light.register(node, 'raised');
  expect(random).not.toHaveBeenCalled();
  const stop = light.mount(document);
  flush();
  expect(node.style.getPropertyValue('--edge-angle')).toBe('90.0deg');
  light.configure({ motion: 'static', staticDirection: 'random' });
  light.refresh();
  point();
  flush();
  expect(node.style.getPropertyValue('--edge-angle')).toBe('90.0deg');
  expect(random).toHaveBeenCalledOnce();
  stop();
  const stopAgain = light.mount(document);
  flush();
  expect(node.style.getPropertyValue('--edge-angle')).toBe('180.0deg');
  light.configure({ motion: 'static', staticDirection: 45 });
  flush();
  expect(node.style.getPropertyValue('--edge-angle')).toBe('45.0deg');
  stopAgain();
});

it('refreshes geometry after font loading and removes the font subscription on stop', async () => {
  const fonts = Object.assign(new EventTarget(), { ready: Promise.resolve() });
  const previous = Object.getOwnPropertyDescriptor(document, 'fonts');
  Object.defineProperty(document, 'fonts', { configurable: true, value: fonts });
  try {
    const light = createLight();
    const { node, measure } = element();
    light.register(node, 'raised');
    const stop = light.mount(document);
    await fonts.ready;
    flush();
    measure.mockClear();
    fonts.dispatchEvent(new Event('loadingdone'));
    flush();
    expect(measure).toHaveBeenCalledOnce();
    stop();
    fonts.dispatchEvent(new Event('loadingdone'));
    expect(frames.size).toBe(0);
  } finally {
    if (previous) Object.defineProperty(document, 'fonts', previous);
    else Reflect.deleteProperty(document, 'fonts');
  }
});

it('remeasures only descendants of a scrolled container', () => {
  const light = createLight();
  const inside = element();
  const outside = element();
  const container = document.createElement('div');
  document.body.append(container);
  container.append(inside.node);
  light.register(inside.node, 'raised');
  light.register(outside.node, 'raised');
  const stop = light.mount(document);
  flush();
  inside.measure.mockClear();
  outside.measure.mockClear();
  container.dispatchEvent(new Event('scroll'));
  flush();
  expect(inside.measure).toHaveBeenCalledOnce();
  expect(outside.measure).not.toHaveBeenCalled();
  document.dispatchEvent(new Event('scroll'));
  flush();
  expect(outside.measure).toHaveBeenCalledOnce();
  stop();
});

it('aligns decoration to asymmetric host borders and restores owned inset variables', () => {
  const light = createLight();
  const { node } = element();
  node.style.borderStyle = 'solid';
  node.style.borderWidth = '2px 3px 4px 5px';
  node.style.setProperty('--edge-inset-top', '7px');
  const registration = light.register(node, 'raised');
  const stop = light.mount(document);
  flush();
  for (const [side, width] of [
    ['top', 2],
    ['right', 3],
    ['bottom', 4],
    ['left', 5],
  ] as const)
    expect(node.style.getPropertyValue(`--edge-inset-${side}`)).toBe(`-${width}px`);
  registration.destroy();
  expect(node.style.getPropertyValue('--edge-inset-top')).toBe('7px');
  expect(node.style.getPropertyValue('--edge-inset-right')).toBe('');
  stop();
});

it('observes existing and late surfaces, and releases removed observation targets', () => {
  const light = createLight({ motion: 'static' });
  const first = element();
  const registration = light.register(first.node, 'raised');
  const stop = light.mount(document);
  flush();
  const observer = observers[0]!;
  expect(observer.targets.has(first.node)).toBe(true);
  const late = element();
  const lateRegistration = light.register(late.node, 'raised');
  expect(observer.targets.has(late.node)).toBe(true);
  flush();
  first.measure.mockClear();
  late.measure.mockClear();
  observer.fire();
  flush();
  expect(first.measure).toHaveBeenCalledOnce();
  expect(late.measure).toHaveBeenCalledOnce();
  registration.destroy();
  expect(observer.targets.has(first.node)).toBe(false);
  expect(observer.targets.has(late.node)).toBe(true);
  lateRegistration.destroy();
  stop();
  expect(observer.disconnected).toBe(true);
});
it('does not schedule empty or unrelated scroll refreshes', () => {
  const light = createLight();
  const stop = light.mount(document);
  expect(frames.size).toBe(0);
  light.refresh();
  expect(frames.size).toBe(0);
  light.register(element().node, 'raised');
  flush();
  const unrelated = document.createElement('div');
  document.body.append(unrelated);
  unrelated.dispatchEvent(new Event('scroll'));
  expect(frames.size).toBe(0);
  stop();
});
it('retains an unmounted document until every registered surface is released', () => {
  const light = createLight();
  const first = light.register(element().node, 'raised');
  const second = light.register(element().node, 'raised');
  first.destroy();
  const other = document.implementation.createHTMLDocument();
  expect(() => light.register(other.createElement('div'), 'raised')).toThrow(/different document/);
  second.destroy();
  light.register(other.createElement('div'), 'raised').destroy();
});

it('remeasures host borders when surface style changes without a resize event', () => {
  const light = createLight({ motion: 'static' });
  const stop = light.mount(document);
  const { node } = element();
  node.style.borderStyle = 'solid';
  node.style.borderWidth = '1px';
  const entry = light.register(node, 'raised');
  flush();
  expect(node.style.getPropertyValue('--edge-inset-top')).toBe('-1px');
  node.style.borderWidth = '2px 3px 4px 5px';
  entry.update('matte');
  flush();
  expect(
    ['top', 'right', 'bottom', 'left'].map((side) =>
      node.style.getPropertyValue(`--edge-inset-${side}`),
    ),
  ).toEqual(['-2px', '-3px', '-4px', '-5px']);
  stop();
});

it('reconfigures direction and range with a stationary pointer and preserves static lighting', () => {
  const light = createLight({ motion: 'dynamic', range: 100 });
  const { node, measure } = element();
  const entry = light.register(node, 'raised');
  const stop = light.mount(document);
  point();
  flush();
  expect(node.style.getPropertyValue('--edge-angle')).toBe('90.0deg');
  expect(node.style.getPropertyValue('--edge-strength')).toBe('0.188');
  light.configure({ motion: 'dynamic', direction: 'away', range: 200 });
  flush();
  expect(node.style.getPropertyValue('--edge-angle')).toBe('270.0deg');
  expect(node.style.getPropertyValue('--edge-strength')).toBe('0.422');
  expect(measure).toHaveBeenCalledOnce();
  entry.update('recessed');
  flush();
  expect(node.style.getPropertyValue('--edge-angle')).toBe('270.0deg');
  light.configure({ motion: 'static', staticDirection: 45, direction: 'away', range: 1 });
  flush();
  expect(node.style.getPropertyValue('--edge-angle')).toBe('45.0deg');
  entry.destroy();
  stop();
});

it.each(['input-first', 'scroll-first', 'stationary-touch'])(
  'uses the newest rectangle and input in one frame: %s',
  (order) => {
    const light = createLight({
      motion: 'dynamic',
      direction: 'toward',
      range: 480,
      intensity: 1,
    });
    const { node, measure } = element();
    const entry = light.register(node, 'raised');
    const stop = light.mount(document);
    if (order === 'stationary-touch') {
      const contact = { identifier: 1, clientX: 150, clientY: 50 };
      document.dispatchEvent(
        Object.assign(new Event('touchstart'), { touches: [contact], changedTouches: [contact] }),
      );
    } else point(150, 50);
    flush();
    expect(node.style.getPropertyValue('--edge-angle')).toBe('0.0deg');
    measure.mockReturnValue({ ...measure.mock.results[0]!.value, top: -100, bottom: 0, y: -100 });
    if (order === 'input-first') point(250, 50);
    document.dispatchEvent(new Event('scroll'));
    if (order === 'scroll-first') point(250, 50);
    flush();
    expect(node.style.getPropertyValue('--edge-angle')).toBe(
      order === 'stationary-touch' ? '180.0deg' : '135.0deg',
    );
    if (order === 'stationary-touch') {
      expect(Number(node.style.getPropertyValue('--edge-strength'))).toBeGreaterThan(0);
    } else expect(node.style.getPropertyValue('--edge-strength')).toBe('0.727');
    entry.destroy();
    stop();
  },
);
