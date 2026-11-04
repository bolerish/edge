import type { ReactNode } from 'react';
import { Button } from '@bolerish/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@bolerish/ui/card';
import { Heading } from '@bolerish/ui/heading';
import { Input } from '@bolerish/ui/input';
import { Label } from '@bolerish/ui/label';
import { Paragraph } from '@bolerish/ui/paragraph';
import { Lighting } from '@bolerish/edge';
import { SiteShell } from '../ui/SiteShell.js';
import { InstallCommands } from '../ui/InstallCommands.js';
import { HeroExample } from './HeroExample.js';
import {
  motionDescriptions,
  usePreferences,
} from '../settings/usePreferences.js';

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
    <Lighting motion={motion} staticDirection={staticDirection === 'random' ? 'random' : undefined} intensity={0.8}>
      <SiteShell section="home" pathname="/">
        <div className="home-hero-layout">
          <section className="home-hero" aria-labelledby="home-title">
            <Heading id="home-title" level={1} size="page">
              A little more alive.
            </Heading>
            <Paragraph variant="description">
              Subtle highlights that follow your pointer. Your components,
              colors and interactions stay yours.
            </Paragraph>
            <Button
              role="link"
              nativeButton={false}
              render={<a href="/docs/" />}
            >
              Get started <span aria-hidden="true">↗</span>
            </Button>
            <div className="home-install">
              <InstallCommands />
            </div>
          </section>
          <HeroExample />
        </div>
        <Dashboard />
      </SiteShell>
    </Lighting>
  );
}

function Dashboard() {
  const { edgeStyle, motion } = usePreferences();
  const completed = projects.filter(
    (project) => project.status === 'Completed',
  ).length;
  return (
    <section className="dashboard" aria-labelledby="dashboard-title">
      <header className="dashboard-header">
        <div>
          <Heading id="dashboard-title" level={2} size="section">
            Dashboard
          </Heading>
          <Paragraph variant="description">
            Built with Bolerish UI. Move your pointer to explore the edges.
          </Paragraph>
        </div>
      </header>
      <Paragraph variant="caption" className="dashboard-note">
        Interface preview · Search and project actions are inactive.{' '}
        <span id="dashboard-motion-description">{motionDescriptions[motion]}</span>
      </Paragraph>
      <div className="summary-grid">
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
      <div className="dashboard-panels">
        <SurfaceCard edgeStyle={edgeStyle}>
          <CardHeader className="projects-header">
            <CardTitle id="projects-title">Projects</CardTitle>
            <div className="project-actions">
              <div className="project-search">
                <Label htmlFor="project-search" className="visually-hidden">
                  Search projects
                </Label>
                <Lighting.Surface
                  edgeStyle="recessed"
                  className="dashboard-input"
                  data-testid="surface-input"
                >
                  <Input
                    id="project-search"
                    placeholder="Search projects…"
                    readOnly
                  />
                </Lighting.Surface>
              </div>
              <Lighting.Surface
                as="span"
                edgeStyle={edgeStyle}
                className="dashboard-button"
                data-testid="surface-button"
              >
                <Button disabled>New project</Button>
              </Lighting.Surface>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="table-scroll"
              tabIndex={0}
              role="region"
              aria-labelledby="projects-title"
            >
              <table className="projects-table">
                <caption className="visually-hidden">
                  Demo workspace projects
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Status</th>
                    <th scope="col">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <th scope="row">{project.name}</th>
                      <td>
                        <span className="project-status">{project.status}</span>
                      </td>
                      <td>{project.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </SurfaceCard>
        <SurfaceCard edgeStyle={edgeStyle}>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>
              A few updates from this demo workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="activity-list">
              <li>
                <p>
                  Updated <strong>Design system</strong>
                </p>
                <span>Today at 10:24 AM</span>
              </li>
              <li>
                <p>
                  Created <strong>Website refresh</strong>
                </p>
                <span>Yesterday at 4:19 PM</span>
              </li>
              <li>
                <p>
                  Completed <strong>Mobile app</strong>
                </p>
                <span>5 days ago</span>
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
        <p className="summary-value">{value}</p>
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
    <Lighting.Surface
      edgeStyle={edgeStyle}
      className="dashboard-surface"
      data-testid={testId}
    >
      <Card className="dashboard-card">{children}</Card>
    </Lighting.Surface>
  );
}
