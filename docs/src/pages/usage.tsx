import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import type { DocPage } from './types.js';

export const usage: DocPage = {
  slug: 'usage',
  title: 'Usage',
  description: 'Choose which elements share a light while keeping your existing UI.',
  sections: [
    {
      id: 'share-one-light', title: 'Choose an area', content: <>
        <span id="package-installation" /><span id="prepare-the-workspace" />
        <P>Start with <Link href="/docs/installation/">Installation</Link>, then choose an area whose elements should respond together. A light can connect a whole section or just a few elements.</P>
        <span id="create-your-first-surface" />
        <P>Select the surfaces inside that area that should respond. Other elements keep their appearance. Give an area its own light when it should respond independently.</P>
      </>,
    },
    {
      id: 'keep-your-styles', title: 'Keep your UI', content: <>
        <span id="load-the-stylesheet" />
        <P>Keep your component’s background, text, spacing and base border. Edge adds a decorative highlight that uses each surface’s own text color and border radius by default. Preserve your existing interactions and keyboard focus indicators.</P>
        <P>Choose the surface response in <Link href="/docs/styles/">Style</Link> and how the light moves in <Link href="/docs/motion/">Motion</Link>.</P>
        <span id="wrap-inputs-you-own" />
        <P>For input wrappers and existing decorations, see <Link href="/docs/integration/#wrap-inputs-you-own">Integration</Link>.</P>
        <span id="refresh-after-layout-changes" />
        <P>For application-controlled position changes, see <Link href="/docs/integration/#refresh-after-layout-changes">layout changes</Link>.</P>
      </>,
    },
    {
      id: 'connect-existing-components', title: 'Connect your components', content: <>
        <P>Follow <Link href="/docs/react/usage/">React Integration</Link> for the component example and existing-host connections. React is the currently available adapter; dedicated Vue, Svelte and Solid adapters are not available yet.</P>
      </>,
    },
  ],
};
