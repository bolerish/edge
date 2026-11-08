import { Paragraph as P } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import { ExamplePreview } from '../_shared/ExamplePreview.js';
import { decorationSlotExample } from './_ui/DecorationSlotExample.js';
import type { DocPage } from '../_shared/types.js';

export const integration: DocPage = {
  slug: 'integration',
  section: 'Guides',
  title: 'Integration',
  description: 'Handle decoration conflicts, native inputs and layout changes.',
  sections: [
    {
      id: 'existing-decorations', title: 'Keep existing decorations', content: <>
        <P>Edge uses <code>::after</code> by default. Set <code>pseudoElement: 'before'</code> to keep an existing <code>::after</code>. If both pseudo-elements are occupied, decorate a wrapper.</P>
        <ExamplePreview title={decorationSlotExample.title} code={decorationSlotExample.code}>
          <decorationSlotExample.Component />
        </ExamplePreview>
      </>,
    },
    {
      id: 'wrap-inputs-you-own', title: 'Wrap native inputs', content: <P>Native inputs do not reliably display pseudo-element decoration. Connect a surrounding <code>label</code> or <code>div</code> with a matching radius instead. Keep the input’s label, focus, validation and keyboard behavior. Use <code>recessed</code> for an inset appearance.</P>,
    },
    {
      id: 'refresh-after-layout-changes', title: 'Refresh after layout changes', content: <>
        <P>Size changes, nested scrolling, viewport resizing, font loading and resource loads update geometry automatically. After a position-only change or a host border-thickness change without a size notification, call <code>light.refresh()</code> once the new layout is applied. It updates even with a stationary pointer.</P>
        <P>See <Link href="/docs/react/api/#refresh">light.refresh()</Link> for the React call.</P>
      </>,
    },
    {
      id: 'geometry-limits', title: 'Geometry and document boundaries', content: <P>Edge approximates axis-aligned rectangles. Rotation, perspective transforms and cross-document portals are unsupported. Portals within the same document can share a light. For focus, selection and validation, see <Link href="/docs/accessibility/">Accessibility</Link>.</P>,
    },
  ],
};
