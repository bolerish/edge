// @vitest-environment jsdom
import { act, StrictMode, useState } from 'react';
import { createRoot, hydrateRoot, type Root } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { useLight, useSurface, type EdgeStyle, type LightOptions, type Light } from '../index.js';

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
  edgeStyle = 'raised',
  replace = false,
}: {
  light: Light;
  edgeStyle?: EdgeStyle;
  replace?: boolean;
}) {
  const surface = useSurface<HTMLButtonElement>(light, { edgeStyle });
  return (
    <button key={String(replace)} ref={surface}>
      Save
    </button>
  );
}
function App({
  edgeStyle = 'raised',
  replace = false,
  motion = 'static',
  intensity = 0.75,
  portal = false,
}: {
  edgeStyle?: EdgeStyle;
  replace?: boolean;
  motion?: LightOptions['motion'];
  intensity?: number;
  portal?: boolean;
}) {
  const light = useLight({ motion, intensity });
  return (
    <>
      <Button light={light} edgeStyle={edgeStyle} replace={replace} />
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
  expect(container.querySelector('button')?.style.getPropertyValue('--edge-angle')).toBe(
    '315.0deg',
  );
  await act(async () => root.render(null));
  expect(frames.size).toBe(0);
});
it('updates stationary edgeStyle and intensity, then replaces the ref target with the latest edgeStyle', async () => {
  await act(async () => root.render(<App />));
  flush();
  const original = container.querySelector('button')!;
  await act(async () => root.render(<App edgeStyle="recessed" intensity={0.4} />));
  flush();
  expect(container.querySelector('button')).toBe(original);
  expect(original.style.getPropertyValue('--edge-angle')).toBe('315.0deg');
  expect(original.style.getPropertyValue('--edge-strength')).toBe('0.280');
  await act(async () => root.render(<App edgeStyle="recessed" intensity={0.4} replace />));
  flush();
  expect(original.style.getPropertyValue('--edge-angle')).toBe('');
  expect(container.querySelector('button')?.style.getPropertyValue('--edge-angle')).toBe(
    '315.0deg',
  );
});
it('does not rerender React components during pointer updates and preserves nodes', async () => {
  let renders = 0;
  function Counter() {
    renders++;
    const light = useLight({ motion: 'dynamic' });
    const surface = useSurface<HTMLButtonElement>(light);
    return <button ref={surface}>Save</button>;
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
  expect(button?.style.getPropertyValue('--edge-angle')).toBe('90.0deg');
});
it('supports same-document portals without reparenting native controls', async () => {
  await act(async () => root.render(<App portal />));
  flush();
  const outside = document.body.querySelector(':scope > button');
  expect(outside?.getAttribute('style')).toContain('--edge-angle: 315.0deg');
  await act(async () => root.render(<App />));
  expect(outside?.isConnected).toBe(false);
});
it('hydrates server markup and keeps an edited input value and selection', async () => {
  function Field() {
    const light = useLight();
    const surface = useSurface<HTMLLabelElement>(light, {
      edgeStyle: 'recessed',
    });
    const [value, setValue] = useState('hello');
    return (
      <label ref={surface}>
        Query
        <input value={value} onChange={(event) => setValue(event.target.value)} />
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

it('updates and clears surface appearance without replacing its registration', async () => {
  function Appearance({ color, intensity }: { color?: string; intensity?: number }) {
    const light = useLight({ motion: 'static' });
    const surface = useSurface<HTMLButtonElement>(light, { color, intensity });
    return <button ref={surface}>Save</button>;
  }
  await act(async () => root.render(<Appearance color="red" intensity={0.4} />));
  flush();
  const button = container.querySelector('button')!;
  expect(button.style.getPropertyValue('--edge-highlight')).toBe('red');
  expect(button.style.getPropertyValue('--edge-intensity')).toBe('0.4');
  const angle = button.style.getPropertyValue('--edge-angle');
  await act(async () => root.render(<Appearance color="blue" intensity={2} />));
  expect(container.querySelector('button')).toBe(button);
  expect(button.style.getPropertyValue('--edge-highlight')).toBe('blue');
  expect(button.style.getPropertyValue('--edge-intensity')).toBe('1');
  expect(button.style.getPropertyValue('--edge-angle')).toBe(angle);
  await act(async () => root.render(<Appearance intensity={-1} />));
  expect(button.style.getPropertyValue('--edge-intensity')).toBe('0');
  expect(button.style.getPropertyValue('--edge-highlight')).toBe('');
  await act(async () => root.render(<Appearance intensity={NaN} />));
  expect(button.style.getPropertyValue('--edge-intensity')).toBe('');
  await act(async () => root.render(<Appearance />));
  expect(button.style.getPropertyValue('--edge-intensity')).toBe('');
});

it('reconnects an existing surface when its light handle changes', async () => {
  function Scene({ second }: { second: boolean }) {
    const firstLight = useLight({ motion: 'static', intensity: 0.2 });
    const secondLight = useLight({ motion: 'static', intensity: 0.8 });
    const surface = useSurface<HTMLButtonElement>(second ? secondLight : firstLight);
    return <button ref={surface}>Save</button>;
  }
  await act(async () => root.render(<Scene second={false} />));
  flush();
  const button = container.querySelector('button')!;
  expect(button.style.getPropertyValue('--edge-strength')).toBe('0.140');
  await act(async () => root.render(<Scene second />));
  flush();
  expect(container.querySelector('button')).toBe(button);
  expect(button.style.getPropertyValue('--edge-strength')).toBe('0.560');
});
it('allows a surface hook without an attached host', async () => {
  function Hidden() {
    const light = useLight();
    useSurface(light);
    return null;
  }
  await act(async () => root.render(<Hidden />));
  expect(container.childElementCount).toBe(0);
});
it('exposes refresh to remeasure a stationary pointer after a position change', async () => {
  let refresh: (() => void) | undefined;
  function Scene() {
    const light = useLight({ motion: 'dynamic', radius: 10 });
    refresh = light.refresh;
    return <button ref={useSurface<HTMLButtonElement>(light)}>Save</button>;
  }
  await act(async () => root.render(<Scene />));
  document.dispatchEvent(
    Object.assign(new Event('pointermove'), {
      clientX: 50,
      clientY: -10,
      pointerType: 'mouse',
    }),
  );
  flush();
  const button = container.querySelector('button')!;
  expect(button.style.getPropertyValue('--edge-strength')).toBe('0.000');
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(0, -20, 100, 100),
  );
  expect(refresh).toBeTypeOf('function');
  refresh!();
  flush();
  expect(Number(button.style.getPropertyValue('--edge-strength'))).toBeGreaterThan(0);
});

it('keeps native classes/styles through rerenders and releases only the effect on detach', async () => {
  function Scene({
    enabled,
    variant,
    color,
  }: {
    enabled: boolean;
    variant: string;
    color?: string;
  }) {
    const light = useLight({ motion: 'static' });
    const ref = useSurface<HTMLButtonElement>(light, { color });
    return (
      <button
        ref={enabled ? ref : undefined}
        className={variant}
        style={{ padding: variant === 'first' ? 12 : 24 }}
      >
        Save
      </button>
    );
  }
  await act(async () => root.render(<Scene enabled variant="first" color="red" />));
  flush();
  const button = container.querySelector('button')!;
  const initialClasses = button.className;
  await act(async () => root.render(<Scene enabled variant="second" color="blue" />));
  expect(container.querySelector('button')).toBe(button);
  expect(button.classList.contains('second')).toBe(true);
  expect(button.classList.contains('first')).toBe(false);
  expect(button.className.split(' ').length).toBe(initialClasses.split(' ').length);
  expect(button.style.padding).toBe('24px');
  expect(button.style.getPropertyValue('--edge-highlight')).toBe('blue');
  await act(async () => root.render(<Scene enabled={false} variant="second" />));
  expect(button.className).toBe('second');
  expect(button.style.padding).toBe('24px');
  expect(button.style.getPropertyValue('--edge-highlight')).toBe('');
  expect(button.style.getPropertyValue('--edge-angle')).toBe('');
  await act(async () => root.render(<Scene enabled variant="second" />));
  flush();
  expect(button.className).not.toBe('second');
  expect(button.style.getPropertyValue('--edge-angle')).toBe('315.0deg');
});

it('decorates a late child and preserves its independent class updates', async () => {
  function Child({ surface }: { surface: ReturnType<typeof useSurface<HTMLButtonElement>> }) {
    const [shown, setShown] = useState(false);
    const [active, setActive] = useState(false);
    return (
      <>
        <button onClick={() => setShown(true)}>Show host</button>
        {shown ? (
          <button
            ref={surface}
            className={active ? 'active' : 'idle'}
            onClick={() => setActive(true)}
          >
            Host
          </button>
        ) : null}
      </>
    );
  }
  function Scene() {
    const light = useLight({ motion: 'static' });
    const surface = useSurface<HTMLButtonElement>(light, { color: 'red' });
    return <Child surface={surface} />;
  }
  await act(async () => root.render(<Scene />));
  await act(async () => container.querySelector('button')!.click());
  flush();
  const host = container.querySelectorAll('button')[1]!;
  expect(host.style.getPropertyValue('--edge-highlight')).toBe('red');
  const classes = host.className.split(' ').length;
  await act(async () => host.click());
  expect(host.classList.contains('active')).toBe(true);
  expect(host.classList.contains('idle')).toBe(false);
  expect(host.className.split(' ').length).toBe(classes);
});
