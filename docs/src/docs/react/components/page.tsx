import { apiReference } from '../api/reference.js';
import { m } from '../../../paraglide/messages.js';
import type { DocPage } from '../../_shared/types.js';
export const components: DocPage = {
  slug: 'react/components',
  section: 'React',
  navigation: false,
  get title() {
    return m.react_components();
  },
  get description() {
    return m.react_components_description();
  },
  sections: ['lighting', 'lighting-surface', 'styles'].map((id) =>
    apiReference.sections.find((section) => section.id === id)!,
  ),
};
