import { Paragraph as P } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import { CodeBlock } from '../../ui/CodeBlock.js';
import { ExamplePreview } from '../../ui/ExamplePreview.js';
import { edgeStylesExample } from '../../examples/examples.js';
import { apiTable, surfaceOptionRows } from './api-options.js';
import type { DocPage } from '../types.js';
export const styles: DocPage = {
  slug: 'styles',
  aliases: ['materials', 'react/materials'],
  section: 'Appearance',
  title: 'Style',
  description:
    'Choose how an edge responds to light. Edge style response and base component styling are separate decisions.',
  sections: [
    {
      id: 'compare-styles',
      title: 'Compare the edge response',
      content: <>
        <P>Choose the edge response independently of your colors and layout. This React example places all three styles under one light. Use Static to compare the direction without moving the pointer, or Dynamic to explore the edges.</P>
        <ExamplePreview title={edgeStylesExample.title} code={edgeStylesExample.code}>
          <edgeStylesExample.Component />
        </ExamplePreview>
      </>,
    },
    { id: 'options', title: 'Style options', content: apiTable('Style options', surfaceOptionRows) },
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
          It is available without the Wisp theme.
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
      id: 'apply-the-wisp-theme',
      title: 'Apply the Wisp theme',
      content: (
        <>
          <P>
            Add <code>theme: 'wisp'</code> for the library’s dark base surface.
            The theme supports Raised and Matte:
          </P>
          <CodeBlock
            label="Wisp theme"
            code={
              '<Lighting.Surface edgeStyle="matte" theme="wisp">\n  Your content\n</Lighting.Surface>'
            }
          />
          <P>
            Leave the theme unset to retain your existing component appearance.
            The recessed style is not a Wisp theme choice. The{' '}
            <Link href="/">dashboard example</Link> uses unthemed materials to
            preserve Bolerish component colors.
          </P>
        </>
      ),
    },
    {
      id: 'customize-the-highlight',
      title: 'Customize the highlight',
      content: (
        <>
          <P>
            Set <code>color</code> and <code>intensity</code> on a surface
            to customize the highlight.
            Set shadowColor to transparent on light surfaces if a dark
            opposite edge is unwanted. borderWidth controls the decorative
            thickness in pixels; it does not change the host border.
            Surface intensity multiplies the shared light intensity. Internal
            CSS variables are reserved for Edge; no CSS variable declarations
            are required in your application. In React, pass these options to{' '}
            <Link href="/docs/react/api/#lighting-surface">Lighting.Surface</Link>.
          </P>
          <P>
            The effect approximates lighting on axis-aligned rectangles. It is
            not a physically accurate point-light renderer. Directional
            intensity fades across a region proportional to the element size
            near the center, where a unique edge direction is ambiguous.
            The light follows a direction rather than simulating a local point light.
          </P>
          <P>The decoration uses <code>::after</code> by default. Choose <code>pseudoElement="before"</code> to preserve an existing <code>::after</code>. If both slots are occupied, use a wrapper.</P>
        </>
      ),
    },
  ],
};
