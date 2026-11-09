import { m } from '../../../paraglide/messages.js';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button } from '@bolerish/ui/button';
import { Edge } from '@bolerish/edge';

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
          {m.your_existing_after_stays_intact()}{' '}
        </Edge.Surface>
        <Edge.Surface
          as="article"
          className={`edge-example-before ${stylex.props(styles.surface, styles.existingBefore).className}`}
        >
          {' '}
          {m.the_default_keeps_your_before_intact()}
        </Edge.Surface>
        <Button
          xstyle={styles.switchButton}
          type="button"
          onClick={() => setPseudoElement(pseudoElement === 'before' ? 'after' : 'before')}
        >
          {m.switch_pseudo_element({ element: pseudoElement === 'before' ? 'after' : 'before' })}
        </Button>
        <Edge.Surface
          data-testid="decoration-slot"
          pseudoElement={pseudoElement}
          shadowColor="transparent"
          borderWidth={2}
          {...stylex.props(styles.surface, styles.asymmetric)}
        >
          {m.current_pseudo_element({ element: pseudoElement })}
        </Edge.Surface>
      </div>
    </Edge.Provider>
  );
}

export const decorationSlotExample = {
  get title() {
    return m.keep_existing_pseudo_elements();
  },
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
