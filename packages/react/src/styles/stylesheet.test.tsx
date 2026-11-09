// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, expect, it } from 'vitest';
import { Edge } from '../index.js';
import { ensureStyles, stylesheet, stylesheetAttribute } from './stylesheet.js';

afterEach(() => {
  cleanup();
  document.querySelectorAll(`style[${stylesheetAttribute}]`).forEach((node) => node.remove());
});

it('prepares one document resource before application styles and retains it for remounts', () => {
  const consumer = document.createElement('style');
  consumer.textContent = '.consumer { position: absolute; }';
  document.head.append(consumer);
  ensureStyles(document);
  const style = document.querySelector(`style[${stylesheetAttribute}]`);
  expect(style?.textContent).toBe(stylesheet);
  expect(document.head.firstChild).toBe(style);
  ensureStyles(document);
  expect(document.querySelectorAll(`style[${stylesheetAttribute}]`)).toHaveLength(1);
  style?.remove();
  ensureStyles(document);
  expect(document.querySelectorAll(`style[${stylesheetAttribute}]`)).toHaveLength(1);
  consumer.remove();
});

it('adopts SSR styles without changing their nonce or position', () => {
  const html = renderToString(<Edge.Styles nonce="request-nonce" />);
  expect(html).toContain('nonce="request-nonce"');
  expect(html).toContain("content: '';");
  document.body.insertAdjacentHTML('afterbegin', html);
  const style = document.querySelector(`style[${stylesheetAttribute}]`);
  if (!style) throw new Error('Missing SSR styles');
  style.textContent = stylesheet.replaceAll(/\s+/g, ' ');
  ensureStyles(document);
  expect(document.querySelectorAll(`style[${stylesheetAttribute}]`)).toHaveLength(1);
  expect(style?.parentNode).toBe(document.body);
  expect(style?.getAttribute('nonce')).toBe('request-nonce');
});

it('does not mistake different CSS for the current resource', () => {
  const previous = document.createElement('style');
  previous.setAttribute(stylesheetAttribute, '');
  previous.textContent = ':root { --previous: 1; }';
  document.head.append(previous);
  ensureStyles(document);
  expect(previous.textContent).toContain('--previous');
  expect(document.querySelectorAll(`style[${stylesheetAttribute}]`)).toHaveLength(2);
});

it('keeps resources independent between documents', () => {
  const another = document.implementation.createHTMLDocument();
  ensureStyles(another);
  expect(another.head.firstElementChild?.textContent).toBe(stylesheet);
  expect(document.querySelector(`style[${stylesheetAttribute}]`)).toBeNull();
});

it('renders the same stylesheet from separate SSR requests without render state', () => {
  const first = renderToString(<Edge.Styles nonce="first" />);
  const second = renderToString(<Edge.Styles nonce="second" />);
  expect(second).toBe(first.replace('nonce="first"', 'nonce="second"'));
  const view = render(<Edge.Styles />);
  expect(view.container.querySelector('style')?.textContent).toBe(stylesheet);
});
