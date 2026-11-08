export interface LightOptions {
  motion?: 'system' | 'dynamic' | 'static';
  staticDirection?: number | 'random';
  /** Dynamic highlight direction; independent of the surface shape. */
  direction?: 'gather' | 'spread';
  radius?: number;
  intensity?: number;
}
const DEFAULT_STATIC_DIRECTION_DEGREES = 315;
const DEFAULT_LIGHT_RADIUS_PX = 480;
const DEFAULT_LIGHT_INTENSITY = 0.75;

export function normalizeLightOptions(options: LightOptions) {
  const motion = options.motion ?? 'system';
  const staticDirection = options.staticDirection ?? DEFAULT_STATIC_DIRECTION_DEGREES;
  if (staticDirection !== 'random' && !Number.isFinite(staticDirection))
    throw new RangeError('staticDirection must be finite or random');
  const direction = options.direction ?? 'gather';
  if (direction !== 'gather' && direction !== 'spread')
    throw new RangeError('Unknown light direction');
  const radius = options.radius ?? DEFAULT_LIGHT_RADIUS_PX;
  const intensity = options.intensity ?? DEFAULT_LIGHT_INTENSITY;
  if (!['system', 'dynamic', 'static'].includes(motion))
    throw new RangeError('Unknown light motion');
  if (!Number.isFinite(radius) || radius <= 0)
    throw new RangeError('radius must be positive and finite');
  if (!Number.isFinite(intensity) || intensity < 0 || intensity > 1)
    throw new RangeError('intensity must be between 0 and 1');
  return { motion, radius, intensity, staticDirection, direction };
}
