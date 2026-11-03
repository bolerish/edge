import { useState } from 'react';
import { Button } from '@bolerish/ui/button';
export function CodeBlock({
  code,
  label = 'Example',
}: {
  code: string;
  label?: string;
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
      <pre>
        <code>{code}</code>
      </pre>
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
