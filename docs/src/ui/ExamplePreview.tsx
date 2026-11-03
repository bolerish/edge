import type { ReactNode } from 'react';
import { CodeBlock } from './CodeBlock.js';
import './ExamplePreview.css';

/** Keeps the executable preview and its exact imported source in one region. */
export function ExamplePreview({ title, code, children }: {
  title: string;
  code: string;
  children: ReactNode;
}) {
  return (
    <div className="example-preview" role="group" aria-label={title}>
      <div className="example-preview-result" role="group" aria-label={`${title} preview`}>
        {children}
      </div>
      <noscript>The example becomes interactive when JavaScript is enabled.</noscript>
      <CodeBlock label={title} code={code} />
    </div>
  );
}
