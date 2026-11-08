import { colorVars } from '@bolerish/tokens/semantic.stylex';
import * as stylex from '@stylexjs/stylex';

export const contentStyles = stylex.create({
  paragraph: {
    marginBlockStart: {
      default: 0,
      [stylex.when.siblingBefore(':is(p)')]: 12,
      [stylex.when.siblingBefore(':is(pre, [data-code-block])')]: 16,
    },
  },
  inlineCode: {
    fontSize: '0.88em',
    fontFamily: 'ui-monospace, monospace',
    backgroundColor: `${colorVars.bgSubtle}`,
    padding: '1px 4px',
    borderRadius: '3px',
  },
  apiTable: { fontSize: '13px', marginBlock: 20 },
  tableCell: { padding: '12px 10px', verticalAlign: 'top', whiteSpace: 'normal', height: 'auto' },
  tableData: { color: colorVars.fgSecondary },
  tableCaption: { textAlign: 'left' },
  tableScroll: {
    overflow: 'auto',
    outline: {
      default: null,
      ':focus-visible': `2px solid ${colorVars.fgPrimary}`,
    },
    outlineOffset: {
      default: null,
      ':focus-visible': '-2px',
    },
  },
  visuallyHidden: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  },
  docNote: {
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    borderLeftColor: colorVars.strokeDefault,
    padding: '12px 20px',
    margin: '20px 0',
    backgroundColor: `${colorVars.bgSubtle}`,
  },
  noteTitle: {
    display: 'block',
    marginBottom: '8px',
  },
  noteParagraph: {
    margin: '0',
  },
});
