import {
  createElement,
  use,
  useCallback,
  type ComponentPropsWithoutRef,
  type JSX,
  type HTMLAttributes,
  type Ref,
  type RefCallback,
} from 'react';
import { getSurfaceProps, type SurfaceOptions } from '@bolerish/edge-styles';
import { useSurfaceRegistration } from '../hooks/useSurfaceRegistration.js';
import { LightContext } from './light-context.js';

export type SurfaceTag = Extract<keyof HTMLElementTagNameMap, keyof JSX.IntrinsicElements>;
export type SurfaceProps<T extends SurfaceTag = 'div'> = SurfaceOptions &
  Omit<ComponentPropsWithoutRef<NoInfer<T>>, keyof SurfaceOptions> & {
    as?: T;
    ref?: Ref<HTMLElementTagNameMap[NoInfer<T>]>;
  };

/** Renders and registers one host; ordinary children remain untouched. */
export function Surface<T extends SurfaceTag = 'div'>(props: SurfaceProps<T>) {
  const light = use(LightContext);
  if (!light) throw new Error('Lighting.Surface must be inside Lighting');
  const surface = getSurfaceProps(props);
  const registrationRef = useSurfaceRegistration<HTMLElementTagNameMap[T]>(light, props.edgeStyle ?? 'raised');
  const {
    as = 'div', ref: forwardedRef, className, style,
    pseudoElement: _pseudoElement, edgeStyle: _edgeStyle, color: _color, intensity: _intensity, shadowColor: _shadowColor, borderWidth: _borderWidth,
    ...hostProps
  } = props;
  const ref = useMergedRefs(registrationRef, forwardedRef);
  const attributes: HTMLAttributes<HTMLElement> = {
    ...hostProps,
    className: [surface.className, className].filter(Boolean).join(' '),
    style: { ...surface.style, ...style },
  };
  return createElement(as, { ...attributes, ref });
}

function useMergedRefs<T>(
  internal: (element: T | null) => void,
  external: Ref<T> | undefined,
): RefCallback<T> {
  return useCallback((element) => {
    internal(element);
    const externalCleanup = setRef(external, element);
    if (element === null) return;
    return () => {
      internal(null);
      if (typeof externalCleanup === 'function') externalCleanup();
      else setRef(external, null);
    };
  }, [internal, external]);
}
function setRef<T>(ref: Ref<T> | undefined, element: T | null) {
  if (typeof ref === 'function') return ref(element);
  if (ref) ref.current = element;
}
