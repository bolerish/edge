import { apiReference } from './reference.js';
import { components } from '../components/page.js';
import { hooks } from '../hooks/page.js';
import { Link } from '@bolerish/ui/link';
import { localePath } from '../../../shared/locale.js';
import { m } from '../../../paraglide/messages.js';
import type { DocPage } from '../../_shared/types.js';
export const api: DocPage = {
  slug: 'react/api',
  aliases: ['api'],
  section: 'React',
  get title() {
    return m.react_api_overview();
  },
  get description() {
    return m.react_api_overview_description();
  },
  get sections() {
    const links: DocPage['sections'] = [components, hooks].flatMap((page) =>
      page.sections.map((section) => ({
        id: section.id,
        title: section.title,
        content: (
          <Link href={localePath(`/docs/${page.slug}/#${section.id}`)}>
            {page.title} → {section.title}
          </Link>
        ),
      })),
    );
    return [
      ...links,
      ...apiReference.sections.filter((section) => section.id === 'rendering-and-cleanup'),
    ];
  },
};
