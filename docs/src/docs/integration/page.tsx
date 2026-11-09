import { inlineMessage } from '../_shared/inline-message.js';
import { localePath } from '../../shared/locale.js';
import { m } from '../../paraglide/messages.js';
import * as stylex from '@stylexjs/stylex';
import { contentStyles } from '../_shared/content-styles.js';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import { ExamplePreview } from '../_shared/ExamplePreview.js';
import { decorationSlotExample } from './_ui/DecorationSlotExample.js';
import type { DocPage } from '../_shared/types.js';

export const integration: DocPage = {
  slug: 'integration',
  aliases: ['accessibility', 'react/accessibility'],
  section: 'Guides',
  get title() {
    return m.integration();
  },
  get description() {
    return m.handle_decoration_conflicts_native_inputs_and_layout();
  },
  sections: [
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
      id: 'existing-decorations',
      get title() {
        return m.keep_existing_decorations();
      },
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {inlineMessage(m.pseudo_element_options(), {
                part0: <code {...stylex.props(contentStyles.inlineCode)}>{'::after'}</code>,
                part1: (
                  <code {...stylex.props(contentStyles.inlineCode)}>
                    {"pseudoElement: 'before'"}
                  </code>
                ),
                part2: <code {...stylex.props(contentStyles.inlineCode)}>{'::after'}</code>,
              })}
            </P>
            <ExamplePreview title={decorationSlotExample.title} code={decorationSlotExample.code}>
              <decorationSlotExample.Component />
            </ExamplePreview>
          </>
        );
      },
    },
    {
      id: 'wrap-inputs-you-own',
      get title() {
        return m.wrap_native_inputs();
      },
      get content() {
        return (
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            {inlineMessage(m.native_input_wrapper(), {
              part0: <code {...stylex.props(contentStyles.inlineCode)}>{'label'}</code>,
              part1: <code {...stylex.props(contentStyles.inlineCode)}>{'div'}</code>,
              part2: <code {...stylex.props(contentStyles.inlineCode)}>{'recessed'}</code>,
            })}
          </P>
        );
      },
    },
    {
      id: 'refresh-after-layout-changes',
      get title() {
        return m.refresh_after_layout_changes();
      },
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {inlineMessage(m.manual_layout_refresh(), {
                part0: <code {...stylex.props(contentStyles.inlineCode)}>{'light.refresh()'}</code>,
              })}
            </P>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {inlineMessage(m.react_refresh_link(), {
                part0: (
                  <Link href={localePath('/docs/react/use-light/#refresh')}>
                    {'light.refresh()'}
                  </Link>
                ),
              })}
            </P>
          </>
        );
      },
    },
    {
      id: 'geometry-limits',
      get title() {
        return m.geometry_and_document_boundaries();
      },
      get content() {
        return (
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            {inlineMessage(m.geometry_limits_link(), {
              part0: (
                <Link href={localePath('/docs/integration/#preserve-native-interactions')}>
                  {m.accessibility()}
                </Link>
              ),
            })}
          </P>
        );
      },
    },
  ],
};
