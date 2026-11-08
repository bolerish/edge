import { colorVars } from '@bolerish/tokens/semantic.stylex';
import { Card } from '@bolerish/ui/card';
import { Link } from '@bolerish/ui/link';
import { use, type ComponentPropsWithoutRef, type RefCallback } from 'react';
import { useSurface, type Light } from '@bolerish/edge';
import { usePreferences } from '../preferences/usePreferences.js';
import { SurfaceLightContext } from './light-context.js';

type Props =
  | ({ as: 'a' } & ComponentPropsWithoutRef<typeof Link>)
  | ({ as?: 'div' } & ComponentPropsWithoutRef<typeof Card>);

/** Adds document lighting to the design system's existing card or native link host. */
export function LightingSurface(props: Props) {
  const light = use(SurfaceLightContext);
  return light ? <LitSurface {...props} light={light} /> : renderSurface(props);
}

function LitSurface({ light, ...props }: Props & { light: Light }) {
  const { edgeStyle } = usePreferences();
  const surface = useSurface<HTMLElement>(light, {
    edgeStyle,
    color: colorVars.fgPrimary,
    shadowColor: 'transparent',
  });
  return renderSurface(props, surface);
}

function renderSurface(props: Props, ref?: RefCallback<HTMLElement>) {
  if (props.as === 'a') {
    const { as: _as, ...host } = props;
    return <Link {...host} variant="plain" ref={ref} />;
  }
  const { as: _as, ...host } = props;
  return <Card {...host} ref={ref} />;
}
