import { Paragraph as P } from '@bolerish/ui/paragraph';
import { CodeBlock } from '../ui/CodeBlock.js';
import { inputSurface, refreshSurface } from './examples.js';
import type { DocPage } from './types.js';
export const usage: DocPage = {
  slug: 'usage',
  title: 'Usage',
  description:
    'Connect elements you own to a shared light. Wisp does not inspect children, replace components or manage your UI state.',
  sections: [
    {
      id: 'share-one-light',
      title: 'Share one light',
      content: (
        <>
          <P>
            Call <code>useLight()</code> in a common owner and pass its stable
            handle to child components. Every surface using that handle responds
            to the same source.
          </P>
          <P>
            A surface unregisters when its element is removed or replaced.
            Removing one surface does not stop its siblings. The light stops
            when its owner unmounts.
          </P>
        </>
      ),
    },
    {
      id: 'keep-your-styles',
      title: 'Keep your styles',
      content: (
        <>
          <P>
            Combine <code>surface.className</code> with your own classes and spread
            <code>surface.style</code> into your inline styles.
            Your component retains its positioning, radius and appearance:
          </P>
          <CodeBlock
            label="Style composition"
            code={
              '<article ref={surface.ref} className={`${surface.className} card`} style={surface.style}>\n  Your content\n</article>'
            }
          />
          <P>
            <code>surface.style</code> is a React inline-style object. Wisp reserves the element’s{' '}
            <code>::after</code> for its border decoration.
          </P>
        </>
      ),
    },
    {
      id: 'wrap-inputs-you-own',
      title: 'Wrap inputs you own',
      content: (
        <>
          <P>
            Register an input wrapper rather than the replaced input element
            itself. The input retains its native value, selection and keyboard
            behavior:
          </P>
          <CodeBlock label="Input wrapper" code={inputSurface} />
          <P>
            Bolerish controls keep their documented styling targets. Use a
            consumer-owned wrapper when a control does not accept the full
            surface recipe.
          </P>
        </>
      ),
    },
    {
      id: 'refresh-after-layout-changes',
      title: 'Refresh after layout changes',
      content: (
        <>
          <P>
            Size changes, nested scrolling, viewport resizing, font loading and
            resource loads invalidate cached geometry. Position-only changes may
            need an explicit refresh after React commits the new layout:
          </P>
          <CodeBlock label="Layout refresh" code={refreshSurface} />
          <P>
            This also schedules an update while the pointer is stationary.
            Rotation, perspective transforms and cross-document portals are
            outside the current support scope. Same-document portals can use the
            same light handle.
          </P>
        </>
      ),
    },
  ],
};
