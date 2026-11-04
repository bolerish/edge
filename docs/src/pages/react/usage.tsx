import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import { CodeBlock } from '../../ui/CodeBlock.js';
import { refreshSurface, hookSurface } from './examples.js';
import { decorationSlotExample, sharedLightExample } from '../../examples/examples.js';
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
            Start with <code>Lighting</code> around the area you want to connect, rather than wrapping the whole application. Only its explicit{' '}
            <code>Lighting.Surface</code> descendants respond to that light.
            The preview connects Bolerish UI components with hooks to this site’s shared light. The code shows the equivalent declarative setup with your own classes.
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
            Your styles compose with the lighting decoration. Set <code>edgeStyle</code> on a surface and <code>motion</code> on its shared light:
          </P>
          <CodeBlock
            label="Style composition"
            code={
              '<Lighting.Surface as="article" className="card" edgeStyle="raised">\n  Your content\n</Lighting.Surface>'
            }
          />
          <ExamplePreview title={decorationSlotExample.title} code={decorationSlotExample.code}>
            <decorationSlotExample.Component />
          </ExamplePreview>
          <P>
            The scope adds no wrapper. Each surface renders one host and reserves its{' '}
            <code>::after</code> for its border decoration by default. Choose <code>pseudoElement="before"</code> when your component already uses <code>::after</code>.
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
            preview above uses a wrapper; its native input keeps its
            value, selection and keyboard behavior. Apply <code>edgeStyle="recessed"</code> to the wrapper.
          </P>
          <Note title="Keep existing decorations">
            <P>Use <code>pseudoElement="before"</code> if only <code>::after</code> is occupied. If both pseudo-elements are occupied, apply lighting to a wrapper. Native inputs also need a wrapper. Match its radius to the visible control.</P>
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
            Use <code>useLight</code> and <code>useSurface</code> when a component already owns its host. Create one light in the common parent and pass it to each surface hook to connect several components. The example below connects one host; a custom Card can receive the same bindings if it forwards its ref, className and style to the DOM element. Merge the returned className and style with your component’s own styling, and attach the ref to that host.
          </P>
          <CodeBlock label="Connect an existing host" code={hookSurface} />
          <P>The Style and Motion pages update this site’s shared settings. Your application controls its own options through <code>edgeStyle</code>, <code>motion</code> and <code>staticDirection</code>; the shared preview above uses these site settings. See <Link href="/docs/styles/">Style</Link> and <Link href="/docs/motion/">Motion</Link> to change them.</P>
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
