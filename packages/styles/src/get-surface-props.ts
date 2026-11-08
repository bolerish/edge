import type { EdgeStyle } from '@bolerish/edge-core';

export interface SurfaceOptions {
  /** How the edge responds to light. */
  edgeStyle?: EdgeStyle;
  /** Decoration slot. Choose before when the host already uses ::after. */
  pseudoElement?: 'before' | 'after';
  /** Any CSS color. Defaults to the host currentColor. */
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
  const className = `bolerish-edge bolerish-edge-${pseudoElement}`;
  const intensity = options.intensity;
  const style = {
    '--edge-highlight': options.color,
    '--edge-shadow': options.shadowColor,
    '--edge-border-width':
      options.borderWidth === undefined || !Number.isFinite(options.borderWidth)
        ? undefined
        : `${Math.max(0, options.borderWidth)}px`,
    '--edge-intensity':
      intensity === undefined || !Number.isFinite(intensity)
        ? undefined
        : Math.min(1, Math.max(0, intensity)),
  };
  return { className, style };
}
