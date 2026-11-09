import { forwardRef, useImperativeHandle, type ReactNode, type Ref } from 'react';
import type { LightOptions } from '@bolerish/edge-core';
import { useLight, type Light } from './light/useLight.js';
import { LightContext } from './light/light-context.js';
import { Surface } from './surface/Surface.js';
import { Styles } from './styles/Styles.js';

export type Motion = NonNullable<LightOptions['motion']>;
export interface EdgeProviderProps {
  children: ReactNode;
  /** Defaults to system, respecting motion and device preferences. */
  motion?: Motion;
  staticDirection?: LightOptions['staticDirection'];
  direction?: LightOptions['direction'];
  radius?: number;
  intensity?: number;
  /** Optional handle for explicit refresh after position-only layout changes. */
  ref?: Ref<Light>;
}
/** Shares one light with explicit descendant surfaces, without adding DOM. */
const EdgeProvider = forwardRef<Light, Omit<EdgeProviderProps, 'ref'>>(function EdgeProvider(
  { children, motion = 'system', staticDirection, direction, radius, intensity },
  ref,
) {
  const light = useLight({ motion, radius, intensity, staticDirection, direction });
  useImperativeHandle(ref, () => light, [light]);
  return <LightContext.Provider value={light}>{children}</LightContext.Provider>;
});

export const Edge = { Provider: EdgeProvider, Surface, Styles };
