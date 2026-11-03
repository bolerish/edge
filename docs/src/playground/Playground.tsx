import { useEffect, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Button } from '@bolerish/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@bolerish/ui/card';
import { Heading } from '@bolerish/ui/heading';
import { Input } from '@bolerish/ui/input';
import { Label } from '@bolerish/ui/label';
import { Link } from '@bolerish/ui/link';
import { Paragraph } from '@bolerish/ui/paragraph';
import { ToggleGroup, ToggleGroupItem } from '@bolerish/ui/toggle-group';
import {
  useLight,
  useSurface,
  type Light,
  type LightOptions,
} from '@bolerish/wisp-react';
import { SiteShell } from '../ui/SiteShell.js';
import type { ReactNode } from 'react';
type Variant = 'raised' | 'matte';

export function Playground() {
  const [variant, setVariant] = useState<Variant>('raised');
  const [mode, setMode] = useState<LightOptions['mode']>('pointer');
  const light = useLight({ mode, intensity: 0.8 });
  const navigation = [
    { items: [{ title: 'Playground', href: '/playground/' }] },
    {
      title: 'Examples',
      items: [
        { title: 'Card', href: '/playground/#card' },
        { title: 'Input', href: '/playground/#input' },
        { title: 'Button', href: '/playground/#button' },
      ],
    },
    {
      title: 'Documentation',
      items: [
        { title: 'Introduction', href: '/docs/' },
        { title: 'Usage', href: '/docs/usage/' },
        { title: 'API reference', href: '/docs/api/' },
      ],
    },
  ];
  return (
    <SiteShell
      section="playground"
      pathname="/playground/"
      navigation={navigation}
    >
      <div className="playground-intro">
        <Heading level={1} size="page">
          Playground
        </Heading>
        <Paragraph variant="description">
          Move your mouse to explore how one light connects your components.
        </Paragraph>
      </div>
      <div className="playground-controls">
        <div className="control-group">
          <span id="material-label">Wisp theme</span>
          <ToggleGroup
            value={[variant]}
            onValueChange={(values: unknown[]) => {
              const value = values[0];
              if (value === 'raised' || value === 'matte') setVariant(value);
            }}
            aria-labelledby="material-label"
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem value="raised">01 Raised</ToggleGroupItem>
            <ToggleGroupItem value="matte">03 Matte</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="control-group">
          <span id="mode-label">Light</span>
          <ToggleGroup
            value={[mode ?? 'pointer']}
            onValueChange={(values: unknown[]) => {
              const value = values[0];
              if (value === 'pointer' || value === 'auto' || value === 'static')
                setMode(value);
            }}
            aria-labelledby="mode-label"
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem value="pointer">Mouse</ToggleGroupItem>
            <ToggleGroupItem value="auto">Auto</ToggleGroupItem>
            <ToggleGroupItem value="static">Static</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <Paragraph variant="caption">
        Mouse explicitly enables tracking. Auto respects reduced motion. Static
        uses a fixed direction.
      </Paragraph>
      <div className="example-grid">
        <Example
          id="card"
          title="Card"
          href="/docs/usage/#share-one-light"
          description="A continuous edge on a larger surface."
        >
          <CardExample light={light} variant={variant} />
        </Example>
        <Example
          id="input"
          title="Input"
          href="/docs/usage/#wrap-inputs-you-own"
          description="An inset edge around an input you own."
        >
          <InputExample light={light} />
        </Example>
        <Example
          id="button"
          title="Button"
          href="/docs/materials/"
          description="A quieter edge, with the same click behavior."
        >
          <ButtonExample light={light} variant={variant} />
        </Example>
      </div>
      <footer className="page-footer">
        Gradients can still require browser paint. No FPS guarantee is implied.
      </footer>
    </SiteShell>
  );
}
function Example({
  id,
  title,
  href,
  description,
  children,
}: {
  id: string;
  title: string;
  href: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="example-panel" id={id}>
      <div className="example-heading">
        <Heading level={2} size="subsection">
          {title}
        </Heading>
        <Link href={href} aria-label={`${title} documentation`}>
          Docs
        </Link>
      </div>
      <div className="example-preview">{children}</div>
      <Paragraph variant="caption" className="example-description">
        {description}
      </Paragraph>
    </section>
  );
}
function CardExample({ light, variant }: { light: Light; variant: Variant }) {
  const surface = useSurface<HTMLDivElement>(light, {
    material: variant,
    theme: 'wisp',
  });
  const surfaceProps = stylex.props(surface.style);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => light.refresh(), [light, expanded]);
  return (
    <div
      ref={surface.ref}
      {...surfaceProps}
      className={`${surfaceProps.className} wisp-sample card-surface`}
      data-testid="surface-card"
    >
      <Card className="demo-card">
        <CardHeader>
          <CardTitle className="inherit-color">Project overview</CardTitle>
          <CardDescription className="inherit-color sample-description">
            A shared light reveals the edges of the card and its controls.
          </CardDescription>
        </CardHeader>
        {expanded ? (
          <CardContent>
            <Paragraph className="inherit-color">
              Your markup, styling and interactions stay in your app.
            </Paragraph>
          </CardContent>
        ) : null}
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            className="sample-action"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? 'Less detail' : 'More detail'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
function InputExample({ light }: { light: Light }) {
  const surface = useSurface<HTMLDivElement>(light, { material: 'recessed' });
  const surfaceProps = stylex.props(surface.style);
  return (
    <div className="input-example">
      <Label htmlFor="workspace-search">Search workspace</Label>
      <div
        ref={surface.ref}
        {...surfaceProps}
        className={`${surfaceProps.className} input-surface`}
        data-testid="surface-input"
      >
        <Input
          id="workspace-search"
          placeholder="An idea to return to…"
          variant="none"
        />
      </div>
    </div>
  );
}
function ButtonExample({ light, variant }: { light: Light; variant: Variant }) {
  const surface = useSurface<HTMLSpanElement>(light, {
    material: variant,
    theme: 'wisp',
  });
  const surfaceProps = stylex.props(surface.style);
  const [clicks, setClicks] = useState(0);
  return (
    <div className="button-example">
      <span
        ref={surface.ref}
        {...surfaceProps}
        className={`${surfaceProps.className} wisp-sample button-surface`}
        data-testid="surface-button"
      >
        <Button
          variant="ghost"
          className="sample-action"
          onClick={() => setClicks((value) => value + 1)}
        >
          Try button
        </Button>
      </span>
      <span role="status" className="interaction-status">
        {clicks
          ? `Clicked ${clicks} ${clicks === 1 ? 'time' : 'times'}.`
          : 'Click or press Enter.'}
      </span>
    </div>
  );
}
