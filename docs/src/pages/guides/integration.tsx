import { Paragraph as P } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import { ExamplePreview } from '../../ui/ExamplePreview.js';
import { decorationSlotExample } from '../../examples/examples.js';
import type { DocPage } from '../types.js';

export const integration: DocPage = {
  slug: 'integration',
  section: 'Guides',
  title: 'Integration',
  description: 'Check these conditions when connecting existing controls, decorations or changing layouts. They apply to the shared DOM engine and CSS bindings.',
  sections: [
    {
      id: 'existing-decorations', title: 'Keep existing decorations', content: <>
        <P>Edge draws its border decoration in <code>::after</code> by default. Choose <code>pseudoElement: 'before'</code> when your component already uses <code>::after</code>. If both slots are occupied, apply Edge to a wrapper. This is a CSS constraint, independent of your framework.</P>
        <P>The React example below uses the same decoration-slot option exposed by the shared style bindings.</P>
        <ExamplePreview title={decorationSlotExample.title} code={decorationSlotExample.code}>
          <decorationSlotExample.Component />
        </ExamplePreview>
      </>,
    },
    {
      id: 'wrap-inputs-you-own', title: 'Wrap native inputs', content: <P>Native inputs do not reliably support the pseudo-elements used for decoration. Register a label or div around the input instead, matching the control’s radius. Keep its label, focus indicator, validation and keyboard behavior intact. The recessed style is useful for input wrappers.</P>,
    },
    {
      id: 'refresh-after-layout-changes', title: 'Refresh after layout changes', content: <>
        <P>Size changes, nested scrolling, viewport resizing, font loading and resource loads invalidate cached geometry automatically. When your application moves a surface or changes its host border thickness without a size notification, call <code>light.refresh()</code> after the new layout is applied. This also schedules an update while the pointer is stationary.</P>
        <P>See the <Link href="/docs/react/api/#refresh">React API reference</Link> for the adapter-specific call.</P>
      </>,
    },
    {
      id: 'geometry-limits', title: 'Geometry and document boundaries', content: <P>The effect approximates axis-aligned rectangles. Rotation, perspective transforms and cross-document portals are unsupported. Same-document portals can share a light. Preserve focus, selection and validation independently of decorative lighting; see <Link href="/docs/accessibility/">Accessibility</Link>.</P>,
    },
  ],
};
