import type { ReactNode } from 'react';
import type {
  LightOptions,
  LightingProps,
  SurfaceOptions,
  SurfaceProps,
} from '@bolerish/edge';

interface OptionDescription {
  type: string;
  defaultValue: string;
  description: string;
}
type OptionDocs<T> = { [Key in keyof T]-?: OptionDescription };
interface ApiRow extends OptionDescription {
  name: string;
}

const lightOptions = {
  motion: {
    type: "'system' | 'dynamic' | 'static'",
    defaultValue: "'system'",
    description: 'System respects reduced-motion and device preferences. Dynamic follows mouse or pen input, even with reduced motion enabled. Static keeps a fixed direction. Touch does not drive the light.',
  },
  staticDirection: {
    type: "number | 'random'",
    defaultValue: '315',
    description: 'Direction in degrees for fixed lighting. Random chooses one shared direction per mount and keeps it across ordinary rerenders. Numbers must be finite.',
  },
  radius: {
    type: 'number',
    defaultValue: '480',
    description: 'Distance over which dynamic lighting fades outside a surface, in viewport CSS pixels. Must be positive and finite.',
  },
  intensity: {
    type: 'number',
    defaultValue: '0.75',
    description: 'Shared light strength. Must be finite and between 0 and 1; invalid values throw a RangeError.',
  },
} satisfies OptionDocs<LightOptions>;

const surfaceOptions = {
  pseudoElement: {
    type: "'after' | 'before'",
    defaultValue: "'after'",
    description: 'Decoration slot. Choose before to preserve an existing ::after. If both slots are occupied, or the host is a native input, use a wrapper. Invalid values throw a RangeError.',
  },
  edgeStyle: {
    type: "'raised' | 'recessed' | 'matte'",
    defaultValue: "'raised'",
    description: 'How the edge responds to light. With the Wisp theme, only raised and matte are supported; recessed is available without a theme.',
  },
  theme: {
    type: "'wisp' | false",
    defaultValue: 'Unset',
    description: 'Wisp adds a dark base appearance. Leave unset or use false to retain your own component appearance.',
  },
  color: {
    type: 'string',
    defaultValue: '#e5edc8',
    description: 'Highlight color. Accepts any CSS color string, including a CSS variable.',
  },
  shadowColor: {
    type: 'string',
    defaultValue: '#0008',
    description: 'Color on the opposite edge. Accepts any CSS color string; use transparent to remove this shadow on a light surface.',
  },
  borderWidth: {
    type: 'number',
    defaultValue: '1',
    description: 'Decorative edge thickness in pixels; it does not change the host border. Negative values clamp to 0. Non-finite values use the default.',
  },
  intensity: {
    type: 'number',
    defaultValue: '1',
    description: 'Multiplier for the shared light strength. Finite values clamp to 0–1; non-finite values use the default.',
  },
} satisfies OptionDocs<SurfaceOptions>;

const lightingOwnProps = {
  children: {
    type: 'ReactNode',
    defaultValue: 'Required',
    description: 'The area that shares this light. Ordinary children stay unchanged; only explicit surfaces respond.',
  },
  ref: {
    type: 'Ref<Light>',
    defaultValue: 'Unset',
    description: 'Optional stable light handle. Call its refresh() method after position-only layout changes.',
  },
} satisfies OptionDocs<Omit<LightingProps, keyof LightOptions>>;

const surfaceOwnProps = {
  as: {
    type: 'HTML tag name',
    defaultValue: "'div'",
    description: 'The HTML element to render. Native attributes and the ref follow the chosen tag; custom React components are not accepted here.',
  },
  children: {
    type: 'ReactNode',
    defaultValue: 'Unset',
    description: 'Content rendered inside the host. Use a wrapper for inputs and other elements that cannot display the decoration themselves.',
  },
  ref: {
    type: 'Ref<HTMLElement for the chosen tag>',
    defaultValue: 'Unset',
    description: 'Forwarded to the rendered element alongside the internal registration ref. React 19 callback-ref cleanup is preserved.',
  },
  className: {
    type: 'string',
    defaultValue: 'Unset',
    description: 'Your classes, combined with the decoration classes.',
  },
  style: {
    type: 'CSSProperties',
    defaultValue: 'Unset',
    description: 'Your inline styles, merged after the decoration bindings. Keep Edge-owned CSS variables intact unless deliberately overriding them.',
  },
} satisfies OptionDocs<Pick<SurfaceProps, 'as' | 'children' | 'ref' | 'className' | 'style'>>;

export const lightOptionRows = rows(lightOptions);
export const surfaceOptionRows = rows(surfaceOptions);
export const lightingPropRows = [...lightOptionRows, ...rows(lightingOwnProps)];
export const surfacePropRows = [...surfaceOptionRows, ...rows(surfaceOwnProps)];

function rows(options: Record<string, OptionDescription>): ApiRow[] {
  return Object.entries(options).map(([name, option]) => ({ name, ...option }));
}

/** Build native nodes eagerly so document search can read the same table text. */
export function apiTable(caption: string, options: readonly ApiRow[]): ReactNode {
  return (
    <div className="table-scroll" role="region" aria-label={`${caption} table`} tabIndex={0}>
      <table className="api-table">
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Prop / option</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option) => (
            <tr key={option.name}>
              <th scope="row"><code>{option.name}</code></th>
              <td><code>{option.type}</code></td>
              <td><code>{option.defaultValue}</code></td>
              <td>{option.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
