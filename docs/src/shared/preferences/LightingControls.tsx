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
  const { direction, range, motion } = usePreferences();
  const disabled = !alwaysEnabled && motion === 'static';
  return (
    <FieldSet xstyle={styles.controls} disabled={disabled} aria-label={m.pointer_lighting()}>
      <Field>
        <FieldLabel id="lighting-direction-label">direction</FieldLabel>
        <Select
          value={direction}
          items={{ toward: 'toward', away: 'away' }}
          disabled={disabled}
          onValueChange={(value) => {
            if (value === 'toward' || value === 'away') updatePreferences({ direction: value });
          }}
        >
          <SelectTrigger xstyle={styles.select} aria-labelledby="lighting-direction-label">
            <SelectValue />
          </SelectTrigger>
          <SelectPopup>
            <SelectList>
              <SelectItem value="toward">toward</SelectItem>
              <SelectItem value="away">away</SelectItem>
            </SelectList>
          </SelectPopup>
        </Select>
      </Field>
      <Field xstyle={styles.range}>
        <FieldLabel id="lighting-range-label">
          range: <output>{range} px</output>
        </FieldLabel>
        <Slider
          aria-label="range"
          min={40}
          max={1200}
          step={20}
          value={range}
          disabled={disabled}
          onValueChange={(value) => {
            const next = typeof value === 'number' ? value : value[0];
            if (next !== undefined) updatePreferences({ range: next });
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
