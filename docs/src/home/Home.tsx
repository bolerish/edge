import { useEffect, useState, type ChangeEvent, type ReactNode } from 'react';
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
import { ToggleGroup, ToggleGroupItem } from '@bolerish/ui/toggle-group';
import {
  useLight,
  useSurface,
  type Light,
  type LightOptions,
} from '@bolerish/wisp-react';
import { SiteShell } from '../ui/SiteShell.js';
import { CodeBlock } from '../ui/CodeBlock.js';

type Material = 'raised' | 'matte';
type Mode = NonNullable<LightOptions['mode']>;
interface Project {
  id: number;
  name: string;
  status: 'In progress' | 'Completed';
  updated: string;
}
const initialProjects: Project[] = [
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
  return (
    <SiteShell section="home" pathname="/">
      <section className="home-hero" aria-labelledby="home-title">
        <Heading id="home-title" level={1} size="page">
          Light that reveals your interface.
        </Heading>
        <Paragraph variant="description">
          Directional lighting for the components you own. One shared light,
          with your colors and interactions.
        </Paragraph>
        <Button
          role="link"
          nativeButton={false}
          render={<a href="/docs/installation/" />}
        >
          Get started <span aria-hidden="true">↗</span>
        </Button>
        <div className="home-install">
          <CodeBlock
            label="Try locally"
            language="bash"
            code={'pnpm install --frozen-lockfile\npnpm dev'}
          />
          <Paragraph variant="caption">
            Private preview · Run from the repository root.
          </Paragraph>
        </div>
      </section>
      <Dashboard />
    </SiteShell>
  );
}

function Dashboard() {
  const [material, setMaterial] = useState<Material>('raised');
  const [mode, setMode] = useState<Mode>('auto');
  const [projects, setProjects] = useState(initialProjects);
  const [query, setQuery] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const light = useLight({ mode, intensity: 0.8 });
  const input = useSurface<HTMLDivElement>(light, { material: 'recessed' });
  const action = useSurface<HTMLSpanElement>(light, { material });
  const inputProps = input;
  const actionProps = action;
  const filtered = projects.filter((project) =>
    project.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const completed = projects.filter(
    (project) => project.status === 'Completed',
  ).length;
  useEffect(() => light.refresh(), [light, projects, query]);

  function addProject() {
    const name = `Untitled project ${projects.length - initialProjects.length + 1}`;
    setProjects([
      ...projects,
      {
        id: projects.length + 1,
        name,
        status: 'In progress',
        updated: 'Just now',
      },
    ]);
    setQuery('');
    setAnnouncement(`Created ${name}.`);
  }
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
        <div className="dashboard-controls">
          <div className="control-group">
            <span id="material-label">Surface</span>
            <ToggleGroup
              aria-labelledby="material-label"
              variant="outline"
              size="sm"
              value={[material]}
              onValueChange={(values: unknown[]) => {
                const value = values[0];
                if (value === 'raised' || value === 'matte') setMaterial(value);
              }}
            >
              <ToggleGroupItem value="raised">01 Raised</ToggleGroupItem>
              <ToggleGroupItem value="matte">03 Matte</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="control-group">
            <span id="mode-label">Light</span>
            <ToggleGroup
              aria-labelledby="mode-label"
              variant="outline"
              size="sm"
              value={[mode]}
              onValueChange={(values: unknown[]) => {
                const value = values[0];
                if (
                  value === 'auto' ||
                  value === 'pointer' ||
                  value === 'static'
                )
                  setMode(value);
              }}
            >
              <ToggleGroupItem value="auto">Auto</ToggleGroupItem>
              <ToggleGroupItem value="pointer">Mouse</ToggleGroupItem>
              <ToggleGroupItem value="static">Static</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </header>
      <Paragraph variant="caption" className="dashboard-note">
        Demo workspace · Changes reset on reload. Auto respects reduced motion;
        Mouse explicitly enables tracking.
      </Paragraph>
      <div className="summary-grid">
        <Summary
          light={light}
          material={material}
          title="Projects"
          value={projects.length}
          description="Across your workspace"
          testId="surface-card"
        />
        <Summary
          light={light}
          material={material}
          title="In progress"
          value={projects.length - completed}
          description="Currently being worked on"
        />
        <Summary
          light={light}
          material={material}
          title="Completed"
          value={completed}
          description="Finished and ready to use"
        />
      </div>
      <div className="dashboard-panels">
        <SurfaceCard light={light} material={material}>
          <CardHeader className="projects-header">
            <CardTitle id="projects-title">Projects</CardTitle>
            <div className="project-actions">
              <div className="project-search">
                <Label htmlFor="project-search" className="visually-hidden">
                  Search projects
                </Label>
                <div
                  {...inputProps}
                  className={`${inputProps.className} dashboard-input`}
                  data-testid="surface-input"
                >
                  <Input
                    id="project-search"
                    placeholder="Search projects…"
                    value={query}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setQuery(event.target.value)
                    }
                  />
                </div>
              </div>
              <span
                {...actionProps}
                className={`${actionProps.className} dashboard-button`}
                data-testid="surface-button"
              >
                <Button onClick={addProject}>New project</Button>
              </span>
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
                  {filtered.map((project) => (
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
            {filtered.length === 0 ? (
              <div className="empty-projects">
                <Paragraph>No projects match “{query}”.</Paragraph>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery('')}
                >
                  Clear search
                </Button>
              </div>
            ) : null}
            <p className="visually-hidden" role="status">
              {query
                ? `${filtered.length} matching ${filtered.length === 1 ? 'project' : 'projects'}.`
                : announcement}
            </p>
          </CardContent>
        </SurfaceCard>
        <SurfaceCard light={light} material={material}>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>
              A few updates from this demo workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="activity-list">
              {projects
                .slice(initialProjects.length)
                .reverse()
                .map((project) => (
                  <li key={project.id}>
                    <p>
                      Created <strong>{project.name}</strong>
                    </p>
                    <span>Just now</span>
                  </li>
                ))}
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
  light,
  material,
  title,
  value,
  description,
  testId,
}: {
  light: Light;
  material: Material;
  title: string;
  value: number;
  description: string;
  testId?: string;
}) {
  return (
    <SurfaceCard light={light} material={material} testId={testId}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="summary-value">{value}</p>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </SurfaceCard>
  );
}

function SurfaceCard({
  light,
  material,
  testId,
  children,
}: {
  light: Light;
  material: Material;
  testId?: string;
  children: ReactNode;
}) {
  const surface = useSurface<HTMLDivElement>(light, { material });
  const props = surface;
  return (
    <div
      {...props}
      className={`${props.className} dashboard-surface`}
      data-testid={testId}
    >
      <Card className="dashboard-card">{children}</Card>
    </div>
  );
}
