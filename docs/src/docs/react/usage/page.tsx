import * as stylex from '@stylexjs/stylex';
import { contentStyles } from '../../_shared/content-styles.js';
import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import { CodeBlock } from '../../../shared/code/CodeBlock.js';
import { sharedLightExample } from './_ui/SharedLightExample.js';
import { ExamplePreview } from '../../_shared/ExamplePreview.js';
import type { DocPage } from '../../_shared/types.js';

export const reactIntegration: DocPage = {
  slug: 'react/usage',
  aliases: ['react'],
  section: 'React',
  title: 'Integration',
  description: 'Connect components to a shared light with Edge.Provider and Edge.Surface.',
  sections: [
    {
      id: 'share-one-light',
      title: 'Connect an area',
      content: (
        <>
          <span id="package-installation" />
          <span id="prepare-the-workspace" />
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            Complete <Link href="/docs/installation/">Installation</Link> first. In Server Component
            frameworks, use Edge from a client module marked with{' '}
            <code {...stylex.props(contentStyles.inlineCode)}>{'"use client"'}</code>.
          </P>
          <span id="create-your-first-surface" />
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            Wrap the area in <code {...stylex.props(contentStyles.inlineCode)}>Edge.Provider</code>{' '}
            and mark each responding element with{' '}
            <code {...stylex.props(contentStyles.inlineCode)}>Edge.Surface</code>. The two cards
            below share one light; nested providers create independent lights.
          </P>
          <ExamplePreview title={sharedLightExample.title} code={sharedLightExample.code}>
            <sharedLightExample.Component />
          </ExamplePreview>
        </>
      ),
    },
    {
      id: 'keep-your-styles',
      title: 'Keep your styles and events',
      content: (
        <>
          <span id="load-the-stylesheet" />
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            Use <code {...stylex.props(contentStyles.inlineCode)}>as</code> to choose the HTML
            element. Native attributes, events and refs follow that element. Optional{' '}
            <code {...stylex.props(contentStyles.inlineCode)}>className</code> and{' '}
            <code {...stylex.props(contentStyles.inlineCode)}>style</code> props apply your styles.
            The provider adds no DOM; each surface renders one element.
          </P>
          <CodeBlock
            label="Style composition"
            code={
              '<Edge.Surface as="button" type="button" onClick={handleExampleClick}>\n  Example button\n</Edge.Surface>'
            }
          />
          <span id="wrap-inputs-you-own" />
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            Inputs need a wrapper. If an existing decoration conflicts, see{' '}
            <Link href="/docs/integration/">Integration</Link>. Choose appearance and movement in{' '}
            <Link href="/docs/styles/">Style</Link> and <Link href="/docs/motion/">Motion</Link>.
          </P>
        </>
      ),
    },
    {
      id: 'connect-existing-components',
      title: 'Connect an existing component',
      content: (
        <>
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            If a Card or Button already renders its own HTML element, call{' '}
            <Link href="/docs/react/api/#use-surface">useSurface(options)</Link> inside it and
            attach the returned ref to that element. Keep the component inside Edge.Provider. React
            18 function components must forward the ref with{' '}
            <code {...stylex.props(contentStyles.inlineCode)}>forwardRef</code>.
          </P>
          <span id="refresh-after-layout-changes" />
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            For position changes, see{' '}
            <Link href="/docs/integration/#refresh-after-layout-changes">layout updates</Link>.
          </P>
        </>
      ),
    },
  ],
};
