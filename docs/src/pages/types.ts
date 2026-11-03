import type { ReactNode } from 'react';
export interface DocPage {
  slug: string;
  aliases?: string[];
  section?: string;
  title: string;
  description: string;
  sections: { id: string; title: string; content: ReactNode }[];
}
