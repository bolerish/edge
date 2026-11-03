// @vitest-environment jsdom
import { act, StrictMode, useState } from 'react';
import { createRoot, hydrateRoot, type Root } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import {
  useLight,
  useSurface,
  type Material,
  type LightOptions,
  type Light,
} from '@wisp-lighting/react';
import * as stylex from '@stylexjs/stylex';

let frames: Map<number, FrameRequestCallback>;
let sequence: number;
let container: HTMLDivElement;
let root: Root;
function flush() {
  const batch = [...frames.values()];
  frames.clear();
  for (const callback of batch) callback(0);
}
function Button({
  light,
  material = 'raised',
  replace = false,
}: {
  light: Light;
  material?: Material;
  replace?: boolean;
}) {
  const surface = useSurface<HTMLButtonElement>(light, { material });
  return (
    <button
      key={String(replace)}
      ref={surface.ref}
      {...stylex.props(surface.style)}
    >
      Save
    </button>
  );
}
function App({
  material = 'raised',
  replace = false,
  mode = 'static',
  intensity = 0.75,
  portal = false,
}: {
  material?: Material;
  replace?: boolean;
  mode?: LightOptions['mode'];
  intensity?: number;
  portal?: boolean;
}) {
  const light = useLight({ mode, intensity });
  return (
    <>
      <Button light={light} material={material} replace={replace} />
      {portal ? createPortal(<Button light={light} />, document.body) : null}
    </>
  );
}
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  frames = new Map();
  sequence = 0;
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++sequence, callback);
    return sequence;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    frames.delete(id);
  });
  vi.stubGlobal('matchMedia', (query: string) =>
    Object.assign(new EventTarget(), {
      matches: query.includes('pointer: fine'),
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
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
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
it('connects actual core after child refs and survives StrictMode replay', async () => {
  await act(async () =>
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    ),
  );
  flush();
  expect(
    container.querySelector('button')?.style.getPropertyValue('--wisp-angle'),
  ).toBe('315.0deg');
  await act(async () => root.render(null));
  expect(frames.size).toBe(0);
});
it('updates stationary material and intensity, then replaces the ref target with the latest material', async () => {
  await act(async () => root.render(<App />));
  flush();
  const original = container.querySelector('button')!;
  await act(async () =>
    root.render(<App material="recessed" intensity={0.4} />),
  );
  flush();
  expect(container.querySelector('button')).toBe(original);
  expect(original.style.getPropertyValue('--wisp-angle')).toBe('135.0deg');
  expect(original.style.getPropertyValue('--wisp-strength')).toBe('0.280');
  await act(async () =>
    root.render(<App material="recessed" intensity={0.4} replace />),
  );
  flush();
  expect(original.style.getPropertyValue('--wisp-angle')).toBe('');
  expect(
    container.querySelector('button')?.style.getPropertyValue('--wisp-angle'),
  ).toBe('135.0deg');
});
it('does not rerender React components during pointer updates and preserves nodes', async () => {
  let renders = 0;
  function Counter() {
    renders++;
    const light = useLight({ mode: 'pointer' });
    const surface = useSurface<HTMLButtonElement>(light);
    return (
      <button ref={surface.ref} {...stylex.props(surface.style)}>
        Save
      </button>
    );
  }
  await act(async () => root.render(<Counter />));
  flush();
  const button = container.querySelector('button');
  const before = renders;
  for (let index = 0; index < 10; index++)
    document.dispatchEvent(
      Object.assign(new Event('pointermove'), {
        clientX: 120 + index,
        clientY: 50,
        pointerType: 'mouse',
      }),
    );
  flush();
  expect(renders).toBe(before);
  expect(container.querySelector('button')).toBe(button);
  expect(button?.style.getPropertyValue('--wisp-angle')).toBe('90.0deg');
});
it('supports same-document portals without reparenting native controls', async () => {
  await act(async () => root.render(<App portal />));
  flush();
  const outside = document.body.querySelector(':scope > button');
  expect(outside?.getAttribute('style')).toContain('--wisp-angle: 315.0deg');
  await act(async () => root.render(<App />));
  expect(outside?.isConnected).toBe(false);
});
it('hydrates server markup and keeps an edited input value and selection', async () => {
  function Field() {
    const light = useLight();
    const surface = useSurface<HTMLLabelElement>(light, {
      material: 'recessed',
    });
    const [value, setValue] = useState('hello');
    return (
      <label ref={surface.ref} {...stylex.props(surface.style)}>
        Query
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </label>
    );
  }
  await act(async () => root.unmount());
  container.innerHTML = renderToString(<Field />);
  const input = container.querySelector('input')!;
  input.value = 'typed before hydration';
  input.focus();
  input.setSelectionRange(2, 7);
  const errors: unknown[] = [];
  await act(async () => {
    root = hydrateRoot(container, <Field />, {
      onRecoverableError: (error) => errors.push(error),
    });
  });
  flush();
  expect(container.querySelector('input')).toBe(input);
  expect(input.value).toBe('typed before hydration');
  expect(document.activeElement).toBe(input);
  expect(input.selectionStart).toBe(2);
  expect(input.selectionEnd).toBe(7);
  expect(errors).toEqual([]);
});
