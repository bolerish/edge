import { m } from '../../paraglide/messages.js';
import * as stylex from '@stylexjs/stylex';
import { installPrompt } from './install-prompt.js';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@bolerish/ui/tabs';
import { CodeBlock } from '../code/CodeBlock.js';

export const installationCommands = [
  { manager: 'npm', command: 'npm install @bolerish/edge' },
  { manager: 'pnpm', command: 'pnpm add @bolerish/edge' },
  { manager: 'Yarn', command: 'yarn add @bolerish/edge' },
  { manager: 'Bun', command: 'bun add @bolerish/edge' },
];
export function InstallCommands({ compact = false }: { compact?: boolean }) {
  return (
    <div className="install-commands">
      <Tabs defaultValue="npm">
        <div {...stylex.props(styles.installToolbar)}>
          <TabsList aria-label={m.installation_choices()} xstyle={styles.tabsList}>
            {installationCommands.map(({ manager }) => (
              <TabsTrigger key={manager} value={manager}>
                {manager}
              </TabsTrigger>
            ))}
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
          </TabsList>
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
        <TabsContent value="prompt">
          <CodeBlock
            compact={compact}
            label={m.installation_prompt()}
            language="text"
            code={installPrompt}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const styles = stylex.create({
  tabsList: { flexWrap: 'wrap' },
  installToolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
});
