import { Paragraph as P } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import { ExamplePreview } from '../../ui/ExamplePreview.js';
import { motionExample } from '../../examples/examples.js';
import { apiTable, lightOptionRows } from './api-options.js';
import type { DocPage } from '../types.js';

export const motion: DocPage = {
  slug: 'motion',
  section: 'Appearance',
  title: 'Motion',
  description: 'Choose whether lighting follows your pointer or stays in a fixed direction. Configure motion once for every surface sharing the light.',
  sections: [
    {
      id: 'compare-motion', title: 'Choose motion behavior', content: <>
        <P>Try System, Dynamic and Static below. Motion controls the shared light; each surface keeps its own style and colors.</P>
        <ExamplePreview title={motionExample.title} code={motionExample.code}>
          <motionExample.Component />
        </ExamplePreview>
      </>,
    },
    { id: 'options', title: 'Motion options', content: apiTable('Motion options', lightOptionRows) },
    {
      id: 'system', title: 'System', content: <P>The default respects reduced motion. Without a precise hover device, lighting starts fixed; mouse or pen input can enable tracking when reduced motion is off. Touch movement never drives the light.</P>,
    },
    {
      id: 'dynamic', title: 'Dynamic', content: <P>Continuously follows mouse or pen input, even when reduced motion is enabled. Offer it as an explicit user choice. Before pointer input, the dynamic effect is hidden.</P>,
    },
    {
      id: 'static', title: 'Static', content: <P>Keeps a fixed direction. Use a finite angle in degrees, or random to choose one shared direction per mount. Rerenders and appearance updates keep that direction; remount the light to sample a new one.</P>,
    },
    {
      id: 'accessibility', title: 'Respect user preferences', content: <P>Keep focus, selection and validation visible independently of lighting. See <Link href="/docs/accessibility/">Accessibility</Link> for input and forced-colors behavior.</P>,
    },
  ],
};
