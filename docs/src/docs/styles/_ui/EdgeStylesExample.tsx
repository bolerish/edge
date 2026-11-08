import { m } from '../../../paraglide/messages.js';
import * as stylex from '@stylexjs/stylex';
import { use } from 'react';
import { SurfaceLightContext } from '../../../shared/lighting/light-context.js';
import { usePreferences, updatePreferences } from '../../../shared/preferences/usePreferences.js';
import { useSurface, type EdgeStyle } from '@bolerish/edge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@bolerish/ui/card';
import {
  Select,
  SelectItem,
  SelectList,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@bolerish/ui/select';

const edgeStyles = [
  {
    value: 'raised',
    get label() {
      return m.raised();
    },
  },
  {
    value: 'recessed',
    get label() {
      return m.recessed();
    },
  },
  {
    value: 'matte',
    get label() {
      return m.matte();
    },
  },
] as const;

export function EdgeStylesExample() {
  const { edgeStyle } = usePreferences();
  return (
    <div role="group" aria-label={m.style_comparison()}>
      <div {...stylex.props(styles.appearanceControls)}>
        <div {...stylex.props(styles.appearanceControl)}>
          <span {...stylex.props(styles.controlLabel)} id="example-style-label">
            {m.style()}
          </span>
          <Select
            value={edgeStyle}
            items={Object.fromEntries(edgeStyles.map((style) => [style.value, style.label]))}
            onValueChange={(value) => {
              if (value === 'raised' || value === 'recessed' || value === 'matte')
                updatePreferences({ edgeStyle: value });
            }}
          >
            <SelectTrigger xstyle={styles.controlTrigger} aria-labelledby="example-style-label">
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              <SelectList>
                {edgeStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectList>
            </SelectPopup>
          </Select>
        </div>
      </div>
      <StyleCard edgeStyle={edgeStyle} />
    </div>
  );
}
function StyleCard({ edgeStyle }: { edgeStyle: EdgeStyle }) {
  const light = use(SurfaceLightContext);
  if (!light) throw new Error('Appearance examples require document lighting');
  const surface = useSurface<HTMLDivElement>(light, { edgeStyle });
  return (
    <Card role="article" ref={surface}>
      <CardHeader>
        <CardTitle>{edgeStyles.find((style) => style.value === edgeStyle)?.label}</CardTitle>
        <CardDescription xstyle={styles.description}>
          {m.a_border_that_responds_to_your_pointer()}
        </CardDescription>
      </CardHeader>
      <CardContent>{m.your_component_keeps_its_own_colors_and()}</CardContent>
    </Card>
  );
}

export const edgeStylesExample = {
  get title() {
    return m.compare_edge_styles();
  },
  Component: EdgeStylesExample,
  code: `const light = useLight();
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
