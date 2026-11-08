// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createLightSession } from './session.js';

let frames: Map<number, FrameRequestCallback>;
let queries: Map<string, EventTarget & { media: string; matches: boolean }>;
let cleanup: Array<() => void>;
beforeEach(() => {
  frames = new Map();
  queries = new Map();
  cleanup = [];
  let sequence = 0;
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++sequence, callback);
    return sequence;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
  vi.stubGlobal('matchMedia', (media: string) => {
    const query = Object.assign(new EventTarget(), {
      media,
      matches: media.includes('pointer: fine'),
      onchange: null,
      addListener() {},
      removeListener() {},
    });
    queries.set(media, query);
    return query;
  });
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  for (const stop of cleanup) stop();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function scene(motion: 'system' | 'dynamic' | 'static' = 'system') {
  const render = vi.fn();
  const invalidate = vi.fn();
  const session = createLightSession(document, { getMotion: () => motion, render, invalidate });
  cleanup.push(session.stop);
  return { session, render, invalidate };
}
function flush() {
  const batch = [...frames.values()];
  frames.clear();
  for (const callback of batch) callback(0);
}
function move() {
  document.dispatchEvent(
    Object.assign(new Event('pointermove'), {
      clientX: 20,
      clientY: 30,
      pointerType: 'mouse',
    }),
  );
}
it('keeps static and reduced-motion sessions idle on pointer input', () => {
  const fixed = scene('static');
  move();
  expect(frames.size).toBe(0);
  fixed.session.stop();
  const system = scene();
  const reduced = queries.get('(prefers-reduced-motion: reduce)')!;
  reduced.matches = true;
  move();
  expect(frames.size).toBe(0);
  expect(system.render).not.toHaveBeenCalled();
});
it('uses fixed lighting without a fine pointer, then accepts explicit mouse input', () => {
  const { session, render } = scene();
  const fine = queries.get('(hover: hover) and (pointer: fine)')!;
  fine.matches = false;
  session.schedule();
  flush();
  expect(render).toHaveBeenLastCalledWith(null, true);
  move();
  flush();
  expect(render).toHaveBeenLastCalledWith({ x: 20, y: 30 }, false);
  fine.matches = true;
  fine.dispatchEvent(new Event('change'));
  flush();
  expect(render).toHaveBeenLastCalledWith(null, false);
});
it.each(['resize', 'load'])('invalidates geometry on %s', (event) => {
  const { invalidate } = scene();
  if (event === 'resize') window.dispatchEvent(new Event(event));
  else {
    const image = document.createElement('img');
    document.body.append(image);
    image.dispatchEvent(new Event(event));
    image.remove();
  }
  expect(invalidate).toHaveBeenCalledWith();
});
it('does not render a canceled frame even if its callback arrives late', () => {
  const { session, render } = scene();
  session.schedule();
  const callback = [...frames.values()][0]!;
  session.stop();
  expect(frames.size).toBe(0);
  callback(0);
  expect(render).not.toHaveBeenCalled();
});
it('releases every document, window and media listener with its original capture mode', () => {
  const targets = [document, window];
  const subscriptions = targets.map((target) => ({
    add: vi.spyOn(target, 'addEventListener'),
    remove: vi.spyOn(target, 'removeEventListener'),
  }));
  const { session } = scene();
  const mediaSubscriptions = [...queries.values()].map((target) => ({
    target,
    remove: vi.spyOn(target, 'removeEventListener'),
  }));
  session.stop();
  const capture = (options: boolean | AddEventListenerOptions | undefined) =>
    typeof options === 'boolean' ? options : (options?.capture ?? false);
  for (const { add, remove } of subscriptions) {
    for (const [type, listener, options] of add.mock.calls) {
      expect(
        remove.mock.calls.some(
          ([removedType, removedListener, removedOptions]) =>
            removedType === type &&
            removedListener === listener &&
            capture(removedOptions) === capture(options),
        ),
      ).toBe(true);
    }
  }
  for (const { remove } of mediaSubscriptions)
    expect(remove).toHaveBeenCalledWith('change', expect.any(Function));
});

function touch(type: string, pointerId = 1, isPrimary = true) {
  document.dispatchEvent(
    Object.assign(new Event(type), {
      touches:
        type === 'touchend' || type === 'touchcancel'
          ? []
          : [
              { identifier: pointerId, clientX: 40, clientY: 50 },
              ...(!isPrimary ? [{ identifier: 1, clientX: 40, clientY: 50 }] : []),
            ],
      changedTouches: [{ identifier: pointerId, clientX: 40, clientY: 50 }],
    }),
  );
}
it.each(['touchend', 'touchcancel'])(
  'tracks a touch until %s and restores fixed lighting',
  (ending) => {
    const { render } = scene();
    queries.get('(hover: hover) and (pointer: fine)')!.matches = false;
    touch('touchmove');
    expect(frames.size).toBe(0);
    touch('touchstart');
    flush();
    expect(render).toHaveBeenLastCalledWith({ x: 40, y: 50 }, false);
    touch('touchmove', 2);
    expect(frames.size).toBe(0);
    touch('touchend', 2, false);
    expect(frames.size).toBe(0);
    touch('touchmove');
    flush();
    expect(render).toHaveBeenLastCalledWith({ x: 40, y: 50 }, false);
    touch(ending);
    flush();
    expect(render).toHaveBeenLastCalledWith(null, true);
    touch('touchmove');
    expect(frames.size).toBe(0);
  },
);
it('ignores secondary touches and honors static and reduced motion on touch down', () => {
  const { session } = scene('static');
  touch('touchstart');
  expect(frames.size).toBe(0);
  session.stop();
  scene();
  touch('touchstart', 2, false);
  expect(frames.size).toBe(0);
  queries.get('(prefers-reduced-motion: reduce)')!.matches = true;
  touch('touchstart');
  expect(frames.size).toBe(0);
});

it('keeps tracking touch positions after pointer cancellation and native scrolling', () => {
  const { render, invalidate } = scene();
  function send(type: string, x = 40, y = 50) {
    const contact = { identifier: 7, clientX: x, clientY: y };
    document.dispatchEvent(
      Object.assign(new Event(type), {
        touches: type === 'touchend' ? [] : [contact],
        changedTouches: [contact],
      }),
    );
  }
  send('touchstart');
  flush();
  expect(render).toHaveBeenLastCalledWith({ x: 40, y: 50 }, false);
  touch('pointercancel');
  document.dispatchEvent(new Event('scroll'));
  send('touchmove', 60, 80);
  flush();
  expect(render).toHaveBeenLastCalledWith({ x: 60, y: 80 }, false);
  expect(invalidate).toHaveBeenCalled();
  send('touchend');
  flush();
  expect(render).toHaveBeenLastCalledWith(null, false);
});
