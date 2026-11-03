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
      title: 'Choose an input mode',
      content: (
        <>
          <P>
            <strong>System</strong> (<code>auto</code>) respects reduced motion. When the primary
            device lacks precise hover, it starts with fixed lighting; observed
            mouse or pen movement can enable tracking when reduced motion is
            off. Touch movement does not drive the light.
          </P>
          <P>
            <strong>On</strong> (<code>pointer</code>) explicitly enables tracking, including when
            reduced motion is enabled. Offer it as a conscious choice rather
            than silently overriding a preference.
          </P>
          <P>
            <strong>Frozen</strong> (<code>frozen</code>) captures the first mouse
            or pen position, then keeps the light there. Browsers do not expose
            a pointer position before an input event; fixed lighting is used
            until the first input. Changing mode or remounting resets it.
          </P>
          <P>
            <strong>Off</strong> (<code>static</code>) uses a fixed light direction on each
            surface.
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
