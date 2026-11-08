import { Paragraph as P } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import { ExamplePreview } from '../_shared/ExamplePreview.js';
import { motionExample } from './_ui/MotionExample.js';
import type { DocPage } from '../_shared/types.js';

export const motion: DocPage = {
  slug: 'motion',
  section: 'Styles',
  title: 'Motion',
  description: 'Choose whether a shared light follows the pointer or keeps a fixed direction.',
  sections: [
    {
      id: 'compare-motion', title: 'Choose motion behavior', content: <>
        <P>Try each mode below. The selection updates the shared light across this site, including the example card.</P>
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
            <tr><th scope="row"><code>system</code></th><td>Respects reduced motion and input preferences. Library default.</td></tr>
            <tr><th scope="row"><code>dynamic</code></th><td>Follows mouse or pen input, including with reduced motion enabled.</td></tr>
            <tr><th scope="row"><code>static</code></th><td>Keeps a fixed direction; ignores pointer movement.</td></tr>
          </tbody>
        </table>
      </div>
      <P>For additional settings, see the <Link href="/docs/react/api/#lighting">API reference</Link>.</P>
    </> },
    {
      id: 'system', title: 'System', content: <P>Without a precise hover device, lighting starts fixed. Mouse or pen input can enable tracking when reduced motion is off. Touch movement never drives the light.</P>,
    },
    {
      id: 'dynamic', title: 'Dynamic', content: <P>Offer this mode as an explicit choice because it overrides reduced motion. The effect stays hidden until mouse or pen input arrives.</P>,
    },
    {
      id: 'static', title: 'Static', content: <P>Set <code>staticDirection</code> to any finite angle in degrees or <code>"random"</code>. The demo offers 0°, 90°, 180°, 270° and 315°. Random chooses one shared direction per mount; rerenders and appearance changes preserve it. Remount to choose a new direction.</P>,
    },
    {
      id: 'accessibility', title: 'Respect user preferences', content: <P>Keep focus, selection and validation visible independently of lighting. See <Link href="/docs/accessibility/">Accessibility</Link> for input and forced-colors behavior.</P>,
    },
  ],
};
