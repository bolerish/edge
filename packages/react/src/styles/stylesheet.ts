import css from '@bolerish/edge-styles/style.css?raw';

export const stylesheet = css;
export const stylesheetAttribute = 'data-bolerish-edge-styles';
// A content identity, not a security digest. It survives SSR HTML/CSS minification.
let fingerprint = 2166136261;
for (let index = 0; index < stylesheet.length; index++) {
  fingerprint = Math.imul(fingerprint ^ stylesheet.charCodeAt(index), 16777619);
}
export const stylesheetId = `edge-${(fingerprint >>> 0).toString(16)}`;

/** Resources belong to the document and outlive individual light owners. */
export function ensureStyles(document: Document) {
  if (document.querySelector(`style[${stylesheetAttribute}="${stylesheetId}"]`)) return;
  const style = document.createElement('style');
  style.setAttribute(stylesheetAttribute, stylesheetId);
  style.textContent = stylesheet;
  document.head.prepend(style);
}
