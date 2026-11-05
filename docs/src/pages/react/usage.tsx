import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import { CodeBlock } from '../../ui/CodeBlock.js';
import { sharedLightExample } from '../../examples/examples.js';
import { ExamplePreview } from '../../ui/ExamplePreview.js';
import type { DocPage } from '../types.js';

export const reactIntegration: DocPage = {
  slug: 'react/usage',
  aliases: ['react'],
  section: 'React',
  title: 'Integration',
  description: 'Choose an area with Lighting, then mark the elements that should respond with Lighting.Surface. Use the React adapter with your own styles and interactions.',
  sections: [
    {
      id: 'share-one-light', title: 'Connect an area', content: <>
        <span id="package-installation" /><span id="prepare-the-workspace" />
        <P>Install Edge and load its CSS from <Link href="/docs/installation/">Installation</Link>. React 19 is required. In frameworks with Server Components, place interactive lighting components and hooks inside a client boundary.</P>
        <span id="create-your-first-surface" />
        <P>Connect the area you chose in <Link href="/docs/usage/">Usage</Link> with <code>Lighting</code>. Add <code>Lighting.Surface</code> only to the elements that should respond. Other elements keep their appearance. A nested Lighting creates an independent scope.</P>
        <ExamplePreview title={sharedLightExample.title} code={sharedLightExample.code}>
          <sharedLightExample.Component />
        </ExamplePreview>
      </>,
    },
    {
      id: 'keep-your-styles', title: 'Keep your styles and events', content: <>
        <span id="load-the-stylesheet" />
        <P>Use <code>as</code> to choose the HTML element, and pass events and refs to that element. The className and style props are optional: use them to apply your existing styles, not to enable Edge. Lighting adds no wrapper; each Surface renders one host.</P>
        <CodeBlock label="Style composition" code={'<Lighting.Surface as="button" type="button" onClick={handleExampleClick}>\n  Example button\n</Lighting.Surface>'} />
        <span id="wrap-inputs-you-own" />
        <P>Inputs need a wrapper. If an existing decoration conflicts, see <Link href="/docs/integration/">Integration</Link>. Choose appearance and movement in <Link href="/docs/styles/">Style</Link> and <Link href="/docs/motion/">Motion</Link>.</P>
      </>,
    },
    {
      id: 'connect-existing-components', title: 'Connect an existing component', content: <>
        <P>The component API above is the default way to use Edge. If a Card or Button already owns its DOM element, use the <Link href="/docs/react/api/#use-surface">ref-based integration in the API reference</Link>. Create one light in the common parent and connect each existing component to that light.</P>
        <span id="refresh-after-layout-changes" />
        <P>For layout changes or decoration conflicts, see <Link href="/docs/integration/">Integration</Link>.</P>
      </>,
    },
  ],
};
