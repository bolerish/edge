import { cloneElement, type ReactElement, type ReactNode } from 'react';

/** Keep a translated sentence whole while allowing its inline links and code to move. */
export function inlineMessage(
  text: string,
  parts: Readonly<Record<string, ReactElement>>,
): ReactNode {
  return text.split(/(<part\d+\/>)/g).map((text, key) => {
    const index = /^<part(\d+)\/>$/.exec(text)?.[1];
    if (index === undefined) return text;
    const part = parts[`part${index}`];
    if (!part) throw new Error(`Missing inline message part: ${index}`);
    return cloneElement(part, { key });
  });
}
