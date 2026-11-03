import * as stylex from '@stylexjs/stylex';
import {
  useCallback,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type RefCallback,
} from 'react';
import type { Material, Registration } from '@bolerish/wisp-core';
import { controllers, type Light } from './useLight.js';

interface SurfaceAppearance {
  /** Any CSS color. */
  color?: string;
  /** Multiplier for the shared light, clamped to 0–1. Defaults to 1. */
  intensity?: number;
}
export type SurfaceOptions = SurfaceAppearance & (
  | { material?: Material; theme?: false }
  | { material?: 'raised' | 'matte'; theme: 'wisp' }
);

/** Register your own host element and apply the returned className and inline style. */
export function useSurface<T extends HTMLElement = HTMLElement>(
  light: Light,
  options: SurfaceOptions = {},
) {
  const core = controllers.get(light);
  if (!core)
    throw new Error('useSurface requires a Light returned by useLight');
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
  });
  const theme =
    options.theme === 'wisp' ? wispStyles[options.material ?? 'raised'] : null;
  const props = stylex.props(surfaceStyles.border, theme);
  const intensity = options.intensity;
  const style: CSSProperties & {
    '--wisp-highlight'?: string;
    '--wisp-intensity'?: number;
  } = {
    ...props.style,
    '--wisp-highlight': options.color,
    '--wisp-intensity':
      intensity === undefined || !Number.isFinite(intensity)
        ? undefined
        : Math.min(1, Math.max(0, intensity)),
  };
  return { ref, className: props.className, style };
}

// The highlight spans twice its half-width; the shadow peaks opposite it.
const HIGHLIGHT_HALF_WIDTH_DEGREES = 40;
const SHADOW_PEAK_DEGREES = 220;
const FULL_TURN_DEGREES = 360;
const FALLBACK_DIRECTION_DEGREES = 315;
const FALLBACK_STRENGTH = 0.25;

const surfaceStyles = stylex.create({
  border: {
    position: 'relative',
    '::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      boxSizing: 'border-box',
      borderRadius: 'inherit',
      pointerEvents: 'none',
      padding: 'var(--wisp-border-width, 1px)',
      backgroundImage:
        `conic-gradient(from calc(var(--wisp-angle, ${FALLBACK_DIRECTION_DEGREES}deg) - ${HIGHLIGHT_HALF_WIDTH_DEGREES}deg), transparent 0deg, var(--wisp-highlight, #e5edc8) ${HIGHLIGHT_HALF_WIDTH_DEGREES}deg, transparent ${HIGHLIGHT_HALF_WIDTH_DEGREES * 2}deg, #0008 ${SHADOW_PEAK_DEGREES}deg, transparent ${FULL_TURN_DEGREES}deg)`,
      opacity: {
        default: `calc(var(--wisp-strength, ${FALLBACK_STRENGTH}) * var(--wisp-intensity, 1))`,
        '@media (forced-colors: active)': 0,
      },
      WebkitMask:
        'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
    },
  },
});

const wispStyles = stylex.create({
  raised: {
    backgroundColor: '#262d20',
    color: '#e5e9d8',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#3b4431',
    borderRadius: 10,
    boxShadow: '0 3px 8px #0003, inset 0 1px #ffffff08',
  },
  matte: {
    backgroundColor: '#20251c',
    color: '#d2d8c5',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#343c2c',
    borderRadius: 10,
    boxShadow: 'none',
  },
});
