import { localePath } from '../../shared/locale.js';
import { m } from '../../paraglide/messages.js';
import * as stylex from '@stylexjs/stylex';
import { contentStyles } from '../_shared/content-styles.js';
import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import { CodeBlock } from '../../shared/code/CodeBlock.js';
import type { DocPage } from '../_shared/types.js';

export const aiIntegration: DocPage = {
  slug: 'ai-integration',
  section: 'Guides',
  get title() {
    return m.ai_integration();
  },
  get description() {
    return m.give_your_assistant_current_edge_documentation_before();
  },
  sections: [
    {
      id: 'llms-txt',
      get title() {
        return m.read_the_documentation();
      },
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.start_with()}
              <Link href={localePath('/llms.txt')}>{'llms.txt'}</Link>
              {m.for_a_short_index_linking_to_markdown()}{' '}
              <Link href={localePath('/llms-full.txt')}>{'llms-full.txt'}</Link>
              {m.when_your_assistant_needs_all_the_documentation()}
            </P>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.these_files_are_generated_from_the_same()}
            </P>
          </>
        );
      },
    },
    {
      id: 'prompt',
      get title() {
        return m.give_your_assistant_context();
      },
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.include_your_existing_component_and_the_area()}
            </P>
            <CodeBlock
              label={m.assistant_prompt()}
              language="text"
              code={`Read https://edge.bolerish.com/llms.txt and follow the relevant Markdown links.
Check the installed @bolerish/edge version and its types before choosing APIs.
Add Edge to the component below, preserving its markup, colors and interactions.
Connect only the surfaces I specify. Keep native controls and focus indicators.
Use the library's default motion="system" unless I ask for another mode.`}
            />
          </>
        );
      },
    },
    {
      id: 'installed-version',
      get title() {
        return m.match_the_installed_version();
      },
      get content() {
        return (
          <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
            {m.check_your_package_manifest_or_lockfile_web()}
          </P>
        );
      },
    },
  ],
};
