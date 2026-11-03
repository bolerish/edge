import {
  useCallback,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type RefCallback,
} from 'react';
import type { Registration } from '@bolerish/edge-core';
import { getLightController, type Light } from './useLight.js';

import { getSurfaceProps, type SurfaceOptions } from '@bolerish/edge-styles';

export type { SurfaceOptions } from '@bolerish/edge-styles';

/** Register your own host element and apply the returned className and inline style. */
export function useSurface<T extends HTMLElement = HTMLElement>(
  light: Light,
  options: SurfaceOptions = {},
) {
  const core = getLightController(light);
  const edgeStyle = options.edgeStyle ?? 'raised';
  const currentEdgeStyle = useRef(edgeStyle);
  const registration = useRef<Registration | null>(null);
  const ref: RefCallback<T> = useCallback(
    (element: T | null) => {
      registration.current?.destroy();
      registration.current = element
        ? core.register(element, currentEdgeStyle.current)
        : null;
    },
    [core],
  );
  // Runs before a scheduled frame, including a ref replacement in the same commit.
  useLayoutEffect(() => {
    currentEdgeStyle.current = edgeStyle;
    registration.current?.update(edgeStyle);
  }, [edgeStyle]);
  const props = getSurfaceProps(options);
  const style: CSSProperties & typeof props.style = props.style;
  return { ref, className: props.className, style };
}
