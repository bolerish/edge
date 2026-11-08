import * as stylex from '@stylexjs/stylex';
import { contentStyles } from '../_shared/content-styles.js';
import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import type { DocPage } from '../_shared/types.js';

export const usage: DocPage = {
  slug: 'usage',
  section: 'Getting started',
  title: 'Usage',
  description: 'Understand lights and surfaces before connecting your components.',
  sections: [
    {
      id: 'share-one-light',
      title: 'Choose an area',
      content: (
        <>
          <span id="package-installation" />
          <span id="prepare-the-workspace" />
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            A light controls a group of surfaces that respond together. Choose a section or a few
            elements to share one light.
          </P>
          <span id="create-your-first-surface" />
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            A surface is an element connected to that light. Only connected surfaces respond. Use a
            separate light for an independent area.
          </P>
        </>
      ),
    },
    {
      id: 'keep-your-styles',
      title: 'Keep your UI',
      content: (
        <>
          <span id="load-the-stylesheet" />
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            Edge keeps your background, text, spacing and base border. Its highlight uses each
            surface’s own text color and border radius by default. Keep existing interactions and
            keyboard focus indicators.
          </P>
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            Choose the surface response in <Link href="/docs/styles/">Style</Link> and how the light
            moves in <Link href="/docs/motion/">Motion</Link>.
          </P>
          <span id="wrap-inputs-you-own" />
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            For input wrappers and decoration conflicts, see{' '}
            <Link href="/docs/integration/#wrap-inputs-you-own">Integration</Link>.
          </P>
          <span id="refresh-after-layout-changes" />
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            For application-controlled position changes, see{' '}
            <Link href="/docs/integration/#refresh-after-layout-changes">layout changes</Link>.
          </P>
        </>
      ),
    },
    {
      id: 'connect-existing-components',
      title: 'Connect your components',
      content: (
        <>
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            Follow <Link href="/docs/react/usage/">React Integration</Link> to connect new or
            existing components. React is the currently available adapter.
          </P>
        </>
      ),
    },
  ],
};
