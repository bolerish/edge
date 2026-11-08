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
    'Choose how an edge responds to light. Edge style response and base component styling are separate decisions.',
  sections: [
    {
      id: 'compare-styles',
      title: 'Compare the edge response',
      content: <>
        <P>Choose Raised, Recessed or Matte to change how the card responds to the shared light. Move your pointer around it to compare the edge response. Your selection also updates the cards, code blocks and navigation surfaces across this site.</P>
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
          Raised surfaces catch a highlight on the edge facing the light. Use{' '}
          <code>edgeStyle: 'raised'</code> for an outward-facing response.
        </P>
      ),
    },
    {
      id: 'recessed',
      title: 'Recessed',
      content: (
        <P>
          Recessed surfaces reverse the light direction. Use{' '}
          <code>edgeStyle: 'recessed'</code> for inset wrappers such as fields.
        </P>
      ),
    },
    {
      id: 'matte',
      title: 'Matte',
      content: (
        <P>
          Matte surfaces use a softer directional response. Use{' '}
          <code>edgeStyle: 'matte'</code> when the border should remain quiet.
        </P>
      ),
    },
    {
      id: 'customize-the-highlight',
      title: 'Customize the highlight',
      content: (
        <>
          <span id="apply-the-wisp-theme" />
          <P>Edge preserves your component’s background, text color, radius and layout. Choose raised, recessed or matte for the decorative response.</P>
          <P>
            Each surface uses its own text color by default, including inside another surface, and inherits its host border radius. Set <code>color</code> and <code>intensity</code> on a surface
            to customize that surface’s highlight.
            Set shadowColor to transparent on light surfaces if a dark
            opposite edge is unwanted. borderWidth controls the decorative
            thickness in pixels; it does not change the host border.
            Surface intensity multiplies the shared light intensity. Internal
            CSS variables are reserved for Edge; no CSS variable declarations
            are required in your application. In React, pass these options to{' '}
            <Link href="/docs/react/api/#lighting-surface">Edge.Surface</Link>.
          </P>
          <P>
            The effect approximates lighting on axis-aligned rectangles. It is
            not a physically accurate point-light renderer. Directional
            intensity fades across a region proportional to the element size
            near the center, where a unique edge direction is ambiguous.
            The light follows a direction rather than simulating a local point light.
          </P>
          <P>For existing decorations and input wrappers, see <Link href="/docs/integration/">Integration</Link>.</P>
        </>
      ),
    },
  ],
};
