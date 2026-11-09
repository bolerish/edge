import type { ReactNode } from 'react';
export interface DocPage {
  slug: string;
  navigation?: boolean;
  aliases?: string[];
  section?: 'Getting started' | 'Styles' | 'Guides' | 'React';
  title: string;
  description: string;
  sections: { id: string; title: string; content: ReactNode }[];
}
