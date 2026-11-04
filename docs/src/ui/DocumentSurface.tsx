import { createElement, use, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { useSurface, type Light } from '@bolerish/edge';
import { DocumentLightContext } from './document-light-context.js';

type Props = { as?: 'div' | 'a'; children: ReactNode } & ComponentPropsWithoutRef<'a'>;
export function DocumentSurface(props: Props) {
  const light = use(DocumentLightContext);
  return light ? <LitSurface {...props} light={light} /> : createElement(props.as ?? 'div', hostProps(props));
}
function LitSurface({ light, ...props }: Props & { light: Light }) {
  const surface = useSurface(light, { color: 'var(--site-foreground)', shadowColor: 'transparent' });
  const { className, style, ...host } = hostProps(props);
  return createElement(props.as ?? 'div', {
    ...host, ref: surface.ref,
    className: [surface.className, className].filter(Boolean).join(' '),
    style: { ...surface.style, ...style },
  });
}
function hostProps({ as: _as, ...props }: Props) { return props; }
