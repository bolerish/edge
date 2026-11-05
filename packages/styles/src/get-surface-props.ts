import * as stylex from '@stylexjs/stylex';
import type { EdgeStyle } from '@bolerish/edge-core';

export interface SurfaceOptions {
  /** How the edge responds to light. */
  edgeStyle?: EdgeStyle;
  /** Decoration slot. Choose before when the host already uses ::after. */
  pseudoElement?: 'before' | 'after';
  /** Any CSS color. */
  color?: string;
  /** Opposite-edge shadow; use transparent on light surfaces when appropriate. */
  shadowColor?: string;
  /** Decorative edge thickness in pixels. Defaults to 1. */
  borderWidth?: number;
  /** Multiplier for the shared light, clamped to 0–1. Defaults to 1. */
  intensity?: number;
}
/** Framework-independent class and CSS-variable bindings for one surface. */
export function getSurfaceProps(options: SurfaceOptions = {}) {
  const pseudoElement = options.pseudoElement === undefined ? 'after' : options.pseudoElement;
  if (pseudoElement !== 'after' && pseudoElement !== 'before')
    throw new RangeError('Unknown surface pseudoElement');
  const props = stylex.props(surfaceStyles.host, surfaceStyles[pseudoElement]);
  const intensity = options.intensity;
  const style = {
    '--wisp-highlight': options.color,
    '--wisp-shadow': options.shadowColor,
    '--wisp-border-width': options.borderWidth === undefined || !Number.isFinite(options.borderWidth) ? undefined : `${Math.max(0, options.borderWidth)}px`,
    '--wisp-intensity':
      intensity === undefined || !Number.isFinite(intensity)
        ? undefined
        : Math.min(1, Math.max(0, intensity)),
  };
  return { className: props.className, style };
}

// Stryker disable all: StyleX declarations must stay static; browser tests cover decorative CSS.
// The highlight spans twice its half-width; the shadow peaks opposite it.
const HIGHLIGHT_HALF_WIDTH_DEGREES = 40;
const SHADOW_PEAK_DEGREES = 220;
const FULL_TURN_DEGREES = 360;
const FALLBACK_DIRECTION_DEGREES = 315;
const FALLBACK_STRENGTH = 0;

const DECORATION_BACKGROUND = `conic-gradient(from calc(var(--wisp-angle, ${FALLBACK_DIRECTION_DEGREES}deg) - ${HIGHLIGHT_HALF_WIDTH_DEGREES}deg), transparent 0deg, var(--wisp-highlight, #e5edc8) ${HIGHLIGHT_HALF_WIDTH_DEGREES}deg, transparent ${HIGHLIGHT_HALF_WIDTH_DEGREES * 2}deg, var(--wisp-shadow, #0008) ${SHADOW_PEAK_DEGREES}deg, transparent ${FULL_TURN_DEGREES}deg)`;
const DECORATION_MASK = 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)';
const DECORATION_OPACITY = `calc(var(--wisp-strength, ${FALLBACK_STRENGTH}) * var(--wisp-intensity, 1))`;

const surfaceStyles = stylex.create({
  host: { position: 'relative' },
  before: {
    '::before': {
      content: '""',
      position: 'absolute',
      top: 'var(--wisp-inset-top, 0px)',
      right: 'var(--wisp-inset-right, 0px)',
      bottom: 'var(--wisp-inset-bottom, 0px)',
      left: 'var(--wisp-inset-left, 0px)',
      boxSizing: 'border-box',
      borderRadius: 'inherit',
      pointerEvents: 'none',
      padding: 'var(--wisp-border-width, 1px)',
      backgroundImage: DECORATION_BACKGROUND,
      opacity: {
        default: DECORATION_OPACITY,
        '@media (forced-colors: active)': 0,
      },
      WebkitMask: DECORATION_MASK,
      mask: DECORATION_MASK,
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
    },
  },
  after: {
    '::after': {
      content: '""',
      position: 'absolute',
      top: 'var(--wisp-inset-top, 0px)',
      right: 'var(--wisp-inset-right, 0px)',
      bottom: 'var(--wisp-inset-bottom, 0px)',
      left: 'var(--wisp-inset-left, 0px)',
      boxSizing: 'border-box',
      borderRadius: 'inherit',
      pointerEvents: 'none',
      padding: 'var(--wisp-border-width, 1px)',
      backgroundImage: DECORATION_BACKGROUND,
      opacity: {
        default: DECORATION_OPACITY,
        '@media (forced-colors: active)': 0,
      },
      WebkitMask: DECORATION_MASK,
      mask: DECORATION_MASK,
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
    },
  },
});
