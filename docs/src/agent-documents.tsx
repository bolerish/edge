import { Children, cloneElement, isValidElement, type ComponentProps, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import TurndownService from 'turndown';
import { learningPath } from './docs/_shared/page-registry.js';
import { getPagePath } from './docs/_shared/routes.js';
import { CodeBlock } from './shared/code/CodeBlock.js';
import { ExamplePreview, formatExampleCode } from './docs/_shared/ExamplePreview.js';
import { InstallCommands, installationCommands } from './shared/installation/InstallCommands.js';
import { usePreferences, type SitePreferences } from './shared/preferences/usePreferences.js';

const origin = 'https://edge.bolerish.com';

/** Build machine-readable documents from the same content as the HTML site. */
export function renderAgentDocuments(version: string) {
  const output = new Map<string, string>();
  const index = [
    '# Edge',
    '> Shared directional highlights for your existing UI.',
    `Documentation target: @bolerish/edge ${version}. Check the installed package version and declarations before applying these examples.`,
    'React 18 and 19 are supported. Other framework adapters are not available yet. The library defaults to motion="system"; interactive examples use the documentation site’s preferences.',
    '## Documentation',
  ];
  const full: string[] = [];
  for (const page of learningPath) {
    const path = getPagePath(page);
    const markdownPath = `${path}index.md`;
    const title = [page.section, page.title].filter(Boolean).join(' · ');
    const markdown = createMarkdownConverter(new URL(path, origin));
    const sections = page.sections.map(section => {
      const html = renderToStaticMarkup(<AgentContent>{section.content}</AgentContent>);
      return `<a id="${section.id}"></a>\n\n## ${section.title}\n\n${markdown.turndown(html)}`;
    });
    const body = `# ${title}\n\n${page.description}\n\nPackage: @bolerish/edge ${version}\nSource: ${origin}${path}\n\n${sections.join('\n\n')}\n`;
    output.set(markdownPath, body);
    index.push(`- [${title}](${origin}${markdownPath}): ${page.description}`);
    full.push(body);
  }
  index.push('## Complete documentation', `- [All documents](${origin}/llms-full.txt): Full text of the pages above.`);
  output.set('/llms.txt', index.join('\n\n') + '\n');
  output.set('/llms-full.txt', full.join('\n---\n\n'));
  return output;
}

function AgentContent({ children }: { children: ReactNode }) {
  return agentNode(children, usePreferences());
}

/** Keep code and prose while omitting preview controls and demo-only markup. */
function agentNode(node: ReactNode, preferences: SitePreferences): ReactNode {
  if (Array.isArray(node)) return Children.map(node, child => agentNode(child, preferences));
  if (!isValidElement<{ children?: ReactNode }>(node)) return node;
  if (node.type === CodeBlock) {
    const { code, language = 'tsx' } = node.props as ComponentProps<typeof CodeBlock>;
    return <pre><code className={`language-${language}`}>{code}</code></pre>;
  }
  if (node.type === ExamplePreview) {
    const { code, title } = node.props as ComponentProps<typeof ExamplePreview>;
    const displayed = formatExampleCode(code, preferences);
    return <><p>{title}</p><pre><code className="language-tsx">{displayed}</code></pre></>;
  }
  if (node.type === InstallCommands) return <>{installationCommands.map(({ manager, command }) =>
    <div key={manager}><p>{manager}</p><pre><code className="language-bash">{command}</code></pre></div>)}</>;
  return 'children' in node.props ? cloneElement(node, {}, agentNode(node.props.children, preferences)) : node;
}

function createMarkdownConverter(base: URL) {
  const markdown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
  markdown.remove(['script', 'style', 'button', 'noscript']);
  markdown.addRule('tables', {
    filter: 'table',
    replacement(_, table) {
      const rows = Array.from(table.querySelectorAll('tr')).map(row => Array.from(row.children).map(cell =>
        markdown.turndown(cell.innerHTML).replaceAll('|', '\\|').replace(/\s*\n\s*/g, '<br>')));
      if (!rows.length) return '';
      rows.splice(1, 0, rows[0]!.map(() => '---'));
      return '\n\n' + rows.map(row => `| ${row.join(' | ')} |`).join('\n') + '\n\n';
    },
  });
  markdown.addRule('absoluteLinks', {
    filter: 'a',
    replacement(content, node) {
      const href = node.getAttribute('href');
      return href ? `[${content}](${new URL(href, base).href})` : content;
    },
  });
  return markdown;
}
