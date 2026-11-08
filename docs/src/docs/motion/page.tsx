import { inlineMessage } from '../_shared/inline-message.js';
import { localePath } from '../../shared/locale.js';
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
import { contentStyles } from '../_shared/content-styles.js';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import { ExamplePreview } from '../_shared/ExamplePreview.js';
import { motionExample } from './_ui/MotionExample.js';
import type { DocPage } from '../_shared/types.js';

export const motion: DocPage = {
  slug: 'motion',
  section: 'Styles',
  get title() {
    return m.motion();
  },
  get description() {
    return m.choose_whether_a_shared_light_follows_the();
  },
  sections: [
    {
      id: 'compare-motion',
      get title() {
        return m.choose_motion_behavior();
      },
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.try_each_mode_below_the_selection_updates()}
            </P>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.pointer_settings_hint()}
            </P>
            <ExamplePreview title={motionExample.title} code={motionExample.code}>
              <motionExample.Component />
            </ExamplePreview>
          </>
        );
      },
    },
    {
      id: 'options',
      get title() {
        return m.motion_values();
      },
      get content() {
        return (
          <>
            <TableContainer
              className={`table-scroll ${stylex.props(contentStyles.tableScroll).className}`}
              role="region"
              aria-label={m.motion_values_table()}
              tabIndex={0}
            >
              <Table className={`api-table ${stylex.props(contentStyles.apiTable).className}`}>
                <TableCaption
                  xstyle={[contentStyles.tableCaption]}
                  className={`visually-hidden ${stylex.props(contentStyles.visuallyHidden).className}`}
                >
                  {m.motion_values()}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead xstyle={[contentStyles.tableCell]} scope="col">
                      {m.value()}
                    </TableHead>
                    <TableHead xstyle={[contentStyles.tableCell]} scope="col">
                      {m.behavior()}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableHead xstyle={[contentStyles.tableCell]} scope="row">
                      <code {...stylex.props(contentStyles.inlineCode)}>{'system'}</code>
                    </TableHead>
                    <TableCell xstyle={[contentStyles.tableCell, contentStyles.tableData]}>
                      {m.respects_reduced_motion_and_input_preferences_library()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead xstyle={[contentStyles.tableCell]} scope="row">
                      <code {...stylex.props(contentStyles.inlineCode)}>{'dynamic'}</code>
                    </TableHead>
                    <TableCell xstyle={[contentStyles.tableCell, contentStyles.tableData]}>
                      {m.follows_mouse_or_pen_input_including_with()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead xstyle={[contentStyles.tableCell]} scope="row">
                      <code {...stylex.props(contentStyles.inlineCode)}>{'static'}</code>
                    </TableHead>
                    <TableCell xstyle={[contentStyles.tableCell, contentStyles.tableData]}>
                      {m.keeps_a_fixed_direction_ignores_pointer_movement()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {inlineMessage(m.motion_options_link(), {
                part0: (
                  <Link href={localePath('/docs/react/api/#lighting')}>{m.api_reference()}</Link>
                ),
              })}
            </P>
          </>
        );
      },
    },
    {
      id: 'system',
      get title() {
        return m.system();
      },
      get content() {
        return (
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            {m.without_a_precise_hover_device_lighting_starts()}
          </P>
        );
      },
    },
    {
      id: 'dynamic',
      get title() {
        return m.dynamic();
      },
      get content() {
        return (
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            {m.offer_this_mode_as_an_explicit_choice()}
          </P>
        );
      },
    },
    {
      id: 'static',
      get title() {
        return m.label_static();
      },
      get content() {
        return (
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            {inlineMessage(m.static_direction_options(), {
              part0: <code {...stylex.props(contentStyles.inlineCode)}>{'staticDirection'}</code>,
              part1: <code {...stylex.props(contentStyles.inlineCode)}>{'"random"'}</code>,
            })}
          </P>
        );
      },
    },
    {
      id: 'accessibility',
      get title() {
        return m.respect_user_preferences();
      },
      get content() {
        return (
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            {inlineMessage(m.motion_accessibility_link(), {
              part0: <Link href={localePath('/docs/accessibility/')}>{m.accessibility()}</Link>,
            })}
          </P>
        );
      },
    },
  ],
};
