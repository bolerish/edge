import { useEffect, useRef } from 'react';
import {
  createLight,
  type LightController,
  type LightOptions,
} from '@bolerish/edge-core';

const lightBrand = Symbol('WispLight');
export interface Light {
  readonly [lightBrand]: LightController;
  refresh(): void;
}

/** Owns one shared light. Pointer frames never update React state. */
export function useLight({
  motion,
  staticDirection,
  radius,
  intensity,
}: LightOptions = {}): Light {
  const lightRef = useRef<Light | null>(null);
  if (lightRef.current === null) {
    const core = createLight({ motion, radius, intensity, staticDirection });
    lightRef.current = { [lightBrand]: core, refresh: core.refresh };
  }
  const light = lightRef.current;
  const core = light[lightBrand];
  useEffect(() => core.mount(document), [core]);
  useEffect(
    () => core.configure({ motion, radius, intensity, staticDirection }),
    [core, motion, radius, intensity, staticDirection],
  );
  return light;
}

/** Internal access keeps controller ownership on the opaque handle. */
export function getLightController(light: Light): LightController {
  const core = light?.[lightBrand];
  if (!core)
    throw new Error('useSurface requires a Light returned by useLight');
  return core;
}

export function isLight(value: unknown): value is Light {
  return typeof value === 'object' && value !== null && lightBrand in value;
}
