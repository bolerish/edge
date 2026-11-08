// @vitest-environment jsdom
import { createRef, StrictMode, type ReactNode } from 'react';
import { act, cleanup, render, type RenderResult } from '@testing-library/react';
import { createPortal } from 'react-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Edge, useLight, useSurface, type Motion, type Light } from '../index.js';

let container: HTMLDivElement;
let view: Pick<RenderResult, 'rerender'> | null;
function renderScene(node: ReactNode) {
  if (view) view.rerender(node);
  else view = render(node, { container });
}
let frames: Map<number, FrameRequestCallback>;
function flush() {
  const callbacks = [...frames.values()];
  frames.clear();
  for (const callback of callbacks) callback(0);
}
function move(x = 120, y = 50) {
  document.dispatchEvent(
    Object.assign(new Event('pointermove'), {
      clientX: x,
      clientY: y,
      pointerType: 'mouse',
    }),
  );
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
  vi.stubGlobal('matchMedia', (media: string) =>
    Object.assign(new EventTarget(), {
      media,
      matches: media.includes('prefers-reduced-motion'),
    }),
  );
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(0, 0, 100, 100),
  );
  container = document.createElement('div');
  document.body.append(container);
  view = null;
});
afterEach(async () => {
  await act(async () => cleanup());
  container.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('lights only marked hosts and preserves native props and interactions', async () => {
  const click = vi.fn();
  await act(async () =>
    renderScene(
      <Edge.Provider motion="static">
        <Edge.Surface as="button" className="own-button" style={{ padding: 12 }} onClick={click}>
          Lit
        </Edge.Surface>
        <button>Plain</button>
      </Edge.Provider>,
    ),
  );
  flush();
  const [lit, plain] = container.querySelectorAll('button');
  expect(container.children).toHaveLength(2);
  expect(lit!.classList.contains('own-button')).toBe(true);
  expect(lit!.style.padding).toBe('12px');
  expect(lit!.style.getPropertyValue('--edge-strength')).toBe('0.525');
  expect(plain!.getAttribute('class')).toBeNull();
  expect(plain!.getAttribute('style')).toBeNull();
  await act(async () => lit!.click());
  expect(click).toHaveBeenCalledOnce();
});
it('uses the nearest light and leaves outer siblings independent', async () => {
  await act(async () =>
    renderScene(
      <Edge.Provider motion="static" intensity={0.2}>
        <Edge.Surface data-testid="outer" />
        <Edge.Provider motion="static" intensity={0.8}>
          <Edge.Surface data-testid="inner" />
        </Edge.Provider>
        <Edge.Surface data-testid="sibling" />
      </Edge.Provider>,
    ),
  );
  flush();
  for (const id of ['outer', 'sibling'])
    expect(
      container
        .querySelector<HTMLElement>(`[data-testid=${id}]`)!
        .style.getPropertyValue('--edge-strength'),
    ).toBe('0.140');
  expect(
    container
      .querySelector<HTMLElement>('[data-testid=inner]')!
      .style.getPropertyValue('--edge-strength'),
  ).toBe('0.560');
});
it.each(['static', 'dynamic', 'system'] as const)(
  'maps motion %s under reduced motion',
  async (motion: Motion) => {
    await act(async () =>
      renderScene(
        <Edge.Provider motion={motion}>
          <Edge.Surface />
        </Edge.Provider>,
      ),
    );
    move();
    flush();
    expect(container.firstElementChild!.getAttribute('style')).toContain(
      `--edge-angle: ${motion === 'dynamic' ? '90.0' : '315.0'}deg`,
    );
  },
);
it('defaults to system motion and updates edgeStyle without replacing the host', async () => {
  await act(async () =>
    renderScene(
      <Edge.Provider>
        <Edge.Surface />
      </Edge.Provider>,
    ),
  );
  flush();
  const host = container.querySelector<HTMLElement>(':scope > div')!;
  expect(host.style.getPropertyValue('--edge-angle')).toBe('315.0deg');
  await act(async () =>
    renderScene(
      <Edge.Provider>
        <Edge.Surface edgeStyle="recessed" color="red" intensity={0.4} />
      </Edge.Provider>,
    ),
  );
  flush();
  expect(container.firstElementChild).toBe(host);
  expect(host.style.getPropertyValue('--edge-angle')).toBe('135.0deg');
  expect(host.style.getPropertyValue('--edge-highlight')).toBe('red');
  expect(host.style.getPropertyValue('--edge-intensity')).toBe('0.4');
});
it('composes object refs and releases them when a host is replaced or removed', async () => {
  const button = createRef<HTMLButtonElement>();
  const article = createRef<HTMLElement>();
  await act(async () =>
    renderScene(
      <Edge.Provider motion="static">
        <Edge.Surface as="button" ref={button} />
      </Edge.Provider>,
    ),
  );
  flush();
  const previous = button.current!;
  expect(previous).toBeInstanceOf(HTMLButtonElement);
  await act(async () =>
    renderScene(
      <Edge.Provider motion="static">
        <Edge.Surface as="article" ref={article} />
      </Edge.Provider>,
    ),
  );
  flush();
  expect(button.current).toBeNull();
  expect(previous.style.getPropertyValue('--edge-strength')).toBe('');
  expect(article.current).toBe(container.firstElementChild);
  await act(async () => renderScene(null));
  expect(article.current).toBeNull();
  expect(frames.size).toBe(0);
});
it('honors React 19 callback-ref cleanup across StrictMode replay', async () => {
  const cleanup = vi.fn();
  const ref = vi.fn((element: HTMLDivElement | null) => {
    if (element) return cleanup;
  });
  await act(async () =>
    renderScene(
      <StrictMode>
        <Edge.Provider motion="static">
          <Edge.Surface ref={ref} />
        </Edge.Provider>
      </StrictMode>,
    ),
  );
  flush();
  const attachments = ref.mock.calls.filter(([element]) => element !== null).length;
  expect(attachments).toBeGreaterThan(0);
  await act(async () => renderScene(null));
  expect(cleanup).toHaveBeenCalledTimes(attachments);
  expect(ref.mock.calls.filter(([element]) => element === null)).toHaveLength(0);
  expect(frames.size).toBe(0);
});
it('cleans the previous callback ref before attaching its replacement to the same host', async () => {
  const firstCleanup = vi.fn();
  const secondCleanup = vi.fn();
  const first = vi.fn(() => firstCleanup);
  const second = vi.fn(() => secondCleanup);
  await act(async () =>
    renderScene(
      <Edge.Provider>
        <Edge.Surface ref={first} />
      </Edge.Provider>,
    ),
  );
  const host = container.firstElementChild;
  await act(async () =>
    renderScene(
      <Edge.Provider>
        <Edge.Surface ref={second} />
      </Edge.Provider>,
    ),
  );
  expect(container.firstElementChild).toBe(host);
  expect(firstCleanup).toHaveBeenCalledOnce();
  expect(second).toHaveBeenCalledWith(host);
  expect(secondCleanup).not.toHaveBeenCalled();
  await act(async () => renderScene(null));
  expect(secondCleanup).toHaveBeenCalledOnce();
});
it('clears callback refs without cleanup functions', async () => {
  const ref = vi.fn((_element: HTMLDivElement | null) => {});
  await act(async () =>
    renderScene(
      <Edge.Provider>
        <Edge.Surface ref={ref} />
      </Edge.Provider>,
    ),
  );
  expect(ref).toHaveBeenLastCalledWith(container.firstElementChild);
  await act(async () => renderScene(null));
  expect(ref).toHaveBeenLastCalledWith(null);
});
it('keeps same-document portals in the declaring light scope', async () => {
  await act(async () =>
    renderScene(
      <Edge.Provider motion="static" intensity={0.4}>
        {createPortal(<Edge.Surface as="button">Portal</Edge.Surface>, document.body)}
      </Edge.Provider>,
    ),
  );
  flush();
  const button = document.body.querySelector<HTMLButtonElement>(':scope > button')!;
  expect(button.style.getPropertyValue('--edge-strength')).toBe('0.280');
  await act(async () => renderScene(null));
  expect(button.isConnected).toBe(false);
});

it('exposes optional refresh for position-only changes and clears the root handle', async () => {
  const light = createRef<Light>();
  await act(async () =>
    renderScene(
      <Edge.Provider motion="dynamic" ref={light}>
        <Edge.Surface />
      </Edge.Provider>,
    ),
  );
  move();
  flush();
  const host = container.querySelector<HTMLElement>(':scope > div')!;
  expect(host.style.getPropertyValue('--edge-angle')).toBe('90.0deg');
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(200, 0, 100, 100),
  );
  light.current!.refresh();
  flush();
  expect(host.style.getPropertyValue('--edge-angle')).toBe('270.0deg');
  await act(async () => renderScene(null));
  expect(light.current).toBeNull();
});

it('unregisters removed surfaces while their light owner and siblings stay mounted', async () => {
  function Scene({ show }: { show: boolean }) {
    return (
      <Edge.Provider motion="static">
        {show ? <Edge.Surface key="first" data-testid="first" /> : null}
        <Edge.Surface key="second" data-testid="second" />
      </Edge.Provider>
    );
  }
  await act(async () => renderScene(<Scene show />));
  flush();
  const removed = container.querySelector<HTMLElement>('[data-testid=first]')!;
  const sibling = container.querySelector<HTMLElement>('[data-testid=second]')!;
  await act(async () => renderScene(<Scene show={false} />));
  flush();
  expect(removed.isConnected).toBe(false);
  expect(removed.style.getPropertyValue('--edge-strength')).toBe('');
  expect(container.querySelector('[data-testid=second]')).toBe(sibling);
  expect(sibling.style.getPropertyValue('--edge-strength')).toBe('0.525');
});

it('switches decoration slots without replacing or registering the host again', async () => {
  const ref = vi.fn((_node: HTMLButtonElement | null) => {});
  const click = vi.fn();
  function Scene({ pseudoElement }: { pseudoElement: 'before' | 'after' }) {
    return (
      <Edge.Provider motion="dynamic">
        <Edge.Surface as="button" ref={ref} onClick={click} pseudoElement={pseudoElement} />
      </Edge.Provider>
    );
  }
  await act(async () => renderScene(<Scene pseudoElement="after" />));
  move();
  flush();
  const host = container.firstElementChild as HTMLButtonElement;
  const previousClass = host.className;
  const angle = host.style.getPropertyValue('--edge-angle');
  await act(async () => renderScene(<Scene pseudoElement="before" />));
  expect(container.firstElementChild).toBe(host);
  expect(host.className).not.toBe(previousClass);
  expect(host.childElementCount).toBe(0);
  expect(host.hasAttribute('pseudoElement')).toBe(false);
  expect(host.style.getPropertyValue('--edge-angle')).toBe(angle);
  expect(ref).toHaveBeenCalledTimes(1);
  await act(async () => host.click());
  expect(click).toHaveBeenCalledOnce();
});

it('shares provider lighting with hook hosts and keeps nested scopes independent', async () => {
  function Existing({ id }: { id: string }) {
    const ref = useSurface<HTMLButtonElement>();
    return <button ref={ref} data-testid={id} />;
  }
  await act(async () =>
    renderScene(
      <Edge.Provider motion="static" intensity={0.2}>
        <Edge.Surface data-testid="surface" />
        <Existing id="outer-hook" />
        <button data-testid="plain" />
        <Edge.Provider motion="static" intensity={0.8}>
          <Existing id="inner-hook" />
        </Edge.Provider>
      </Edge.Provider>,
    ),
  );
  flush();
  for (const id of ['surface', 'outer-hook'])
    expect(
      container
        .querySelector<HTMLElement>(`[data-testid=${id}]`)!
        .style.getPropertyValue('--edge-strength'),
    ).toBe('0.140');
  expect(
    container
      .querySelector<HTMLElement>('[data-testid=inner-hook]')!
      .style.getPropertyValue('--edge-strength'),
  ).toBe('0.560');
  expect(container.querySelector('[data-testid=plain]')!.getAttribute('style')).toBeNull();
});

it('lets an explicit light override the provider for existing hosts', async () => {
  function Existing() {
    const light = useLight({ motion: 'static', intensity: 0.8 });
    const ref = useSurface<HTMLButtonElement>(light, { intensity: 0.5 });
    return <button ref={ref} />;
  }
  await act(async () =>
    renderScene(
      <Edge.Provider motion="static" intensity={0.2}>
        <Existing />
      </Edge.Provider>,
    ),
  );
  flush();
  expect(container.querySelector('button')!.style.getPropertyValue('--edge-strength')).toBe(
    '0.560',
  );
});

it('updates context surface options while preserving the host and restoring styles on detach', async () => {
  function Existing({ intensity }: { intensity: number }) {
    const ref = useSurface<HTMLButtonElement>({ intensity, color: 'red' });
    return <button ref={ref} className="original" />;
  }
  await act(async () =>
    renderScene(
      <Edge.Provider motion="static">
        <Existing intensity={1} />
      </Edge.Provider>,
    ),
  );
  flush();
  const host = container.querySelector('button')!;
  expect(host.style.getPropertyValue('--edge-strength')).toBe('0.525');
  await act(async () =>
    renderScene(
      <Edge.Provider motion="static">
        <Existing intensity={0.5} />
      </Edge.Provider>,
    ),
  );
  flush();
  expect(container.querySelector('button')).toBe(host);
  expect(host.style.getPropertyValue('--edge-strength')).toBe('0.525');
  expect(host.style.getPropertyValue('--edge-intensity')).toBe('0.5');
  await act(async () => renderScene(null));
  expect(host.className).toBe('original');
  expect(host.style.getPropertyValue('--edge-strength')).toBe('');
});
