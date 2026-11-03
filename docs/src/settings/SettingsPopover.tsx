import type { ChangeEvent } from 'react';
import { Button } from '@bolerish/ui/button';
import { NativeSelect } from '@bolerish/ui/native-select';
import { Popover, PopoverTrigger, PopoverContent, PopoverTitle } from '@bolerish/ui/popover';
import { SlidersHorizontalIcon } from '@phosphor-icons/react/SlidersHorizontal';
import { motionDescriptions, updatePreferences, usePreferences } from './usePreferences.js';

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
            <NativeSelect value={preferences.edgeStyle} onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              const edgeStyle = event.target.value;
              if (edgeStyle === 'raised' || edgeStyle === 'matte') updatePreferences({ edgeStyle });
            }}>
              <option value="raised">Raised</option>
              <option value="matte">Matte</option>
            </NativeSelect>
          </label>
          <label>
            <span>Motion</span>
            <NativeSelect aria-describedby="motion-description" value={preferences.motion} onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              const motion = event.target.value;
              if (motion === 'dynamic' || motion === 'static') updatePreferences({ motion });
            }}>
              <option value="static">Static</option>
              <option value="dynamic">Dynamic</option>
            </NativeSelect>
          </label>
          {preferences.motion === 'static' ? (
            <label>
              <span>Direction</span>
              <NativeSelect value={preferences.staticDirection} onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                const staticDirection = event.target.value;
                if (staticDirection === 'fixed' || staticDirection === 'random') updatePreferences({ staticDirection });
              }}>
                <option value="fixed">Fixed</option>
                <option value="random">Random on load</option>
              </NativeSelect>
            </label>
          ) : null}
          <p id="motion-description" className="preference-description">{motionDescriptions[preferences.motion]}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
