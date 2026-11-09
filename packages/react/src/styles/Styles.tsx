import type { ReactElement } from 'react';
import { stylesheet, stylesheetId } from './stylesheet.js';

export interface StylesProps {
  /** Use the same request nonce on the server and during hydration. */
  nonce?: string;
}

// Only the package's fixed CSS is serialized; no caller content enters this HTML.
const styleHtml = { __html: stylesheet };

/** Render once per SSR document, before application styles. */
export function Styles({ nonce }: StylesProps): ReactElement {
  return (
    <style
      data-bolerish-edge-styles={stylesheetId}
      nonce={nonce}
      dangerouslySetInnerHTML={styleHtml}
    />
  );
}
