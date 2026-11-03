import { Tabs, TabsList, TabsTrigger, TabsContent } from '@bolerish/ui/tabs';
import { CodeBlock } from './CodeBlock.js';
const commands = [
  { manager: 'npm', command: 'npm install @bolerish/wisp-react' },
  { manager: 'pnpm', command: 'pnpm add @bolerish/wisp-react' },
  { manager: 'Yarn', command: 'yarn add @bolerish/wisp-react' },
  { manager: 'Bun', command: 'bun add @bolerish/wisp-react' },
];
export function InstallCommands() {
  return (
    <div className="install-commands">
      <Tabs defaultValue="npm">
        <TabsList aria-label="Package manager">
          {commands.map(({ manager }) => (
            <TabsTrigger key={manager} value={manager}>
              {manager}
            </TabsTrigger>
          ))}
        </TabsList>
        {commands.map(({ manager, command }) => (
          <TabsContent key={manager} value={manager}>
            <CodeBlock
              label={`${manager} installation`}
              language="bash"
              code={command}
            />
          </TabsContent>
        ))}
      </Tabs>
      <p className="install-notice">
        Not published yet · Commands become available after the public release.
      </p>
    </div>
  );
}
