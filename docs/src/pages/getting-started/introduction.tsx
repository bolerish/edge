import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import type { DocPage } from '../types.js';

export const introduction: DocPage = {
  slug: '',
  aliases: ['getting-started', 'introduction'],
  section: 'Getting started',
  title: 'Introduction',
  description: 'Subtle highlights for your UI, with your existing colors, layout and interactions.',
  sections: [
    {
      id: 'one-shared-light',
      title: 'A little more alive.',
      content: <>
        <P>Group elements under one shared light and choose which surfaces respond. Give an area its own light when it should react independently.</P>
      </>,
    },
    {
      id: 'choose-your-framework',
      title: 'Start using Edge',
      content: <P><span id="installation" /><span id="stylesheet" />Start with <Link href="/docs/installation/">Installation</Link>, learn the concepts in <Link href="/docs/usage/">Usage</Link>, then follow <Link href="/docs/react/usage/">React Integration</Link>. Find settings in the <Link href="/docs/react/api/">API reference</Link>.</P>,
    },
  ],
};
