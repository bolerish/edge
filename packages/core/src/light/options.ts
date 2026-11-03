export interface LightOptions {
  mode?: 'auto' | 'pointer' | 'static' | 'frozen';
  radius?: number;
  intensity?: number;
}
const DEFAULT_LIGHT_RADIUS_PX = 480;
const DEFAULT_LIGHT_INTENSITY = 0.75;

export function normalizeLightOptions(options: LightOptions) {
  const mode = options.mode ?? 'auto';
  const radius = options.radius ?? DEFAULT_LIGHT_RADIUS_PX;
  const intensity = options.intensity ?? DEFAULT_LIGHT_INTENSITY;
  if (!['auto', 'pointer', 'static', 'frozen'].includes(mode))
    throw new RangeError('Unknown light mode');
  if (!Number.isFinite(radius) || radius <= 0)
    throw new RangeError('radius must be positive and finite');
  if (!Number.isFinite(intensity) || intensity < 0 || intensity > 1)
    throw new RangeError('intensity must be between 0 and 1');
  return { mode, radius, intensity };
}
