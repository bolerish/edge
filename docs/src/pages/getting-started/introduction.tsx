import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import type { DocPage } from '../types.js';

export const introduction: DocPage = {
  slug: '',
  aliases: ['getting-started', 'introduction'],
  section: 'Getting started',
  title: 'Introduction',
  description: 'Give your UI a subtle response to the pointer. Connect the elements you choose while keeping your own markup, colors and interactions.',
  sections: [
    {
      id: 'one-shared-light',
      title: 'A little more alive.',
      content: <>
        <P>Add a subtle highlight that responds as the pointer moves around your UI. Choose an area that shares a light, then select the elements that should respond. Your components keep their markup, colors and interactions.</P>
        <P>Use one light across a section, or give a smaller area an independent light. Install the package and load its stylesheet once, then follow Usage to choose which elements should respond.</P>
      </>,
    },
    {
      id: 'choose-your-framework',
      title: 'Start using Edge',
      content: <P><span id="installation" /><span id="stylesheet" />Follow <Link href="/docs/installation/">Installation</Link> to add the package and load its CSS. Continue to <Link href="/docs/usage/">Usage</Link> for shared-light concepts, follow <Link href="/docs/react/usage/">React Integration</Link> for code, or look up options in the <Link href="/docs/react/api/">React API reference</Link>.</P>,
    },
  ],
};
