import { Paragraph as P } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import { ExamplePreview } from '../../ui/ExamplePreview.js';
import { edgeStylesExample } from '../../examples/examples.js';
import type { DocPage } from '../types.js';
export const styles: DocPage = {
  slug: 'styles',
  aliases: ['materials', 'react/materials'],
  section: 'Styles',
  title: 'Style',
  description:
    'Choose how a surface responds to light without changing its base styles.',
  sections: [
    {
      id: 'compare-styles',
      title: 'Compare the edge response',
      content: <>
        <P>Choose a style and move your pointer around the card. The selection also updates this site’s cards, code blocks and navigation surfaces.</P>
        <ExamplePreview title={edgeStylesExample.title} code={edgeStylesExample.code}>
          <edgeStylesExample.Component />
        </ExamplePreview>
      </>,
    },
    { id: 'options', title: 'Style values', content: <>
      <div className="table-scroll" role="region" aria-label="Style values table" tabIndex={0}>
        <table className="api-table">
          <caption className="visually-hidden">Style values</caption>
          <thead><tr><th scope="col">Value</th><th scope="col">Behavior</th></tr></thead>
          <tbody>
            <tr><th scope="row"><code>raised</code></th><td>Highlights the edge facing the light. Default.</td></tr>
            <tr><th scope="row"><code>recessed</code></th><td>Reverses the direction for an inset appearance.</td></tr>
            <tr><th scope="row"><code>matte</code></th><td>Softens the edge response.</td></tr>
          </tbody>
        </table>
      </div>
      <P>For additional settings, see the <Link href="/docs/react/api/#lighting-surface">API reference</Link>.</P>
    </> },
    {
      id: 'raised',
      title: 'Raised',
      content: (
        <P>
          Use <code>edgeStyle: 'raised'</code> for an outward-facing edge highlight.
        </P>
      ),
    },
    {
      id: 'recessed',
      title: 'Recessed',
      content: (
        <P>
          Use <code>edgeStyle: 'recessed'</code> for inset elements such as input wrappers.
        </P>
      ),
    },
    {
      id: 'matte',
      title: 'Matte',
      content: (
        <P>
          Use <code>edgeStyle: 'matte'</code> for a softer, quieter border.
        </P>
      ),
    },
    {
      id: 'customize-the-highlight',
      title: 'Customize the highlight',
      content: (
        <>
          <span id="apply-the-wisp-theme" />
          <P>
            Each surface uses its own text color, even when nested, and follows its host border radius.
            Set <code>color</code> to override the highlight, or <code>intensity</code> to multiply the shared light strength.
            Use <code>shadowColor="transparent"</code> to remove the opposite-edge shadow.
            <code> borderWidth</code> changes the decoration thickness in pixels, not the host border.
            Pass options to <Link href="/docs/react/api/#lighting-surface">Edge.Surface</Link>; no CSS variable declarations are needed.
          </P>
          <P>
            The effect approximates a direction on axis-aligned rectangles, not a physical point light.
            Near the center, directional intensity fades over a region proportional to the surface size.
          </P>
          <P>For existing decorations and input wrappers, see <Link href="/docs/integration/">Integration</Link>.</P>
        </>
      ),
    },
  ],
};
