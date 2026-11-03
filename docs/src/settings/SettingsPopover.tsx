import type { ChangeEvent } from 'react';
import { Button } from '@bolerish/ui/button';
import { NativeSelect } from '@bolerish/ui/native-select';
import { Popover, PopoverTrigger, PopoverContent, PopoverTitle } from '@bolerish/ui/popover';
import { SlidersHorizontalIcon } from '@phosphor-icons/react/SlidersHorizontal';
import { modeDescriptions, updatePreferences, usePreferences } from './usePreferences.js';

export function SettingsPopover() {
  const preferences = usePreferences();
  return (
    <Popover>
      <PopoverTrigger render={<Button size="icon" variant="ghost" aria-label="Settings" />}>
        <SlidersHorizontalIcon aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent className="preferences-popover" align="end">
        <div className="preferences">
          <PopoverTitle>Settings</PopoverTitle>
          <label>
            <span>Style</span>
            <NativeSelect value={preferences.material} onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              const material = event.target.value;
              if (material === 'raised' || material === 'matte') updatePreferences({ material });
            }}>
              <option value="raised">Raised</option>
              <option value="matte">Matte</option>
            </NativeSelect>
          </label>
          <label>
            <span>Pointer tracking</span>
            <NativeSelect aria-describedby="tracking-description" value={preferences.mode} onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              const mode = event.target.value;
              if (mode === 'auto' || mode === 'pointer' || mode === 'static') updatePreferences({ mode });
            }}>
              <option value="static">Off</option>
              <option value="pointer">On</option>
              <option value="auto">System</option>
            </NativeSelect>
          </label>
          <p id="tracking-description" className="preference-description">{modeDescriptions[preferences.mode]}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
