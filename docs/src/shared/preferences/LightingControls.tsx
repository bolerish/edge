import { m } from '../../paraglide/messages.js';
import * as stylex from '@stylexjs/stylex';
import { Button } from '@bolerish/ui/button';
import { Slider } from '@bolerish/ui/slider';
import { usePreferences, updatePreferences } from './usePreferences.js';

export function LightingControls() {
  const { direction, radius, motion } = usePreferences();
  return (
    <fieldset {...stylex.props(styles.controls)} disabled={motion === 'static'}>
      <legend>{m.pointer_lighting()}</legend>
      <div role="group" aria-label={m.highlight_direction()} {...stylex.props(styles.directions)}>
        <Button
          variant="outline"
          aria-pressed={direction === 'gather'}
          onClick={() => updatePreferences({ direction: 'gather' })}
        >
          {m.gather()}
        </Button>
        <Button
          variant="outline"
          aria-pressed={direction === 'spread'}
          onClick={() => updatePreferences({ direction: 'spread' })}
        >
          {m.spread()}
        </Button>
      </div>
      <div {...stylex.props(styles.range)}>
        <span>{m.range_value({ radius })}</span>
        <Slider
          aria-label={m.light_range()}
          min={40}
          max={1200}
          step={20}
          value={radius}
          disabled={motion === 'static'}
          onValueChange={(value) => {
            const next = typeof value === 'number' ? value : value[0];
            if (next !== undefined) updatePreferences({ radius: next });
          }}
        />
      </div>
      <small>{m.pointer_settings_hint()}</small>
    </fieldset>
  );
}

const styles = stylex.create({
  controls: {
    borderWidth: 0,
    padding: 0,
    margin: '0 0 24px',
    minWidth: 0,
    display: 'grid',
    gap: 12,
  },
  directions: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  range: { display: 'grid', gap: 12, maxWidth: 360 },
});
