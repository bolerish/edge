import { forwardRef, useImperativeHandle, type ReactNode, type Ref } from 'react';
import type { LightOptions } from '@bolerish/edge-core';
import { useLight, type Light } from '../hooks/useLight.js';
import { LightContext } from './light-context.js';
import { Surface } from './Surface.js';

export type Motion = NonNullable<LightOptions['motion']>;
export interface LightingProps {
  children: ReactNode;
  /** Defaults to system, respecting motion and device preferences. */
  motion?: Motion;
  staticDirection?: LightOptions['staticDirection'];
  radius?: number;
  intensity?: number;
  /** Optional handle for explicit refresh after position-only layout changes. */
  ref?: Ref<Light>;
}
/** Shares one light with explicit descendant surfaces, without adding DOM. */
const LightingRoot = forwardRef<Light, Omit<LightingProps, 'ref'>>(function LightingRoot({
  children, motion = 'system', staticDirection, radius, intensity,
}, ref) {
  const light = useLight({ motion, radius, intensity, staticDirection });
  useImperativeHandle(ref, () => light, [light]);
  return <LightContext.Provider value={light}>{children}</LightContext.Provider>;
});

export const Lighting = Object.assign(LightingRoot, { Surface });

export type EdgeProviderProps = LightingProps;
export const Edge = { Provider: LightingRoot, Surface };
