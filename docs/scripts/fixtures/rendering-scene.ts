import React from 'react';
import { Edge, useSurface } from '@bolerish/edge';

export function createStreamingScene() {
  let ready = false;
  let release: () => void = () => {};
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });

  function ExistingHost() {
    const ref = useSurface({ color: 'red' });
    return React.createElement('button', { id: 'delayed-hook', ref }, 'Existing host');
  }

  function Delayed() {
    if (!ready) throw pending;
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Edge.Surface, { as: 'button', id: 'delayed-surface' }, 'Ready'),
      React.createElement(ExistingHost),
    );
  }

  function Scene() {
    return React.createElement(
      Edge.Provider,
      { motion: 'static', staticDirection: 90 },
      React.createElement(Edge.Surface, { as: 'button', id: 'shell' }, 'Shell'),
      React.createElement(
        React.Suspense,
        {
          fallback: React.createElement(Edge.Surface, { as: 'button', id: 'fallback' }, 'Loading'),
        },
        React.createElement(Delayed),
      ),
    );
  }

  return {
    Scene,
    resolve() {
      ready = true;
      release();
    },
  };
}
