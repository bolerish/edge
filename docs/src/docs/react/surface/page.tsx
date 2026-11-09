import { apiReference } from '../api/reference.js';
import { m } from '../../../paraglide/messages.js';
import type { DocPage } from '../../_shared/types.js';
export const surface: DocPage = {
  slug: 'react/surface',
  section: 'React',
  navigationGroup: 'components',
  title: 'Edge.Surface',
  get description() {
    return m.surface_summary();
  },
  get sections() {
    return apiReference.sections.filter((section) => ['lighting-surface'].includes(section.id));
  },
};
