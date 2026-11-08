import * as stylex from '@stylexjs/stylex';
import { Card, CardHeader, CardTitle, CardDescription } from '@bolerish/ui/card';
import { Heading } from '@bolerish/ui/heading';
import { m } from '../paraglide/messages.js';

export function Benefits() {
  const benefits = [
    { title: m.benefit_keep_ui_title(), description: m.benefit_keep_ui_description() },
    { title: m.benefit_shared_title(), description: m.benefit_shared_description() },
    { title: m.benefit_explicit_title(), description: m.benefit_explicit_description() },
    { title: m.benefit_preferences_title(), description: m.benefit_preferences_description() },
  ];
  return (
    <section aria-labelledby="why-edge" {...stylex.props(styles.section)}>
      <Heading id="why-edge" level={2} size="section">
        {m.why_edge()}
      </Heading>
      <div {...stylex.props(styles.grid)}>
        {benefits.map((benefit) => (
          <Card key={benefit.title}>
            <CardHeader>
              <CardTitle>{benefit.title}</CardTitle>
              <CardDescription>{benefit.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
const styles = stylex.create({
  section: { display: 'grid', gap: 20, marginBlock: '0 56px' },
  grid: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: {
      default: 'repeat(4, minmax(0, 1fr))',
      '@media (max-width: 1100px)': 'repeat(2, minmax(0, 1fr))',
      '@media (max-width: 600px)': 'minmax(0, 1fr)',
    },
  },
});
