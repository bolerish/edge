import { Paragraph as P } from '@bolerish/ui/paragraph';
import type { DocPage } from '../types.js';
export const api: DocPage = {
  slug: 'react/api',
  aliases: ['api'],
  section: 'React',
  title: 'API reference',
  description:
    'Use one light handle to connect explicit surface elements. Pointer updates run outside React state and context updates.',
  sections: [
    {
      id: 'lighting',
      title: 'Lighting',
      content: (
        <>
          <P>
            Shares one light with explicitly marked descendants without adding
            a DOM wrapper. motion accepts dynamic, static or system (default). Dynamic
            follows the pointer, Static keeps fixed lighting, and System
            follows device and reduced-motion preferences. Touch movement is ignored.
          </P>
          <P>
            staticDirection accepts an angle in degrees (default 315) or random.
            Random samples one shared direction per mount and keeps it across
            ordinary rerenders. It applies to fixed lighting. radius (default 480) and intensity (default 0.75) configure the shared
            light. An optional ref exposes the stable Light handle for refresh().
            Pointer input is read from the document; the scope selects which
            surfaces receive the effect, rather than clipping pointer input.
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
            Renders one HTML host inside its nearest Lighting owner. as chooses
            the tag (default div). Native attributes, events, className, style
            and refs are forwarded to that host. React 19 callback-ref cleanup
            is preserved. A surface outside Lighting throws an error.
          </P>
          <P>
            edgeStyle, theme, color and intensity use the same options as
            useSurface below. Input elements need a wrapper such as a label
            because the border decoration uses ::after. For a custom component
            that already owns its host, use the hooks instead.
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
            Returns a stable <code>Light</code> handle. Options update the
            existing light; omitted options use their defaults.
          </P>
          <div className="table-scroll">
            <table className="api-table">
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Default</th>
                  <th>Accepted values</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>motion</code>
                  </td>
                  <td>
                    <code>'system'</code>
                  </td>
                  <td>system, dynamic, static</td>
                </tr>
                <tr>
                  <td>
                    <code>radius</code>
                  </td>
                  <td>480</td>
                  <td>Positive finite number in viewport CSS pixels</td>
                </tr>
                <tr>
                  <td>
                    <code>intensity</code>
                  </td>
                  <td>0.75</td>
                  <td>Finite number from 0 to 1</td>
                </tr>
              </tbody>
            </table>
          </div>
          <P>
            <code>radius</code> controls dynamic distance attenuation. Static
            motion uses a fixed per-surface direction and does not fade out
            because the surface is far from an arbitrary origin.
          </P>
        </>
      ),
    },
    {
      id: 'refresh',
      title: 'light.refresh()',
      content: (
        <P>
          Invalidates cached geometry and schedules a frame. Call it after
          application-controlled layout changes have committed. It does not
          require pointer movement and does not replace the light handle.
        </P>
      ),
    },
    {
      id: 'use-surface',
      title: 'useSurface(light, options?)',
      content: (
        <>
          <P>
            Returns <code>{'{ ref, className, style }'}</code>. Connect the ref to one HTML
            element and apply the returned className and React inline style.
          </P>
          <div className="table-scroll">
            <table className="api-table">
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Default</th>
                  <th>Accepted values</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>edgeStyle</code>
                  </td>
                  <td>
                    <code>'raised'</code>
                  </td>
                  <td>raised, recessed, matte without a theme</td>
                </tr>
                <tr>
                  <td>
                    <code>theme</code>
                  </td>
                  <td>Unset</td>
                  <td>wisp or false</td>
                </tr>
                <tr>
                  <td><code>color</code></td>
                  <td><code>#e5edc8</code></td>
                  <td>Any CSS color string</td>
                </tr>
                <tr>
                  <td><code>intensity</code></td>
                  <td>1</td>
                  <td>Finite number from 0 to 1; multiplies shared intensity</td>
                </tr>
              </tbody>
            </table>
          </div>
          <P>
            With <code>theme: 'wisp'</code>, edgeStyle is limited to raised or
            matte. Set color to any CSS color string. Surface intensity defaults to 1
            and multiplies the shared light intensity; finite values are clamped
            to 0–1 and non-finite values use the default.
            EdgeStyle changes update the current registration. An element
            cannot belong to two light controllers.
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
            Creating hooks and server-rendering their markup does not access the
            DOM. Client effects activate the light after hydration. Cleanup
            restores controller-owned inline variables, removes external
            subscriptions and cancels pending frames. Setup can restart during
            React StrictMode checks.
          </P>
          <P>
            The package supports SSR and static React markup with client
            hydration. The current tests use React’s server renderer and
            hydration APIs; they do not establish integration with every SSR
            framework. Svelte, Solid and Vue adapters are not implemented. The DOM engine and
            compiled style bindings are shared independently of React.
          </P>
        </>
      ),
    },
  ],
};
