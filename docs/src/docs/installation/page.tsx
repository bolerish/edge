import { inlineMessage } from '../_shared/inline-message.js';
import { localePath } from '../../shared/locale.js';
import { m } from '../../paraglide/messages.js';
import * as stylex from '@stylexjs/stylex';
import { contentStyles } from '../_shared/content-styles.js';
import { InstallCommands } from '../../shared/installation/InstallCommands.js';
import { CodeBlock } from '../../shared/code/CodeBlock.js';
import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import type { DocPage } from '../_shared/types.js';

export const installation: DocPage = {
  slug: 'installation',
  section: 'Getting started',
  get title() {
    return m.installation();
  },
  get description() {
    return m.install_edge_and_load_its_stylesheet();
  },
  sections: [
    {
      id: 'installation',
      get title() {
        return m.installation();
      },
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.the_react_adapter_requires_react_18_or()}
            </P>
            <InstallCommands />
          </>
        );
      },
    },
    {
      id: 'stylesheet',
      get title() {
        return m.load_the_stylesheet();
      },
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.load_the_stylesheet_once_before_application_and()}
            </P>
            <CodeBlock label={m.ssr_styles()} code={'<Edge.Styles nonce={nonce} />'} />
            <CodeBlock
              label={m.optional_css_import()}
              language="css"
              code={'@import "@bolerish/edge/style.css";'}
            />
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.the_css_alternative_needs_a_build_tool()}
            </P>
          </>
        );
      },
    },
    {
      id: 'next-steps',
      get title() {
        return m.start_using_edge();
      },
      get content() {
        return (
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            {inlineMessage(m.installation_next_steps(), {
              part0: <Link href={localePath('/docs/usage/')}>{m.usage()}</Link>,
              part1: <Link href={localePath('/docs/react/usage/')}>{m.react_integration()}</Link>,
            })}
          </P>
        );
      },
    },
  ],
};
