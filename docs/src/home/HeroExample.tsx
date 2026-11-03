import { useState } from 'react';
import { Button } from '@bolerish/ui/button';
import { Lighting } from '@bolerish/edge';
import { usePreferences } from '../settings/usePreferences.js';

export function HeroExample() {
  const [enabled, setEnabled] = useState(true);
  const { material } = usePreferences();
  return (
    <section className="hero-example" aria-label="Lighting example">
      <div className="hero-example-stage" aria-hidden="true">
        {['back', 'middle', 'front'].map((layer) => (
          <Lighting.Surface
            key={layer}
            material={material}
            color="var(--site-foreground)"
            intensity={enabled ? 1 : 0}
            className={`hero-example-surface hero-example-${layer}`}
            data-testid={layer === 'front' ? 'hero-surface' : undefined}
          >
            <Lighting.Surface
              material={material}
              color="var(--site-foreground)"
              intensity={enabled ? 1 : 0}
              className="hero-example-orbit"
            />
            <span className="hero-example-line" />
            <span className="hero-example-line hero-example-line-short" />
          </Lighting.Surface>
        ))}
      </div>
      <div className="hero-example-toolbar">
        <Button
          size="sm"
          variant="ghost"
          aria-pressed={enabled}
          onClick={() => setEnabled((value) => !value)}
        >
          Lighting {enabled ? 'on' : 'off'}
        </Button>
      </div>
    </section>
  );
}
