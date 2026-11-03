import { Paragraph as P } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import { CodeBlock } from '../ui/CodeBlock.js';
import type { DocPage } from './types.js';
export const materials: DocPage = {
  slug: 'materials',
  title: 'Materials',
  description:
    'Choose how an edge responds to light. Material response and base component styling are separate decisions.',
  sections: [
    {
      id: 'raised',
      title: 'Raised',
      content: (
        <P>
          Raised surfaces catch a highlight on the edge facing the light. Use{' '}
          <code>material: 'raised'</code> for an outward-facing response.
        </P>
      ),
    },
    {
      id: 'recessed',
      title: 'Recessed',
      content: (
        <P>
          Recessed surfaces reverse the light direction. Use{' '}
          <code>material: 'recessed'</code> for inset wrappers such as fields.
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
          <code>material: 'matte'</code> when the border should remain quiet.
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
              "const surface = useSurface(light, { material: 'matte', theme: 'wisp' });"
            }
          />
          <P>
            Leave the theme unset to retain your existing component appearance.
            The recessed material is not a Wisp theme choice. Compare the two
            theme choices in the <Link href="/playground/">Playground</Link>.
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
            Your styles can set <code>--wisp-highlight</code> and{' '}
            <code>--wisp-border-width</code>. Keep <code>--wisp-angle</code> and{' '}
            <code>--wisp-strength</code> reserved for the controller; writing
            them from React or another animation system creates competing
            ownership.
          </P>
          <P>
            The effect approximates lighting on axis-aligned rectangles. It is
            not a physically accurate point-light renderer. Directional
            intensity fades near the exact center, where a unique edge direction
            is ambiguous.
          </P>
        </>
      ),
    },
  ],
};
