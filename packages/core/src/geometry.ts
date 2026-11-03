export interface Rectangle { left: number; top: number; width: number; height: number }
export interface Point { x: number; y: number }
export type Material = 'raised' | 'recessed' | 'matte';

export function getLighting(rect: Rectangle, point: Point, radius: number, material: Material) {
  const dx = point.x - rect.left - rect.width / 2;
  const dy = point.y - rect.top - rect.height / 2;
  const centerDistance = Math.hypot(dx, dy);
  const edgeDistance = Math.hypot(
    Math.max(0, Math.abs(dx) - rect.width / 2),
    Math.max(0, Math.abs(dy) - rect.height / 2),
  );
  const direction = centerDistance === 0 ? 315 : (Math.atan2(dy, dx) * 180 / Math.PI + 450) % 360;
  return {
    angle: (direction + (material === 'recessed' ? 180 : 0)) % 360,
    strength: Math.max(0, 1 - edgeDistance / radius) ** 2
      * Math.min(1, centerDistance / 12)
      * (material === 'matte' ? 0.3 : 1),
  };
}
