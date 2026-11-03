import { Paragraph as P } from '@bolerish/ui/paragraph';
import { CodeBlock } from '../../ui/CodeBlock.js';
import { refreshSurface, hookSurface } from './examples.js';
import { sharedLightExample } from '../../examples/examples.js';
import { ExamplePreview } from '../../ui/ExamplePreview.js';
import { Note } from '../../ui/Note.js';
import type { DocPage } from '../types.js';
export const usage: DocPage = {
  slug: 'react/usage',
  aliases: ['usage'],
  section: 'React',
  title: 'Usage',
  description:
    'Connect elements you own to a shared light. Edge does not inspect children, replace components or manage your UI state.',
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
          <ExamplePreview title={sharedLightExample.title} code={sharedLightExample.code}>
            <sharedLightExample.Component />
          </ExamplePreview>
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
            Put the decoration on a label or div around the input. The border
            uses <code>::after</code>, which is not a reliable drawing surface
            on native input elements. The editable Project name field in the
            example above uses a label wrapper; its native input keeps its
            value, selection and keyboard behavior:
          </P>
          <Note title="Keep existing decorations">
            <P>If a component already uses <code>::after</code>, apply lighting to a wrapper so the decorations do not compete. Match the wrapper’s radius to the visible control.</P>
          </Note>
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
          <Note title="Position changes need a refresh">
          <P>
            This also schedules an update while the pointer is stationary.
            Rotation, perspective transforms and cross-document portals are
            outside the current support scope. Same-document portals can use the
            declaring Lighting scope.
          </P>
          </Note>
        </>
      ),
    },
  ],
};
