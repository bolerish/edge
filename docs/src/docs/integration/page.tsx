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
  section: 'Guides',
  get title() {
    return m.integration();
  },
  get description() {
    return m.handle_decoration_conflicts_native_inputs_and_layout();
  },
  sections: [
    {
      id: 'existing-decorations',
      get title() {
        return m.keep_existing_decorations();
      },
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.edge_uses()}
              <code {...stylex.props(contentStyles.inlineCode)}>{'::after'}</code>
              {m.by_default_set()}
              <code {...stylex.props(contentStyles.inlineCode)}>{"pseudoElement: 'before'"}</code>
              {m.to_keep_an_existing()}
              <code {...stylex.props(contentStyles.inlineCode)}>{'::after'}</code>
              {m.if_both_pseudo_elements_are_occupied_decorate()}
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
            {m.native_inputs_do_not_reliably_display_pseudo()}{' '}
            <code {...stylex.props(contentStyles.inlineCode)}>{'label'}</code>
            {m.or()} <code {...stylex.props(contentStyles.inlineCode)}>{'div'}</code>
            {m.with_a_matching_radius_instead_keep_the()}{' '}
            <code {...stylex.props(contentStyles.inlineCode)}>{'recessed'}</code>
            {m.for_an_inset_appearance()}
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
              {m.size_changes_nested_scrolling_viewport_resizing_font()}{' '}
              <code {...stylex.props(contentStyles.inlineCode)}>{'light.refresh()'}</code>
              {m.once_the_new_layout_is_applied_it()}
            </P>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.see()}
              <Link href={localePath('/docs/react/api/#refresh')}>{'light.refresh()'}</Link>
              {m.for_the_react_call()}
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
            {m.edge_approximates_axis_aligned_rectangles_rotation_perspective()}{' '}
            <Link href={localePath('/docs/accessibility/')}>{m.accessibility()}</Link>.
          </P>
        );
      },
    },
  ],
};
