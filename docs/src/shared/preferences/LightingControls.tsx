import * as stylex from '@stylexjs/stylex';
import { Button } from '@bolerish/ui/button';
import { Slider } from '@bolerish/ui/slider';
import { usePreferences, updatePreferences } from './usePreferences.js';

export function LightingControls() {
  const { direction, radius, motion } = usePreferences();
  return (
    <fieldset {...stylex.props(styles.controls)} disabled={motion === 'static'}>
      <legend>Pointer lighting</legend>
      <div role="group" aria-label="Highlight direction" {...stylex.props(styles.directions)}>
        <Button
          variant="outline"
          aria-pressed={direction === 'gather'}
          onClick={() => updatePreferences({ direction: 'gather' })}
        >
          Gather
        </Button>
        <Button
          variant="outline"
          aria-pressed={direction === 'spread'}
          onClick={() => updatePreferences({ direction: 'spread' })}
        >
          Spread
        </Button>
      </div>
      <div {...stylex.props(styles.range)}>
        <span>Range: {radius} px</span>
        <Slider
          aria-label="Light range"
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
      <small>
        Gather faces the pointer; Spread faces away. Range is the fade distance outside each
        surface. Fixed lighting ignores these settings.
      </small>
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
