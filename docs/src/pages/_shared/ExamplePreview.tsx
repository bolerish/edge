import { usePreferences, type SitePreferences } from '../../shared/preferences/usePreferences.js';
import { DocumentSurface } from './DocumentSurface.js';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@bolerish/ui/tabs';
import type { ReactNode } from 'react';
import { CodeBlock } from '../../shared/code/CodeBlock.js';
import './ExamplePreview.css';

/** Keeps the executable preview and its exact imported source in one region. */
export function ExamplePreview({ title, code, children }: {
  title: string;
  code: string;
  children: ReactNode;
}) {
  const { edgeStyle, motion, staticDirection } = usePreferences();
  const displayedCode = formatExampleCode(code, { edgeStyle, motion, staticDirection });
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

export function formatExampleCode(code: string, preferences: Pick<SitePreferences, 'edgeStyle' | 'motion' | 'staticDirection'>) {
  return code.replaceAll('__EDGE_STYLE__', JSON.stringify(preferences.edgeStyle))
    .replaceAll('__MOTION__', JSON.stringify(preferences.motion))
    .replaceAll('__STATIC_DIRECTION__', JSON.stringify(preferences.staticDirection));
}
