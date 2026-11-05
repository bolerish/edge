import { useCallback, useLayoutEffect, useRef, type RefCallback } from 'react';
import { getSurfaceProps, type SurfaceOptions } from '@bolerish/edge-styles';
import type { Light } from './useLight.js';
import { useSurfaceRegistration } from './useSurfaceRegistration.js';
import { bindSurfaceAppearance } from './surface-appearance.js';

export type { SurfaceOptions } from '@bolerish/edge-styles';

/** Connects an existing host. Edge owns decoration; the caller owns its UI. */
export function useSurface<T extends HTMLElement = HTMLElement>(light: Light, options: SurfaceOptions = {}): RefCallback<T> {
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
  useLayoutEffect(() => {
    latest.current = props;
    binding.current?.update(props);
  });
  return ref;
}
