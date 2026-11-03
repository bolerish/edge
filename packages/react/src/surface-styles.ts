import * as stylex from '@stylexjs/stylex';

export const surfaceStyles = stylex.create({
  border: {
    position: 'relative',
    '::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      boxSizing: 'border-box',
      borderRadius: 'inherit',
      pointerEvents: 'none',
      padding: 'var(--wisp-border-width, 1px)',
      backgroundImage: 'conic-gradient(from calc(var(--wisp-angle, 315deg) - 40deg), transparent 0deg, var(--wisp-highlight, #e5edc8) 40deg, transparent 80deg, #0008 220deg, transparent 360deg)',
      opacity: { default: 'var(--wisp-strength, 0.25)', '@media (forced-colors: active)': 0 },
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
    },
  },
});

export const wispStyles = stylex.create({
  raised: {
    backgroundColor: '#262d20',
    color: '#e5e9d8',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#3b4431',
    borderRadius: 10,
    boxShadow: '0 3px 8px #0003, inset 0 1px #ffffff08',
  },
  matte: {
    backgroundColor: '#20251c',
    color: '#d2d8c5',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#343c2c',
    borderRadius: 10,
    boxShadow: 'none',
  },
});
