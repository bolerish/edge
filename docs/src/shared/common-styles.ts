import { colorVars } from '@bolerish/tokens/semantic.stylex';
import * as stylex from '@stylexjs/stylex';
export const commonStyles = stylex.create({
  visuallyHidden: {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  },
  tableScroll: {
    overflow: 'auto',
    outline: { default: null, ':focus-visible': `2px solid ${colorVars.fgPrimary}` },
    outlineOffset: { default: null, ':focus-visible': -2 },
  },
});
