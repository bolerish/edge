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
        <P>Use one light across a section, or give a smaller area an independent light. Choose your framework below for installation and your first example.</P>
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
