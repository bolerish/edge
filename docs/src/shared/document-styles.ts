import { colorVars } from '@bolerish/tokens/semantic.stylex';
import * as stylex from '@stylexjs/stylex';
import { siteColors } from './site.stylex';

export const documentStyles = stylex.create({
  html: { scrollPaddingTop: 90, scrollbarGutter: 'stable' },
  body: { backgroundColor: siteColors.background, color: colorVars.fgPrimary },
  link: {
    touchAction: 'manipulation',
    textUnderlineOffset: 3,
    outline: { default: null, ':focus-visible': `2px solid ${colorVars.fgPrimary}` },
    outlineOffset: { default: null, ':focus-visible': 4 },
  },
});
