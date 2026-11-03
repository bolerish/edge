export interface Rectangle {
  left: number;
  top: number;
  width: number;
  height: number;
}
export interface Point {
  x: number;
  y: number;
}
export type Material = 'raised' | 'recessed' | 'matte';

// CSS conic gradients start at the top; atan2 starts at the right.
const FULL_TURN_DEGREES = 360;
const HALF_TURN_DEGREES = FULL_TURN_DEGREES / 2;
const CSS_ANGLE_OFFSET_DEGREES = FULL_TURN_DEGREES + 90;
const DEFAULT_DIRECTION_DEGREES = 315;
const CENTER_FADE_RADIUS_PX = 12;
const DISTANCE_FALLOFF_EXPONENT = 2;
const MATTE_STRENGTH_MULTIPLIER = 0.3;
const STATIC_LIGHT_STRENGTH = 0.7;

export function getStaticLighting(material: Material) {
  return {
    angle:
      (DEFAULT_DIRECTION_DEGREES +
        (material === 'recessed' ? HALF_TURN_DEGREES : 0)) % FULL_TURN_DEGREES,
    strength:
      STATIC_LIGHT_STRENGTH *
      (material === 'matte' ? MATTE_STRENGTH_MULTIPLIER : 1),
  };
}

export function getLighting(
  rect: Rectangle,
  point: Point,
  radius: number,
  material: Material,
) {
  const dx = point.x - rect.left - rect.width / 2;
  const dy = point.y - rect.top - rect.height / 2;
  const centerDistance = Math.hypot(dx, dy);
  const edgeDistance = Math.hypot(
    Math.max(0, Math.abs(dx) - rect.width / 2),
    Math.max(0, Math.abs(dy) - rect.height / 2),
  );
  const direction =
    centerDistance === 0
      ? DEFAULT_DIRECTION_DEGREES
      : ((Math.atan2(dy, dx) * HALF_TURN_DEGREES) / Math.PI +
          CSS_ANGLE_OFFSET_DEGREES) % FULL_TURN_DEGREES;
  return {
    angle:
      (direction + (material === 'recessed' ? HALF_TURN_DEGREES : 0)) %
      FULL_TURN_DEGREES,
    strength:
      Math.max(0, 1 - edgeDistance / radius) ** DISTANCE_FALLOFF_EXPONENT *
      Math.min(1, centerDistance / CENTER_FADE_RADIUS_PX) *
      (material === 'matte' ? MATTE_STRENGTH_MULTIPLIER : 1),
  };
}
