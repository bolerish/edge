import { DocumentSurface } from '../ui/DocumentSurface.js';
import { InstallCommands } from '../ui/InstallCommands.js';
import { CodeBlock } from '../ui/CodeBlock.js';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import type { DocPage } from './types.js';
import './getting-started.css';

export const gettingStarted: DocPage = {
  slug: '',
  aliases: ['getting-started'],
  title: 'Getting started',
  description:
    'Give your UI a subtle response to the pointer. Connect the elements you choose while keeping your own markup, colors and interactions.',
  sections: [
    {
      id: 'one-shared-light',
      title: 'A little more alive.',
      content: <>
        <P>Add a subtle highlight that responds as the pointer moves around your UI. Choose an area that shares a light, then select the elements that should respond. Your components keep their markup, colors and interactions.</P>
        <P>Use one light across a section, or give a smaller area an independent light. Install the package and load its stylesheet once, then choose your framework for its setup.</P>
      </>,
    },
    {
      id: 'installation',
      title: 'Installation',
      content: <>
        <P>Add Edge to your existing project with your package manager. The commands below target the React adapter; it requires React 19. Other framework adapters are not available yet.</P>
        <InstallCommands />
        <P>The package is not yet on the public npm registry. These are the consumer installation commands for its release; repository development setup is documented in CONTRIBUTING.md.</P>
        <details>
          <summary>Install with an AI assistant</summary>
          <CodeBlock label="AI installation prompt" language="text" code={`Set up @bolerish/edge in this existing React project.

1. Inspect package.json, the lockfile and the app entry or root layout. Use the project's existing package manager. Edge requires React 19; report an incompatible version instead of upgrading React automatically.
2. Add @bolerish/edge with npm install, pnpm add, yarn add or bun add. If the registry reports that the package is unavailable, report the error and stop; do not substitute another package.
3. Load @bolerish/edge/style.css once: import it in the app entry/root layout, or use @import "@bolerish/edge/style.css" in the global CSS if the build tool resolves package CSS imports. Preserve reset and override ordering. Do not add StyleX configuration or a CSS-injecting provider.
4. Use Lighting and Lighting.Surface from @bolerish/edge for the specific existing area I choose. Lighting adds no DOM; only explicit surfaces receive decoration. Keep my markup, colors, events and focus styles. Use useLight/useSurface when a component already owns its host, composing its ref, className and style.
5. Keep the default motion="system" unless I request another mode. Wrap native inputs; use pseudoElement="before" if the host already uses ::after, and a wrapper if both pseudo-elements are occupied.
6. Run the project's relevant checks and summarize the changed files. Do not add a demo page or replace existing UI.`} />
        </details>
      </>,
    },
    {
      id: 'stylesheet',
      title: 'Load the stylesheet',
      content: <>
        <P>Load the compiled styles once, after your reset and before application overrides. Choose either your application entry or a global CSS file.</P>
        <CodeBlock label="Application entry" code={"import '@bolerish/edge/style.css';"} />
        <CodeBlock label="Global CSS alternative" language="css" code={'@import "@bolerish/edge/style.css";'} />
        <P>The CSS alternative requires a build tool that resolves package imports. Edge does not require StyleX setup or a style-injection provider.</P>
      </>,
    },
    {
      id: 'choose-your-framework',
      title: 'Choose your framework',
      content: (
        <>
          <P>
            Choose an integration for framework-specific setup and usage.
          </P>
          <ul className="framework-cards" aria-label="Framework integrations">
            <li>
              <DocumentSurface as="a" className="framework-card" href="/docs/react/">
                <span className="framework-card-heading">
                  <strong>React</strong>
                  <span className="framework-card-status">Available</span>
                </span>
                <span className="framework-card-description">
                  Set up the stylesheet and add lighting with components or hooks.
                </span>
                <span className="framework-card-action">
                  Start with React <span aria-hidden="true">↗</span>
                </span>
              </DocumentSurface>
            </li>
            {['Vue', 'Svelte', 'Solid'].map((framework) => (
              <li key={framework}>
                <DocumentSurface className="framework-card framework-card-unavailable">
                  <span className="framework-card-heading">
                    <strong>{framework}</strong>
                    <span className="framework-card-status">Coming soon</span>
                  </span>
                  <span className="framework-card-description">
                    A dedicated integration is not available yet.
                  </span>
                </DocumentSurface>
              </li>
            ))}
          </ul>
        </>
      ),
    },
  ],
};
