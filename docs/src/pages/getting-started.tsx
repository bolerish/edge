import { Paragraph as P } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import type { DocPage } from './types.js';

export const gettingStarted: DocPage = {
  slug: '',
  aliases: ['getting-started'],
  title: 'Getting started',
  description:
    'Add directional lighting to the components you choose. Start with your framework, then connect only the area and elements that should respond.',
  sections: [
    {
      id: 'choose-your-framework',
      title: 'Choose your framework',
      content: (
        <>
          <P>
            React has a ready-to-use integration with declarative components
            and hooks. Follow its installation guide, then add your first
            light to an existing component.
          </P>
          <P><Link href="/docs/react/">Start with React</Link></P>
          <P>
            Svelte, Solid and Vue adapters are not available yet. The shared
            DOM controller and styles packages are framework-independent
            building blocks for custom integrations; they are not complete
            framework adapters.
          </P>
        </>
      ),
    },
    {
      id: 'choose-the-area',
      title: 'Choose the area',
      content: (
        <>
          <P>
            A shared light can cover a card, a group of controls or a whole
            page. Only the elements you connect respond to it. You do not
            need to apply lighting to the entire app.
          </P>
          <P>
            In React, wrap the area in <code>Lighting</code> and mark each
            target with <code>Lighting.Surface</code>. See{' '}
            <Link href="/docs/react/usage/">React usage</Link> for a minimal
            example, independent areas and existing component integration.
          </P>
        </>
      ),
    },
    {
      id: 'keep-your-components',
      title: 'Keep your components',
      content: (
        <>
          <P>
            Your app owns markup, colors and interactions. Wisp coordinates
            the light and decorative edge response. Keep visible boundaries
            and keyboard focus usable without the effect.
          </P>
          <P>
            Explore <Link href="/docs/react/materials/">React materials</Link>{' '}
            and <Link href="/docs/react/accessibility/">accessibility</Link>,
            or try the <Link href="/">dashboard example</Link>.
          </P>
        </>
      ),
    },
  ],
};
