// @vitest-environment jsdom
import { act, createRef, StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Lighting, type Motion, type Light } from '../index.js';

let container: HTMLDivElement;
let root: Root;
let frames: Map<number, FrameRequestCallback>;
function flush() {
  const callbacks = [...frames.values()];
  frames.clear();
  for (const callback of callbacks) callback(0);
}
function move(x = 120, y = 50) {
  document.dispatchEvent(Object.assign(new Event('pointermove'), {
    clientX: x, clientY: y, pointerType: 'mouse',
  }));
}
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  frames = new Map();
  let frame = 0;
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++frame, callback);
    return frame;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
  vi.stubGlobal('matchMedia', (media: string) => Object.assign(new EventTarget(), {
    media, matches: media.includes('prefers-reduced-motion'),
  }));
  vi.stubGlobal('ResizeObserver', class {
    observe() {} unobserve() {} disconnect() {}
  });
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockReturnValue(new DOMRect(0, 0, 100, 100));
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('lights only marked hosts and preserves native props and interactions', async () => {
  const click = vi.fn();
  await act(async () => root.render(
    <Lighting motion="static">
      <Lighting.Surface as="button" className="own-button" style={{ padding: 12 }} onClick={click}>
        Lit
      </Lighting.Surface>
      <button>Plain</button>
    </Lighting>,
  ));
  flush();
  const [lit, plain] = container.querySelectorAll('button');
  expect(container.children).toHaveLength(2);
  expect(lit!.classList.contains('own-button')).toBe(true);
  expect(lit!.style.padding).toBe('12px');
  expect(lit!.style.getPropertyValue('--wisp-strength')).toBe('0.525');
  expect(plain!.getAttribute('class')).toBeNull();
  expect(plain!.getAttribute('style')).toBeNull();
  await act(async () => lit!.click());
  expect(click).toHaveBeenCalledOnce();
});
it('uses the nearest light and leaves outer siblings independent', async () => {
  await act(async () => root.render(
    <Lighting motion="static" intensity={0.2}>
      <Lighting.Surface data-testid="outer" />
      <Lighting motion="static" intensity={0.8}>
        <Lighting.Surface data-testid="inner" />
      </Lighting>
      <Lighting.Surface data-testid="sibling" />
    </Lighting>,
  ));
  flush();
  for (const id of ['outer', 'sibling'])
    expect(container.querySelector<HTMLElement>(`[data-testid=${id}]`)!.style.getPropertyValue('--wisp-strength')).toBe('0.140');
  expect(container.querySelector<HTMLElement>('[data-testid=inner]')!.style.getPropertyValue('--wisp-strength')).toBe('0.560');
});
it.each(['static', 'dynamic', 'system'] as const)('maps motion %s under reduced motion', async (motion: Motion) => {
  await act(async () => root.render(
    <Lighting motion={motion}><Lighting.Surface /></Lighting>,
  ));
  move();
  flush();
  expect(container.firstElementChild!.getAttribute('style'))
    .toContain(`--wisp-angle: ${motion === 'dynamic' ? '90.0' : '315.0'}deg`);
});
it('defaults to system motion and updates edgeStyle without replacing the host', async () => {
  await act(async () => root.render(<Lighting><Lighting.Surface /></Lighting>));
  flush();
  const host = container.querySelector<HTMLElement>(':scope > div')!;
  expect(host.style.getPropertyValue('--wisp-angle')).toBe('315.0deg');
  await act(async () => root.render(
    <Lighting><Lighting.Surface edgeStyle="recessed" color="red" intensity={0.4} /></Lighting>,
  ));
  flush();
  expect(container.firstElementChild).toBe(host);
  expect(host.style.getPropertyValue('--wisp-angle')).toBe('135.0deg');
  expect(host.style.getPropertyValue('--wisp-highlight')).toBe('red');
  expect(host.style.getPropertyValue('--wisp-intensity')).toBe('0.4');
});
it('composes object refs and releases them when a host is replaced or removed', async () => {
  const button = createRef<HTMLButtonElement>();
  const article = createRef<HTMLElement>();
  await act(async () => root.render(
    <Lighting motion="static"><Lighting.Surface as="button" ref={button} /></Lighting>,
  ));
  flush();
  const previous = button.current!;
  expect(previous).toBeInstanceOf(HTMLButtonElement);
  await act(async () => root.render(
    <Lighting motion="static"><Lighting.Surface as="article" ref={article} /></Lighting>,
  ));
  flush();
  expect(button.current).toBeNull();
  expect(previous.style.getPropertyValue('--wisp-strength')).toBe('');
  expect(article.current).toBe(container.firstElementChild);
  await act(async () => root.render(null));
  expect(article.current).toBeNull();
  expect(frames.size).toBe(0);
});
it('honors React 19 callback-ref cleanup across StrictMode replay', async () => {
  const cleanup = vi.fn();
  const ref = vi.fn((element: HTMLDivElement | null) => {
    if (element) return cleanup;
  });
  await act(async () => root.render(
    <StrictMode><Lighting motion="static"><Lighting.Surface ref={ref} /></Lighting></StrictMode>,
  ));
  flush();
  const attachments = ref.mock.calls.filter(([element]) => element !== null).length;
  expect(attachments).toBeGreaterThan(0);
  await act(async () => root.render(null));
  expect(cleanup).toHaveBeenCalledTimes(attachments);
  expect(ref.mock.calls.filter(([element]) => element === null)).toHaveLength(0);
  expect(frames.size).toBe(0);
});
it('clears callback refs without cleanup functions', async () => {
  const ref = vi.fn((_element: HTMLDivElement | null) => {});
  await act(async () => root.render(<Lighting><Lighting.Surface ref={ref} /></Lighting>));
  expect(ref).toHaveBeenLastCalledWith(container.firstElementChild);
  await act(async () => root.render(null));
  expect(ref).toHaveBeenLastCalledWith(null);
});
it('keeps same-document portals in the declaring light scope', async () => {
  await act(async () => root.render(
    <Lighting motion="static" intensity={0.4}>
      {createPortal(<Lighting.Surface as="button">Portal</Lighting.Surface>, document.body)}
    </Lighting>,
  ));
  flush();
  const button = document.body.querySelector<HTMLButtonElement>(':scope > button')!;
  expect(button.style.getPropertyValue('--wisp-strength')).toBe('0.280');
  await act(async () => root.render(null));
  expect(button.isConnected).toBe(false);
});

it('exposes optional refresh for position-only changes and clears the root handle', async () => {
  const light = createRef<Light>();
  await act(async () => root.render(
    <Lighting motion="dynamic" ref={light}><Lighting.Surface /></Lighting>,
  ));
  move();
  flush();
  const host = container.querySelector<HTMLElement>(':scope > div')!;
  expect(host.style.getPropertyValue('--wisp-angle')).toBe('90.0deg');
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockReturnValue(new DOMRect(200, 0, 100, 100));
  light.current!.refresh();
  flush();
  expect(host.style.getPropertyValue('--wisp-angle')).toBe('270.0deg');
  await act(async () => root.render(null));
  expect(light.current).toBeNull();
});

it('unregisters removed surfaces while their light owner and siblings stay mounted', async () => {
  function Scene({ show }: { show: boolean }) {
    return (
      <Lighting motion="static">
        {show ? <Lighting.Surface key="first" data-testid="first" /> : null}
        <Lighting.Surface key="second" data-testid="second" />
      </Lighting>
    );
  }
  await act(async () => root.render(<Scene show />));
  flush();
  const removed = container.querySelector<HTMLElement>('[data-testid=first]')!;
  const sibling = container.querySelector<HTMLElement>('[data-testid=second]')!;
  await act(async () => root.render(<Scene show={false} />));
  flush();
  expect(removed.isConnected).toBe(false);
  expect(removed.style.getPropertyValue('--wisp-strength')).toBe('');
  expect(container.querySelector('[data-testid=second]')).toBe(sibling);
  expect(sibling.style.getPropertyValue('--wisp-strength')).toBe('0.525');
});
