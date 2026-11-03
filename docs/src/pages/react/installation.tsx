import { Paragraph as P } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import { InstallCommands } from '../../ui/InstallCommands.js';
import { CodeBlock } from '../../ui/CodeBlock.js';
import { firstSurface } from './examples.js';
import type { DocPage } from '../types.js';
export const installation: DocPage = {
  slug: 'react',
  aliases: ['installation'],
  section: 'React',
  title: 'Installation',
  description:
    'Prepare the local workspace and load Wisp’s compiled styles before connecting a surface. The packages are currently private and have not been published to npm.',
  sections: [
    {
      id: 'package-installation',
      title: 'Package installation',
      content: <InstallCommands />,
    },
    {
      id: 'prepare-the-workspace',
      title: 'Prepare the workspace',
      content: (
        <>
          <P>
            Use the Node and pnpm versions pinned in <code>.node-version</code>{' '}
            and <code>package.json</code>. From the repository root, install
            dependencies and build the packages:
          </P>
          <CodeBlock
            label="Workspace setup"
            language="bash"
            code={'pnpm install --frozen-lockfile\npnpm build'}
          />
          <P>
            The React adapter targets React 19. StyleX is compiled inside the
            library; consumers do not need to install or configure it.
          </P>
        </>
      ),
    },
    {
      id: 'load-the-stylesheet',
      title: 'Load the stylesheet',
      content: (
        <>
          <P>
            Import Wisp’s compiled stylesheet once from your application entry,
            after your reset and before application overrides:
          </P>
          <CodeBlock
            label="Stylesheet import"
            code={"import '@bolerish/edge/style.css';"}
          />
          <P>
            The library ships compiled JavaScript and CSS. Use your preferred
            styling tool, including Tailwind CSS, StyleX or vanilla-extract.
          </P>
        </>
      ),
    },
    {
      id: 'create-your-first-surface',
      title: 'Create your first surface',
      content: (
        <>
          <P>
            Add lighting to one area of your app and mark the elements that
            should respond. This example uses the optional Wisp theme for a
            complete base appearance:
          </P>
          <CodeBlock label="First surface" code={firstSurface} />
          <ul>
            <li>
              <strong>Area:</strong> <code>Lighting</code> shares one light
              within this part of the app. It adds no wrapper element.
            </li>
            <li>
              <strong>Target:</strong> <code>Lighting.Surface</code> marks an
              element that responds to the light. The ordinary article stays
              unchanged, even inside the same area.
            </li>
            <li>
              <strong>Tracking:</strong> <code>tracking="on"</code> follows the
              pointer. Use <code>"off"</code> for a fixed light direction or{' '}
              <code>"system"</code> to follow device and motion preferences.
              System is the library default.
            </li>
          </ul>
          <P>
            You can start with one card; the rest of your app does not need a
            lighting area. Continue with{' '}
            <Link href="/docs/react/usage/">Usage</Link> to share the light
            across components.
          </P>
        </>
      ),
    },
  ],
};
