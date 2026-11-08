import { useEffect, useRef } from 'react';
import { createLight, type LightController, type LightOptions } from '@bolerish/edge-core';

const lightBrand = Symbol('EdgeLight');
export interface Light {
  readonly [lightBrand]: LightController;
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
    lightRef.current = { [lightBrand]: core, refresh: core.refresh };
  }
  const light = lightRef.current;
  const core = light[lightBrand];
  useEffect(() => core.mount(document), [core]);
  useEffect(
    () => core.configure({ motion, radius, intensity, staticDirection, direction }),
    [core, motion, radius, intensity, staticDirection, direction],
  );
  return light;
}

/** Internal access keeps controller ownership on the opaque handle. */
export function getLightController(light: Light): LightController {
  const core = light?.[lightBrand];
  if (!core) throw new Error('useSurface requires a Light returned by useLight');
  return core;
}

export function isLight(value: unknown): value is Light {
  return typeof value === 'object' && value !== null && lightBrand in value;
}
