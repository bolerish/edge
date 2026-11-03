import { Paragraph as P } from '@bolerish/ui/paragraph';
import { ExamplePreview } from '../ui/ExamplePreview.js';
import { sharedLightExample } from '../examples/examples.js';
import type { DocPage } from './types.js';
import './getting-started.css';

export const gettingStarted: DocPage = {
  slug: '',
  aliases: ['getting-started'],
  title: 'Getting started',
  description:
    'Your components own their markup, colors and interactions. Edge adds shared directional lighting to the elements you choose, whether in one card or across a page.',
  sections: [
    {
      id: 'one-shared-light',
      title: 'One shared light for your UI',
      content: <>
        <P>Wrap the area that shares a light, then mark the elements that should respond. In this React example, a card, button and input wrapper share one light. Other elements keep their appearance.</P>
        <ExamplePreview title={sharedLightExample.title} code={sharedLightExample.code}>
          <sharedLightExample.Component />
        </ExamplePreview>
        <P>Try the button and edit the project name. Lighting decorates their edges while the controls keep their own behavior. Choose your framework below to set up the example.</P>
      </>,
    },
    {
      id: 'choose-your-framework',
      title: 'Choose your framework',
      content: (
        <>
          <P>
            Choose an integration to set up Edge and try your first example.
            React is currently available in the local workspace; the packages
            have not been published to npm.
          </P>
          <ul className="framework-cards" aria-label="Framework integrations">
            <li>
              <a className="framework-card" href="/docs/react/">
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
              </a>
            </li>
            {['Vue', 'Svelte', 'Solid'].map((framework) => (
              <li key={framework}>
                <div className="framework-card framework-card-unavailable">
                  <span className="framework-card-heading">
                    <strong>{framework}</strong>
                    <span className="framework-card-status">Coming soon</span>
                  </span>
                  <span className="framework-card-description">
                    A dedicated integration is not available yet.
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      ),
    },
  ],
};
