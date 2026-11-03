import { DecorationSlotExample } from './decoration-slot.example.js';
import decorationSlotSource from './decoration-slot.example.tsx?raw';
import { FirstSurfaceExample } from './first-surface.example.js';
import firstSurfaceSource from './first-surface.example.tsx?raw';
import { SharedLightExample } from './shared-light.example.js';
import sharedLightSource from './shared-light.example.tsx?raw';
import { EdgeStylesExample } from './edge-styles.example.js';
import edgeStylesSource from './edge-styles.example.tsx?raw';

export const firstSurfaceExample = {
  title: 'Your first surface',
  Component: FirstSurfaceExample,
  code: firstSurfaceSource,
};
export const sharedLightExample = {
  title: 'One light, your components',
  Component: SharedLightExample,
  code: sharedLightSource,
};
export const edgeStylesExample = {
  title: 'Compare edge styles',
  Component: EdgeStylesExample,
  code: edgeStylesSource,
};

export const decorationSlotExample = {
  title: 'Keep existing pseudo-elements',
  Component: DecorationSlotExample,
  code: decorationSlotSource,
};
