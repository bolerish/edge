import { Paragraph as P } from '@bolerish/ui/paragraph';
import type { DocPage } from './types.js';
export const api: DocPage = {
  slug: 'api',
  title: 'API reference',
  description:
    'Use one light handle to connect explicit surface elements. Pointer updates run outside React state and context updates.',
  sections: [
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
                    <code>mode</code>
                  </td>
                  <td>
                    <code>'auto'</code>
                  </td>
                  <td>auto, pointer, static</td>
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
            mode uses a fixed per-surface direction and does not fade out
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
            Returns <code>{'{ ref, style }'}</code>. Connect the ref to one HTML
            element and compose the style with <code>stylex.props()</code>.
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
                    <code>material</code>
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
              </tbody>
            </table>
          </div>
          <P>
            With <code>theme: 'wisp'</code>, material is limited to raised or
            matte. Material changes update the current registration. An element
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
            framework. Solid and Svelte adapters are not implemented.
          </P>
        </>
      ),
    },
  ],
};
