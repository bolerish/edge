import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import type { DocPage } from '../types.js';
export const accessibility: DocPage = {
  slug: 'accessibility',
  aliases: ['react/accessibility'],
  section: 'Guides',
  title: 'Accessibility',
  description:
    'Treat lighting as decoration. Components must remain readable and operable without a moving highlight.',
  sections: [
    {
      id: 'choose-an-input-mode',
      title: 'Choose motion behavior',
      content: (
        <P>Keep the default <code>system</code> motion to respect reduced-motion preferences. Touch movement never drives the light. Offer <code>dynamic</code> as an explicit choice because it overrides reduced motion; see <Link href="/docs/motion/">Motion</Link> for the available behaviors.</P>
      ),
    },
    {
      id: 'preserve-native-interactions',
      title: 'Preserve native interactions',
      content: (
        <>
          <P>
            Keep useful base borders, text contrast, labels and focus styles.
            Edge’s decoration does not capture pointer events. Your app owns
            input values, selection, keyboard handlers and portal composition.
          </P>
          <P>
            Forced-colors mode hides the border decoration. Do not use its
            presence or absence as the only way to communicate selection,
            validation or availability.
          </P>
        </>
      ),
    },
    {
      id: 'understand-rendering-cost',
      title: 'Understand rendering cost',
      content: (
        <>
          <P>
            One light coalesces updates into at most one pending frame. Geometry
            reads precede style writes and unchanged output properties are
            skipped.
          </P>
          <P>
            Changing gradients can still require browser rendering work. Framework
            execution counts and functional browser tests are not measurements
            of paint, compositing, battery use or frame-rate guarantees.
          </P>
        </>
      ),
    },
  ],
};
