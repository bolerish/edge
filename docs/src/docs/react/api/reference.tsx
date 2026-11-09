import { inlineMessage } from '../../_shared/inline-message.js';
import { localePath } from '../../../shared/locale.js';
import { m } from '../../../paraglide/messages.js';
import { Banner } from '@bolerish/ui/banner';
import * as stylex from '@stylexjs/stylex';
import { contentStyles } from '../../_shared/content-styles.js';
import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import { CodeBlock } from '../../../shared/code/CodeBlock.js';
import {
  apiTable,
  providerPropRows,
  stylesPropRows,
  lightOptionRows,
  surfacePropRows,
  surfaceOptionRows,
} from '../../_shared/api-options.js';
import type { DocPage } from '../../_shared/types.js';

export const apiReference: DocPage = {
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
      id: 'styles',
      title: 'Edge.Styles',
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.styles_usage()}
            </P>
            <CodeBlock label="Edge.Styles" code={'<Edge.Styles nonce={nonce} />'} />
            {apiTable('Edge.Styles props', stylesPropRows)}
          </>
        );
      },
    },
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
              {inlineMessage(m.provider_input(), {
                part0: <code {...stylex.props(contentStyles.inlineCode)}>{'staticDirection'}</code>,
                part1: <code {...stylex.props(contentStyles.inlineCode)}>{'motion="system"'}</code>,
              })}
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
              {inlineMessage(m.surface_element(), {
                part0: <code {...stylex.props(contentStyles.inlineCode)}>{'as'}</code>,
              })}
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
                {inlineMessage(m.surface_provider_requirement(), {
                  part0: <code {...stylex.props(contentStyles.inlineCode)}>{'Edge.Surface'}</code>,
                  part1: <code {...stylex.props(contentStyles.inlineCode)}>{'Edge.Provider'}</code>,
                  part2: <Link href={localePath('/docs/integration/')}>{m.integration()}</Link>,
                })}
              </P>
            </Banner>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {inlineMessage(m.surface_existing_element(), {
                part0: (
                  <Link href={localePath('/docs/react/use-surface/#use-surface')}>
                    {'useSurface'}
                  </Link>
                ),
              })}
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
              {inlineMessage(m.use_surface_ref(), {
                part0: <code {...stylex.props(contentStyles.inlineCode)}>{'className'}</code>,
                part1: <code {...stylex.props(contentStyles.inlineCode)}>{'style'}</code>,
              })}
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
              {inlineMessage(m.react_ref_versions(), {
                part0: <code {...stylex.props(contentStyles.inlineCode)}>{'forwardRef'}</code>,
              })}
            </P>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {inlineMessage(m.explicit_light_override(), {
                part0: (
                  <code {...stylex.props(contentStyles.inlineCode)}>
                    {'useSurface(light, options)'}
                  </code>
                ),
                part1: <code {...stylex.props(contentStyles.inlineCode)}>{'useLight'}</code>,
              })}
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
              {inlineMessage(m.hook_server_appearance(), {
                part0: <code {...stylex.props(contentStyles.inlineCode)}>{'Edge.Surface'}</code>,
              })}
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
              {inlineMessage(m.use_light_handle(), {
                part0: <code {...stylex.props(contentStyles.inlineCode)}>{'Light'}</code>,
                part1: (
                  <code {...stylex.props(contentStyles.inlineCode)}>
                    {'useSurface(light, options)'}
                  </code>
                ),
                part2: <code {...stylex.props(contentStyles.inlineCode)}>{'Edge.Provider'}</code>,
              })}
            </P>
            <CodeBlock
              label={m.uselight_signature()}
              code={'function useLight(options?: LightOptions): Light;'}
            />
            {apiTable('useLight options', lightOptionRows)}
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {inlineMessage(m.light_radius_modes(), {
                part0: <code {...stylex.props(contentStyles.inlineCode)}>{'radius'}</code>,
                part1: <code {...stylex.props(contentStyles.inlineCode)}>{'staticDirection'}</code>,
              })}
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
              {inlineMessage(m.automatic_layout_updates(), {
                part0: (
                  <Link href={localePath('/docs/integration/#refresh-after-layout-changes')}>
                    {m.layout_updates()}
                  </Link>
                ),
              })}
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
              {inlineMessage(m.component_hook_rendering(), {
                part0: <code {...stylex.props(contentStyles.inlineCode)}>{'Edge.Surface'}</code>,
                part1: <code {...stylex.props(contentStyles.inlineCode)}>{'useSurface'}</code>,
              })}
            </P>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {inlineMessage(m.server_component_boundary(), {
                part0: <code {...stylex.props(contentStyles.inlineCode)}>{'"use client"'}</code>,
              })}
            </P>
          </>
        );
      },
    },
  ],
};
