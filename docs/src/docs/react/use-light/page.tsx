import { apiReference } from '../api/reference.js';
import { m } from '../../../paraglide/messages.js';
import type { DocPage } from '../../_shared/types.js';
export const use_light: DocPage = {
  slug: 'react/use-light',
  section: 'React',
  navigationGroup: 'hooks',
  title: 'useLight',
  get description() {
    return m.use_light_summary();
  },
  get sections() {
    return apiReference.sections.filter((section) => ['use-light', 'refresh'].includes(section.id));
  },
};
