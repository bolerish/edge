import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import * as stylex from '@stylexjs/stylex';
import {
  useLight,
  useSurface,
  type Light,
  type LightOptions,
} from '@wisp-lighting/react';

type Variant = 'raised' | 'matte';

export function App() {
  const [variant, setVariant] = useState<Variant>('raised');
  const [mode, setMode] = useState<LightOptions['mode']>('pointer');
  const [count, setCount] = useState(20);
  const [intensity, setIntensity] = useState(0.8);
  const [note, setNote] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const light = useLight({ mode, intensity });
  useEffect(() => light.refresh(), [light, count, expanded, note]);
  return (
    <main {...stylex.props(styles.page)}>
      <header {...stylex.props(styles.header)}>
        <a href="#" {...stylex.props(styles.brand)}>
          wisp<span {...stylex.props(styles.version)}> / 0.1</span>
        </a>
        <span {...stylex.props(styles.caption)}>
          One source. A quieter kind of depth.
        </span>
      </header>
      <section {...stylex.props(styles.intro)}>
        <p {...stylex.props(styles.eyebrow)}>DIRECTIONAL SURFACE LIGHTING</p>
        <h1 {...stylex.props(styles.title)}>Light at the edges.</h1>
        <p {...stylex.props(styles.lead)}>
          Your components, in a shared light.
          <br />
          Move your mouse to reveal the shape of the surface.
        </p>
      </section>
      <div {...stylex.props(styles.controls)}>
        <fieldset {...stylex.props(styles.group)}>
          <legend>Wisp theme</legend>
          {(['raised', 'matte'] as const).map((value, index) => (
            <button
              key={value}
              type="button"
              aria-pressed={variant === value}
              onClick={() => setVariant(value)}
              {...stylex.props(
                styles.option,
                variant === value && styles.selected,
              )}
            >
              {index === 0 ? '01 Raised' : '03 Matte'}
            </button>
          ))}
        </fieldset>
        <fieldset {...stylex.props(styles.group)}>
          <legend>Light</legend>
          {(['pointer', 'auto', 'static'] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => setMode(value)}
              {...stylex.props(
                styles.option,
                mode === value && styles.selected,
              )}
            >
              {value === 'pointer'
                ? 'Mouse'
                : value === 'auto'
                  ? 'Auto'
                  : 'Static'}
            </button>
          ))}
        </fieldset>
        <label {...stylex.props(styles.range)}>
          Intensity <output>{Math.round(intensity * 100)}%</output>
          <input
            aria-label="Intensity"
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={intensity}
            onChange={(event) => setIntensity(Number(event.target.value))}
          />
        </label>
      </div>
      <p {...stylex.props(styles.caption)}>
        Mouse explicitly enables tracking. Auto respects reduced motion. Static
        uses a fixed direction.
      </p>
      <section
        aria-label="Component examples"
        {...stylex.props(styles.examples)}
      >
        <Card
          light={light}
          variant={variant}
          expanded={expanded}
          onToggle={() => setExpanded((value) => !value)}
        />
        <div {...stylex.props(styles.form)}>
          <p {...stylex.props(styles.eyebrow)}>BUILT AROUND YOUR UI</p>
          <h2 {...stylex.props(styles.heading)}>The content stays yours.</h2>
          <Search light={light} />
          <SaveButton
            light={light}
            variant={variant}
            onClick={() => setNote((value) => !value)}
          >
            Open quick note ↗
          </SaveButton>
          <p {...stylex.props(styles.caption)}>
            Type, select, tab, click. The light never owns your input.
          </p>
        </div>
      </section>
      <section
        {...stylex.props(styles.fieldSection)}
        aria-labelledby="field-title"
      >
        <div {...stylex.props(styles.fieldHeading)}>
          <h2 id="field-title" {...stylex.props(styles.heading)}>
            One light, many surfaces.
          </h2>
          <fieldset {...stylex.props(styles.group)}>
            <legend>Surfaces</legend>
            {[20, 100, 500].map((value) => (
              <button
                key={value}
                aria-pressed={count === value}
                onClick={() => setCount(value)}
                {...stylex.props(
                  styles.option,
                  count === value && styles.selected,
                )}
              >
                {value}
              </button>
            ))}
          </fieldset>
        </div>
        <div data-testid="field" {...stylex.props(styles.field)}>
          {Array.from({ length: count }, (_, index) => (
            <Tile key={index} light={light} variant={variant} index={index} />
          ))}
        </div>
        <p {...stylex.props(styles.caption)}>
          The sample count is a test scene, not an FPS promise. Changing
          gradients can still require browser paint.
        </p>
      </section>
      <footer {...stylex.props(styles.footer)}>
        React + StyleX · composed by you · illuminated by Wisp
      </footer>
      {note
        ? createPortal(
            <QuickNote light={light} onClose={() => setNote(false)} />,
            document.body,
          )
        : null}
    </main>
  );
}

function Card({
  light,
  variant,
  expanded,
  onToggle,
}: {
  light: Light;
  variant: Variant;
  expanded: boolean;
  onToggle(): void;
}) {
  const surface = useSurface<HTMLElement>(light, {
    material: variant,
    theme: 'wisp',
  });
  return (
    <article
      ref={surface.ref}
      data-testid="card"
      {...stylex.props(surface.style, styles.card)}
    >
      <p {...stylex.props(styles.eyebrow)}>01 / A SHARED ATMOSPHERE</p>
      <div {...stylex.props(styles.orbit)} aria-hidden="true">
        ↗
      </div>
      <h2 {...stylex.props(styles.cardTitle)}>
        A little light.
        <br />A clearer edge.
      </h2>
      <p {...stylex.props(styles.caption)}>
        One source connects the edges of cards, buttons, and fields.
      </p>
      {expanded ? (
        <p>
          Lighting follows the surface without replacing its content or
          interactions.
        </p>
      ) : null}
      <SaveButton light={light} variant={variant} onClick={onToggle}>
        {expanded ? 'Less detail' : 'More detail'}
      </SaveButton>
    </article>
  );
}
function Search({ light }: { light: Light }) {
  const surface = useSurface<HTMLLabelElement>(light, { material: 'recessed' });
  return (
    <label
      ref={surface.ref}
      data-testid="input-surface"
      {...stylex.props(surface.style, styles.inputShell)}
    >
      <span {...stylex.props(styles.caption)}>Search your workspace</span>
      <input
        aria-label="Search your workspace"
        placeholder="An idea to return to…"
        {...stylex.props(styles.input)}
      />
    </label>
  );
}
function SaveButton({
  light,
  variant,
  onClick,
  children,
}: {
  light: Light;
  variant: Variant;
  onClick(): void;
  children: React.ReactNode;
}) {
  const surface = useSurface<HTMLButtonElement>(light, {
    material: variant,
    theme: 'wisp',
  });
  return (
    <button
      ref={surface.ref}
      onClick={onClick}
      {...stylex.props(surface.style, styles.button)}
    >
      {children}
    </button>
  );
}
function Tile({
  light,
  variant,
  index,
}: {
  light: Light;
  variant: Variant;
  index: number;
}) {
  const surface = useSurface<HTMLDivElement>(light, {
    material: variant,
    theme: 'wisp',
  });
  return (
    <div
      ref={surface.ref}
      data-testid="tile"
      aria-hidden="true"
      {...stylex.props(surface.style, styles.tile)}
    >
      <span>↗</span>
      <span>{String(index + 1).padStart(2, '0')}</span>
    </div>
  );
}
function QuickNote({ light, onClose }: { light: Light; onClose(): void }) {
  const surface = useSurface<HTMLElement>(light, {
    material: 'raised',
    theme: 'wisp',
  });
  return (
    <aside
      ref={surface.ref}
      data-testid="portal"
      aria-label="Quick note"
      {...stylex.props(surface.style, styles.note)}
    >
      <h2 {...stylex.props(styles.heading)}>An idea, close by.</h2>
      <label>
        Quick note
        <input aria-label="Quick note" {...stylex.props(styles.input)} />
      </label>
      <button onClick={onClose} {...stylex.props(styles.option)}>
        Close note
      </button>
    </aside>
  );
}

const styles = stylex.create({
  page: {
    maxWidth: 1200,
    marginInline: 'auto',
    paddingInline: { default: 48, '@media (max-width: 640px)': 20 },
  },
  header: {
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#ffffff12',
    gap: 24,
  },
  brand: {
    fontSize: 30,
    fontWeight: 600,
    letterSpacing: -1.5,
    color: '#e7ecd9',
    textDecoration: 'none',
  },
  version: { fontSize: 12, color: '#8d977e', letterSpacing: 0 },
  caption: { fontSize: 12, color: '#a4ad97', lineHeight: 1.8 },
  intro: { paddingBlock: 64 },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#b6c797',
    fontWeight: 600,
  },
  title: {
    fontSize: { default: 64, '@media (max-width: 640px)': 42 },
    fontWeight: 450,
    letterSpacing: -2.5,
    marginBlock: 20,
  },
  lead: { fontSize: 16, lineHeight: 1.8, color: '#b8c1aa' },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 28,
    alignItems: 'center',
    paddingBlock: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopStyle: 'solid',
    borderBottomStyle: 'solid',
    borderTopColor: '#ffffff12',
    borderBottomColor: '#ffffff12',
  },
  group: {
    borderWidth: 0,
    padding: 0,
    margin: 0,
    fontSize: 11,
    color: '#a6b197',
  },
  option: {
    color: '#aeb9a0',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: 6,
    backgroundColor: 'transparent',
    padding: '8px 12px',
    fontSize: 12,
    marginTop: 8,
  },
  selected: {
    backgroundColor: '#354128',
    color: '#e6f0d3',
    borderColor: '#4d5a3f',
  },
  range: { display: 'grid', gap: 8, fontSize: 11, color: '#a6b197' },
  examples: {
    display: 'grid',
    gridTemplateColumns: {
      default: '1fr 1fr',
      '@media (max-width: 700px)': '1fr',
    },
    gap: 32,
    paddingBlock: 40,
  },
  card: { padding: 32, borderRadius: 20 },
  orbit: { fontSize: 48, color: '#cad9ae', marginBlock: 16 },
  cardTitle: {
    fontSize: 30,
    fontWeight: 450,
    letterSpacing: -0.8,
    lineHeight: 1.2,
  },
  heading: { fontSize: 20, fontWeight: 450, letterSpacing: -0.4 },
  form: {
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
  },
  inputShell: {
    display: 'grid',
    gap: 10,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#323d29',
    borderRadius: 12,
    backgroundColor: '#0e120c',
    width: '100%',
    boxShadow: 'inset 0 2px 4px #0004',
  },
  input: {
    display: 'block',
    width: '100%',
    color: '#e7ecd9',
    paddingBlock: 8,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#ffffff18',
    backgroundColor: 'transparent',
    fontSize: 14,
  },
  button: {
    padding: '12px 18px',
    fontSize: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  fieldSection: { paddingBlock: 30 },
  fieldHeading: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  field: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(10,minmax(0,1fr))',
      '@media (max-width: 700px)': 'repeat(5,minmax(0,1fr))',
    },
    gap: 10,
    marginBlock: 24,
  },
  tile: {
    height: 64,
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    fontSize: 10,
    color: '#a4b48c',
  },
  footer: {
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#ffffff12',
    paddingBlock: 32,
    marginTop: 32,
    fontSize: 11,
    color: '#8d997c',
  },
  note: {
    position: 'fixed',
    right: 20,
    bottom: 20,
    width: 'min(340px,calc(100vw - 40px))',
    padding: 24,
    zIndex: 10,
    borderRadius: 16,
  },
});
