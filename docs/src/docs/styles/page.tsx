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
import { edgeStylesExample } from './_ui/EdgeStylesExample.js';
import type { DocPage } from '../_shared/types.js';
export const styles: DocPage = {
  slug: 'styles',
  aliases: ['materials', 'react/materials'],
  section: 'Styles',
  get title() {
    return m.style();
  },
  get description() {
    return m.choose_how_a_surface_responds_to_light();
  },
  sections: [
    {
      id: 'compare-styles',
      get title() {
        return m.compare_the_edge_response();
      },
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.choose_a_style_and_move_your_pointer()}
            </P>
            <ExamplePreview title={edgeStylesExample.title} code={edgeStylesExample.code}>
              <edgeStylesExample.Component />
            </ExamplePreview>
          </>
        );
      },
    },
    {
      id: 'options',
      get title() {
        return m.style_values();
      },
      get content() {
        return (
          <>
            <TableContainer
              className={`table-scroll ${stylex.props(contentStyles.tableScroll).className}`}
              role="region"
              aria-label={m.style_values_table()}
              tabIndex={0}
            >
              <Table className={`api-table ${stylex.props(contentStyles.apiTable).className}`}>
                <TableCaption
                  xstyle={[contentStyles.tableCaption]}
                  className={`visually-hidden ${stylex.props(contentStyles.visuallyHidden).className}`}
                >
                  {m.style_values()}
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
                      <code {...stylex.props(contentStyles.inlineCode)}>{'raised'}</code>
                    </TableHead>
                    <TableCell xstyle={[contentStyles.tableCell, contentStyles.tableData]}>
                      {m.highlights_the_edge_facing_the_light_default()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead xstyle={[contentStyles.tableCell]} scope="row">
                      <code {...stylex.props(contentStyles.inlineCode)}>{'recessed'}</code>
                    </TableHead>
                    <TableCell xstyle={[contentStyles.tableCell, contentStyles.tableData]}>
                      {m.reverses_the_direction_for_an_inset_appearance()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead xstyle={[contentStyles.tableCell]} scope="row">
                      <code {...stylex.props(contentStyles.inlineCode)}>{'matte'}</code>
                    </TableHead>
                    <TableCell xstyle={[contentStyles.tableCell, contentStyles.tableData]}>
                      {m.softens_the_edge_response()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {inlineMessage(m.additional_options_link(), {
                part0: (
                  <Link href={localePath('/docs/react/surface/#lighting-surface')}>
                    {m.api_reference()}
                  </Link>
                ),
              })}
            </P>
          </>
        );
      },
    },
    {
      id: 'raised',
      get title() {
        return m.raised();
      },
      get content() {
        return (
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            {inlineMessage(m.raised_style_usage(), {
              part0: (
                <code {...stylex.props(contentStyles.inlineCode)}>{"edgeStyle: 'raised'"}</code>
              ),
            })}
          </P>
        );
      },
    },
    {
      id: 'recessed',
      get title() {
        return m.recessed();
      },
      get content() {
        return (
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            {inlineMessage(m.recessed_style_usage(), {
              part0: (
                <code {...stylex.props(contentStyles.inlineCode)}>{"edgeStyle: 'recessed'"}</code>
              ),
            })}
          </P>
        );
      },
    },
    {
      id: 'matte',
      get title() {
        return m.matte();
      },
      get content() {
        return (
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            {inlineMessage(m.matte_style_usage(), {
              part0: (
                <code {...stylex.props(contentStyles.inlineCode)}>{"edgeStyle: 'matte'"}</code>
              ),
            })}
          </P>
        );
      },
    },
    {
      id: 'customize-the-highlight',
      get title() {
        return m.customize_the_highlight();
      },
      get content() {
        return (
          <>
            <span id="apply-the-edge-theme" />
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {inlineMessage(m.customize_surface_options(), {
                part0: <code {...stylex.props(contentStyles.inlineCode)}>{'color'}</code>,
                part1: <code {...stylex.props(contentStyles.inlineCode)}>{'intensity'}</code>,
                part2: (
                  <code {...stylex.props(contentStyles.inlineCode)}>
                    {'shadowColor="transparent"'}
                  </code>
                ),
                part3: <code {...stylex.props(contentStyles.inlineCode)}>{'borderWidth'}</code>,
                part4: (
                  <Link href={localePath('/docs/react/surface/#lighting-surface')}>
                    {'Edge.Surface'}
                  </Link>
                ),
              })}
            </P>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.the_effect_approximates_a_direction_on_axis()}
            </P>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {inlineMessage(m.existing_decoration_link(), {
                part0: <Link href={localePath('/docs/integration/')}>{m.integration()}</Link>,
              })}
            </P>
          </>
        );
      },
    },
  ],
};
