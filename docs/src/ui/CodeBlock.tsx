import { Highlight } from 'prism-react-renderer';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-tsx.js';
import 'prismjs/components/prism-bash.js';
import { useState } from 'react';
import { Button } from '@bolerish/ui/button';

// React owns the highlighted DOM; disable Prism’s automatic document scan.
Prism.manual = true;
const codeTheme = { plain: {}, styles: [] };
export function CodeBlock({
  code,
  label = 'Example',
  language = 'tsx',
}: {
  code: string;
  label?: string;
  language?: 'tsx' | 'bash';
}) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'unavailable'>(
    'idle',
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus('copied');
    } catch {
      setStatus('unavailable');
    }
  }
  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>{label}</span>
        <Button
          size="sm"
          variant="ghost"
          aria-label={`Copy ${label}`}
          onClick={copy}
        >
          {status === 'copied' ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <Highlight
        prism={Prism}
        code={code}
        language={language}
        theme={codeTheme}
      >
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre role="region" tabIndex={0} aria-label={`${label} code`}>
            <code>
              {tokens.map((line, index) => (
                <div key={index} {...getLineProps({ line })}>
                  {line.map((token, tokenIndex) => (
                    <span key={tokenIndex} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
      <span
        className={status === 'unavailable' ? 'copy-error' : 'visually-hidden'}
        role="status"
      >
        {status === 'copied'
          ? 'Copied'
          : status === 'unavailable'
            ? 'Copy unavailable. Select the code to copy it manually.'
            : ''}
      </span>
    </div>
  );
}
