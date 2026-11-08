import { m } from '../../../../paraglide/messages.js';
import * as stylex from '@stylexjs/stylex';
import { use } from 'react';
import { useSurface } from '@bolerish/edge';
import { Card, CardContent, CardHeader, CardTitle } from '@bolerish/ui/card';
import { SurfaceLightContext } from '../../../../shared/lighting/light-context.js';
import { usePreferences } from '../../../../shared/preferences/usePreferences.js';

export function SharedLightExample() {
  const light = use(SurfaceLightContext);
  if (!light) throw new Error('Usage example requires document lighting');
  const { edgeStyle } = usePreferences();
  const firstCard = useSurface<HTMLDivElement>(light, { edgeStyle });
  const secondCard = useSurface<HTMLDivElement>(light, { edgeStyle });
  return (
    <div
      role="group"
      aria-label={m.shared_light_example()}
      className={`shared-light-example ${stylex.props(styles.sharedLightExample).className}`}
    >
      <Card xstyle={styles.exampleCard} ref={firstCard} role="article">
        <CardHeader>
          <CardTitle>{m.example_card()}</CardTitle>
        </CardHeader>
        <CardContent>{m.both_cards_respond_to_the_same_light()}</CardContent>
      </Card>
      <Card xstyle={styles.exampleCard} ref={secondCard} role="article">
        <CardHeader>
          <CardTitle>{m.another_example_card()}</CardTitle>
        </CardHeader>
        <CardContent>{m.both_cards_respond_to_the_same_light()}</CardContent>
      </Card>
    </div>
  );
}

export const sharedLightExample = {
  get title() {
    return m.one_light_your_components();
  },
  Component: SharedLightExample,
  code: `<Edge.Provider>
  <Edge.Surface>Example card</Edge.Surface>
  <Edge.Surface>Another example card</Edge.Surface>
</Edge.Provider>`,
};

const styles = stylex.create({
  sharedLightExample: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(2, minmax(0, 1fr))',
      '@media (max-width: 600px)': 'minmax(0, 1fr)',
    },
    alignItems: 'start',
    gap: '16px',
  },
  exampleCard: {
    height: '100%',
  },
});
