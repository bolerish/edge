import type { ReactNode } from 'react';

/** Static supporting information; it must not announce itself as a live alert. */
export function Note({ title, children }: { title: string; children: ReactNode }) {
  return <div role="note" aria-label={title} className="doc-note"><strong>{title}</strong>{children}</div>;
}
