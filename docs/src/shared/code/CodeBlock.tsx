import { colorVars } from '@bolerish/tokens/semantic.stylex';
import * as stylex from '@stylexjs/stylex';
import { LightingSurface } from '../lighting/LightingSurface.js';
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
  hideLabel = false,
  language = 'tsx',
  compact = false,
}: {
  code: string;
  label?: string;
  hideLabel?: boolean;
  language?: 'tsx' | 'bash' | 'css' | 'text';
  compact?: boolean;
}) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'unavailable'>('idle');
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus('copied');
    } catch {
      setStatus('unavailable');
    }
  }
  return (
    <LightingSurface
      data-code-block
      className="code-block"
      xstyle={[styles.codeBlock, compact && styles.compact, stylex.defaultMarker()]}
    >
      <div {...stylex.props(styles.codeToolbar)}>
        <span {...stylex.props(hideLabel && styles.visuallyHidden)}>{label}</span>
        <Button size="sm" variant="ghost" aria-label={`Copy ${label}`} onClick={copy}>
          {status === 'copied' ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <Highlight prism={Prism} code={code} language={language} theme={codeTheme}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre
            {...stylex.props(styles.pre)}
            role="region"
            tabIndex={0}
            aria-label={`${label} code`}
          >
            <code {...stylex.props(styles.code)}>
              {tokens.map((line, index) => (
                <div key={index} {...getLineProps({ line })}>
                  {line.map((token, tokenIndex) => (
                    <span
                      key={tokenIndex}
                      {...getTokenProps({ token })}
                      className={
                        getTokenProps({ token }).className +
                        ' ' +
                        stylex.props(
                          ...token.types.map((type) =>
                            tokenCategories[type] ? tokenStyles[tokenCategories[type]] : undefined,
                          ),
                        ).className
                      }
                    />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
      <span
        {...stylex.props(status === 'unavailable' ? styles.copyError : styles.visuallyHidden)}
        role="status"
      >
        {status === 'copied'
          ? 'Copied'
          : status === 'unavailable'
            ? 'Copy unavailable. Select the code to copy it manually.'
            : ''}
      </span>
    </LightingSurface>
  );
}

const styles = stylex.create({
  compact: {
    margin: '0 0 10px',
  },
  codeBlock: { backgroundColor: colorVars.bgSubtle, marginBlock: 20, overflow: 'hidden' },
  codeToolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    fontSize: '11px',
    color: `${colorVars.fgSecondary}`,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars.strokeDefault,
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
  pre: {
    margin: '0',
    padding: {
      default: '18px 20px',
      '@media (max-width: 760px)': '16px',
    },
    overflow: 'auto',
    lineHeight: '1.8',
    tabSize: '4',
    fontSize: {
      default: '14px',
      '@media (max-width: 760px)': '14px',
    },
    outline: {
      default: null,
      ':focus-visible': `2px solid ${colorVars.fgPrimary}`,
    },
    outlineOffset: {
      default: null,
      ':focus-visible': '-2px',
    },
  },
  code: {
    fontSize: '0.88em',
    fontFamily: 'ui-monospace, monospace',
    whiteSpace: 'pre',
  },
});
const tokenCategories: Record<string, keyof typeof tokenStyles> = {
  comment: 'comment',
  prolog: 'comment',
  doctype: 'comment',
  cdata: 'comment',
  keyword: 'keyword',
  builtin: 'keyword',
  function: 'function',
  number: 'number',
  boolean: 'number',
  constant: 'number',
  string: 'string',
  char: 'string',
  'attr-value': 'string',
  tag: 'tag',
  'attr-name': 'attribute',
  'class-name': 'className',
  operator: 'punctuation',
  punctuation: 'punctuation',
};
const tokenStyles = stylex.create({
  comment: {
    color: {
      default: 'light-dark(#426849, #92b58b)',
      '@media (forced-colors: active)': 'CanvasText',
    },
  },
  keyword: {
    color: {
      default: 'light-dark(#0842a0, #80b7ed)',
      '@media (forced-colors: active)': 'CanvasText',
    },
  },
  function: {
    color: {
      default: 'light-dark(#0842a0, #dcdcaa)',
      '@media (forced-colors: active)': 'CanvasText',
    },
  },
  number: {
    color: {
      default: 'light-dark(#116329, #b5cea8)',
      '@media (forced-colors: active)': 'CanvasText',
    },
  },
  string: {
    color: {
      default: 'light-dark(#a31515, #e8ad93)',
      '@media (forced-colors: active)': 'CanvasText',
    },
  },
  tag: {
    color: {
      default: 'light-dark(#800000, #80b7ed)',
      '@media (forced-colors: active)': 'CanvasText',
    },
  },
  attribute: {
    color: {
      default: 'light-dark(#800000, #9cdcfe)',
      '@media (forced-colors: active)': 'CanvasText',
    },
  },
  className: {
    color: {
      default: 'light-dark(#176275, #65d0ba)',
      '@media (forced-colors: active)': 'CanvasText',
    },
  },
  punctuation: {
    color: {
      default: 'light-dark(#41454c, #c0c0c0)',
      '@media (forced-colors: active)': 'CanvasText',
    },
  },
});
