import { useCallback, useLayoutEffect, useRef } from 'react';
import type { Registration, EdgeStyle } from '@bolerish/edge-core';
import { getLightController, type Light } from './useLight.js';

/** Shares registration without assigning appearance ownership. */
export function useSurfaceRegistration<T extends HTMLElement>(light: Light, edgeStyle: EdgeStyle) {
  const core = getLightController(light);
  const currentEdgeStyle = useRef(edgeStyle);
  const registration = useRef<Registration | null>(null);
  const ref = useCallback((element: T | null) => {
    registration.current?.destroy();
    registration.current = element ? core.register(element, currentEdgeStyle.current) : null;
  }, [core]);
  useLayoutEffect(() => {
    currentEdgeStyle.current = edgeStyle;
    registration.current?.update(edgeStyle);
  }, [edgeStyle]);
  return ref;
}
