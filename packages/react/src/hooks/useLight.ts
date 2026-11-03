import { useEffect, useState } from 'react';
import {
  createLight,
  type LightController,
  type LightOptions,
} from '@bolerish/wisp-core';

const lightBrand = Symbol('WispLight');
export interface Light {
  readonly [lightBrand]: true;
  refresh(): void;
}

// Shared privately by the two hooks, never exposed by the package barrel.
export const controllers = new WeakMap<Light, LightController>();

/** Owns one shared light. Pointer frames never update React state. */
export function useLight({
  mode,
  radius,
  intensity,
}: LightOptions = {}): Light {
  const [state] = useState(() => {
    const core = createLight({ mode, radius, intensity });
    const handle: Light = { [lightBrand]: true, refresh: core.refresh };
    controllers.set(handle, core);
    return { core, handle };
  });
  useEffect(() => state.core.mount(document), [state]);
  useEffect(
    () => state.core.configure({ mode, radius, intensity }),
    [state, mode, radius, intensity],
  );
  return state.handle;
}
