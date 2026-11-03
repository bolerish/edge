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
        <>
          <P>
            <strong>System</strong> (<code>system</code>) respects reduced motion. When the primary
            device lacks precise hover, it starts with fixed lighting; observed
            mouse or pen movement can enable motion when reduced motion is
            off. Touch movement does not drive the light.
          </P>
          <P>
            <strong>Dynamic</strong> (<code>dynamic</code>) explicitly enables motion, including when
            reduced motion is enabled. Offer it as a conscious choice rather
            than silently overriding a preference.
          </P>
          <P>
            <strong>Static</strong> (<code>static</code>) uses a fixed light direction on each
            surface. Set staticDirection to random to choose one shared direction
            per mount, or pass an angle in degrees. Ordinary rerenders keep it.
          </P>
        </>
      ),
    },
    {
      id: 'preserve-native-interactions',
      title: 'Preserve native interactions',
      content: (
        <>
          <P>
            Keep useful base borders, text contrast, labels and focus styles.
            Wisp’s decoration does not capture pointer events. Your app owns
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
