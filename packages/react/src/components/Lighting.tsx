import { useImperativeHandle, type ReactNode, type Ref } from 'react';
import type { LightOptions } from '@bolerish/wisp-core';
import { useLight, type Light } from '../hooks/useLight.js';
import { LightContext } from './light-context.js';
import { Surface } from './Surface.js';

export type Tracking = 'off' | 'on' | 'system';
export interface LightingProps {
  children: ReactNode;
  /** Defaults to system, respecting motion and device preferences. */
  tracking?: Tracking;
  radius?: number;
  intensity?: number;
  /** Optional handle for explicit refresh after position-only layout changes. */
  ref?: Ref<Light>;
}
const modes = {
  off: 'static',
  on: 'pointer',
  system: 'auto',
} satisfies Record<Tracking, NonNullable<LightOptions['mode']>>;

/** Shares one light with explicit descendant surfaces, without adding DOM. */
function LightingRoot({
  children, tracking = 'system', radius, intensity, ref,
}: LightingProps) {
  const mode = modes[tracking];
  if (typeof mode !== 'string') throw new RangeError('Unknown pointer tracking mode');
  const light = useLight({ mode, radius, intensity });
  useImperativeHandle(ref, () => light, [light]);
  return <LightContext value={light}>{children}</LightContext>;
}

export const Lighting = Object.assign(LightingRoot, { Surface });
