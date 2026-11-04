import { usePreferences } from '../settings/usePreferences.js';
import { DocumentSurface } from './DocumentSurface.js';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@bolerish/ui/tabs';
import type { ReactNode } from 'react';
import { CodeBlock } from './CodeBlock.js';
import './ExamplePreview.css';

/** Keeps the executable preview and its exact imported source in one region. */
export function ExamplePreview({ title, code, children }: {
  title: string;
  code: string;
  children: ReactNode;
}) {
  const { edgeStyle, motion, staticDirection } = usePreferences();
  const displayedCode = code.replaceAll('__EDGE_STYLE__', JSON.stringify(edgeStyle)).replaceAll('__MOTION__', JSON.stringify(motion)).replaceAll('__STATIC_DIRECTION__', staticDirection === 'random' ? '"random"' : '315');
  return (
    <div className="example-preview" role="group" aria-label={title}>
      <Tabs defaultValue="preview" variant="underline">
        <TabsList aria-label={`${title} view`}>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" keepMounted>
          <DocumentSurface className="example-preview-result" role="group" aria-label={`${title} preview`}>
            {children}
          </DocumentSurface>
        </TabsContent>
        <TabsContent value="code" keepMounted>
          <CodeBlock label={title} code={displayedCode} />
        </TabsContent>
      </Tabs>
      <noscript>
        <p>The example becomes interactive when JavaScript is enabled.</p>
        <CodeBlock label={title} code={displayedCode} />
      </noscript>
    </div>
  );
}
