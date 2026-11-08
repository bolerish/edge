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
  function updatePointer(x: number, y: number) {
    if (getMotion() === 'static' || (getMotion() === 'system' && reduced.matches)) return;
    pointer = { x, y };
    scheduleFrame();
  }
  function move(event: PointerEvent) {
    if (touchId === null && event.pointerType !== 'touch')
      updatePointer(event.clientX, event.clientY);
  }
  function handleTouchStart(event: TouchEvent) {
    if (touchId !== null || event.touches.length !== 1) return;
    const contact = event.changedTouches[0];
    if (!contact) return;
    touchId = contact.identifier;
    updatePointer(contact.clientX, contact.clientY);
  }
  function handleTouchMove(event: TouchEvent) {
    for (const contact of Array.from(event.touches)) {
      if (contact.identifier === touchId) {
        updatePointer(contact.clientX, contact.clientY);
        return;
      }
    }
  }
  function handleTouchEnd(event: TouchEvent) {
    for (const contact of Array.from(event.changedTouches)) {
      if (contact.identifier === touchId) {
        clear();
        return;
      }
    }
  }
  function clear() {
    touchId = null;
    pointer = null;
    scheduleFrame();
  }
  function out(event: PointerEvent) {
    if (touchId === null && event.pointerType !== 'touch' && event.relatedTarget === null) clear();
  }
  function invalidateGeometry() {
    if (live) invalidate();
  }
  function mediaChanged() {
    clear();
  }
  function scrolled(event: Event) {
    if (!live) return;
    const container = event.target instanceof view!.Element ? (event.target as Element) : undefined;
    invalidate(container);
  }
  const observer = new view.ResizeObserver(invalidateGeometry);
  // Native scrolling can cancel the pointer stream; touch events track contact lifetime.
  target.addEventListener('touchstart', handleTouchStart, { passive: true });
  target.addEventListener('touchmove', handleTouchMove, { passive: true });
  target.addEventListener('touchend', handleTouchEnd, { passive: true });
  target.addEventListener('touchcancel', handleTouchEnd, { passive: true });
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
      target.removeEventListener('touchstart', handleTouchStart);
      target.removeEventListener('touchmove', handleTouchMove);
      target.removeEventListener('touchend', handleTouchEnd);
      target.removeEventListener('touchcancel', handleTouchEnd);
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
