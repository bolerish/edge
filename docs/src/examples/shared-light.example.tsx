import { useState } from 'react';
import { Lighting, type Motion } from '@bolerish/edge';
import '@bolerish/edge/style.css';

export function SharedLightExample() {
  const [motion, setMotion] = useState<Motion>('system');
  const [saved, setSaved] = useState(0);
  return (
    <div role="group" aria-label="Shared light controls" style={{ display: 'grid', gap: 16 }}>
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
        <Lighting.Surface as="article" theme="wisp" style={{ padding: 24 }}>
          <strong>Project overview</strong>
          <p>One light connects this card, the button and the input wrapper.</p>
        </Lighting.Surface>
        <Lighting.Surface
          as="button"
          type="button"
          theme="wisp"
          onClick={() => setSaved((count) => count + 1)}
          style={{ padding: '12px 20px', justifySelf: 'start', font: 'inherit', cursor: 'pointer' }}
        >
          Save project ({saved})
        </Lighting.Surface>
        <Lighting.Surface
          as="label"
          edgeStyle="recessed"
          style={{ display: 'grid', gap: 8, padding: 16, borderRadius: 10, background: '#20251c', color: '#e5e9d8' }}
        >
          Project name
          <input
            name="project-name"
            defaultValue="Website refresh"
            style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', padding: 8, font: 'inherit', background: '#20251c', color: '#e5e9d8', border: '1px solid #a4ad9a', borderRadius: 4 }}
          />
        </Lighting.Surface>
        <p>This ordinary element has no lighting decoration.</p>
      </Lighting>
    </div>
  );
}
