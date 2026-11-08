import { use } from 'react';
import { DocumentLightContext } from '../../_shared/document-light-context.js';
import { usePreferences, updatePreferences } from '../../../shared/preferences/usePreferences.js';
import { useSurface, type EdgeStyle } from '@bolerish/edge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@bolerish/ui/card';
import { Select, SelectItem, SelectList, SelectPopup, SelectTrigger, SelectValue } from '@bolerish/ui/select';
import '@bolerish/edge/style.css';
import '../../_shared/example-controls.css';

const edgeStyles = [
  { value: 'raised', label: 'Raised' },
  { value: 'recessed', label: 'Recessed' },
  { value: 'matte', label: 'Matte' },
] as const;

export function EdgeStylesExample() {
  const { edgeStyle } = usePreferences();
  return (
    <div role="group" aria-label="Style comparison">
      <div className="appearance-controls">
        <div className="appearance-control">
          <span id="example-style-label">Style</span>
          <Select value={edgeStyle} items={Object.fromEntries(edgeStyles.map(style => [style.value, style.label]))}
            onValueChange={value => { if (value === 'raised' || value === 'recessed' || value === 'matte') updatePreferences({ edgeStyle: value }); }}>
            <SelectTrigger aria-labelledby="example-style-label"><SelectValue /></SelectTrigger>
            <SelectPopup><SelectList>
              {edgeStyles.map(style => <SelectItem key={style.value} value={style.value}>{style.label}</SelectItem>)}
            </SelectList></SelectPopup>
          </Select>
        </div>
      </div>
      <StyleCard edgeStyle={edgeStyle} />
    </div>
  );
}
function StyleCard({ edgeStyle }: { edgeStyle: EdgeStyle }) {
  const light = use(DocumentLightContext);
  if (!light) throw new Error('Appearance examples require document lighting');
  const surface = useSurface<HTMLDivElement>(light, { edgeStyle });
  return (
    <Card role="article" ref={surface}>
      <CardHeader>
        <CardTitle>{edgeStyles.find(style => style.value === edgeStyle)?.label}</CardTitle>
        <CardDescription>A border that responds to your pointer.</CardDescription>
      </CardHeader>
      <CardContent>Your component keeps its own colors and layout.</CardContent>
    </Card>
  );
}

export const edgeStylesExample = {
  title: 'Compare edge styles',
  Component: EdgeStylesExample,
  code: `const light = useLight();
const surface = useSurface(light, { edgeStyle: __EDGE_STYLE__ });

<Card ref={surface}>
  Your component
</Card>`,
};
