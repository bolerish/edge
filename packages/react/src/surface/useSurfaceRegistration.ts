import { useBrowserLayoutEffect } from './useBrowserLayoutEffect.js';
import { useCallback, useRef } from 'react';
import type { Registration, EdgeStyle } from '@bolerish/edge-core';
import { getLightController, registerLightSurface, type Light } from '../light/useLight.js';

/** Shares registration without assigning appearance ownership. */
export function useSurfaceRegistration<T extends HTMLElement>(light: Light, edgeStyle: EdgeStyle) {
  getLightController(light);
  const currentEdgeStyle = useRef(edgeStyle);
  const registration = useRef<Registration | null>(null);
  const ref = useCallback(
    (element: T | null) => {
      registration.current?.destroy();
      registration.current = null;
      if (element)
        registration.current = registerLightSurface(light, element, currentEdgeStyle.current);
    },
    [light],
  );
  useBrowserLayoutEffect(() => {
    currentEdgeStyle.current = edgeStyle;
    registration.current?.update(edgeStyle);
  }, [edgeStyle]);
  return ref;
}
