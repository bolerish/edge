import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import { CodeBlock } from '../../ui/CodeBlock.js';
import { hookSurface } from './examples.js';
import { sharedLightExample } from '../../examples/examples.js';
import { ExamplePreview } from '../../ui/ExamplePreview.js';
import type { DocPage } from '../types.js';

export const usage: DocPage = {
  slug: 'react/usage',
  aliases: ['usage', 'react', 'installation'],
  section: 'React',
  title: 'Usage',
  description: 'Choose an area with Lighting, then mark the elements that should respond with Lighting.Surface. Keep your own styles and interactions.',
  sections: [
    {
      id: 'share-one-light', title: 'Connect an area', content: <>
        <span id="package-installation" /><span id="prepare-the-workspace" />
        <P>Install Edge and load its CSS from <Link href="/docs/">Getting started</Link>. React 19 is required. In frameworks with Server Components, place interactive lighting components and hooks inside a client boundary.</P>
        <span id="create-your-first-surface" />
        <P>Wrap the part of your interface you want to connect in <code>Lighting</code>. Add <code>Lighting.Surface</code> only to the elements that should respond. Other elements keep their appearance. A nested Lighting creates an independent scope.</P>
        <ExamplePreview title={sharedLightExample.title} code={sharedLightExample.code}>
          <sharedLightExample.Component />
        </ExamplePreview>
        <P>Use the hooks below when an existing component already owns its host.</P>
      </>,
    },
    {
      id: 'keep-your-styles', title: 'Keep your styles and events', content: <>
        <span id="load-the-stylesheet" />
        <P>Use <code>as</code> to choose the HTML element, and pass your className, style, events and ref to that element. Lighting adds no wrapper; each Surface renders one host.</P>
        <CodeBlock label="Style composition" code={'<Lighting.Surface as="button" className="button" onClick={saveProject}>\n  Save project\n</Lighting.Surface>'} />
        <span id="wrap-inputs-you-own" />
        <P>Inputs need a wrapper. If an existing decoration conflicts, see <Link href="/docs/integration/">Integration</Link>. Choose appearance and movement in <Link href="/docs/styles/">Style</Link> and <Link href="/docs/motion/">Motion</Link>.</P>
      </>,
    },
    {
      id: 'connect-existing-components', title: 'Connect an existing component', content: <>
        <P>Use <code>useLight</code> and <code>useSurface</code> for components that forward ref, className and style to their DOM host. Create the light in a common parent to connect several components, then pass it to each surface hook. Compose the returned bindings with your existing ones.</P>
        <CodeBlock label="Connect an existing host" code={hookSurface} />
        <span id="refresh-after-layout-changes" />
        <P>For position changes or decoration conflicts, see the common <Link href="/docs/integration/">Integration guide</Link>. Lifecycle and handle details are in the <Link href="/docs/react/api/">API reference</Link>.</P>
      </>,
    },
  ],
};
