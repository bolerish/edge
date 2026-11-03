import { useState } from 'react';
import { Lighting, type Motion } from '@bolerish/edge';
import '@bolerish/edge/style.css';

export function EdgeStylesExample() {
  const [motion, setMotion] = useState<Motion>('system');
  return (
    <div role="group" aria-label="Style comparison" style={{ display: 'grid', gap: 16 }}>
      <label>
        Motion{' '}
        <select value={motion} onChange={(event) => {
          const next = event.target.value;
          if (next === 'system' || next === 'dynamic' || next === 'static') setMotion(next);
        }}>
          <option value="system">System</option>
          <option value="dynamic">Dynamic</option>
          <option value="static">Static</option>
        </select>
      </label>
      <Lighting motion={motion}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: 16 }}>
          {([
            { edgeStyle: 'raised', label: 'Raised' },
            { edgeStyle: 'recessed', label: 'Recessed' },
            { edgeStyle: 'matte', label: 'Matte' },
          ] as const).map(({ edgeStyle, label }) => (
            <Lighting.Surface
              key={edgeStyle}
              as="article"
              edgeStyle={edgeStyle}
              color="#e5edc8"
              style={{ padding: '32px 16px', borderRadius: 10, background: '#262d20', color: '#e5e9d8', border: '1px solid #66735a', textAlign: 'center' }}
            >
              {label}
            </Lighting.Surface>
          ))}
        </div>
      </Lighting>
    </div>
  );
}
