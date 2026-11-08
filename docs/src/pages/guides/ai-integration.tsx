import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import { CodeBlock } from '../../shared/code/CodeBlock.js';
import type { DocPage } from '../types.js';

export const aiIntegration: DocPage = {
  slug: 'ai-integration',
  section: 'Guides',
  title: 'AI Integration',
  description: 'Give your assistant current Edge documentation before it changes your UI.',
  sections: [
    {
      id: 'llms-txt', title: 'Read the documentation', content: <>
        <P>Start with <Link href="/llms.txt">llms.txt</Link> for a short index linking to Markdown versions of each guide and API reference.
          Use <Link href="/llms-full.txt">llms-full.txt</Link> when your assistant needs all the documentation in one file.</P>
        <P>These files are generated from the same content as this site and identify the package version they describe.
          Publishing them does not guarantee that an assistant reads them automatically; include the URL in your request.</P>
      </>,
    },
    {
      id: 'prompt', title: 'Give your assistant context', content: <>
        <P>Include your existing component and the area that should respond. For example:</P>
        <CodeBlock label="Assistant prompt" language="text" code={`Read https://edge.bolerish.com/llms.txt and follow the relevant Markdown links.
Check the installed @bolerish/edge version and its types before choosing APIs.
Add Edge to the component below, preserving its markup, colors and interactions.
Connect only the surfaces I specify. Keep native controls and focus indicators.
Use the library's default motion="system" unless I ask for another mode.`} />
      </>,
    },
    {
      id: 'installed-version', title: 'Match the installed version', content:
        <P>Check your package manifest or lockfile. Web documentation may describe a newer release;
          if versions differ, use the installed package’s declarations and matching documentation.
          Do not upgrade dependencies just to match an example.</P>,
    },
  ],
};
