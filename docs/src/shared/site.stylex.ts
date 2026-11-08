import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@bolerish/tokens/semantic.stylex';

// Preserve the site's white/light and canvas/dark document background.
// Component appearances use the design system's semantic tokens directly.
export const siteColors = stylex.defineVars({
  background: {
    default: `light-dark(white, ${colorVars.bgCanvas})`,
    '@media (forced-colors: active)': 'Canvas',
  },
});
