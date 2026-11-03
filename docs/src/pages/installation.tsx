import { Paragraph as P } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import { CodeBlock } from '../ui/CodeBlock.js';
import { firstSurface } from './examples.js';
import type { DocPage } from './types.js';
export const installation: DocPage = {
  slug: 'installation',
  title: 'Installation',
  description:
    'Prepare the local workspace and load Wisp’s compiled styles before connecting a surface. The packages are currently private and have not been published to npm.',
  sections: [
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
            code={"import '@bolerish/wisp-react/style.css';"}
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
            Create a shared light in the owner component and pass it to a
            surface component. This example uses the Wisp theme to provide a
            complete base appearance:
          </P>
          <CodeBlock label="First surface" code={firstSurface} />
          <P>
            Move the pointer near the card’s edges. In Auto mode, reduced-motion
            preferences use fixed lighting instead. Continue with{' '}
            <Link href="/docs/usage/">Usage</Link> to share the light across
            components.
          </P>
        </>
      ),
    },
  ],
};
