import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createStreamingScene } from './rendering-scene.ts';
import '@bolerish/edge/style.css';

const fixture = createStreamingScene();
fixture.resolve();
const errors: string[] = [];
const container = document.getElementById('root');
if (!container) throw new Error('Missing hydration root');
const root = hydrateRoot(container, React.createElement(fixture.Scene), {
  onRecoverableError: (error) => errors.push(String(error)),
});
declare global {
  interface Window {
    renderingFixture: { errors: string[]; unmount: () => void };
  }
}
window.renderingFixture = { errors, unmount: () => root.unmount() };
