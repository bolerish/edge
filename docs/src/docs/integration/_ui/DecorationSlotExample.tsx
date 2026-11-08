import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button } from '@bolerish/ui/button';
import { Edge } from '@bolerish/edge';
import '@bolerish/edge/style.css';

export function DecorationSlotExample() {
  const [pseudoElement, setPseudoElement] = useState<'before' | 'after'>('before');
  return (
    <Edge.Provider motion="dynamic">
      <div
        className={`decoration-slot-example ${stylex.props(styles.decorationSlotExample).className}`}
      >
        <Edge.Surface
          as="article"
          pseudoElement="before"
          className={`edge-example-after ${stylex.props(styles.surface, styles.existingAfter).className}`}
        >
          Your existing ::after stays intact.{' '}
        </Edge.Surface>
        <Edge.Surface
          as="article"
          className={`edge-example-before ${stylex.props(styles.surface, styles.existingBefore).className}`}
        >
          {' '}
          The default keeps your ::before intact.
        </Edge.Surface>
        <Button
          xstyle={styles.switchButton}
          type="button"
          onClick={() => setPseudoElement(pseudoElement === 'before' ? 'after' : 'before')}
        >
          Use {pseudoElement === 'before' ? 'after' : 'before'} decoration
        </Button>
        <Edge.Surface
          data-testid="decoration-slot"
          pseudoElement={pseudoElement}
          shadowColor="transparent"
          borderWidth={2}
          {...stylex.props(styles.surface, styles.asymmetric)}
        >
          Decoration uses ::{pseudoElement}
        </Edge.Surface>
      </div>
    </Edge.Provider>
  );
}

export const decorationSlotExample = {
  title: 'Keep existing pseudo-elements',
  Component: DecorationSlotExample,
  code: `import { Edge } from '@bolerish/edge';

<Edge.Provider>
  <Edge.Surface as="article" pseudoElement="before" className="existing-after">
    Your existing ::after stays intact.
  </Edge.Surface>
</Edge.Provider>`,
};

const styles = stylex.create({
  surface: {
    padding: 24,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'currentColor',
    borderRadius: 16,
  },
  asymmetric: {
    borderWidth: '2px 3px 4px 5px',
  },
  existingAfter: {
    '::after': {
      content: '"Saved"',
      color: 'currentColor',
    },
  },
  existingBefore: {
    '::before': {
      content: '"Ready"',
      color: 'currentColor',
    },
  },
  decorationSlotExample: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(2, minmax(0, 1fr))',
      '@media (max-width: 600px)': 'minmax(0, 1fr)',
    },
    alignItems: 'start',
    gap: '16px',
  },
  switchButton: {
    justifySelf: 'start',
    alignSelf: 'center',
  },
});
