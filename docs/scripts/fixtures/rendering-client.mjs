import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createStreamingScene } from './rendering-scene.mjs';
import '@bolerish/edge/style.css';

const fixture = createStreamingScene();
fixture.resolve();
const errors = [];
const root = hydrateRoot(document.getElementById('root'), React.createElement(fixture.Scene), {
  onRecoverableError: error => errors.push(error.message),
});
window.renderingFixture = { errors, unmount: () => root.unmount() };
