import { gettingStarted } from './getting-started.js';
import { installation } from './react/installation.js';
import { usage } from './react/usage.js';
import { styles } from './guides/styles.js';
import { accessibility } from './guides/accessibility.js';
import { api } from './react/api.js';
export const pages = [
  gettingStarted,
  styles,
  accessibility,
  installation,
  usage,
  api,
];

// A reading journey differs from the sidebar's responsibility-based catalog.
export const learningPath = [gettingStarted, installation, usage, styles, accessibility, api];

export function getReadingNeighbors(page: (typeof pages)[number]) {
  const index = learningPath.indexOf(page);
  return { previous: learningPath[index - 1], next: learningPath[index + 1] };
}
