import { m } from '../../paraglide/messages.js';
import * as stylex from '@stylexjs/stylex';
import { FieldSet, Field, FieldLabel } from '@bolerish/ui/field';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectList,
  SelectItem,
} from '@bolerish/ui/select';
import { Slider } from '@bolerish/ui/slider';
import { usePreferences, updatePreferences } from './usePreferences.js';

export function LightingControls({ alwaysEnabled = false }: { alwaysEnabled?: boolean }) {
  const { direction, radius, motion } = usePreferences();
  const disabled = !alwaysEnabled && motion === 'static';
  return (
    <FieldSet xstyle={styles.controls} disabled={disabled} aria-label={m.pointer_lighting()}>
      <Field>
        <FieldLabel id="lighting-direction-label">direction</FieldLabel>
        <Select
          value={direction}
          items={{ gather: 'gather', spread: 'spread' }}
          disabled={disabled}
          onValueChange={(value) => {
            if (value === 'gather' || value === 'spread') updatePreferences({ direction: value });
          }}
        >
          <SelectTrigger xstyle={styles.select} aria-labelledby="lighting-direction-label">
            <SelectValue />
          </SelectTrigger>
          <SelectPopup>
            <SelectList>
              <SelectItem value="gather">gather</SelectItem>
              <SelectItem value="spread">spread</SelectItem>
            </SelectList>
          </SelectPopup>
        </Select>
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
      </Field>
    </FieldSet>
  );
}
const styles = stylex.create({
  controls: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(2, minmax(0, 240px))',
      '@media (max-width: 600px)': 'minmax(0, 1fr)',
    },
    alignItems: 'start',
    gap: 24,
    marginBlockEnd: 24,
    minWidth: 0,
  },
  select: { width: 240, maxWidth: '100%' },
  range: { width: 240, maxWidth: '100%' },
});
