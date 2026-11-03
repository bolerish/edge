import type { ReactNode } from 'react';
export interface DocPage {
  slug: string;
  title: string;
  description: string;
  sections: { id: string; title: string; content: ReactNode }[];
}
