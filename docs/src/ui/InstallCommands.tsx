import { useEffect, useState } from 'react';
import { Button } from '@bolerish/ui/button';
import { installPrompt } from './install-prompt.js';
import './InstallCommands.css';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@bolerish/ui/tabs';
import { CodeBlock } from './CodeBlock.js';
const COPY_CONFIRMATION_DURATION_MS = 2000;

export const installationCommands = [
  { manager: 'npm', command: 'npm install @bolerish/edge' },
  { manager: 'pnpm', command: 'pnpm add @bolerish/edge' },
  { manager: 'Yarn', command: 'yarn add @bolerish/edge' },
  { manager: 'Bun', command: 'bun add @bolerish/edge' },
];
export function InstallCommands() {
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
        <div className="install-toolbar">
          <TabsList aria-label="Package manager">
            {installationCommands.map(({ manager }) => (
              <TabsTrigger key={manager} value={manager}>
                {manager}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button size="sm" variant="ghost" onClick={copyPrompt}>
            {status === 'copied' ? 'Copied' : 'Copy prompt'}
          </Button>
        </div>
        {installationCommands.map(({ manager, command }) => (
          <TabsContent key={manager} value={manager}>
            <CodeBlock
              label={`${manager} installation`}
              hideLabel
              language="bash"
              code={command}
            />
          </TabsContent>
        ))}
      </Tabs>

      <span role="status" className={status === 'unavailable' ? 'copy-error' : 'visually-hidden'}>
        {status === 'copied' ? 'Installation prompt copied' : status === 'unavailable' ? 'Copy unavailable. Select the prompt below to copy it manually.' : ''}
      </span>
      {status === 'unavailable' ? <pre tabIndex={0} aria-label="Installation prompt">{installPrompt}</pre> : null}
    </div>
  );
}
