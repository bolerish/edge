import { useState } from 'react';
import { useLight, useSurface, type EdgeStyle } from '@bolerish/edge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@bolerish/ui/card';
import { Select, SelectItem, SelectList, SelectPopup, SelectTrigger, SelectValue } from '@bolerish/ui/select';
import '@bolerish/edge/style.css';
import './appearance-examples.css';

// docs:start styles
const edgeStyles = [
  { value: 'raised', label: 'Raised' },
  { value: 'recessed', label: 'Recessed' },
  { value: 'matte', label: 'Matte' },
] as const;
// docs:end styles

export function EdgeStylesExample() {
  const [edgeStyle, setEdgeStyle] = useState<EdgeStyle>('raised');
  return (
    <div role="group" aria-label="Style comparison">
      <div className="appearance-controls">
        <div className="appearance-control">
          <span id="example-style-label">Style</span>
          <Select value={edgeStyle} items={Object.fromEntries(edgeStyles.map(style => [style.value, style.label]))}
            onValueChange={value => { if (value === 'raised' || value === 'recessed' || value === 'matte') setEdgeStyle(value); }}>
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
// docs:start usage
function StyleCard({ edgeStyle }: { edgeStyle: EdgeStyle }) {
  const light = useLight();
  const surface = useSurface<HTMLDivElement>(light, { edgeStyle });
  return (
    <Card role="article" ref={surface.ref} className={surface.className} style={surface.style}>
      <CardHeader>
        <CardTitle>{edgeStyles.find(style => style.value === edgeStyle)?.label}</CardTitle>
        <CardDescription>A border that responds to your pointer.</CardDescription>
      </CardHeader>
      <CardContent>Your component keeps its own colors and layout.</CardContent>
    </Card>
  );
}
// docs:end usage
