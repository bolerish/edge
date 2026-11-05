import { Link } from '@bolerish/ui/link';
import { InstallCommands } from '../ui/InstallCommands.js';
import { CodeBlock } from '../ui/CodeBlock.js';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import type { DocPage } from './types.js';

export const gettingStarted: DocPage = {
  slug: '',
  aliases: ['getting-started'],
  title: 'Getting started',
  description:
    'Give your UI a subtle response to the pointer. Connect the elements you choose while keeping your own markup, colors and interactions.',
  sections: [
    {
      id: 'one-shared-light',
      title: 'A little more alive.',
      content: <>
        <P>Add a subtle highlight that responds as the pointer moves around your UI. Choose an area that shares a light, then select the elements that should respond. Your components keep their markup, colors and interactions.</P>
        <P>Use one light across a section, or give a smaller area an independent light. Install the package and load its stylesheet once, then continue to the React usage guide.</P>
      </>,
    },
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
        <P>Load the compiled styles once, after your reset and before application overrides. Choose either your application entry or a global CSS file.</P>
        <CodeBlock label="Application entry" code={"import '@bolerish/edge/style.css';"} />
        <CodeBlock label="Global CSS alternative" language="css" code={'@import "@bolerish/edge/style.css";'} />
        <P>The CSS alternative requires a build tool that resolves package imports. Edge does not require StyleX setup or a style-injection provider.</P>
      </>,
    },
    {
      id: 'choose-your-framework',
      title: 'Start using Edge',
      content: <P>No additional React setup is required after installation and stylesheet loading. Continue to <Link href="/docs/react/usage/">React Usage</Link> to connect your components, or look up options in the <Link href="/docs/react/api/">React API reference</Link>.</P>,
    },
  ],
};
