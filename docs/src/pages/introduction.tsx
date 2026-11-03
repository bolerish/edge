import { Paragraph as P } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import type { DocPage } from './types.js';
export const introduction: DocPage = {
  slug: '',
  title: 'Introduction',
  description:
    'Wisp adds directional lighting to component borders. Share one light across your React components while keeping markup, styling and interactions in your app.',
  sections: [
    {
      id: 'start-with-a-light',
      title: 'Start with a light',
      content: (
        <>
          <P>
            Create a light with <code>useLight()</code> and pass it to the
            components in the same scene. The component that creates the light
            owns its lifetime.
          </P>
          <P>
            Follow <Link href="/docs/installation/">Installation</Link> to
            prepare the workspace and <Link href="/docs/usage/">Usage</Link> to
            connect your first surface.
          </P>
        </>
      ),
    },
    {
      id: 'connect-your-components',
      title: 'Connect your components',
      content: (
        <>
          <P>
            Register an element with <code>useSurface()</code>. Apply the
            returned StyleX value before your own styles so your layout and
            appearance take precedence.
          </P>
          <P>
            The library coordinates pointer input, geometry and decorative
            output. Your app continues to own content, input values, focus and
            event handlers.
          </P>
        </>
      ),
    },
    {
      id: 'choose-a-surface',
      title: 'Choose a surface',
      content: (
        <>
          <P>
            Use a material to describe how an edge responds to light. The
            optional Wisp theme offers 01 Raised and 03 Matte. An unthemed
            recessed material supports inset elements such as input wrappers.
          </P>
          <P>
            Read <Link href="/docs/materials/">Materials</Link> for the
            differences, then compare them in the{' '}
            <Link href="/">dashboard example</Link>.
          </P>
        </>
      ),
    },
    {
      id: 'control-motion',
      title: 'Control motion',
      content: (
        <>
          <P>
            Auto mode respects reduced motion. Choose Pointer mode to explicitly
            enable tracking, or Static mode for a fixed light direction.
          </P>
          <P>
            Keep visible borders and keyboard focus without relying on the
            effect. See <Link href="/docs/accessibility/">Accessibility</Link>{' '}
            for input modes and supported behavior.
          </P>
        </>
      ),
    },
  ],
};
