import { m } from '../../paraglide/messages.js';
import * as stylex from '@stylexjs/stylex';
import { FieldSet, FieldLegend, Field, FieldLabel, FieldDescription } from '@bolerish/ui/field';
import { ToggleGroup, ToggleGroupItem } from '@bolerish/ui/toggle-group';
import { Slider } from '@bolerish/ui/slider';
import { usePreferences, updatePreferences } from './usePreferences.js';

export function LightingControls() {
  const { direction, radius, motion } = usePreferences();
  const disabled = motion === 'static';
  return (
    <FieldSet xstyle={styles.controls} disabled={disabled}>
      <FieldLegend>{m.pointer_lighting()}</FieldLegend>
      <Field>
        <FieldLabel id="lighting-direction-label">direction</FieldLabel>
        <ToggleGroup
          aria-labelledby="lighting-direction-label"
          value={[direction]}
          disabled={disabled}
          onValueChange={(values) => {
            const next = values[0];
            if (next === 'gather' || next === 'spread') updatePreferences({ direction: next });
          }}
        >
          <ToggleGroupItem value="gather">gather</ToggleGroupItem>
          <ToggleGroupItem value="spread">spread</ToggleGroupItem>
        </ToggleGroup>
      </Field>
      <Field xstyle={styles.range}>
        <FieldLabel id="lighting-radius-label">
          radius: <output>{radius} px</output>
        </FieldLabel>
        <Slider
          aria-label="radius"
          min={40}
          max={1200}
          step={20}
          value={radius}
          disabled={disabled}
          onValueChange={(value) => {
            const next = typeof value === 'number' ? value : value[0];
            if (next !== undefined) updatePreferences({ radius: next });
          }}
        />
        <FieldDescription>{m.pointer_settings_hint()}</FieldDescription>
      </Field>
    </FieldSet>
  );
}
const styles = stylex.create({
  controls: { marginBlockEnd: 24, minWidth: 0 },
  range: { maxWidth: 360 },
});
