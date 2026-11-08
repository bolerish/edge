import { use } from 'react';
import { useSurface } from '@bolerish/edge';
import { Card, CardContent, CardHeader, CardTitle } from '@bolerish/ui/card';
import { DocumentLightContext } from '../../../_shared/document-light-context.js';
import { usePreferences } from '../../../../shared/preferences/usePreferences.js';
import '../../../_shared/example-layout.css';

export function SharedLightExample() {
  const light = use(DocumentLightContext);
  if (!light) throw new Error('Usage example requires document lighting');
  const { edgeStyle } = usePreferences();
  const firstCard = useSurface<HTMLDivElement>(light, { edgeStyle });
  const secondCard = useSurface<HTMLDivElement>(light, { edgeStyle });
  return (
    <div role="group" aria-label="Shared light example" className="shared-light-example">
      <Card ref={firstCard} role="article">
        <CardHeader><CardTitle>Example card</CardTitle></CardHeader>
        <CardContent>Both cards respond to the same light.</CardContent>
      </Card>
      <Card ref={secondCard} role="article">
        <CardHeader><CardTitle>Another example card</CardTitle></CardHeader>
        <CardContent>Both cards respond to the same light.</CardContent>
      </Card>
    </div>
  );
}

export const sharedLightExample = {
  title: 'One light, your components',
  Component: SharedLightExample,
  code: `<Edge.Provider>
  <Edge.Surface>Example card</Edge.Surface>
  <Edge.Surface>Another example card</Edge.Surface>
</Edge.Provider>`,
};
