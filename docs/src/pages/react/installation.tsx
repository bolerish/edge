import { Paragraph as P } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import type { DocPage } from '../types.js';

export const installation: DocPage = {
  slug: 'react',
  aliases: ['installation'],
  section: 'React',
  title: 'Installation',
  description: 'Connect Edge to React 19. Package installation and stylesheet setup are shared in Getting started.',
  sections: [
    {
      id: 'package-installation',
      title: 'Install the package',
      content: <P>Follow <Link href="/docs/#installation">Getting started · Installation</Link> for npm, pnpm, Yarn or Bun commands, or copy the AI installation prompt there. You do not need a second React-specific package.</P>,
    },
    {
      id: 'prepare-the-workspace',
      title: 'Check React compatibility',
      content: <P>The React adapter requires React 19. It works with client rendering, server rendering and static generation. In frameworks with Server Components, keep interactive lighting components and hooks inside a client boundary. StyleX is compiled inside the library; no consumer configuration is needed.</P>,
    },
    {
      id: 'load-the-stylesheet',
      title: 'Load styles once',
      content: <P>Use the <Link href="/docs/#stylesheet">shared stylesheet setup</Link> in your application entry or global CSS. Do not load it again for every component. Lighting shares the light; it does not inject styles.</P>,
    },
    {
      id: 'create-your-first-surface',
      title: 'Continue to usage',
      content: <P>Continue to <Link href="/docs/react/usage/">Usage</Link> to connect an area with Lighting and Lighting.Surface, or attach hooks to your existing components. You choose the area that responds; the rest of your app can keep its current behavior.</P>,
    },
  ],
};
