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
            Wrap the area that shares a light in <code>Lighting</code>. Add{' '}
            <code>Lighting.Surface</code> only to the elements that should
            respond. Ordinary elements stay unchanged, even inside the area.
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
            A <code>Lighting.Surface</code> renders a div by default. Choose
            another HTML element with <code>as</code>, and pass your own
            className, style, events and ref. Existing hooks remain available
            when you need to connect a component directly.
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
            optional Wisp theme offers Raised and Matte. An unthemed
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
            Pointer tracking starts On (<code>pointer</code>) in the documentation
            demo. Use <code>tracking="system"</code> to follow device and
            motion preferences, or <code>tracking="off"</code> for a fixed
            light direction. The library defaults to System.
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
