import {
  createElement,
  forwardRef,
  useContext,
  useMemo,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactElement,
  type HTMLAttributes,
  type Ref,
  type RefCallback,
} from 'react';
import { getSurfaceProps, type SurfaceOptions } from '@bolerish/edge-styles';
import { useSurfaceRegistration } from '../hooks/useSurfaceRegistration.js';
import { LightContext } from './light-context.js';

export type SurfaceTag = Extract<keyof HTMLElementTagNameMap, ElementType>;
export type SurfaceProps<T extends SurfaceTag = 'div'> = SurfaceOptions &
  Omit<ComponentPropsWithoutRef<NoInfer<T>>, keyof SurfaceOptions> & {
    as?: T;
    ref?: Ref<HTMLElementTagNameMap[NoInfer<T>]>;
  };

type SurfaceComponent = <T extends SurfaceTag = 'div'>(props: SurfaceProps<T>) => ReactElement | null;

/** Renders and registers one host; ordinary children remain untouched. */
const SurfaceRoot = forwardRef<HTMLElement, Omit<SurfaceProps<SurfaceTag>, 'ref'>>(function Surface(props, forwardedRef) {
  const light = useContext(LightContext);
  if (!light) throw new Error('Edge.Surface must be inside Edge.Provider (legacy Lighting.Surface must be inside Lighting)');
  const surface = getSurfaceProps(props);
  const registrationRef = useSurfaceRegistration<HTMLElement>(light, props.edgeStyle ?? 'raised');
  const {
    as = 'div', className, style,
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
});

// forwardRef erases the host generic; the public signature keeps attributes and refs tied to `as`.
export const Surface = SurfaceRoot as SurfaceComponent;

function useMergedRefs<T>(
  internal: (element: T | null) => void,
  external: Ref<T> | undefined,
): RefCallback<T> {
  return useMemo(() => {
    let cleanup: void | (() => void);
    return (element: T | null) => {
      internal(element);
      if (element !== null) {
        cleanup = setRef(external, element);
      } else {
        if (typeof cleanup === 'function') cleanup();
        else setRef(external, null);
        cleanup = undefined;
      }
    };
  }, [internal, external]);
}
function setRef<T>(ref: Ref<T> | undefined, element: T | null) {
  if (typeof ref === 'function') return ref(element);
  if (ref) ref.current = element;
}
