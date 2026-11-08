import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import type { DocPage } from '../types.js';
export const accessibility: DocPage = {
  slug: 'accessibility',
  aliases: ['react/accessibility'],
  section: 'Guides',
  title: 'Accessibility',
  description:
    'Keep components readable and operable without lighting.',
  sections: [
    {
      id: 'choose-an-input-mode',
      title: 'Choose motion behavior',
      content: (
        <P>Use <code>system</code> to respect reduced motion. Touch never drives the light. Offer <code>dynamic</code> only as an explicit choice because it overrides reduced motion. See <Link href="/docs/motion/">Motion</Link> for details.</P>
      ),
    },
    {
      id: 'preserve-native-interactions',
      title: 'Preserve native interactions',
      content: (
        <>
          <P>
            Keep labels, text contrast, base borders and visible keyboard focus.
            Decoration does not capture pointer events; input values, selection,
            keyboard handling and portals remain under your control.
          </P>
          <P>
            Forced-colors mode hides decoration. Communicate selection, validation
            and availability independently of the highlight.
          </P>
        </>
      ),
    },
    {
      id: 'understand-rendering-cost',
      title: 'Understand rendering cost',
      content: (
        <>
          <P>Each light queues at most one frame, reads geometry before writing styles,
            and skips unchanged output. Gradient changes still require browser rendering work;
            this does not guarantee a frame rate or battery cost.</P>
        </>
      ),
    },
  ],
};
