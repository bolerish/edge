import { useState } from 'react';
import { Heading } from '@bolerish/ui/heading';
import { Button } from '@bolerish/ui/button';
import {
  Card,
  CardHeader,
  CardDescription,
  CardFooter,
} from '@bolerish/ui/card';
import { Lighting } from '@bolerish/edge';
import { usePreferences } from '../settings/usePreferences.js';
export function HeroExample() {
  const [enabled, setEnabled] = useState(true);
  const [saved, setSaved] = useState(false);
  const { material } = usePreferences();
  return (
    <section className="hero-example" aria-label="Lighting example">
      <div className="hero-example-toolbar">
        <span>One light. Your components.</span>
        <Button
          size="sm"
          variant="outline"
          aria-pressed={enabled}
          onClick={() => setEnabled((value) => !value)}
        >
          Lighting {enabled ? 'on' : 'off'}
        </Button>
      </div>
      <div className="hero-example-stage">
        <Lighting.Surface
          material={material}
          intensity={enabled ? 1 : 0}
          className="hero-example-surface"
          data-testid="hero-surface"
        >
          <Card>
            <CardHeader>
              <Heading level={2} size="subsection">A little more definition.</Heading>
              <CardDescription>
                Move your pointer around the edges. Your colors and content stay
                yours.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Lighting.Surface
                as="span"
                material={material}
                intensity={enabled ? 1 : 0}
                className="hero-example-button"
              >
                <Button
                  variant="outline"
                  aria-pressed={saved}
                  onClick={() => setSaved((value) => !value)}
                >
                  {saved ? 'Saved' : 'Save for later'}
                </Button>
              </Lighting.Surface>
            </CardFooter>
          </Card>
        </Lighting.Surface>
      </div>
      <p className="hero-example-caption">
        Switch lighting off to compare the same surface.
      </p>
    </section>
  );
}
