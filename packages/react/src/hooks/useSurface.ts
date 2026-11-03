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
  const material = options.material ?? 'raised';
  const currentMaterial = useRef(material);
  const registration = useRef<Registration | null>(null);
  const ref: RefCallback<T> = useCallback(
    (element: T | null) => {
      registration.current?.destroy();
      registration.current = element
        ? core.register(element, currentMaterial.current)
        : null;
    },
    [core],
  );
  // Runs before a scheduled frame, including a ref replacement in the same commit.
  useLayoutEffect(() => {
    currentMaterial.current = material;
    registration.current?.update(material);
  }, [material]);
  const props = getSurfaceProps(options);
  const style: CSSProperties & typeof props.style = props.style;
  return { ref, className: props.className, style };
}
