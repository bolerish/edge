import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefCallback } from 'react';
import { createLight, type LightController, type LightOptions, type Material, type Registration } from '@wisp-lighting/core';
import { surfaceStyles, wispStyles } from './surface-styles.js';

export type { LightOptions, Material } from '@wisp-lighting/core';
const lightBrand = Symbol('WispLight');
export interface Light { readonly [lightBrand]: true; refresh(): void }
export type SurfaceOptions =
  | { material?: Material; theme?: false }
  | { material?: 'raised' | 'matte'; theme: 'wisp' };
const controllers = new WeakMap<Light, LightController>();

/** Owns one shared light. Pointer frames never update React state. */
export function useLight({mode,radius,intensity}: LightOptions = {}): Light {
  const [state] = useState(() => {
    const core = createLight({mode,radius,intensity});
    const handle: Light = {[lightBrand]:true,refresh:core.refresh};
    controllers.set(handle,core);
    return {core,handle};
  });
  useEffect(() => state.core.mount(document),[state]);
  useEffect(() => state.core.configure({mode,radius,intensity}),[state,mode,radius,intensity]);
  return state.handle;
}

/** Register your own host element and compose the returned StyleX value first. */
export function useSurface<T extends HTMLElement = HTMLElement>(light: Light, options: SurfaceOptions = {}) {
  const core = controllers.get(light);
  if (!core) throw new Error('useSurface requires a Light returned by useLight');
  const material = options.material ?? 'raised';
  const currentMaterial = useRef(material);
  const registration = useRef<Registration | null>(null);
  const ref: RefCallback<T> = useCallback((element: T | null) => {
    registration.current?.destroy();
    registration.current = element ? core.register(element,currentMaterial.current) : null;
  },[core]);
  // Runs before a scheduled frame, including a ref replacement in the same commit.
  useLayoutEffect(() => {
    currentMaterial.current = material;
    registration.current?.update(material);
  });
  const theme = options.theme === 'wisp' ? wispStyles[options.material ?? 'raised'] : null;
  return {ref,style:[surfaceStyles.border,theme]};
}
