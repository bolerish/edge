import { colorVars } from '@bolerish/tokens/semantic.stylex';
import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { Button } from '@bolerish/ui/button';
import { installPrompt } from './install-prompt.js';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@bolerish/ui/tabs';
import { CodeBlock } from '../code/CodeBlock.js';
const COPY_CONFIRMATION_DURATION_MS = 2000;

export const installationCommands = [
  { manager: 'npm', command: 'npm install @bolerish/edge' },
  { manager: 'pnpm', command: 'pnpm add @bolerish/edge' },
  { manager: 'Yarn', command: 'yarn add @bolerish/edge' },
  { manager: 'Bun', command: 'bun add @bolerish/edge' },
];
export function InstallCommands({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'unavailable'>('idle');
  useEffect(() => {
    if (status !== 'copied') return;
    const timeout = window.setTimeout(() => setStatus('idle'), COPY_CONFIRMATION_DURATION_MS);
    return () => window.clearTimeout(timeout);
  }, [status]);
  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(installPrompt);
      setStatus('copied');
    } catch {
      setStatus('unavailable');
    }
  }
  return (
    <div className="install-commands">
      <Tabs defaultValue="npm">
        <div {...stylex.props(styles.installToolbar)}>
          <TabsList aria-label="Package manager">
            {installationCommands.map(({ manager }) => (
              <TabsTrigger key={manager} value={manager}>
                {manager}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button xstyle={styles.copyButton} size="sm" variant="ghost" onClick={copyPrompt}>
            {status === 'copied' ? 'Copied' : 'Copy prompt'}
          </Button>
        </div>
        {installationCommands.map(({ manager, command }) => (
          <TabsContent key={manager} value={manager}>
            <CodeBlock
              compact={compact}
              label={`${manager} installation`}
              hideLabel
              language="bash"
              code={command}
            />
          </TabsContent>
        ))}
      </Tabs>

      <span
        role="status"
        {...stylex.props(status === 'unavailable' ? styles.copyError : styles.visuallyHidden)}
      >
        {status === 'copied'
          ? 'Installation prompt copied'
          : status === 'unavailable'
            ? 'Copy unavailable. Select the prompt below to copy it manually.'
            : ''}
      </span>
      {status === 'unavailable' ? (
        <pre {...stylex.props(styles.prompt)} tabIndex={0} aria-label="Installation prompt">
          {installPrompt}
        </pre>
      ) : null}
    </div>
  );
}

const styles = stylex.create({
  prompt: {
    padding: {
      default: '18px 20px',
      '@media (max-width: 760px)': 16,
    },
    overflow: 'auto',
    lineHeight: 1.8,
    tabSize: 4,
    fontSize: 14,
    outline: {
      default: null,
      ':focus-visible': `2px solid ${colorVars.fgPrimary}`,
    },
    outlineOffset: -2,
  },
  installToolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  copyButton: {
    marginInlineStart: 'auto',
  },
  copyError: {
    display: 'block',
    padding: '0 20px 16px',
    fontSize: '12px',
  },
  visuallyHidden: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  },
});
