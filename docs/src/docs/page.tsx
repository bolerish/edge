import { localePath } from '../shared/locale.js';
import { m } from '../paraglide/messages.js';
import * as stylex from '@stylexjs/stylex';
import { contentStyles } from './_shared/content-styles.js';
import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import type { DocPage } from './_shared/types.js';

export const introduction: DocPage = {
  slug: '',
  aliases: ['getting-started', 'introduction'],
  section: 'Getting started',
  get title() {
    return m.introduction();
  },
  get description() {
    return m.subtle_highlights_for_your_ui_with_your();
  },
  sections: [
    {
      id: 'one-shared-light',
      get title() {
        return m.a_little_more_alive();
      },
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.group_elements_under_one_shared_light_and()}
            </P>
          </>
        );
      },
    },
    {
      id: 'choose-your-framework',
      get title() {
        return m.start_using_edge();
      },
      get content() {
        return (
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            <span id="installation" />
            <span id="stylesheet" />
            {m.start_with()}
            <Link href={localePath('/docs/installation/')}>{m.installation()}</Link>
            {m.learn_the_concepts_in()} <Link href={localePath('/docs/usage/')}>{m.usage()}</Link>
            {m.then_follow()}{' '}
            <Link href={localePath('/docs/react/usage/')}>{m.react_integration()}</Link>
            {m.find_settings_in_the()}{' '}
            <Link href={localePath('/docs/react/api/')}>{m.api_reference()}</Link>.
          </P>
        );
      },
    },
  ],
};
