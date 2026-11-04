import { use } from 'react';
import { DocumentLightContext } from '../ui/document-light-context.js';
import { usePreferences, updatePreferences } from '../settings/usePreferences.js';
import { useSurface } from '@bolerish/edge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@bolerish/ui/card';
import { Select, SelectItem, SelectList, SelectPopup, SelectTrigger, SelectValue } from '@bolerish/ui/select';
import '@bolerish/edge/style.css';
import './appearance-examples.css';

const motions = { system: 'System', dynamic: 'Dynamic', static: 'Static' };
const directions = { fixed: '315°', random: 'Random per mount' };
export function MotionExample() {
  const { motion, staticDirection: direction } = usePreferences();
  return (
    <div role="group" aria-label="Motion comparison">
      <div className="appearance-controls">
        <div className="appearance-control">
          <span id="example-motion-label">Motion</span>
          <Select value={motion} items={motions} onValueChange={value => {
            if (value === 'system' || value === 'dynamic' || value === 'static') updatePreferences({ motion: value });
          }}>
            <SelectTrigger aria-labelledby="example-motion-label"><SelectValue /></SelectTrigger>
            <SelectPopup><SelectList>
              {Object.entries(motions).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
            </SelectList></SelectPopup>
          </Select>
        </div>
        {motion === 'static' ? <div className="appearance-control">
          <span id="example-direction-label">Static direction</span>
          <Select value={direction} items={directions}
            onValueChange={value => { if (value === 'fixed' || value === 'random') updatePreferences({ staticDirection: value }); }}>
            <SelectTrigger aria-labelledby="example-direction-label"><SelectValue /></SelectTrigger>
            <SelectPopup><SelectList>
              {Object.entries(directions).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
            </SelectList></SelectPopup>
          </Select>
        </div> : null}
      </div>
      <MotionCard />
    </div>
  );
}
function MotionCard() {
  const light = use(DocumentLightContext);
  if (!light) throw new Error('Appearance examples require document lighting');
  const { edgeStyle } = usePreferences();
  const surface = useSurface<HTMLDivElement>(light, { edgeStyle });
  return (
    <Card role="article" ref={surface.ref} className={surface.className} style={surface.style}>
      <CardHeader>
        <CardTitle>Follow your pointer</CardTitle>
        <CardDescription>Choose how this card responds to movement.</CardDescription>
      </CardHeader>
      <CardContent>System respects your motion preferences. Static keeps the direction fixed.</CardContent>
    </Card>
  );
}
