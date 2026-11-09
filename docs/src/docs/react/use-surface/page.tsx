import { apiReference } from '../api/reference.js';
import { m } from '../../../paraglide/messages.js';
import type { DocPage } from '../../_shared/types.js';
export const use_surface: DocPage = {
  slug: 'react/use-surface',
  section: 'React',
  navigationGroup: 'hooks',
  title: 'useSurface',
  get description() {
    return m.use_surface_summary();
  },
  get sections() {
    return apiReference.sections.filter((section) => ['use-surface'].includes(section.id));
  },
};
