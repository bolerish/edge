import { apiReference } from '../api/reference.js';
import { m } from '../../../paraglide/messages.js';
import type { DocPage } from '../../_shared/types.js';
export const hooks: DocPage = {
  slug: 'react/hooks',
  section: 'React',
  get title() {
    return m.react_hooks();
  },
  get description() {
    return m.react_hooks_description();
  },
  sections: ['use-light', 'use-surface', 'refresh'].map((id) =>
    apiReference.sections.find((section) => section.id === id)!,
  ),
};
