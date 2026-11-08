import { useBrowserLayoutEffect } from './useBrowserLayoutEffect.js';
import { useCallback, useContext, useRef, type RefCallback } from 'react';
import { getSurfaceProps, type SurfaceOptions } from '@bolerish/edge-styles';
import { isLight, getLightController, type Light } from './useLight.js';
import { useSurfaceRegistration } from './useSurfaceRegistration.js';
import { LightContext } from '../components/light-context.js';
import { bindSurfaceAppearance } from './surface-appearance.js';

export type { SurfaceOptions } from '@bolerish/edge-styles';

/** Connects an existing host. Edge owns decoration; the caller owns its UI. */
export function useSurface<T extends HTMLElement = HTMLElement>(options?: SurfaceOptions): RefCallback<T>;
export function useSurface<T extends HTMLElement = HTMLElement>(light: Light, options?: SurfaceOptions): RefCallback<T>;
export function useSurface<T extends HTMLElement = HTMLElement>(lightOrOptions?: Light | SurfaceOptions, explicitOptions?: SurfaceOptions): RefCallback<T> {
  const contextLight = useContext(LightContext);
  const explicit = arguments.length >= 2 || isLight(lightOrOptions);
  const light = explicit ? lightOrOptions as Light : contextLight;
  const options = (explicit ? explicitOptions : lightOrOptions as SurfaceOptions | undefined) ?? {};
  if (explicit) getLightController(light as Light);
  else if (lightOrOptions !== undefined && (lightOrOptions === null || typeof lightOrOptions !== 'object' || 'refresh' in lightOrOptions)) {
    throw new Error('useSurface requires a Light returned by useLight');
  }
  if (!light) throw new Error('useSurface requires an Edge.Provider or an explicit Light returned by useLight');
  const props = getSurfaceProps(options);
  const register = useSurfaceRegistration<T>(light, options.edgeStyle ?? 'raised');
  const latest = useRef(props);
  const binding = useRef<ReturnType<typeof bindSurfaceAppearance> | null>(null);
  const ref = useCallback((element: T | null) => {
    binding.current?.destroy();
    binding.current = null;
    register(element);
    if (element) binding.current = bindSurfaceAppearance(element, latest.current);
  }, [register]);
  // Reapply after React changes a host's className/style; attachment also supports late children.
  useBrowserLayoutEffect(() => {
    latest.current = props;
    binding.current?.update(props);
  });
  return ref;
}
