import * as stylex from '@stylexjs/stylex';
import { contentStyles } from '../_shared/content-styles.js';
import { InstallCommands } from '../../shared/installation/InstallCommands.js';
import { CodeBlock } from '../../shared/code/CodeBlock.js';
import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import type { DocPage } from '../_shared/types.js';

export const installation: DocPage = {
  slug: 'installation',
  section: 'Getting started',
  title: 'Installation',
  description: 'Install Edge and load its stylesheet.',
  sections: [
    {
      id: 'installation',
      title: 'Installation',
      content: (
        <>
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            The React adapter requires React 18 or 19. Other framework adapters are not available
            yet.
          </P>
          <InstallCommands />
        </>
      ),
    },
    {
      id: 'stylesheet',
      title: 'Load the stylesheet',
      content: (
        <>
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            Load the stylesheet once, before application and utility styles so they can override
            Edge’s positioning defaults. A reset may load first. Choose one of the following:
          </P>
          <CodeBlock label="Application entry" code={"import '@bolerish/edge/style.css';"} />
          <CodeBlock
            label="Global CSS alternative"
            language="css"
            code={'@import "@bolerish/edge/style.css";'}
          />
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            The CSS alternative needs a build tool that resolves package imports. No styling
            compiler or style-injection provider is required.
          </P>
        </>
      ),
    },
    {
      id: 'next-steps',
      title: 'Start using Edge',
      content: (
        <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
          Choose an area and its surfaces in <Link href="/docs/usage/">Usage</Link>, then connect
          them with <Link href="/docs/react/usage/">React Integration</Link>.
        </P>
      ),
    },
  ],
};
