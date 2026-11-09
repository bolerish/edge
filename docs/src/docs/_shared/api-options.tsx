import { m } from '../../paraglide/messages.js';
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
import type {
  LightOptions,
  EdgeProviderProps,
  SurfaceOptions,
  SurfaceProps,
  StylesProps,
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
    get description() {
      return m.system_respects_reduced_motion_and_device_preferences();
    },
  },
  staticDirection: {
    type: "number | 'random'",
    defaultValue: '315',
    get description() {
      return m.direction_in_degrees_for_fixed_lighting_random();
    },
  },
  direction: {
    type: "'gather' | 'spread'",
    defaultValue: "'gather'",
    get description() {
      return m.direction_description();
    },
  },
  radius: {
    type: 'number',
    defaultValue: '480',
    get description() {
      return m.distance_over_which_dynamic_lighting_fades_outside();
    },
  },
  intensity: {
    type: 'number',
    defaultValue: '0.75',
    get description() {
      return m.shared_light_strength_must_be_finite_and();
    },
  },
} satisfies OptionDocs<LightOptions>;

const surfaceOptions = {
  pseudoElement: {
    type: "'after' | 'before'",
    defaultValue: "'after'",
    get description() {
      return m.decoration_slot_choose_before_to_preserve_an();
    },
  },
  edgeStyle: {
    type: "'raised' | 'recessed' | 'matte'",
    defaultValue: "'raised'",
    get description() {
      return m.how_the_edge_responds_to_light_all();
    },
  },
  color: {
    type: 'string',
    defaultValue: 'currentColor',
    get description() {
      return m.highlight_color_follows_the_host_text_color();
    },
  },
  shadowColor: {
    type: 'string',
    defaultValue: '#0008',
    get description() {
      return m.color_on_the_opposite_edge_accepts_any();
    },
  },
  borderWidth: {
    type: 'number',
    defaultValue: '1',
    get description() {
      return m.decorative_edge_thickness_in_pixels_it_does();
    },
  },
  intensity: {
    type: 'number',
    defaultValue: '1',
    get description() {
      return m.multiplier_for_the_shared_light_strength_finite();
    },
  },
} satisfies OptionDocs<SurfaceOptions>;

const providerOwnProps = {
  children: {
    type: 'ReactNode',
    defaultValue: 'Required',
    get description() {
      return m.the_area_that_shares_this_light_ordinary();
    },
  },
  ref: {
    type: 'Ref<Light>',
    defaultValue: 'Unset',
    get description() {
      return m.optional_stable_light_handle_call_its_refresh();
    },
  },
} satisfies OptionDocs<Omit<EdgeProviderProps, keyof LightOptions>>;

const surfaceOwnProps = {
  as: {
    type: 'HTML tag name',
    defaultValue: "'div'",
    get description() {
      return m.the_html_element_to_render_native_attributes();
    },
  },
  children: {
    type: 'ReactNode',
    defaultValue: 'Unset',
    get description() {
      return m.content_rendered_inside_the_host_use_a();
    },
  },
  ref: {
    type: 'Ref<HTMLElement for the chosen tag>',
    defaultValue: 'Unset',
    get description() {
      return m.forwarded_to_the_rendered_element_alongside_the();
    },
  },
  className: {
    type: 'string',
    defaultValue: 'Unset',
    get description() {
      return m.your_classes_combined_with_the_decoration_classes();
    },
  },
  style: {
    type: 'CSSProperties',
    defaultValue: 'Unset',
    get description() {
      return m.your_inline_styles_merged_after_the_decoration();
    },
  },
} satisfies OptionDocs<Pick<SurfaceProps, 'as' | 'children' | 'ref' | 'className' | 'style'>>;

export const stylesPropRows = rows({
  nonce: {
    type: 'string',
    defaultValue: 'undefined',
    get description() {
      return m.styles_nonce_description();
    },
  },
} satisfies OptionDocs<StylesProps>);

export const lightOptionRows = rows(lightOptions);
export const surfaceOptionRows = rows(surfaceOptions);
export const providerPropRows = [...lightOptionRows, ...rows(providerOwnProps)];
export const surfacePropRows = [...surfaceOptionRows, ...rows(surfaceOwnProps)];

function rows(options: Record<string, OptionDescription>): ApiRow[] {
  return Object.entries(options).map(([name, option]) => ({
    name,
    type: option.type,
    defaultValue: option.defaultValue,
    get description() {
      return option.description;
    },
  }));
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
              {m.prop_option()}
            </TableHead>
            <TableHead xstyle={[contentStyles.tableCell]} scope="col">
              {m.type()}
            </TableHead>
            <TableHead xstyle={[contentStyles.tableCell]} scope="col">
              {m.label_default()}
            </TableHead>
            <TableHead xstyle={[contentStyles.tableCell]} scope="col">
              {m.description()}
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
