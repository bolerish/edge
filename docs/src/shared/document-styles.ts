import { colorVars, typo } from '@bolerish/tokens/semantic.stylex';
import * as stylex from '@stylexjs/stylex';
import { siteColors } from './site.stylex';

export const documentStyles = stylex.create({
  html: { fontSize: '100%', scrollPaddingTop: 90, scrollbarGutter: 'stable' },
  body: {
    fontSize: typo.fontSizeMd,
    fontFamily: typo.fontFamilyBody,
    lineHeight: typo.lineHeightNormal,
    backgroundColor: siteColors.background,
    color: colorVars.fgPrimary,
  },
  link: {
    touchAction: 'manipulation',
    textUnderlineOffset: 3,
    outline: { default: null, ':focus-visible': `2px solid ${colorVars.fgPrimary}` },
    outlineOffset: { default: null, ':focus-visible': 4 },
  },
});
