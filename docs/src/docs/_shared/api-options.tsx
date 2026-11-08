import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableContainer,
} from '@bolerish/ui/table';
import * as stylex from '@stylexjs/stylex';
import { contentStyles } from './content-styles.js';
import type { ReactNode } from 'react';
import type { LightOptions, EdgeProviderProps, SurfaceOptions, SurfaceProps } from '@bolerish/edge';

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
    description:
      'System respects reduced-motion and device preferences. Dynamic follows mouse or pen input, even with reduced motion enabled. Static keeps a fixed direction. Touch does not drive the light.',
  },
  staticDirection: {
    type: "number | 'random'",
    defaultValue: '315',
    description:
      'Direction in degrees for fixed lighting. Random chooses one shared direction per mount and keeps it across ordinary rerenders. Numbers must be finite.',
  },
  direction: {
    type: "'gather' | 'spread'",
    defaultValue: "'gather'",
    description:
      'Gather faces highlights toward the pointer; spread reverses them by 180 degrees. Recessed surfaces retain their inverted response. Only affects pointer-driven lighting; staticDirection controls fixed lighting.',
  },
  radius: {
    type: 'number',
    defaultValue: '480',
    description:
      'Distance over which dynamic lighting fades outside a surface, in viewport CSS pixels. Must be positive and finite.',
  },
  intensity: {
    type: 'number',
    defaultValue: '0.75',
    description:
      'Shared light strength. Must be finite and between 0 and 1; invalid values throw a RangeError.',
  },
} satisfies OptionDocs<LightOptions>;

const surfaceOptions = {
  pseudoElement: {
    type: "'after' | 'before'",
    defaultValue: "'after'",
    description:
      'Decoration slot. Choose before to preserve an existing ::after. If both slots are occupied, or the host is a native input, use a wrapper. Invalid values throw a RangeError.',
  },
  edgeStyle: {
    type: "'raised' | 'recessed' | 'matte'",
    defaultValue: "'raised'",
    description:
      'How the edge responds to light. All three styles preserve your component appearance.',
  },
  color: {
    type: 'string',
    defaultValue: 'currentColor',
    description:
      'Highlight color. Follows the host text color by default. Accepts any CSS color string, including a CSS variable.',
  },
  shadowColor: {
    type: 'string',
    defaultValue: '#0008',
    description:
      'Color on the opposite edge. Accepts any CSS color string; use transparent to remove this shadow on a light surface.',
  },
  borderWidth: {
    type: 'number',
    defaultValue: '1',
    description:
      'Decorative edge thickness in pixels; it does not change the host border. Negative values clamp to 0. Non-finite values use the default.',
  },
  intensity: {
    type: 'number',
    defaultValue: '1',
    description:
      'Multiplier for the shared light strength. Finite values clamp to 0–1; non-finite values use the default.',
  },
} satisfies OptionDocs<SurfaceOptions>;

const providerOwnProps = {
  children: {
    type: 'ReactNode',
    defaultValue: 'Required',
    description:
      'The area that shares this light. Ordinary children stay unchanged; only explicit surfaces respond.',
  },
  ref: {
    type: 'Ref<Light>',
    defaultValue: 'Unset',
    description:
      'Optional stable light handle. Call its refresh() method after position-only layout changes.',
  },
} satisfies OptionDocs<Omit<EdgeProviderProps, keyof LightOptions>>;

const surfaceOwnProps = {
  as: {
    type: 'HTML tag name',
    defaultValue: "'div'",
    description:
      'The HTML element to render. Native attributes and the ref follow the chosen tag; custom React components are not accepted here.',
  },
  children: {
    type: 'ReactNode',
    defaultValue: 'Unset',
    description:
      'Content rendered inside the host. Use a wrapper for inputs and other elements that cannot display the decoration themselves.',
  },
  ref: {
    type: 'Ref<HTMLElement for the chosen tag>',
    defaultValue: 'Unset',
    description:
      'Forwarded to the rendered element alongside the internal registration ref. React 19 callback-ref cleanup is preserved.',
  },
  className: {
    type: 'string',
    defaultValue: 'Unset',
    description: 'Your classes, combined with the decoration classes.',
  },
  style: {
    type: 'CSSProperties',
    defaultValue: 'Unset',
    description:
      'Your inline styles, merged after the decoration bindings. Keep Edge-owned CSS variables intact unless deliberately overriding them.',
  },
} satisfies OptionDocs<Pick<SurfaceProps, 'as' | 'children' | 'ref' | 'className' | 'style'>>;

export const lightOptionRows = rows(lightOptions);
export const surfaceOptionRows = rows(surfaceOptions);
export const providerPropRows = [...lightOptionRows, ...rows(providerOwnProps)];
export const surfacePropRows = [...surfaceOptionRows, ...rows(surfaceOwnProps)];

function rows(options: Record<string, OptionDescription>): ApiRow[] {
  return Object.entries(options).map(([name, option]) => ({ name, ...option }));
}

/** Build native nodes eagerly so document search can read the same table text. */
export function apiTable(caption: string, options: readonly ApiRow[]): ReactNode {
  return (
    <TableContainer
      className={`table-scroll ${stylex.props(contentStyles.tableScroll).className}`}
      role="region"
      aria-label={`${caption} table`}
      tabIndex={0}
    >
      <Table className={`api-table ${stylex.props(contentStyles.apiTable).className}`}>
        <TableCaption
          xstyle={[contentStyles.tableCaption]}
          className={`visually-hidden ${stylex.props(contentStyles.visuallyHidden).className}`}
        >
          {caption}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead xstyle={[contentStyles.tableCell]} scope="col">
              Prop / option
            </TableHead>
            <TableHead xstyle={[contentStyles.tableCell]} scope="col">
              Type
            </TableHead>
            <TableHead xstyle={[contentStyles.tableCell]} scope="col">
              Default
            </TableHead>
            <TableHead xstyle={[contentStyles.tableCell]} scope="col">
              Description
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {options.map((option) => (
            <TableRow key={option.name}>
              <TableHead xstyle={[contentStyles.tableCell]} scope="row">
                <code {...stylex.props(contentStyles.inlineCode)}>{option.name}</code>
              </TableHead>
              <TableCell xstyle={[contentStyles.tableCell, contentStyles.tableData]}>
                <code {...stylex.props(contentStyles.inlineCode)}>{option.type}</code>
              </TableCell>
              <TableCell xstyle={[contentStyles.tableCell, contentStyles.tableData]}>
                <code {...stylex.props(contentStyles.inlineCode)}>{option.defaultValue}</code>
              </TableCell>
              <TableCell xstyle={[contentStyles.tableCell, contentStyles.tableData]}>
                {option.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
