import { Paragraph as P } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import { ExamplePreview } from '../../ui/ExamplePreview.js';
import { motionExample } from '../../examples/examples.js';
import type { DocPage } from '../types.js';

export const motion: DocPage = {
  slug: 'motion',
  section: 'Appearance',
  title: 'Motion',
  description: 'Choose whether lighting follows your pointer or stays in a fixed direction. Configure motion once for every surface sharing the light.',
  sections: [
    {
      id: 'compare-motion', title: 'Choose motion behavior', content: <>
        <P>Try System, Dynamic and Static below. Your selection updates the shared light across this site, including this card. Each surface keeps its colors and layout.</P>
        <ExamplePreview title={motionExample.title} code={motionExample.code}>
          <motionExample.Component />
        </ExamplePreview>
      </>,
    },
    { id: 'options', title: 'Motion values', content: <>
      <div className="table-scroll" role="region" aria-label="Motion values table" tabIndex={0}>
        <table className="api-table">
          <caption className="visually-hidden">Motion values</caption>
          <thead><tr><th scope="col">Value</th><th scope="col">Behavior</th></tr></thead>
          <tbody>
            <tr><th scope="row"><code>system</code></th><td>Respects reduced motion and input preferences. Default.</td></tr>
            <tr><th scope="row"><code>dynamic</code></th><td>Follows mouse or pen input, including with reduced motion enabled.</td></tr>
            <tr><th scope="row"><code>static</code></th><td>Keeps a fixed direction; ignores pointer movement.</td></tr>
          </tbody>
        </table>
      </div>
      <P>For additional settings, see the <Link href="/docs/react/api/#lighting">API reference</Link>.</P>
    </> },
    {
      id: 'system', title: 'System', content: <P>The default respects reduced motion. Without a precise hover device, lighting starts fixed; mouse or pen input can enable tracking when reduced motion is off. Touch movement never drives the light.</P>,
    },
    {
      id: 'dynamic', title: 'Dynamic', content: <P>Continuously follows mouse or pen input, even when reduced motion is enabled. Offer it as an explicit user choice. Before pointer input, the dynamic effect is hidden.</P>,
    },
    {
      id: 'static', title: 'Static', content: <P>Keeps a fixed direction. The selector offers 0°, 90°, 180°, 270° and 315°, plus Random per mount. In your code, use any finite angle in degrees, or <code>"random"</code> to choose one shared direction per mount. Rerenders and appearance updates keep that direction; remount the light to sample a new one.</P>,
    },
    {
      id: 'accessibility', title: 'Respect user preferences', content: <P>Keep focus, selection and validation visible independently of lighting. See <Link href="/docs/accessibility/">Accessibility</Link> for input and forced-colors behavior.</P>,
    },
  ],
};
