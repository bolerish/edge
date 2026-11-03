import './reset.css';
import '@wisp-lighting/react/style.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
const root = document.querySelector('#root');
if (!root) throw new Error('Missing root');
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
