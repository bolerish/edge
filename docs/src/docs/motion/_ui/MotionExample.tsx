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

const motions = {
  get system() {
    return m.system();
  },
  get dynamic() {
    return m.dynamic();
  },
  get static() {
    return m.label_static();
  },
};
const directions = {
  get random() {
    return m.random();
  },
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
        <div {...stylex.props(styles.appearanceControl)}>
          <span {...stylex.props(styles.controlLabel)} id="example-motion-label">
            {m.motion()}
          </span>
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
        </div>
        {motion === 'static' ? (
          <div {...stylex.props(styles.appearanceControl)}>
            <span {...stylex.props(styles.controlLabel)} id="example-direction-label">
              {m.static_direction()}
            </span>
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
          </div>
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
  controlLabel: {
    fontSize: '14px',
    fontWeight: '500',
  },
  controlTrigger: {
    width: '100%',
  },
});
