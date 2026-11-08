import { introduction } from './getting-started/introduction.js';
import { installation } from './getting-started/installation.js';
import { integration } from './guides/integration.js';
import { usage } from './usage.js';
import { reactIntegration } from './react/usage.js';
import { styles } from './appearance/style.js';
import { motion } from './appearance/motion.js';
import { accessibility } from './guides/accessibility.js';
import { api } from './react/api.js';
import { aiIntegration } from './guides/ai-integration.js';
export const pages = [
  introduction,
  installation,
  usage,
  styles,
  motion,
  integration,
  accessibility,
  aiIntegration,
  reactIntegration,
  api,
];

// A reading journey differs from the sidebar's responsibility-based catalog.
export const learningPath = [introduction, installation, usage, reactIntegration, styles, motion, integration, accessibility, aiIntegration, api];

export function getReadingNeighbors(page: (typeof pages)[number]) {
  const index = learningPath.indexOf(page);
  return { previous: learningPath[index - 1], next: learningPath[index + 1] };
}
