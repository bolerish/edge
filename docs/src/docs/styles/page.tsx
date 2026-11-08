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
  title: 'Style',
  description: 'Choose how a surface responds to light without changing its base styles.',
  sections: [
    {
      id: 'compare-styles',
      title: 'Compare the edge response',
      content: (
        <>
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            Choose a style and move your pointer around the card. The selection also updates this
            site’s cards, code blocks and navigation surfaces.
          </P>
          <ExamplePreview title={edgeStylesExample.title} code={edgeStylesExample.code}>
            <edgeStylesExample.Component />
          </ExamplePreview>
        </>
      ),
    },
    {
      id: 'options',
      title: 'Style values',
      content: (
        <>
          <TableContainer
            className={`table-scroll ${stylex.props(contentStyles.tableScroll).className}`}
            role="region"
            aria-label="Style values table"
            tabIndex={0}
          >
            <Table className={`api-table ${stylex.props(contentStyles.apiTable).className}`}>
              <TableCaption
                xstyle={[contentStyles.tableCaption]}
                className={`visually-hidden ${stylex.props(contentStyles.visuallyHidden).className}`}
              >
                Style values
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead xstyle={[contentStyles.tableCell]} scope="col">
                    Value
                  </TableHead>
                  <TableHead xstyle={[contentStyles.tableCell]} scope="col">
                    Behavior
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableHead xstyle={[contentStyles.tableCell]} scope="row">
                    <code {...stylex.props(contentStyles.inlineCode)}>raised</code>
                  </TableHead>
                  <TableCell xstyle={[contentStyles.tableCell, contentStyles.tableData]}>
                    Highlights the edge facing the light. Default.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead xstyle={[contentStyles.tableCell]} scope="row">
                    <code {...stylex.props(contentStyles.inlineCode)}>recessed</code>
                  </TableHead>
                  <TableCell xstyle={[contentStyles.tableCell, contentStyles.tableData]}>
                    Reverses the direction for an inset appearance.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead xstyle={[contentStyles.tableCell]} scope="row">
                    <code {...stylex.props(contentStyles.inlineCode)}>matte</code>
                  </TableHead>
                  <TableCell xstyle={[contentStyles.tableCell, contentStyles.tableData]}>
                    Softens the edge response.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            For additional settings, see the{' '}
            <Link href="/docs/react/api/#lighting-surface">API reference</Link>.
          </P>
        </>
      ),
    },
    {
      id: 'raised',
      title: 'Raised',
      content: (
        <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
          Use <code {...stylex.props(contentStyles.inlineCode)}>edgeStyle: 'raised'</code> for an
          outward-facing edge highlight.
        </P>
      ),
    },
    {
      id: 'recessed',
      title: 'Recessed',
      content: (
        <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
          Use <code {...stylex.props(contentStyles.inlineCode)}>edgeStyle: 'recessed'</code> for
          inset elements such as input wrappers.
        </P>
      ),
    },
    {
      id: 'matte',
      title: 'Matte',
      content: (
        <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
          Use <code {...stylex.props(contentStyles.inlineCode)}>edgeStyle: 'matte'</code> for a
          softer, quieter border.
        </P>
      ),
    },
    {
      id: 'customize-the-highlight',
      title: 'Customize the highlight',
      content: (
        <>
          <span id="apply-the-edge-theme" />
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            Each surface uses its own text color, even when nested, and follows its host border
            radius. Set <code {...stylex.props(contentStyles.inlineCode)}>color</code> to override
            the highlight, or <code {...stylex.props(contentStyles.inlineCode)}>intensity</code> to
            multiply the shared light strength. Use{' '}
            <code {...stylex.props(contentStyles.inlineCode)}>shadowColor="transparent"</code> to
            remove the opposite-edge shadow.
            <code {...stylex.props(contentStyles.inlineCode)}> borderWidth</code> changes the
            decoration thickness in pixels, not the host border. Pass options to{' '}
            <Link href="/docs/react/api/#lighting-surface">Edge.Surface</Link>; no CSS variable
            declarations are needed.
          </P>
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            The effect approximates a direction on axis-aligned rectangles, not a physical point
            light. Near the center, directional intensity fades over a region proportional to the
            surface size.
          </P>
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            For existing decorations and input wrappers, see{' '}
            <Link href="/docs/integration/">Integration</Link>.
          </P>
        </>
      ),
    },
  ],
};
