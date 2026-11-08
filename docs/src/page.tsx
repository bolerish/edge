import { Benefits } from './_ui/Benefits.js';
import { localePath } from './shared/locale.js';
import { m } from './paraglide/messages.js';
import { Badge } from '@bolerish/ui/badge';
import { Item, ItemContent, ItemTitle, ItemDescription } from '@bolerish/ui/item';
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
import { colorVars } from '@bolerish/tokens/semantic.stylex';
import { commonStyles } from './shared/common-styles.js';
import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { Button } from '@bolerish/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@bolerish/ui/card';
import { Heading } from '@bolerish/ui/heading';
import { Input } from '@bolerish/ui/input';
import { Label } from '@bolerish/ui/label';
import { Paragraph } from '@bolerish/ui/paragraph';
import { Edge } from '@bolerish/edge';
import { InstallCommands } from './shared/installation/InstallCommands.js';
import { HeroExample } from './_ui/HeroExample.js';
import { motionDescriptions, usePreferences } from './shared/preferences/usePreferences.js';

type EdgeStyle = 'raised' | 'recessed' | 'matte';
interface Project {
  id: number;
  name: string;
  status: 'In progress' | 'Completed';
  updated: string;
}
const projects: readonly Project[] = [
  {
    id: 1,
    get name() {
      return m.website_refresh();
    },
    status: 'In progress',
    get updated() {
      return m.today();
    },
  },
  {
    id: 2,
    get name() {
      return m.design_system();
    },
    status: 'In progress',
    get updated() {
      return m.days_ago();
    },
  },
  {
    id: 3,
    get name() {
      return m.mobile_app();
    },
    status: 'Completed',
    get updated() {
      return m.label_5_days_ago();
    },
  },
];

export function Home() {
  const { motion, staticDirection, direction, radius } = usePreferences();
  return (
    <Edge.Provider
      motion={motion}
      staticDirection={staticDirection}
      direction={direction}
      radius={radius}
      intensity={0.8}
    >
      <div {...stylex.props(styles.homeLayout)}>
        <main id="content" tabIndex={-1} {...stylex.props(styles.siteContent)}>
          <div {...stylex.props(styles.homeHeroLayout)}>
            <section {...stylex.props(styles.homeHero)} aria-labelledby="home-title">
              <Heading id="home-title" level={1} size="page" {...stylex.props(styles.heroTitle)}>
                {m.a_little_more_alive()}
              </Heading>
              <Paragraph variant="description" {...stylex.props(styles.heroDescription)}>
                {m.subtle_highlights_that_follow_your_pointer_your()}
              </Paragraph>
              <Button
                {...stylex.props(styles.heroLink)}
                role="link"
                nativeButton={false}
                render={<a href={localePath('/docs/')} />}
              >
                {m.get_started()}
                <span aria-hidden="true">↗</span>
              </Button>
              <div {...stylex.props(styles.homeInstall)}>
                <InstallCommands compact />
              </div>
            </section>
            <HeroExample />
          </div>
          <Benefits />
          <Dashboard />
        </main>
      </div>
    </Edge.Provider>
  );
}

function Dashboard() {
  const { edgeStyle, motion } = usePreferences();
  const completed = projects.filter((project) => project.status === 'Completed').length;
  return (
    <section className="dashboard" aria-labelledby="dashboard-title">
      <header {...stylex.props(styles.dashboardHeader)}>
        <div>
          <Heading id="dashboard-title" level={2} size="section" xstyle={styles.dashboardTitle}>
            {m.dashboard()}
          </Heading>
          <Paragraph variant="description">
            {m.built_with_bolerish_ui_move_your_pointer()}
          </Paragraph>
        </div>
      </header>
      <Paragraph variant="caption" xstyle={styles.dashboardNote}>
        {m.interface_preview_search_and_project_actions_are()}{' '}
        <span id="dashboard-motion-description">{motionDescriptions[motion]}</span>
      </Paragraph>
      <div {...stylex.props(styles.summaryGrid)}>
        <Summary
          edgeStyle={edgeStyle}
          title={m.projects()}
          value={projects.length}
          description={m.workspace_total()}
          testId="surface-card"
        />
        <Summary
          edgeStyle={edgeStyle}
          title={m.in_progress()}
          value={projects.length - completed}
          description={m.workspace_progress()}
        />
        <Summary
          edgeStyle={edgeStyle}
          title={m.completed()}
          value={completed}
          description={m.workspace_done()}
        />
      </div>
      <div {...stylex.props(styles.dashboardPanels)}>
        <SurfaceCard edgeStyle={edgeStyle}>
          <CardHeader xstyle={styles.projectsHeader}>
            <CardTitle id="projects-title">{m.projects()}</CardTitle>
            <div {...stylex.props(styles.projectActions)}>
              <div {...stylex.props(styles.projectSearch)}>
                <Label htmlFor="project-search" {...stylex.props(commonStyles.visuallyHidden)}>
                  {m.search_projects()}
                </Label>
                <Edge.Surface
                  color={colorVars.fgPrimary}
                  shadowColor="transparent"
                  edgeStyle="recessed"
                  {...stylex.props(styles.dashboardInput)}
                  data-testid="surface-input"
                >
                  <Input id="project-search" placeholder={m.search_projects_011()} readOnly />
                </Edge.Surface>
              </div>
              <Edge.Surface
                color={colorVars.fgPrimary}
                shadowColor="transparent"
                as="span"
                edgeStyle={edgeStyle}
                {...stylex.props(styles.dashboardButton)}
                data-testid="surface-button"
              >
                <Button disabled>{m.new_project()}</Button>
              </Edge.Surface>
            </div>
          </CardHeader>
          <CardContent>
            <TableContainer
              xstyle={commonStyles.tableScroll}
              tabIndex={0}
              role="region"
              aria-labelledby="projects-title"
            >
              <Table xstyle={[styles.projectsTable]}>
                <TableCaption xstyle={[commonStyles.visuallyHidden]}>
                  {m.demo_workspace_projects()}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col" xstyle={[styles.projectCell, styles.projectColumn]}>
                      {m.name()}
                    </TableHead>
                    <TableHead scope="col" xstyle={[styles.projectCell, styles.projectColumn]}>
                      {m.status()}
                    </TableHead>
                    <TableHead scope="col" xstyle={[styles.projectCell, styles.projectColumn]}>
                      {m.updated()}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow
                      key={project.id}
                      xstyle={project.id === projects.at(-1)?.id && styles.lastCell}
                    >
                      <TableHead scope="row" xstyle={[styles.projectCell, styles.projectRow]}>
                        {project.name}
                      </TableHead>
                      <TableCell xstyle={styles.projectCell}>
                        <Badge variant="secondary">
                          {project.status === 'Completed' ? m.completed() : m.in_progress()}
                        </Badge>
                      </TableCell>
                      <TableCell xstyle={styles.projectCell}>{project.updated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </SurfaceCard>
        <SurfaceCard edgeStyle={edgeStyle}>
          <CardHeader>
            <CardTitle>{m.recent_activity()}</CardTitle>
            <CardDescription>{m.a_few_updates_from_this_demo_workspace()}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className={`activity-list ${stylex.props(styles.activityList).className}`}>
              <li {...stylex.props(styles.activityItem)}>
                <Item size="xs" xstyle={styles.activityRow}>
                  <ItemContent>
                    <ItemTitle>
                      {m.updated()}{' '}
                      <strong {...stylex.props(styles.activityStrong)}>{m.design_system()}</strong>
                    </ItemTitle>
                    <ItemDescription>{m.today_at_10_24_am()}</ItemDescription>
                  </ItemContent>
                </Item>
              </li>
              <li {...stylex.props(styles.activityItem)}>
                <Item size="xs" xstyle={styles.activityRow}>
                  <ItemContent>
                    <ItemTitle>
                      {m.created()}{' '}
                      <strong {...stylex.props(styles.activityStrong)}>
                        {m.website_refresh()}
                      </strong>
                    </ItemTitle>
                    <ItemDescription>{m.yesterday_at_4_19_pm()}</ItemDescription>
                  </ItemContent>
                </Item>
              </li>
              <li {...stylex.props(styles.activityItem)}>
                <Item size="xs" xstyle={styles.activityRow}>
                  <ItemContent>
                    <ItemTitle>
                      {m.completed_024()}
                      <strong {...stylex.props(styles.activityStrong)}>{m.mobile_app()}</strong>
                    </ItemTitle>
                    <ItemDescription>{m.label_5_days_ago()}</ItemDescription>
                  </ItemContent>
                </Item>
              </li>
            </ul>
          </CardContent>
        </SurfaceCard>
      </div>
    </section>
  );
}

function Summary({
  edgeStyle,
  title,
  value,
  description,
  testId,
}: {
  edgeStyle: EdgeStyle;
  title: string;
  value: number;
  description: string;
  testId?: string;
}) {
  return (
    <SurfaceCard edgeStyle={edgeStyle} testId={testId}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p {...stylex.props(styles.summaryValue)}>{value}</p>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </SurfaceCard>
  );
}

function SurfaceCard({
  edgeStyle,
  testId,
  children,
}: {
  edgeStyle: EdgeStyle;
  testId?: string;
  children: ReactNode;
}) {
  return (
    <Edge.Surface
      edgeStyle={edgeStyle}
      color={colorVars.fgPrimary}
      shadowColor="transparent"
      {...stylex.props(styles.dashboardSurface)}
      data-testid={testId}
    >
      <Card xstyle={styles.dashboardCard} className="dashboard-card">
        {children}
      </Card>
    </Edge.Surface>
  );
}

const styles = stylex.create({
  activityRow: { padding: 0, minHeight: 0, borderWidth: 0 },
  homeLayout: {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: {
      default: '0 48px 80px',
      '@media (max-width: 760px)': '0 20px 48px',
    },
  },
  homeHero: {
    padding: {
      default: '68px 0 56px',
      '@media (max-width: 760px)': '40px 0 36px',
    },
    maxWidth: '780px',
    minWidth: 0,
  },
  homeInstall: {
    maxWidth: '510px',
    marginBlockStart: '24px',
  },
  dashboardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    gap: '24px',
    paddingTop: '32px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colorVars.strokeDefault,
    flexDirection: {
      default: null,
      '@media (max-width: 1100px)': 'column',
    },
  },
  dashboardNote: {
    margin: '20px 0 24px',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(3, minmax(0, 1fr))',
      '@media (max-width: 760px)': 'minmax(0, 1fr)',
    },
    gap: '20px',
  },
  dashboardSurface: {
    minWidth: '0',
    borderRadius: '8px',
  },
  dashboardCard: {
    height: '100%',
  },
  summaryValue: {
    fontSize: '30px',
    fontWeight: '600',
    lineHeight: '1.2',
  },
  dashboardPanels: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 2fr) minmax(260px, 1fr)',
      '@media (max-width: 1100px)': 'minmax(0, 1fr) minmax(240px, 0.7fr)',
      '@media (max-width: 760px)': 'minmax(0, 1fr)',
    },
    gap: '20px',
    marginBlockStart: '20px',
    alignItems: 'start',
  },
  projectsHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
  },
  projectActions: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    width: {
      default: null,
      '@media (max-width: 760px)': '100%',
    },
  },
  projectSearch: {
    minWidth: '0',
    flex: '1',
    maxWidth: {
      default: '240px',
      '@media (max-width: 760px)': 'none',
    },
    flexBasis: {
      default: null,
      '@media (max-width: 760px)': '100%',
    },
  },
  dashboardInput: {
    borderRadius: '4px',
    outline: {
      default: null,
      ':focus-within': `2px solid ${colorVars.fgPrimary}`,
    },
    outlineOffset: {
      default: null,
      ':focus-within': '3px',
    },
  },
  dashboardButton: {
    display: 'inline-flex',
    borderRadius: '4px',
  },
  projectsTable: { fontSize: '13px' },
  activityList: {
    listStyle: 'none',
    padding: '0',
  },
  siteContent: {
    minWidth: '0',
    padding: {
      default: '18px 0',
      '@media (max-width: 760px)': '8px 0',
    },
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colorVars.fgPrimary}`,
    },
    outlineOffset: 4,
    paddingTop: {
      default: null,
      '@media (min-width: 1500px)': '24px',
    },
  },
  homeHeroLayout: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr) minmax(0, 1fr)',
      '@media (max-width: 1000px)': 'minmax(0, 1fr)',
    },
    gap: {
      default: '64px',
      '@media (max-width: 1000px)': '0',
    },
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 'clamp(30px, 3.2vw, 44px)',
    lineHeight: '1.2',
    letterSpacing: {
      default: '-1.2px',
      '@media (max-width: 760px)': '-0.7px',
    },
    marginBlockEnd: '20px',
    textWrap: 'balance',
  },
  heroDescription: {
    maxWidth: '620px',
    marginBlockEnd: '24px',
    fontSize: '16px',
    lineHeight: '1.7',
  },
  heroLink: {
    textDecoration: 'none',
  },
  dashboardTitle: {
    marginBlockEnd: '8px',
  },
  projectCell: { padding: '14px 8px' },
  projectColumn: { fontWeight: 400 },
  projectRow: { fontWeight: 500, color: colorVars.fgPrimary },
  lastCell: {
    borderBottomWidth: 0,
  },
  activityItem: {
    marginBlockStart: {
      default: 0,
      ':not(:first-child)': 16,
    },
    borderTopWidth: {
      default: 0,
      ':not(:first-child)': 1,
    },
    borderTopStyle: 'solid',
    borderTopColor: colorVars.strokeDefault,
    paddingTop: {
      default: 0,
      ':not(:first-child)': 16,
    },
  },
  activityStrong: {
    fontWeight: '500',
  },
});
