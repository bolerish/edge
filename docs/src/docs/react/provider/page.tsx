import { apiReference } from '../api/reference.js';
import { m } from '../../../paraglide/messages.js';
import type { DocPage } from '../../_shared/types.js';
export const provider: DocPage = {
  slug: 'react/provider',
  section: 'React',
  title: 'Edge.Provider',
  get description() {
    return m.provider_summary();
  },
  get sections() {
    return apiReference.sections.filter((section) => ['lighting'].includes(section.id));
  },
};
