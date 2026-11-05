import { use, useState } from 'react';
import { useSurface } from '@bolerish/edge';
import { Card, CardContent, CardHeader, CardTitle } from '@bolerish/ui/card';
import { Button } from '@bolerish/ui/button';
import { Input } from '@bolerish/ui/input';
import { Label } from '@bolerish/ui/label';
import { DocumentLightContext } from '../ui/document-light-context.js';
import { usePreferences } from '../settings/usePreferences.js';
import './usage-examples.css';

export function SharedLightExample() {
  const light = use(DocumentLightContext);
  if (!light) throw new Error('Usage example requires document lighting');
  const { edgeStyle } = usePreferences();
  const card = useSurface<HTMLDivElement>(light, { edgeStyle });
  const button = useSurface<HTMLButtonElement>(light, { edgeStyle });
  const field = useSurface<HTMLDivElement>(light, { edgeStyle: 'recessed' });
  const [saved, setSaved] = useState(0);
  return (
    <div role="group" aria-label="Shared light controls" className="shared-light-example">
      <Card ref={card.ref} className={card.className} style={card.style} role="article">
        <CardHeader><CardTitle>Project overview</CardTitle></CardHeader>
        <CardContent>One light connects this card, the button and the input wrapper.</CardContent>
      </Card>
      <div className="shared-light-example-controls">
        <div ref={field.ref} className={`${field.className} shared-light-example-field`} style={field.style}>
          <Label htmlFor="usage-project-name">Project name</Label>
          <Input id="usage-project-name" name="project-name" defaultValue="Website refresh" />
        </div>
        <Button ref={button.ref} className={button.className} style={button.style}
          onClick={() => setSaved(count => count + 1)}>Save project ({saved})</Button>
      </div>
      <p>This ordinary element has no lighting decoration.</p>
    </div>
  );
}
