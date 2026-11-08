import { m } from '../../paraglide/messages.js';
import { colorVars } from '@bolerish/tokens/semantic.stylex';
import * as stylex from '@stylexjs/stylex';
import { usePreferences, type SitePreferences } from '../../shared/preferences/usePreferences.js';
import { LightingSurface } from '../../shared/lighting/LightingSurface.js';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@bolerish/ui/tabs';
import type { ReactNode } from 'react';
import { CodeBlock } from '../../shared/code/CodeBlock.js';

/** Keeps the executable preview and its exact imported source in one region. */
export function ExamplePreview({
  title,
  code,
  children,
}: {
  title: string;
  code: string;
  children: ReactNode;
}) {
  const { edgeStyle, motion, staticDirection, direction, radius } = usePreferences();
  const displayedCode = formatExampleCode(code, {
    edgeStyle,
    motion,
    staticDirection,
    direction,
    radius,
  });
  return (
    <div
      className={`example-preview ${stylex.props(styles.examplePreview).className}`}
      role="group"
      aria-label={title}
    >
      <Tabs defaultValue="preview" variant="underline">
        <TabsList aria-label={m.view_region({ title })}>
          <TabsTrigger value="preview">{m.preview()}</TabsTrigger>
          <TabsTrigger value="code">{m.code()}</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" keepMounted>
          <LightingSurface
            className="example-preview-result"
            xstyle={styles.examplePreviewResult}
            role="group"
            aria-label={m.preview_region({ title })}
          >
            {children}
          </LightingSurface>
        </TabsContent>
        <TabsContent value="code" keepMounted>
          <CodeBlock label={title} code={displayedCode} />
        </TabsContent>
      </Tabs>
      <noscript>
        <p>{m.the_example_becomes_interactive_when_javascript_is()}</p>
        <CodeBlock label={title} code={displayedCode} />
      </noscript>
    </div>
  );
}

export function formatExampleCode(
  code: string,
  preferences: Pick<SitePreferences, 'edgeStyle' | 'motion' | 'staticDirection'> &
    Partial<Pick<SitePreferences, 'direction' | 'radius'>>,
) {
  return code
    .replaceAll('__EDGE_STYLE__', JSON.stringify(preferences.edgeStyle))
    .replaceAll('__MOTION__', JSON.stringify(preferences.motion))
    .replaceAll('__STATIC_DIRECTION__', JSON.stringify(preferences.staticDirection))
    .replaceAll('__DIRECTION__', JSON.stringify(preferences.direction ?? 'gather'))
    .replaceAll('__RADIUS__', String(preferences.radius ?? 480));
}

const styles = stylex.create({
  examplePreview: {
    display: 'grid',
    gap: '16px',
    minWidth: '0',
    marginBlock: '24px',
  },
  examplePreviewResult: {
    minWidth: 0,
    padding: { default: 24, '@media (max-width: 760px)': 16 },
    backgroundColor: colorVars.bgSubtle,
  },
});
