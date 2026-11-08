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
  title: 'Motion',
  description: 'Choose whether a shared light follows the pointer or keeps a fixed direction.',
  sections: [
    {
      id: 'compare-motion',
      title: 'Choose motion behavior',
      content: (
        <>
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            Try each mode below. The selection updates the shared light across this site, including
            the example card.
          </P>
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            Gather faces highlights toward the pointer; Spread reverses them. Range is the fade
            distance outside each surface in CSS pixels. Fixed lighting ignores these settings.
          </P>
          <ExamplePreview title={motionExample.title} code={motionExample.code}>
            <motionExample.Component />
          </ExamplePreview>
        </>
      ),
    },
    {
      id: 'options',
      title: 'Motion values',
      content: (
        <>
          <TableContainer
            className={`table-scroll ${stylex.props(contentStyles.tableScroll).className}`}
            role="region"
            aria-label="Motion values table"
            tabIndex={0}
          >
            <Table className={`api-table ${stylex.props(contentStyles.apiTable).className}`}>
              <TableCaption
                xstyle={[contentStyles.tableCaption]}
                className={`visually-hidden ${stylex.props(contentStyles.visuallyHidden).className}`}
              >
                Motion values
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
                    <code {...stylex.props(contentStyles.inlineCode)}>system</code>
                  </TableHead>
                  <TableCell xstyle={[contentStyles.tableCell, contentStyles.tableData]}>
                    Respects reduced motion and input preferences. Library default.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead xstyle={[contentStyles.tableCell]} scope="row">
                    <code {...stylex.props(contentStyles.inlineCode)}>dynamic</code>
                  </TableHead>
                  <TableCell xstyle={[contentStyles.tableCell, contentStyles.tableData]}>
                    Follows mouse or pen input, including with reduced motion enabled.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead xstyle={[contentStyles.tableCell]} scope="row">
                    <code {...stylex.props(contentStyles.inlineCode)}>static</code>
                  </TableHead>
                  <TableCell xstyle={[contentStyles.tableCell, contentStyles.tableData]}>
                    Keeps a fixed direction; ignores pointer movement.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            For additional settings, see the{' '}
            <Link href="/docs/react/api/#lighting">API reference</Link>.
          </P>
        </>
      ),
    },
    {
      id: 'system',
      title: 'System',
      content: (
        <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
          Without a precise hover device, lighting starts fixed. Mouse or pen input can enable
          tracking when reduced motion is off. Touch movement never drives the light.
        </P>
      ),
    },
    {
      id: 'dynamic',
      title: 'Dynamic',
      content: (
        <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
          Offer this mode as an explicit choice because it overrides reduced motion. The effect
          stays hidden until mouse or pen input arrives.
        </P>
      ),
    },
    {
      id: 'static',
      title: 'Static',
      content: (
        <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
          Set <code {...stylex.props(contentStyles.inlineCode)}>staticDirection</code> to any finite
          angle in degrees or <code {...stylex.props(contentStyles.inlineCode)}>"random"</code>. The
          demo offers 0°, 90°, 180°, 270° and 315°. Random chooses one shared direction per mount;
          rerenders and appearance changes preserve it. Remount to choose a new direction.
        </P>
      ),
    },
    {
      id: 'accessibility',
      title: 'Respect user preferences',
      content: (
        <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
          Keep focus, selection and validation visible independently of lighting. See{' '}
          <Link href="/docs/accessibility/">Accessibility</Link> for input and forced-colors
          behavior.
        </P>
      ),
    },
  ],
};
