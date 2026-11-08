import {
  getLighting,
  getStaticLighting,
  type EdgeStyle,
  type Point,
  type Rectangle,
} from './geometry.js';
import type { LightOptions } from '../light/options.js';

const ANGLE_DECIMAL_PLACES = 1;
const STRENGTH_DECIMAL_PLACES = 3;
const insetProperties = [
  '--edge-inset-top',
  '--edge-inset-right',
  '--edge-inset-bottom',
  '--edge-inset-left',
] as const;
const outputProperties = ['--edge-angle', '--edge-strength', ...insetProperties] as const;
export interface SurfaceEntry {
  element: HTMLElement;
  edgeStyle: EdgeStyle;
  rect: Rectangle | null;
  insets: string[];
  output: readonly string[] | null;
  original: Array<{ name: string; value: string; priority: string }>;
}

export function createSurfaceEntry(element: HTMLElement, edgeStyle: EdgeStyle): SurfaceEntry {
  return {
    element,
    edgeStyle,
    rect: null,
    insets: ['0px', '0px', '0px', '0px'],
    output: null,
    original: outputProperties.map((name) => ({
      name,
      value: element.style.getPropertyValue(name),
      priority: element.style.getPropertyPriority(name),
    })),
  };
}

export function renderSurfaces(
  entries: Set<SurfaceEntry>,
  dirty: Set<SurfaceEntry>,
  options: Required<LightOptions>,
  pointer: Point | null,
  fixed: boolean,
) {
  for (const entry of dirty) {
    if (entries.has(entry)) {
      entry.rect = entry.element.getBoundingClientRect();
      const computed = entry.element.ownerDocument.defaultView!.getComputedStyle(entry.element);
      entry.insets = [
        computed.borderTopWidth,
        computed.borderRightWidth,
        computed.borderBottomWidth,
        computed.borderLeftWidth,
      ].map((width) => `${-(Number.parseFloat(width) || 0)}px`);
    }
  }
  dirty.clear();
  for (const entry of entries) {
    const rect = entry.rect;
    if (!rect) continue;
    const staticLighting = getStaticLighting(
      entry.edgeStyle,
      typeof options.staticDirection === 'number' ? options.staticDirection : undefined,
    );
    let angle = staticLighting.angle;
    let strength = 0;
    if (entry.element.isConnected && rect.width > 0 && rect.height > 0) {
      if (fixed) strength = staticLighting.strength;
      else if (pointer)
        ({ angle, strength } = getLighting(rect, pointer, options.radius, entry.edgeStyle));
    }
    const values = [
      `${angle.toFixed(ANGLE_DECIMAL_PLACES)}deg`,
      (strength * options.intensity).toFixed(STRENGTH_DECIMAL_PLACES),
      ...entry.insets,
    ];
    outputProperties.forEach((name, index) => {
      const value = values[index];
      if (value !== undefined && entry.output?.[index] !== value)
        entry.element.style.setProperty(name, value);
    });
    entry.output = values;
  }
}

export function restoreSurface(entry: SurfaceEntry) {
  for (const { name, value, priority } of entry.original) {
    if (value) entry.element.style.setProperty(name, value, priority);
    else entry.element.style.removeProperty(name);
  }
  entry.output = null;
}
