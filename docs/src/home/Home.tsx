import { useState, type ReactNode } from 'react';
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectList,
  SelectItem,
} from '@bolerish/ui/select';
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
const modeDescriptions: Record<Mode, string> = {
  auto: 'Adapts to your device and motion preferences.',
  pointer: 'Follows your pointer, even when reduced motion is enabled.',
  static: 'Keeps the light direction fixed.',
};
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
  const [mode, setMode] = useState<Mode>('pointer');
  const light = useLight({ mode, intensity: 0.8 });
  const input = useSurface<HTMLDivElement>(light, { material: 'recessed' });
  const action = useSurface<HTMLSpanElement>(light, { material });
  const inputProps = input;
  const actionProps = action;
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
        <div className="dashboard-controls">
          <div className="control-group">
            <span id="material-label">Surface</span>
            <Select
              items={{ raised: 'Raised', matte: 'Matte' }}
              value={material}
              onValueChange={(value) => {
                if (value === 'raised' || value === 'matte') setMaterial(value);
              }}
            >
              <SelectTrigger aria-labelledby="material-label">
                <SelectValue />
              </SelectTrigger>
              <SelectPopup>
                <SelectList>
                  <SelectItem value="raised">Raised</SelectItem>
                  <SelectItem value="matte">Matte</SelectItem>
                </SelectList>
              </SelectPopup>
            </Select>
          </div>
          <div className="control-group">
            <span id="mode-label">Light</span>
            <Select
              items={{ static: 'Static', pointer: 'Dynamic', auto: 'System' }}
              value={mode}
              onValueChange={(value) => {
                if (value === 'auto' || value === 'pointer' || value === 'static')
                  setMode(value);
              }}
            >
              <SelectTrigger
                aria-labelledby="mode-label"
                aria-describedby="mode-description"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectPopup>
                <SelectList>
                  <SelectItem value="static">Static</SelectItem>
                  <SelectItem value="pointer">Dynamic</SelectItem>
                  <SelectItem value="auto">System</SelectItem>
                </SelectList>
              </SelectPopup>
            </Select>
          </div>
        </div>
      </header>
      <Paragraph variant="caption" className="dashboard-note">
        Interface preview · Search and project actions are inactive.{' '}
        <span id="mode-description">{modeDescriptions[mode]}</span>
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
                    readOnly
                  />
                </div>
              </div>
              <span
                {...actionProps}
                className={`${actionProps.className} dashboard-button`}
                data-testid="surface-button"
              >
                <Button disabled>New project</Button>
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
        <SurfaceCard light={light} material={material}>
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
