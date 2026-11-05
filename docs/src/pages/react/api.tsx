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
    'Look up component props, hook options and their defaults. Start with Lighting and Lighting.Surface; use the hooks when you need to connect an existing host.',
  sections: [
    {
      id: 'lighting',
      title: 'Lighting',
      content: (
        <>
          <P>
            Wrap the part of your interface that should share a light.
            <code> Lighting</code> adds no DOM element. Each surface uses its
            nearest owner, so nested owners create independent lights.
          </P>
          <CodeBlock
            label="Lighting signature"
            code={'<Lighting motion="system" radius={480} intensity={0.75}>\n  {/* Your surfaces */}\n</Lighting>'}
          />
          {apiTable('Lighting props', lightingPropRows)}
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
      title: 'Lighting.Surface',
      content: (
        <>
          <P>
            Mark an element that should respond to its nearest light. It renders
            one HTML host and preserves your native attributes and event handlers.
          </P>
          <CodeBlock
            label="Lighting.Surface signature"
            code={'<Lighting.Surface as="article" edgeStyle="raised">\n  Your content\n</Lighting.Surface>'}
          />
          {apiTable('Lighting.Surface props', surfacePropRows)}
          <div role="note" aria-label="Surface ownership" className="doc-note">
            <P>
              Place every <code>Lighting.Surface</code> inside a
              <code> Lighting</code> owner; rendering it outside one throws an
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
            Create a light when you need to connect existing components through
            hooks. The returned <code>Light</code> handle stays stable; changing
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
      title: 'useSurface(light, options?)',
      content: (
        <>
          <P>
            Connect one existing HTML host to a light. Attach the returned
            <code> ref</code> and merge <code>className</code> and
            <code> style</code> with your own styles.
          </P>
          <CodeBlock
            label="useSurface signature"
            code={'const { ref, className, style } = useSurface<HTMLElement>(light, options);'}
          />
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
            With <code>theme="wisp"</code>, only <code>raised</code> and
            <code> matte</code> are supported. Leave the theme unset to use
            <code> recessed</code> or keep your existing appearance.
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
            The React adapter requires React 19. Tests cover React’s server
            renderer and hydration APIs; they do not establish integration with
            every SSR framework.
          </P>
        </>
      ),
    },
  ],
};
