import type { LightOptions } from './options.js';
import type { Point } from '../surface/geometry.js';

export function createLightSession(
  target: Document,
  {
    getMotion,
    render,
    invalidate,
  }: {
    getMotion(): Required<LightOptions>['motion'];
    render(pointer: Point | null, fixed: boolean): void;
    invalidate(scrollContainer?: Element): void;
  },
) {
  const view = target.defaultView;
  if (!view) throw new Error('Light requires a browser document');
  let pointer: Point | null = null;
  let touchId: number | null = null;
  let live = true;
  let frame: number | null = null;
  const reduced = view.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = view.matchMedia('(hover: hover) and (pointer: fine)');
  function scheduleFrame() {
    if (live && frame === null) frame = view!.requestAnimationFrame(renderFrame);
  }
  function renderFrame() {
    frame = null;
    if (!live) return;
    const motion = getMotion();
    const fixed =
      motion === 'static' ||
      (motion === 'system' && (reduced.matches || (!fine.matches && !pointer)));
    render(pointer, fixed);
  }
  function move(event: PointerEvent) {
    if (
      (event.pointerType === 'touch' && event.pointerId !== touchId) ||
      getMotion() === 'static' ||
      (getMotion() === 'system' && reduced.matches)
    )
      return;
    pointer = { x: event.clientX, y: event.clientY };
    scheduleFrame();
  }
  function down(event: PointerEvent) {
    if (event.pointerType !== 'touch' || !event.isPrimary) return;
    touchId = event.pointerId;
    move(event);
  }
  function end(event: PointerEvent) {
    if (event.pointerType === 'touch' && event.pointerId === touchId) clear();
  }
  function clear() {
    touchId = null;
    pointer = null;
    scheduleFrame();
  }
  function out(event: PointerEvent) {
    if (event.pointerType !== 'touch' && event.relatedTarget === null) clear();
  }
  function invalidateGeometry() {
    if (live) invalidate();
  }
  function mediaChanged() {
    clear();
  }
  function scrolled(event: Event) {
    if (!live) return;
    if (touchId !== null) clear();
    const container = event.target instanceof view!.Element ? (event.target as Element) : undefined;
    invalidate(container);
  }
  const observer = new view.ResizeObserver(invalidateGeometry);
  target.addEventListener('pointerdown', down, { passive: true });
  target.addEventListener('pointerup', end, { passive: true });
  target.addEventListener('pointercancel', end, { passive: true });
  target.addEventListener('pointermove', move, { passive: true });
  target.addEventListener('pointerout', out, { passive: true });
  target.addEventListener('scroll', scrolled, {
    capture: true,
    passive: true,
  });
  target.addEventListener('load', invalidateGeometry, true);
  view.addEventListener('resize', invalidateGeometry, { passive: true });
  view.addEventListener('blur', clear);
  reduced.addEventListener('change', mediaChanged);
  fine.addEventListener('change', mediaChanged);
  target.fonts?.addEventListener('loadingdone', invalidateGeometry);
  void target.fonts?.ready.then(invalidateGeometry);
  return {
    schedule: scheduleFrame,
    clearPointer() {
      touchId = null;
      pointer = null;
    },
    observe(element: HTMLElement) {
      observer.observe(element);
    },
    unobserve(element: HTMLElement) {
      observer.unobserve(element);
    },
    stop() {
      if (!live) return;
      live = false;
      if (frame !== null) view.cancelAnimationFrame(frame);
      observer.disconnect();
      target.removeEventListener('pointerdown', down);
      target.removeEventListener('pointerup', end);
      target.removeEventListener('pointercancel', end);
      target.removeEventListener('pointermove', move);
      target.removeEventListener('pointerout', out);
      target.removeEventListener('scroll', scrolled, true);
      target.removeEventListener('load', invalidateGeometry, true);
      view.removeEventListener('resize', invalidateGeometry);
      view.removeEventListener('blur', clear);
      reduced.removeEventListener('change', mediaChanged);
      fine.removeEventListener('change', mediaChanged);
      target.fonts?.removeEventListener('loadingdone', invalidateGeometry);
    },
  };
}
