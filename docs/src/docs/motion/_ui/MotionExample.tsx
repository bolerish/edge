import { Field, FieldLabel } from '@bolerish/ui/field';
import { LightingControls } from '../../../shared/preferences/LightingControls.js';
import { m } from '../../../paraglide/messages.js';
import * as stylex from '@stylexjs/stylex';
import { use } from 'react';
import { SurfaceLightContext } from '../../../shared/lighting/light-context.js';
import { usePreferences, updatePreferences } from '../../../shared/preferences/usePreferences.js';
import { useSurface } from '@bolerish/edge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@bolerish/ui/card';
import {
  Select,
  SelectItem,
  SelectList,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@bolerish/ui/select';

const motions = { system: 'system', dynamic: 'dynamic', static: 'static' };
const directions = {
  random: 'random',
  '0': '0°',
  '90': '90°',
  '180': '180°',
  '270': '270°',
  '315': '315°',
};
export function MotionExample() {
  const { motion, staticDirection: direction } = usePreferences();
  return (
    <div role="group" aria-label={m.motion_comparison()}>
      <div {...stylex.props(styles.appearanceControls)}>
        <Field xstyle={styles.appearanceControl}>
          <FieldLabel id="example-motion-label">motion</FieldLabel>
          <Select
            value={motion}
            items={motions}
            onValueChange={(value) => {
              if (value === 'system' || value === 'dynamic' || value === 'static')
                updatePreferences({ motion: value });
            }}
          >
            <SelectTrigger xstyle={styles.controlTrigger} aria-labelledby="example-motion-label">
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              <SelectList>
                {Object.entries(motions).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectList>
            </SelectPopup>
          </Select>
        </Field>
        {motion === 'static' ? (
          <Field xstyle={styles.appearanceControl}>
            <FieldLabel id="example-direction-label">staticDirection</FieldLabel>
            <Select
              value={String(direction)}
              items={directions}
              onValueChange={(value) => {
                if (value === 'random') updatePreferences({ staticDirection: value });
                else {
                  const angle = Number(value);
                  if (
                    angle === 0 ||
                    angle === 90 ||
                    angle === 180 ||
                    angle === 270 ||
                    angle === 315
                  )
                    updatePreferences({ staticDirection: angle });
                }
              }}
            >
              <SelectTrigger
                xstyle={styles.controlTrigger}
                aria-labelledby="example-direction-label"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectPopup>
                <SelectList>
                  {Object.entries(directions).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectList>
              </SelectPopup>
            </Select>
          </Field>
        ) : null}
      </div>
      <LightingControls />
      <MotionCard />
    </div>
  );
}
function MotionCard() {
  const light = use(SurfaceLightContext);
  if (!light) throw new Error('Appearance examples require document lighting');
  const { edgeStyle } = usePreferences();
  const surface = useSurface<HTMLDivElement>(light, { edgeStyle });
  return (
    <Card role="article" ref={surface}>
      <CardHeader>
        <CardTitle>{m.follow_your_pointer()}</CardTitle>
        <CardDescription xstyle={styles.description}>
          {m.choose_how_this_card_responds_to_movement()}
        </CardDescription>
      </CardHeader>
      <CardContent>{m.system_respects_your_motion_preferences_static_keeps()}</CardContent>
    </Card>
  );
}

export const motionExample = {
  get title() {
    return m.compare_motion();
  },
  Component: MotionExample,
  code: `const light = useLight({ motion: __MOTION__, staticDirection: __STATIC_DIRECTION__, direction: __DIRECTION__, radius: __RADIUS__ });
const surface = useSurface(light, { edgeStyle: __EDGE_STYLE__ });

<Card ref={surface}>
  Your component
</Card>`,
};

const styles = stylex.create({
  description: {
    marginBlock: '12px 0',
  },
  appearanceControls: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(2, minmax(0, 1fr))',
      '@media (max-width: 480px)': 'minmax(0, 1fr)',
    },
    gap: '16px',
    marginBlockEnd: '24px',
  },
  appearanceControl: {
    display: 'grid',
    gap: '8px',
    minWidth: '0',
  },
  controlTrigger: {
    width: '100%',
  },
});
