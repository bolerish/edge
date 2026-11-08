import { Card } from '@bolerish/ui/card';
import { Edge } from '@bolerish/edge';
import { usePreferences } from '../shared/preferences/usePreferences.js';

export function HeroExample() {
  const { edgeStyle } = usePreferences();
  return (
    <section className="hero-example" aria-label="Edge example">
      <div className="hero-example-stage" aria-hidden="true">
        {['back', 'middle', 'front'].map((layer) => (
          <Edge.Surface
            key={layer}
            edgeStyle={edgeStyle}
            color="var(--site-foreground)"
            shadowColor="transparent"
            intensity={1}
            className={`hero-example-surface hero-example-${layer}`}
            data-testid={layer === 'front' ? 'hero-surface' : undefined}
          >
            <Card className="hero-example-panel">
            <Edge.Surface
              edgeStyle={edgeStyle}
              color="var(--site-foreground)"
            shadowColor="transparent"
              intensity={1}
              className="hero-example-orbit"
            />
            <span className="hero-example-line" />
            <span className="hero-example-line hero-example-line-short" />
            </Card>
          </Edge.Surface>
        ))}
      </div>

    </section>
  );
}
