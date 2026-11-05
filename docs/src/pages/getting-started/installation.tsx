import { InstallCommands } from '../../ui/InstallCommands.js';
import { CodeBlock } from '../../ui/CodeBlock.js';
import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import type { DocPage } from '../types.js';

export const installation: DocPage = {
  slug: 'installation',
  section: 'Getting started',
  title: 'Installation',
  description: 'Install Edge with your package manager or AI assistant, then load the stylesheet once.',
  sections: [
    {
      id: 'installation',
      title: 'Installation',
      content: <>
        <P>Add Edge to your existing project with your package manager. The commands below target the React adapter; it requires React 19. Other framework adapters are not available yet.</P>
        <InstallCommands />
        <P>The package is not yet on the public npm registry. These are the consumer installation commands for its release; repository development setup is documented in CONTRIBUTING.md.</P>

      </>,
    },
    {
      id: 'stylesheet',
      title: 'Load the stylesheet',
      content: <>
        <P>Load the styles once, before your application and utility styles so their positioning rules can override Edge’s defaults. A separate reset can load first. Choose either your application entry or a global CSS file.</P>
        <CodeBlock label="Application entry" code={"import '@bolerish/edge/style.css';"} />
        <CodeBlock label="Global CSS alternative" language="css" code={'@import "@bolerish/edge/style.css";'} />
        <P>The CSS alternative requires a build tool that resolves package imports. Edge ships plain CSS; no styling compiler or style-injection provider is needed.</P>
      </>,
    },
    {
      id: 'next-steps', title: 'Start using Edge',
      content: <P>Continue to <Link href="/docs/react/usage/">React Usage</Link> to connect your components.</P>,
    },
  ],
};
