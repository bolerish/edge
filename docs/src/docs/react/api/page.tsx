import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import { CodeBlock } from '../../../shared/code/CodeBlock.js';
import {
  apiTable,
  providerPropRows,
  lightOptionRows,
  surfacePropRows,
  surfaceOptionRows,
} from '../../_shared/api-options.js';
import type { DocPage } from '../../_shared/types.js';

export const api: DocPage = {
  slug: 'react/api',
  aliases: ['api'],
  section: 'React',
  title: 'API reference',
  description:
    'Component props, hook signatures, defaults and rendering behavior.',
  sections: [
    {
      id: 'lighting',
      title: 'Edge.Provider',
      content: (
        <>
          <P>
            Shares one light with descendant surfaces without adding DOM.
            Nested providers create independent lights.
          </P>
          <CodeBlock
            label="Edge.Provider signature"
            code={'<Edge.Provider motion="system" radius={480} intensity={0.75}>\n  {/* Your surfaces */}\n</Edge.Provider>'}
          />
          {apiTable('Edge.Provider props', providerPropRows)}
          <P>
            Pointer input comes from the document. The scope chooses which
            surfaces respond; it does not clip input to a wrapper rectangle.
            <code> staticDirection</code> applies whenever fixed lighting is
            active, including when <code>motion="system"</code> respects
            reduced motion.
          </P>
        </>
      ),
    },
    {
      id: 'lighting-surface',
      title: 'Edge.Surface',
      content: (
        <>
          <P>
            Renders one HTML element connected to the nearest provider.
            Native attributes and events follow the tag selected by <code>as</code>.
          </P>
          <CodeBlock
            label="Edge.Surface signature"
            code={'<Edge.Surface as="article" edgeStyle="raised">\n  Your content\n</Edge.Surface>'}
          />
          {apiTable('Edge.Surface props', surfacePropRows)}
          <div role="note" aria-label="Surface ownership" className="doc-note">
            <P>
              Place every <code>Edge.Surface</code> inside a
              <code> Edge.Provider</code> owner; rendering it outside one throws an
              error. For native inputs and occupied pseudo-elements, see <Link href="/docs/integration/">Integration</Link>.
            </P>
          </div>
          <P>
            Decoration aligns with the outside of the host border.
            To connect an existing component’s HTML element, use <Link href="#use-surface">useSurface</Link>.
          </P>
        </>
      ),
    },
    {
      id: 'use-surface',
      title: 'useSurface(options?)',
      content: (
        <>
          <P>
            Returns a callback ref that connects an existing HTML element to the nearest provider.
            Attach it to the element displaying the border and keep your existing <code>className</code> and <code>style</code>.
          </P>
          <CodeBlock
            label="useSurface signature"
            code={'const ref = useSurface<HTMLElement>(options);'}
          />
          <CodeBlock label="Share one light with existing components" code={`function Area() {
  return <Edge.Provider><ExistingCard /><ExistingCard /></Edge.Provider>;
}

function ExistingCard() {
  const ref = useSurface<HTMLDivElement>();
  return <Card ref={ref}>Your existing component</Card>;
}`} />
          <P>In React 18, an existing function component must use <code>forwardRef</code> to pass the ref to its HTML host. React 19 also supports receiving ref as a prop.</P>
          <P>Without an explicit light, this hook requires an Edge.Provider. For advanced ownership, use <code>useSurface(light, options)</code> with a handle returned by <code>useLight</code>. The explicit light takes precedence over the provider.</P>
          {apiTable('useSurface options', surfaceOptionRows)}
          <div role="note" aria-label="One owner per element" className="doc-note">
            <P>
              An element can belong to only one light. Do not attach the ref to a parent with different dimensions.
            </P>
          </div>
          <P>
            Options update without replacing the element. Hook decoration attaches after hydration;
            use <code>Edge.Surface</code> to include appearance classes and variables in server output.
          </P>
        </>
      ),
    },
    {
      id: 'use-light',
      title: 'useLight(options?)',
      content: (
        <>
          <P>
            Returns a stable <code>Light</code> handle for explicit ownership without a provider.
            Pass it to <code>useSurface(light, options)</code>. Option changes update the existing light;
            use <code>Edge.Provider</code> for ordinary component trees.
          </P>
          <CodeBlock
            label="useLight signature"
            code={'function useLight(options?: LightOptions): Light;'}
          />
          {apiTable('useLight options', lightOptionRows)}
          <P>
            <code>radius</code> affects dynamic lighting only. Fixed lighting uses
            <code> staticDirection</code> without distance attenuation.
          </P>
        </>
      ),
    },
    {
      id: 'refresh',
      title: 'light.refresh()',
      content: (
        <>
          <P>
            Remeasures surfaces on the next frame, even with a stationary pointer.
            Call after React commits a position or host border-thickness change without a size notification.
          </P>
          <CodeBlock label="refresh signature" code={`interface Light {
  refresh(): void;
}`} />
          <P>Size changes and scrolling are handled automatically; see <Link href="/docs/integration/#refresh-after-layout-changes">layout updates</Link> for details.</P>
        </>
      ),
    },
    {
      id: 'rendering-and-cleanup',
      title: 'Rendering and cleanup',
      content: (
        <>
          <P>
            Server rendering does not access the DOM. Lighting starts on the client after hydration.
            Cleanup restores owned inline variables, removes listeners and cancels pending frames;
            setup can restart in React StrictMode.
          </P>
          <P>
            <code>Edge.Surface</code> includes appearance classes and variables in server HTML.
            <code> useSurface</code> leaves your markup unchanged until hydration.
            Geometry, fixed direction and pointer tracking require client code.
          </P>
          <div className="table-scroll" role="region" aria-label="Rendering modes table" tabIndex={0}>
            <table className="api-table">
              <caption className="visually-hidden">Rendering modes</caption>
              <thead><tr><th scope="col">Mode</th><th scope="col">Behavior</th></tr></thead>
              <tbody>
                <tr><th scope="row">CSR</th><td>The provider and marked hosts activate after the client mounts.</td></tr>
                <tr><th scope="row">SSR</th><td>Use renderToString with hydrateRoot. Native content and controls remain available before hydration.</td></tr>
                <tr><th scope="row">Streaming SSR</th><td>Node renderToPipeableStream and Web renderToReadableStream can send a Suspense fallback before delayed surfaces. Surfaces use their nearest provider when they hydrate.</td></tr>
                <tr><th scope="row">SSG with hydration</th><td>Generate hydratable HTML at build time. For delayed content, wait for onAllReady or stream.allReady before collecting the output.</td></tr>
                <tr><th scope="row">Static HTML</th><td>renderToStaticMarkup produces HTML that cannot be hydrated. Content and surface classes remain, but lighting does not activate without client code.</td></tr>
              </tbody>
            </table>
          </div>
          <P>
            In Server Component frameworks, use Edge inside a client module marked
            with <code>{'"use client"'}</code>.
          </P>
          <P>
            React 18 and 19 are supported. Web Streams are tested in Node;
            individual frameworks, deployed Web runtimes and hydration of incomplete streams are not verified.
          </P>
        </>
      ),
    },
  ],
};
