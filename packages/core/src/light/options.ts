export interface LightOptions {
  motion?: 'system' | 'dynamic' | 'static';
  staticDirection?: number | 'random';
  /** Dynamic highlight direction relative to the pointer; independent of surface style. */
  direction?: 'toward' | 'away';
  /** Fade distance outside each surface in CSS pixels. Defaults to 480; must be positive and finite. */
  range?: number;
  intensity?: number;
}
const DEFAULT_STATIC_DIRECTION_DEGREES = 315;
const DEFAULT_LIGHT_RANGE_PX = 480;
const DEFAULT_LIGHT_INTENSITY = 0.75;

export function normalizeLightOptions(options: LightOptions) {
  const motion = options.motion ?? 'system';
  const staticDirection = options.staticDirection ?? DEFAULT_STATIC_DIRECTION_DEGREES;
  if (staticDirection !== 'random' && !Number.isFinite(staticDirection))
    throw new RangeError('staticDirection must be finite or random');
  const direction = options.direction ?? 'toward';
  if (direction !== 'toward' && direction !== 'away')
    throw new RangeError('Unknown light direction');
  const range = options.range ?? DEFAULT_LIGHT_RANGE_PX;
  const intensity = options.intensity ?? DEFAULT_LIGHT_INTENSITY;
  if (!['system', 'dynamic', 'static'].includes(motion))
    throw new RangeError('Unknown light motion');
  if (!Number.isFinite(range) || range <= 0)
    throw new RangeError('range must be positive and finite');
  if (!Number.isFinite(intensity) || intensity < 0 || intensity > 1)
    throw new RangeError('intensity must be between 0 and 1');
  return { motion, range, intensity, staticDirection, direction };
}
