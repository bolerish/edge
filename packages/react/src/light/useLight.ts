import { useEffect, useRef } from 'react';
import {
  createLight,
  type LightController,
  type LightOptions,
  type EdgeStyle,
} from '@bolerish/edge-core';
import { ensureStyles } from '../styles/stylesheet.js';

const lightBrand = Symbol('EdgeLight');
export interface Light {
  readonly [lightBrand]: {
    core: LightController;
    document?: Document;
    active: boolean;
    stop?: () => void;
  };
  refresh(): void;
}

/** Owns one shared light. Pointer frames never update React state. */
export function useLight({
  motion,
  staticDirection,
  direction,
  radius,
  intensity,
}: LightOptions = {}): Light {
  const lightRef = useRef<Light | null>(null);
  if (lightRef.current === null) {
    const core = createLight({ motion, radius, intensity, staticDirection, direction });
    lightRef.current = { [lightBrand]: { core, active: false }, refresh: core.refresh };
  }
  const light = lightRef.current;
  const state = light[lightBrand];
  const core = state.core;
  useEffect(() => {
    state.active = true;
    if (state.document) state.stop = core.mount(state.document);
    return () => {
      state.active = false;
      state.stop?.();
      state.stop = undefined;
    };
  }, [state, core]);
  useEffect(
    () => core.configure({ motion, radius, intensity, staticDirection, direction }),
    [core, motion, radius, intensity, staticDirection, direction],
  );
  return light;
}

/** Internal access keeps controller ownership on the opaque handle. */
export function getLightController(light: Light): LightController {
  const state = light?.[lightBrand];
  if (!state) throw new Error('useSurface requires a Light returned by useLight');
  return state.core;
}

/** Register first so rejected hosts never acquire styles or a document lifetime. */
export function registerLightSurface(light: Light, element: HTMLElement, edgeStyle: EdgeStyle) {
  const state = light[lightBrand];
  const registration = getLightController(light).register(element, edgeStyle);
  try {
    ensureStyles(element.ownerDocument);
    state.document = element.ownerDocument;
    if (state.active && !state.stop) state.stop = state.core.mount(state.document);
  } catch (error) {
    registration.destroy();
    throw error;
  }
  return registration;
}

export function isLight(value: unknown): value is Light {
  return typeof value === 'object' && value !== null && lightBrand in value;
}
