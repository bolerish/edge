import { useState } from 'react';
import { Lighting } from '@bolerish/edge';
import '@bolerish/edge/style.css';

export function DecorationSlotExample() {
  const [pseudoElement, setPseudoElement] = useState<'before' | 'after'>('before');
  return (
    <Lighting motion="dynamic">
      <style>{`
        .edge-example-after::after { content: "Saved"; color: green; }
        .edge-example-before::before { content: "Ready"; color: green; }
      `}</style>
      <Lighting.Surface as="article" pseudoElement="before" className="edge-example-after"
        style={{ padding: 24, border: '1px solid currentColor', borderRadius: 16 }}>
        Your existing ::after stays intact.{' '}
      </Lighting.Surface>
      <Lighting.Surface as="article" className="edge-example-before"
        style={{ padding: 24, border: '1px solid currentColor', borderRadius: 16 }}>
        {' '}The default keeps your ::before intact.
      </Lighting.Surface>
      <button type="button" onClick={() => setPseudoElement(pseudoElement === 'before' ? 'after' : 'before')}>
        Use {pseudoElement === 'before' ? 'after' : 'before'} decoration
      </button>
      <Lighting.Surface data-testid="decoration-slot" pseudoElement={pseudoElement}
        shadowColor="transparent" borderWidth={2}
        style={{ padding: 24, borderStyle: 'solid', borderWidth: '2px 3px 4px 5px', borderRadius: 16 }}>
        Decoration uses ::{pseudoElement}
      </Lighting.Surface>
    </Lighting>
  );
}
