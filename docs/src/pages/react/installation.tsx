import { Paragraph as P } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import { Note } from '../../ui/Note.js';
import { ExamplePreview } from '../../ui/ExamplePreview.js';
import { firstSurfaceExample } from '../../examples/examples.js';
import { CodeBlock } from '../../ui/CodeBlock.js';
import type { DocPage } from '../types.js';
export const installation: DocPage = {
  slug: 'react',
  aliases: ['installation'],
  section: 'React',
  title: 'Installation',
  description:
    'Run the local React preview, load the stylesheet once, and connect your first component. React 19 is required; no StyleX setup is needed.',
  sections: [
    {
      id: 'package-installation',
      title: 'Choose the current setup path',
      content: <Note title="Local preview"><P>The packages are currently private. Use this repository to try the examples; a public npm installation is not available yet. The steps below describe the local workspace, rather than installation into an unrelated app.</P></Note>,
    },
    {
      id: 'prepare-the-workspace',
      title: 'Prepare the workspace',
      content: (
        <>
          <P>
            Use the Node and pnpm versions pinned in <code>.node-version</code>{' '}
            and <code>package.json</code>. From the repository root, install
            dependencies and start the preview:
          </P>
          <CodeBlock
            label="Workspace setup"
            language="bash"
            code={'pnpm install --frozen-lockfile\npnpm dev'}
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
            Import Edge’s compiled stylesheet once from your application entry,
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
          <ExamplePreview title={firstSurfaceExample.title} code={firstSurfaceExample.code}>
            <firstSurfaceExample.Component />
          </ExamplePreview>
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
              <strong>Motion:</strong> <code>motion="system"</code> follows your device and motion preferences.
              Choose <code>"dynamic"</code> to follow the pointer explicitly, or <code>"static"</code> for a fixed direction. System is the library default.
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
