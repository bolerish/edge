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
  { id: 1, name: 'Website refresh', status: 'In progress', updated: 'Today' },
  {
    id: 2,
    name: 'Design system',
    status: 'In progress',
    updated: '2 days ago',
  },
  { id: 3, name: 'Mobile app', status: 'Completed', updated: '5 days ago' },
];

export function Home() {
  const { motion, staticDirection } = usePreferences();
  return (
    <Edge.Provider motion={motion} staticDirection={staticDirection} intensity={0.8}>
      <div {...stylex.props(styles.homeLayout)}>
        <main id="content" tabIndex={-1} {...stylex.props(styles.siteContent)}>
          <div {...stylex.props(styles.homeHeroLayout)}>
            <section {...stylex.props(styles.homeHero)} aria-labelledby="home-title">
              <Heading id="home-title" level={1} size="page" {...stylex.props(styles.heroTitle)}>
                A little more alive.
              </Heading>
              <Paragraph variant="description" {...stylex.props(styles.heroDescription)}>
                Subtle highlights that follow your pointer. Your components, colors and interactions
                stay yours.
              </Paragraph>
              <Button
                {...stylex.props(styles.heroLink)}
                role="link"
                nativeButton={false}
                render={<a href="/docs/" />}
              >
                Get started <span aria-hidden="true">↗</span>
              </Button>
              <div {...stylex.props(styles.homeInstall)}>
                <InstallCommands compact />
              </div>
            </section>
            <HeroExample />
          </div>
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
            Dashboard
          </Heading>
          <Paragraph variant="description">
            Built with Bolerish UI. Move your pointer to explore the edges.
          </Paragraph>
        </div>
      </header>
      <Paragraph variant="caption" xstyle={styles.dashboardNote}>
        Interface preview · Search and project actions are inactive.{' '}
        <span id="dashboard-motion-description">{motionDescriptions[motion]}</span>
      </Paragraph>
      <div {...stylex.props(styles.summaryGrid)}>
        <Summary
          edgeStyle={edgeStyle}
          title="Projects"
          value={projects.length}
          description="Across your workspace"
          testId="surface-card"
        />
        <Summary
          edgeStyle={edgeStyle}
          title="In progress"
          value={projects.length - completed}
          description="Currently being worked on"
        />
        <Summary
          edgeStyle={edgeStyle}
          title="Completed"
          value={completed}
          description="Finished and ready to use"
        />
      </div>
      <div {...stylex.props(styles.dashboardPanels)}>
        <SurfaceCard edgeStyle={edgeStyle}>
          <CardHeader xstyle={styles.projectsHeader}>
            <CardTitle id="projects-title">Projects</CardTitle>
            <div {...stylex.props(styles.projectActions)}>
              <div {...stylex.props(styles.projectSearch)}>
                <Label htmlFor="project-search" {...stylex.props(commonStyles.visuallyHidden)}>
                  Search projects
                </Label>
                <Edge.Surface
                  color={colorVars.fgPrimary}
                  shadowColor="transparent"
                  edgeStyle="recessed"
                  {...stylex.props(styles.dashboardInput)}
                  data-testid="surface-input"
                >
                  <Input id="project-search" placeholder="Search projects…" readOnly />
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
                <Button disabled>New project</Button>
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
                  Demo workspace projects
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col" xstyle={[styles.projectCell, styles.projectColumn]}>
                      Name
                    </TableHead>
                    <TableHead scope="col" xstyle={[styles.projectCell, styles.projectColumn]}>
                      Status
                    </TableHead>
                    <TableHead scope="col" xstyle={[styles.projectCell, styles.projectColumn]}>
                      Updated
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
                        <Badge variant="secondary">{project.status}</Badge>
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
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>A few updates from this demo workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className={`activity-list ${stylex.props(styles.activityList).className}`}>
              <li {...stylex.props(styles.activityItem)}>
                <Item size="xs" xstyle={styles.activityRow}>
                  <ItemContent>
                    <ItemTitle>
                      Updated{' '}
                      <strong {...stylex.props(styles.activityStrong)}>Design system</strong>
                    </ItemTitle>
                    <ItemDescription>Today at 10:24 AM</ItemDescription>
                  </ItemContent>
                </Item>
              </li>
              <li {...stylex.props(styles.activityItem)}>
                <Item size="xs" xstyle={styles.activityRow}>
                  <ItemContent>
                    <ItemTitle>
                      Created{' '}
                      <strong {...stylex.props(styles.activityStrong)}>Website refresh</strong>
                    </ItemTitle>
                    <ItemDescription>Yesterday at 4:19 PM</ItemDescription>
                  </ItemContent>
                </Item>
              </li>
              <li {...stylex.props(styles.activityItem)}>
                <Item size="xs" xstyle={styles.activityRow}>
                  <ItemContent>
                    <ItemTitle>
                      Completed <strong {...stylex.props(styles.activityStrong)}>Mobile app</strong>
                    </ItemTitle>
                    <ItemDescription>5 days ago</ItemDescription>
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
