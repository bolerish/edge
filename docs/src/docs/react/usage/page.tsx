import { inlineMessage } from '../../_shared/inline-message.js';
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
    return m.usage();
  },
  get description() {
    return m.react_api_choice();
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
              {inlineMessage(m.react_installation_boundary(), {
                part0: <Link href={localePath('/docs/installation/')}>{m.installation()}</Link>,
                part1: <code {...stylex.props(contentStyles.inlineCode)}>{'"use client"'}</code>,
              })}
            </P>
            <span id="create-your-first-surface" />
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {inlineMessage(m.react_shared_area(), {
                part0: <code {...stylex.props(contentStyles.inlineCode)}>{'Edge.Provider'}</code>,
                part1: <code {...stylex.props(contentStyles.inlineCode)}>{'Edge.Surface'}</code>,
              })}
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
              {inlineMessage(m.react_native_props(), {
                part0: <code {...stylex.props(contentStyles.inlineCode)}>{'as'}</code>,
                part1: <code {...stylex.props(contentStyles.inlineCode)}>{'className'}</code>,
                part2: <code {...stylex.props(contentStyles.inlineCode)}>{'style'}</code>,
              })}
            </P>
            <CodeBlock
              label={m.style_composition()}
              code={
                '<Edge.Surface as="button" type="button" onClick={handleExampleClick}>\n  Example button\n</Edge.Surface>'
              }
            />
            <span id="wrap-inputs-you-own" />
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {inlineMessage(m.react_integration_links(), {
                part0: <Link href={localePath('/docs/integration/')}>{m.integration()}</Link>,
                part1: <Link href={localePath('/docs/styles/')}>{m.style()}</Link>,
                part2: <Link href={localePath('/docs/motion/')}>{m.motion()}</Link>,
              })}
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
              {inlineMessage(m.react_existing_component(), {
                part0: (
                  <Link href={localePath('/docs/react/use-surface/#use-surface')}>
                    {'useSurface(options)'}
                  </Link>
                ),
                part1: <code {...stylex.props(contentStyles.inlineCode)}>{'forwardRef'}</code>,
              })}
            </P>
            <span id="refresh-after-layout-changes" />
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {inlineMessage(m.position_change_link(), {
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
  ],
};
