import { useState } from 'react';
import { Lighting, type Motion } from '@bolerish/edge';
import '@bolerish/edge/style.css';

export function MotionExample() {
  const [motion, setMotion] = useState<Motion>('system');
  const [direction, setDirection] = useState<'fixed' | 'random'>('fixed');
  return (
    <div role="group" aria-label="Motion comparison" style={{ display: 'grid', gap: 16 }}>
      <label>Motion{' '}
        <select value={motion} onChange={event => {
          const value = event.target.value;
          if (value === 'system' || value === 'dynamic' || value === 'static') setMotion(value);
        }}>
          <option value="system">System</option>
          <option value="dynamic">Dynamic</option>
          <option value="static">Static</option>
        </select>
      </label>
      <label>Static direction{' '}
        <select value={direction} onChange={event => setDirection(event.target.value === 'random' ? 'random' : 'fixed')}>
          <option value="fixed">315°</option>
          <option value="random">Random per mount</option>
        </select>
      </label>
      <Lighting motion={motion} staticDirection={direction === 'random' ? 'random' : 315}>
        <Lighting.Surface as="article" theme="wisp" style={{ padding: 32 }}>
          Move your pointer around this card.
        </Lighting.Surface>
      </Lighting>
    </div>
  );
}
