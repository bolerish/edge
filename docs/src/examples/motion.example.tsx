import { useState } from 'react';
import { useLight, useSurface, type Motion } from '@bolerish/edge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@bolerish/ui/card';
import { Select, SelectItem, SelectList, SelectPopup, SelectTrigger, SelectValue } from '@bolerish/ui/select';
import '@bolerish/edge/style.css';
import './appearance-examples.css';

const motions = { system: 'System', dynamic: 'Dynamic', static: 'Static' };
const directions = { fixed: '315°', random: 'Random per mount' };
export function MotionExample() {
  const [motion, setMotion] = useState<Motion>('system');
  const [direction, setDirection] = useState<'fixed' | 'random'>('fixed');
  return (
    <div role="group" aria-label="Motion comparison">
      <div className="appearance-controls">
        <div className="appearance-control">
          <span id="example-motion-label">Motion</span>
          <Select value={motion} items={motions} onValueChange={value => {
            if (value === 'system' || value === 'dynamic' || value === 'static') setMotion(value);
          }}>
            <SelectTrigger aria-labelledby="example-motion-label"><SelectValue /></SelectTrigger>
            <SelectPopup><SelectList>
              {Object.entries(motions).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
            </SelectList></SelectPopup>
          </Select>
        </div>
        <div className="appearance-control">
          <span id="example-direction-label">Static direction</span>
          <Select value={direction} items={directions} disabled={motion !== 'static'}
            onValueChange={value => { if (value === 'fixed' || value === 'random') setDirection(value); }}>
            <SelectTrigger aria-labelledby="example-direction-label"><SelectValue /></SelectTrigger>
            <SelectPopup><SelectList>
              {Object.entries(directions).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
            </SelectList></SelectPopup>
          </Select>
        </div>
      </div>
      <MotionCard motion={motion} staticDirection={direction === 'random' ? 'random' : 315} />
    </div>
  );
}
// docs:start usage
function MotionCard({ motion, staticDirection }: { motion: Motion; staticDirection: number | 'random' }) {
  const light = useLight({ motion, staticDirection });
  const surface = useSurface<HTMLDivElement>(light);
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
// docs:end usage
