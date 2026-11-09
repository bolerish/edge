import { provider } from '../react/provider/page.js';
import { surface } from '../react/surface/page.js';
import { use_light } from '../react/use-light/page.js';
import { use_surface } from '../react/use-surface/page.js';
import { introduction } from '../page.js';
import { installation } from '../installation/page.js';
import { usage } from '../usage/page.js';
import { styles } from '../styles/page.js';
import { motion } from '../motion/page.js';
import { integration } from '../integration/page.js';
import { components } from '../react/components/page.js';
import { hooks } from '../react/hooks/page.js';
import { api } from '../react/api/page.js';
import { aiIntegration } from '../ai-integration/page.js';
import { reactIntegration } from '../react/usage/page.js';
export const pages = [
  introduction,
  installation,
  usage,
  styles,
  motion,
  integration,
  aiIntegration,
  reactIntegration,
  provider,
  surface,
  use_light,
  use_surface,
  api,
  components,
  hooks,
];

// A reading journey differs from the sidebar's responsibility-based catalog.
export const learningPath = [
  introduction,
  installation,
  usage,
  reactIntegration,
  provider,
  surface,
  use_light,
  use_surface,
  styles,
  motion,
  integration,
  aiIntegration,
];

export function getReadingNeighbors(page: (typeof pages)[number]) {
  const index = learningPath.indexOf(page);
  return { previous: learningPath[index - 1], next: learningPath[index + 1] };
}
