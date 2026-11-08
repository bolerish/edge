export const installPrompt = `Set up @bolerish/edge in this existing React project.

1. Inspect package.json, the lockfile and the app entry or root layout. Use the project's existing package manager. Edge requires React 18 or 19; report an incompatible version instead of upgrading React automatically.
2. Add @bolerish/edge with npm install, pnpm add, yarn add or bun add. If the registry reports that the package is unavailable, report the error and stop; do not substitute another package.
3. Load @bolerish/edge/style.css once: import it in the app entry/root layout, or use @import "@bolerish/edge/style.css" in the global CSS if the build tool resolves package CSS imports. Load Edge before application and utility styles; a separate reset may load first. Do not add a styling compiler or a CSS-injecting provider.
4. Use Edge.Provider and Edge.Surface from @bolerish/edge for the specific existing area I choose. Edge.Provider adds no DOM; only explicit surfaces receive decoration. Keep my markup, colors, events and focus styles. Use useSurface(options) inside Edge.Provider when a component already owns its host, passing the callback ref returned by useSurface to that host. Keep the existing className and style unchanged.
5. Keep the default motion="system" unless I request another mode. Wrap native inputs; use pseudoElement="before" if the host already uses ::after, and a wrapper if both pseudo-elements are occupied.
6. Run the project's relevant checks and summarize the changed files. Do not add a demo page or replace existing UI.`;
