import { useEffect, useState } from 'react';
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
  mode,
  staticDirection,
  radius,
  intensity,
}: LightOptions = {}): Light {
  const [state] = useState(() => {
    const core = createLight({ mode, radius, intensity, staticDirection });
    const handle: Light = { [lightBrand]: core, refresh: core.refresh };
    return { core, handle };
  });
  useEffect(() => state.core.mount(document), [state]);
  useEffect(
    () => state.core.configure({ mode, radius, intensity, staticDirection }),
    [state, mode, radius, intensity, staticDirection],
  );
  return state.handle;
}

/** Internal access keeps controller ownership on the opaque handle. */
export function getLightController(light: Light): LightController {
  const core = light?.[lightBrand];
  if (!core)
    throw new Error('useSurface requires a Light returned by useLight');
  return core;
}
