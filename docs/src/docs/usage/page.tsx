import { ReactLogo } from './_ui/ReactLogo.js';
import { inlineMessage } from '../_shared/inline-message.js';
import { Card, CardHeader, CardTitle } from '@bolerish/ui/card';
import { localePath } from '../../shared/locale.js';
import { m } from '../../paraglide/messages.js';
import * as stylex from '@stylexjs/stylex';
import { contentStyles } from '../_shared/content-styles.js';
import { Link } from '@bolerish/ui/link';
import { Paragraph as P } from '@bolerish/ui/paragraph';
import type { DocPage } from '../_shared/types.js';

export const usage: DocPage = {
  slug: 'usage',
  section: 'Getting started',
  get title() {
    return m.usage();
  },
  get description() {
    return m.understand_lights_and_surfaces_before_connecting_your();
  },
  sections: [
    {
      id: 'share-one-light',
      get title() {
        return m.choose_an_area();
      },
      get content() {
        return (
          <>
            <span id="package-installation" />
            <span id="prepare-the-workspace" />
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.a_light_controls_a_group_of_surfaces()}
            </P>
            <span id="create-your-first-surface" />
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.a_surface_is_an_element_connected_to()}
            </P>
          </>
        );
      },
    },
    {
      id: 'keep-your-styles',
      get title() {
        return m.keep_your_ui();
      },
      get content() {
        return (
          <>
            <span id="load-the-stylesheet" />
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.edge_keeps_your_background_text_spacing_and()}
            </P>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {inlineMessage(m.style_and_motion_links(), {
                part0: <Link href={localePath('/docs/styles/')}>{m.style()}</Link>,
                part1: <Link href={localePath('/docs/motion/')}>{m.motion()}</Link>,
              })}
            </P>
            <span id="wrap-inputs-you-own" />
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {inlineMessage(m.input_integration_link(), {
                part0: (
                  <Link href={localePath('/docs/integration/#wrap-inputs-you-own')}>
                    {m.integration()}
                  </Link>
                ),
              })}
            </P>
            <span id="refresh-after-layout-changes" />
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {inlineMessage(m.application_layout_link(), {
                part0: (
                  <Link href={localePath('/docs/integration/#refresh-after-layout-changes')}>
                    {m.layout_changes()}
                  </Link>
                ),
              })}
            </P>
          </>
        );
      },
    },
    {
      id: 'connect-existing-components',
      get title() {
        return m.connect_your_components();
      },
      get content() {
        return (
          <>
            <P {...stylex.props(stylex.defaultMarker())} xstyle={contentStyles.paragraph}>
              {m.framework_guide_description()}
            </P>
            <Link
              variant="plain"
              href={localePath('/docs/react/usage/')}
              {...stylex.props(frameworkStyles.link)}
            >
              <Card>
                <CardHeader>
                  <ReactLogo />
                  <CardTitle>React</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          </>
        );
      },
    },
  ],
};

const frameworkStyles = stylex.create({
  link: { display: 'inline-block', marginBlockStart: 20, textDecoration: 'none' },
});
