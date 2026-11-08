import { introduction } from '../page.js';
import { installation } from '../installation/page.js';
import { usage } from '../usage/page.js';
import { styles } from '../styles/page.js';
import { motion } from '../motion/page.js';
import { integration } from '../integration/page.js';
import { accessibility } from '../accessibility/page.js';
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
