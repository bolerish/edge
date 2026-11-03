import { Paragraph as P } from '@bolerish/ui/paragraph';
import { CodeBlock } from '../../ui/CodeBlock.js';
import { inputSurface, refreshSurface, hookSurface } from './examples.js';
import type { DocPage } from '../types.js';
export const usage: DocPage = {
  slug: 'react/usage',
  aliases: ['usage'],
  section: 'React',
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
            Wrap a section in <code>Lighting</code>. Only its explicit{' '}
            <code>Lighting.Surface</code> descendants respond to that light.
            Nest another Lighting to give part of the section an independent
            light; each surface uses its nearest owner.
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
            Pass className and style directly to <code>Lighting.Surface</code>.
            Your styles compose with the lighting decoration:
          </P>
          <CodeBlock
            label="Style composition"
            code={
              '<Lighting.Surface as="article" className="card" style={{ padding: 24 }}>\n  Your content\n</Lighting.Surface>'
            }
          />
          <P>
            The scope adds no wrapper. Each surface renders one host and reserves its{' '}
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
      id: 'connect-existing-components',
      title: 'Connect existing components with hooks',
      content: (
        <>
          <P>
            Use useLight and useSurface when an existing component should own
            the registered host. Merge the returned className and style with
            your component’s own styling, and attach the ref to that host.
          </P>
          <CodeBlock label="Hook escape hatch" code={hookSurface} />
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
            declaring Lighting scope.
          </P>
        </>
      ),
    },
  ],
};
