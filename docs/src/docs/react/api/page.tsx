import { localePath } from '../../../shared/locale.js';
import { m } from '../../../paraglide/messages.js';
import { Banner } from '@bolerish/ui/banner';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableContainer,
} from '@bolerish/ui/table';
import * as stylex from '@stylexjs/stylex';
import { contentStyles } from '../../_shared/content-styles.js';
import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import { CodeBlock } from '../../../shared/code/CodeBlock.js';
import {
  apiTable,
  providerPropRows,
  lightOptionRows,
  surfacePropRows,
  surfaceOptionRows,
} from '../../_shared/api-options.js';
import type { DocPage } from '../../_shared/types.js';

export const api: DocPage = {
  slug: 'react/api',
  aliases: ['api'],
  section: 'React',
  get title() {
    return m.api_reference();
  },
  get description() {
    return m.component_props_hook_signatures_defaults_and_rendering();
  },
  sections: [
    {
      id: 'lighting',
      get title() {
        return 'Edge.Provider';
      },
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.shares_one_light_with_descendant_surfaces_without()}
            </P>
            <CodeBlock
              label={m.edge_provider_signature()}
              code={
                '<Edge.Provider motion="system" radius={480} intensity={0.75}>\n  {/* Your surfaces */}\n</Edge.Provider>'
              }
            />
            {apiTable('Edge.Provider props', providerPropRows)}
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.pointer_input_comes_from_the_document_the()}
              <code {...stylex.props(contentStyles.inlineCode)}>{' staticDirection'}</code>
              {m.applies_whenever_fixed_lighting_is_active_including()}{' '}
              <code {...stylex.props(contentStyles.inlineCode)}>{'motion="system"'}</code>
              {m.respects_reduced_motion()}
            </P>
          </>
        );
      },
    },
    {
      id: 'lighting-surface',
      get title() {
        return 'Edge.Surface';
      },
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.renders_one_html_element_connected_to_the()}
              <code {...stylex.props(contentStyles.inlineCode)}>{'as'}</code>.
            </P>
            <CodeBlock
              label={m.edge_surface_signature()}
              code={
                '<Edge.Surface as="article" edgeStyle="raised">\n  Your content\n</Edge.Surface>'
              }
            />
            {apiTable('Edge.Surface props', surfacePropRows)}
            <Banner
              role="note"
              aria-label={m.surface_ownership()}
              className="doc-note"
              xstyle={contentStyles.docNote}
            >
              <P xstyle={contentStyles.noteParagraph}>
                {m.place_every()}
                <code {...stylex.props(contentStyles.inlineCode)}>{'Edge.Surface'}</code>{' '}
                {m.inside_a()}
                <code {...stylex.props(contentStyles.inlineCode)}>{' Edge.Provider'}</code>
                {m.owner_rendering_it_outside_one_throws_an()}
                <Link href={localePath('/docs/integration/')}>{m.integration()}</Link>.
              </P>
            </Banner>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.decoration_aligns_with_the_outside_of_the()}
              <Link href="#use-surface">{'useSurface'}</Link>.
            </P>
          </>
        );
      },
    },
    {
      id: 'use-surface',
      get title() {
        return 'useSurface(options?)';
      },
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.returns_a_callback_ref_that_connects_an()}{' '}
              <code {...stylex.props(contentStyles.inlineCode)}>{'className'}</code>
              {m.and()} <code {...stylex.props(contentStyles.inlineCode)}>{'style'}</code>.
            </P>
            <CodeBlock
              label={m.usesurface_signature()}
              code={'const ref = useSurface<HTMLElement>(options);'}
            />
            <CodeBlock
              label={m.share_one_light_with_existing_components()}
              code={`function Area() {
  return <Edge.Provider><ExistingCard /><ExistingCard /></Edge.Provider>;
}

function ExistingCard() {
  const ref = useSurface<HTMLDivElement>();
  return <Card ref={ref}>Your existing component</Card>;
}`}
            />
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.in_react_18_an_existing_function_component()}{' '}
              <code {...stylex.props(contentStyles.inlineCode)}>{'forwardRef'}</code>
              {m.to_pass_the_ref_to_its_html()}
            </P>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.without_an_explicit_light_this_hook_requires()}
              <code {...stylex.props(contentStyles.inlineCode)}>
                {'useSurface(light, options)'}
              </code>{' '}
              {m.with_a_handle_returned_by()}{' '}
              <code {...stylex.props(contentStyles.inlineCode)}>{'useLight'}</code>
              {m.the_explicit_light_takes_precedence_over_the()}
            </P>
            {apiTable('useSurface options', surfaceOptionRows)}
            <Banner
              role="note"
              aria-label={m.one_owner_per_element()}
              className="doc-note"
              xstyle={contentStyles.docNote}
            >
              <P xstyle={contentStyles.noteParagraph}>{m.an_element_can_belong_to_only_one()}</P>
            </Banner>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.options_update_without_replacing_the_element_hook()}
              <code {...stylex.props(contentStyles.inlineCode)}>{'Edge.Surface'}</code>
              {m.to_include_appearance_classes_and_variables_in()}
            </P>
          </>
        );
      },
    },
    {
      id: 'use-light',
      get title() {
        return 'useLight(options?)';
      },
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.returns_a_stable()}
              <code {...stylex.props(contentStyles.inlineCode)}>{'Light'}</code>
              {m.handle_for_explicit_ownership_without_a_provider()}{' '}
              <code {...stylex.props(contentStyles.inlineCode)}>
                {'useSurface(light, options)'}
              </code>
              {m.option_changes_update_the_existing_light_use()}{' '}
              <code {...stylex.props(contentStyles.inlineCode)}>{'Edge.Provider'}</code>
              {m.for_ordinary_component_trees()}
            </P>
            <CodeBlock
              label={m.uselight_signature()}
              code={'function useLight(options?: LightOptions): Light;'}
            />
            {apiTable('useLight options', lightOptionRows)}
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              <code {...stylex.props(contentStyles.inlineCode)}>{'radius'}</code>
              {m.affects_dynamic_lighting_only_fixed_lighting_uses()}
              <code {...stylex.props(contentStyles.inlineCode)}>{' staticDirection'}</code>
              {m.without_distance_attenuation()}
            </P>
          </>
        );
      },
    },
    {
      id: 'refresh',
      get title() {
        return 'light.refresh()';
      },
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.remeasures_surfaces_on_the_next_frame_even()}
            </P>
            <CodeBlock
              label={m.refresh_signature()}
              code={`interface Light {
  refresh(): void;
}`}
            />
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.size_changes_and_scrolling_are_handled_automatically()}{' '}
              <Link href={localePath('/docs/integration/#refresh-after-layout-changes')}>
                {m.layout_updates()}
              </Link>
              {m.for_details()}
            </P>
          </>
        );
      },
    },
    {
      id: 'rendering-and-cleanup',
      get title() {
        return m.rendering_and_cleanup();
      },
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.server_rendering_does_not_access_the_dom()}
            </P>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              <code {...stylex.props(contentStyles.inlineCode)}>{'Edge.Surface'}</code>
              {m.includes_appearance_classes_and_variables_in_server()}
              <code {...stylex.props(contentStyles.inlineCode)}>{' useSurface'}</code>
              {m.leaves_your_markup_unchanged_until_hydration_geometry()}
            </P>
            <TableContainer
              className={`table-scroll ${stylex.props(contentStyles.tableScroll).className}`}
              role="region"
              aria-label={m.rendering_modes_table()}
              tabIndex={0}
            >
              <Table className={`api-table ${stylex.props(contentStyles.apiTable).className}`}>
                <TableCaption
                  xstyle={[contentStyles.tableCaption]}
                  className={`visually-hidden ${stylex.props(contentStyles.visuallyHidden).className}`}
                >
                  {m.rendering_modes()}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead xstyle={[contentStyles.tableCell]} scope="col">
                      {m.mode()}
                    </TableHead>
                    <TableHead xstyle={[contentStyles.tableCell]} scope="col">
                      {m.behavior()}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableHead xstyle={[contentStyles.tableCell]} scope="row">
                      {'CSR'}
                    </TableHead>
                    <TableCell xstyle={[contentStyles.tableCell, contentStyles.tableData]}>
                      {m.the_provider_and_marked_hosts_activate_after()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead xstyle={[contentStyles.tableCell]} scope="row">
                      {'SSR'}
                    </TableHead>
                    <TableCell xstyle={[contentStyles.tableCell, contentStyles.tableData]}>
                      {m.use_rendertostring_with_hydrateroot_native_content_and()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead xstyle={[contentStyles.tableCell]} scope="row">
                      {m.streaming_ssr()}
                    </TableHead>
                    <TableCell xstyle={[contentStyles.tableCell, contentStyles.tableData]}>
                      {m.node_rendertopipeablestream_and_web_rendertoreadablestream_can_se()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead xstyle={[contentStyles.tableCell]} scope="row">
                      {m.ssg_with_hydration()}
                    </TableHead>
                    <TableCell xstyle={[contentStyles.tableCell, contentStyles.tableData]}>
                      {m.generate_hydratable_html_at_build_time_for()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead xstyle={[contentStyles.tableCell]} scope="row">
                      {m.static_html()}
                    </TableHead>
                    <TableCell xstyle={[contentStyles.tableCell, contentStyles.tableData]}>
                      {m.rendertostaticmarkup_produces_html_that_cannot_be_hydrated()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.in_server_component_frameworks_use_edge_inside()}{' '}
              <code {...stylex.props(contentStyles.inlineCode)}>{'"use client"'}</code>.
            </P>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.react_18_and_19_are_supported_web()}
            </P>
          </>
        );
      },
    },
  ],
};
