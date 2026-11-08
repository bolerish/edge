import { inlineMessage } from '../_shared/inline-message.js';
import { localePath } from '../../shared/locale.js';
import { m } from '../../paraglide/messages.js';
import * as stylex from '@stylexjs/stylex';
import { contentStyles } from '../_shared/content-styles.js';
import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import type { DocPage } from '../_shared/types.js';
export const accessibility: DocPage = {
  slug: 'accessibility',
  aliases: ['react/accessibility'],
  section: 'Guides',
  get title() {
    return m.accessibility();
  },
  get description() {
    return m.keep_components_readable_and_operable_without_lighting();
  },
  sections: [
    {
      id: 'choose-an-input-mode',
      get title() {
        return m.choose_motion_behavior();
      },
      get content() {
        return (
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            {inlineMessage(m.accessible_motion_choice(), {
              part0: <code {...stylex.props(contentStyles.inlineCode)}>{'system'}</code>,
              part1: <code {...stylex.props(contentStyles.inlineCode)}>{'dynamic'}</code>,
              part2: <Link href={localePath('/docs/motion/')}>{m.motion()}</Link>,
            })}
          </P>
        );
      },
    },
    {
      id: 'preserve-native-interactions',
      get title() {
        return m.preserve_native_interactions();
      },
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.keep_labels_text_contrast_base_borders_and()}
            </P>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.forced_colors_mode_hides_decoration_communicate_selection()}
            </P>
          </>
        );
      },
    },
    {
      id: 'understand-rendering-cost',
      get title() {
        return m.understand_rendering_cost();
      },
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.each_light_queues_at_most_one_frame()}
            </P>
          </>
        );
      },
    },
  ],
};
