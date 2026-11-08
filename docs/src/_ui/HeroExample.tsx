import { colorVars } from '@bolerish/tokens/semantic.stylex';
import * as stylex from '@stylexjs/stylex';
import { Card } from '@bolerish/ui/card';
import { Edge } from '@bolerish/edge';
import { usePreferences } from '../shared/preferences/usePreferences.js';

export function HeroExample() {
  const { edgeStyle } = usePreferences();
  return (
    <section {...stylex.props(styles.heroExample)} aria-label="Edge example">
      <div {...stylex.props(styles.heroExampleStage)} aria-hidden="true">
        {(['back', 'middle', 'front'] as const).map((layer) => (
          <Edge.Surface
            key={layer}
            edgeStyle={edgeStyle}
            color={colorVars.fgPrimary}
            shadowColor="transparent"
            intensity={1}
            {...stylex.props(styles.heroExampleSurface, styles[layer])}
            data-testid={layer === 'front' ? 'hero-surface' : undefined}
          >
            <Card xstyle={styles.heroExamplePanel}>
              <Edge.Surface
                edgeStyle={edgeStyle}
                color={colorVars.fgPrimary}
                shadowColor="transparent"
                intensity={1}
                className={`hero-example-orbit ${stylex.props(styles.heroExampleOrbit).className}`}
              />
              <span {...stylex.props(styles.heroExampleLine)} />
              <span {...stylex.props(styles.heroExampleLine, styles.heroExampleLineShort)} />
            </Card>
          </Edge.Surface>
        ))}
      </div>
    </section>
  );
}

const styles = stylex.create({
  heroExample: {
    minWidth: '0',
    marginBlockEnd: {
      default: null,
      '@media (max-width: 1000px)': '40px',
    },
  },
  heroExampleStage: {
    position: 'relative',
    height: '360px',
    width: 'min(100%, 440px)',
    margin: '0 auto',
  },
  heroExampleSurface: {
    position: 'absolute',
    width: '68%',
    height: '200px',
    borderRadius: '20px',
  },
  back: {
    top: '18px',
    left: '27%',
  },
  middle: {
    top: '70px',
    left: '16%',
  },
  front: {
    top: '122px',
    left: '5%',
  },
  heroExamplePanel: {
    height: '100%',
    padding: '28px',
    borderRadius: 'inherit',
    borderColor: 'color-mix(in srgb, currentColor 30%, transparent)',
  },
  heroExampleOrbit: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    marginBlockEnd: '28px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'color-mix(in srgb, currentColor 35%, transparent)',
  },
  heroExampleLine: {
    display: 'block',
    width: '75%',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: 'color-mix(in srgb, currentColor 25%, transparent)',
  },
  heroExampleLineShort: {
    width: '45%',
    marginBlockStart: '12px',
  },
});
