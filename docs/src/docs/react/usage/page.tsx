import { localePath } from '../../../shared/locale.js';
import { m } from '../../../paraglide/messages.js';
import * as stylex from '@stylexjs/stylex';
import { contentStyles } from '../../_shared/content-styles.js';
import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import { CodeBlock } from '../../../shared/code/CodeBlock.js';
import { sharedLightExample } from './_ui/SharedLightExample.js';
import { ExamplePreview } from '../../_shared/ExamplePreview.js';
import type { DocPage } from '../../_shared/types.js';

export const reactIntegration: DocPage = {
  slug: 'react/usage',
  aliases: ['react'],
  section: 'React',
  get title() {
    return m.integration();
  },
  get description() {
    return m.connect_components_to_a_shared_light_with();
  },
  sections: [
    {
      id: 'share-one-light',
      get title() {
        return m.connect_an_area();
      },
      get content() {
        return (
          <>
            <span id="package-installation" />
            <span id="prepare-the-workspace" />
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.complete()}
              <Link href={localePath('/docs/installation/')}>{m.installation()}</Link>
              {m.first_in_server_component_frameworks_use_edge()}{' '}
              <code {...stylex.props(contentStyles.inlineCode)}>{'"use client"'}</code>.
            </P>
            <span id="create-your-first-surface" />
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.wrap_the_area_in()}
              <code {...stylex.props(contentStyles.inlineCode)}>{'Edge.Provider'}</code>{' '}
              {m.and_mark_each_responding_element_with()}{' '}
              <code {...stylex.props(contentStyles.inlineCode)}>{'Edge.Surface'}</code>
              {m.the_two_cards_below_share_one_light()}
            </P>
            <ExamplePreview title={sharedLightExample.title} code={sharedLightExample.code}>
              <sharedLightExample.Component />
            </ExamplePreview>
          </>
        );
      },
    },
    {
      id: 'keep-your-styles',
      get title() {
        return m.keep_your_styles_and_events();
      },
      get content() {
        return (
          <>
            <span id="load-the-stylesheet" />
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.use()}
              <code {...stylex.props(contentStyles.inlineCode)}>{'as'}</code>
              {m.to_choose_the_html_element_native_attributes()}{' '}
              <code {...stylex.props(contentStyles.inlineCode)}>{'className'}</code>
              {m.and()} <code {...stylex.props(contentStyles.inlineCode)}>{'style'}</code>
              {m.props_apply_your_styles_the_provider_adds()}
            </P>
            <CodeBlock
              label={m.style_composition()}
              code={
                '<Edge.Surface as="button" type="button" onClick={handleExampleClick}>\n  Example button\n</Edge.Surface>'
              }
            />
            <span id="wrap-inputs-you-own" />
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.inputs_need_a_wrapper_if_an_existing()}{' '}
              <Link href={localePath('/docs/integration/')}>{m.integration()}</Link>
              {m.choose_appearance_and_movement_in()}{' '}
              <Link href={localePath('/docs/styles/')}>{m.style()}</Link>
              {m.and()}
              <Link href={localePath('/docs/motion/')}>{m.motion()}</Link>.
            </P>
          </>
        );
      },
    },
    {
      id: 'connect-existing-components',
      get title() {
        return m.connect_an_existing_component();
      },
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.if_a_card_or_button_already_renders()}{' '}
              <Link href={localePath('/docs/react/api/#use-surface')}>{'useSurface(options)'}</Link>
              {m.inside_it_and_attach_the_returned_ref()}{' '}
              <code {...stylex.props(contentStyles.inlineCode)}>{'forwardRef'}</code>.
            </P>
            <span id="refresh-after-layout-changes" />
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.for_position_changes_see()}{' '}
              <Link href={localePath('/docs/integration/#refresh-after-layout-changes')}>
                {m.layout_updates()}
              </Link>
              .
            </P>
          </>
        );
      },
    },
  ],
};
