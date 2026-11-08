import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import { CodeBlock } from '../../ui/CodeBlock.js';
import {
  apiTable,
  lightingPropRows,
  lightOptionRows,
  surfacePropRows,
  surfaceOptionRows,
} from '../appearance/api-options.js';
import type { DocPage } from '../types.js';

export const api: DocPage = {
  slug: 'react/api',
  aliases: ['api'],
  section: 'React',
  title: 'API reference',
  description:
    'Look up component props, hook options and their defaults. Start with Edge.Provider and Edge.Surface; use the hooks when you need to connect an existing host.',
  sections: [
    {
      id: 'lighting',
      title: 'Edge.Provider',
      content: (
        <>
          <P>
            Wrap the part of your interface that should share a light.
            <code> Edge.Provider</code> adds no DOM element. Each surface uses its
            nearest owner, so nested owners create independent lights.
          </P>
          <CodeBlock
            label="Edge.Provider signature"
            code={'<Edge.Provider motion="system" radius={480} intensity={0.75}>\n  {/* Your surfaces */}\n</Edge.Provider>'}
          />
          {apiTable('Edge.Provider props', lightingPropRows)}
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
            Mark an element that should respond to its nearest light. It renders
            one HTML host and preserves your native attributes and event handlers.
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
            Existing host borders are measured so the decoration aligns with
            their outside edge. <code>borderWidth</code> changes the decoration
            thickness, not the host border. For a custom component that already
            exposes its host, use <code>useSurface</code> below.
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
            Create an independent light when you need to manage it explicitly. Normally, use Edge.Provider and useSurface(options) instead. Pass this handle to useSurface(light, options) to connect a host without a provider. The returned <code>Light</code> handle stays stable; changing
            options updates the existing light.
          </P>
          <CodeBlock
            label="useLight signature"
            code={'function useLight(options?: LightOptions): Light;'}
          />
          {apiTable('useLight options', lightOptionRows)}
          <P>
            Omitted options use their defaults. <code>radius</code> controls
            distance attenuation for dynamic lighting. Fixed lighting uses
            <code> staticDirection</code> and does not fade because an element
            is far from an arbitrary origin.
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
            Call <code>light.refresh()</code> after your application moves an
            element or changes its host border thickness without a size notification. It remeasures geometry on the
            next frame, including while the pointer is stationary.
          </P>
          <CodeBlock label="refresh signature" code={`interface Light {
  refresh(): void;
}`} />
          <P>
            Call it after React commits the new layout. It schedules an update
            without replacing the light handle or requiring pointer movement.
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
            Connect one existing HTML host to the nearest Edge.Provider. Attach the returned
            <code> ref</code>. Edge applies and removes its own decoration; keep your existing className and style props.
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
          <P>Without an explicit light, this hook requires an Edge.Provider. For advanced ownership, use <code>useSurface(light, options)</code> with a handle returned by <code>useLight</code>. The explicit light takes precedence over the provider. The legacy Lighting and Lighting.Surface names remain supported.</P>
          {apiTable('useSurface options', surfaceOptionRows)}
          <div role="note" aria-label="One owner per element" className="doc-note">
            <P>
              An element can belong to only one light controller. Connect the
              returned ref to the element that actually displays the border,
              not to a parent whose dimensions differ.
            </P>
          </div>
          <P>
            <code>edgeStyle</code> changes update the existing registration.
            Appearance options update without replacing the host. Hook decoration is attached on the client; its server markup contains only your own styles. Use Edge.Surface when you need the decorative CSS in server output too.
          </P>
        </>
      ),
    },
    {
      id: 'rendering-and-cleanup',
      title: 'Rendering and cleanup',
      content: (
        <>
          <P>
            Hooks can create handles and render markup on the server without
            accessing the DOM. Client effects activate the light after hydration.
            Cleanup restores controller-owned inline variables, removes browser
            subscriptions and cancels pending frames. Setup can restart during
            React StrictMode checks.
          </P>
          <P>
            The React adapter supports React 18 and 19. Tests cover React’s server
            renderer and hydration APIs; they do not establish integration with
            every SSR framework.
          </P>
        </>
      ),
    },
  ],
};
