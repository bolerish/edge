export const installPrompt = `Set up @bolerish/edge in this existing React project.
Read https://edge.bolerish.com/llms.txt and its relevant Markdown documents first. Match the documentation to the installed package version.

1. Inspect package.json, the lockfile and the app entry or root layout. Use the project's existing package manager. Edge requires React 18 or 19; report an incompatible version instead of upgrading React automatically.
2. Add @bolerish/edge with npm install, pnpm add, yarn add or bun add. If the registry reports that the package is unavailable, report the error and stop; do not substitute another package.
3. React prepares Edge styles automatically for Provider and hook usage; no CSS import is required. For SSR, render <Edge.Styles /> once per document before application styles, outside the content wrapper. If CSP requires a nonce, use <Edge.Styles nonce={nonce} /> with the same request nonce during hydration. Keep any existing CSS import compatible. Do not add a styling compiler.
4. Use Edge.Provider and Edge.Surface from @bolerish/edge for the specific existing area I choose. Edge.Provider adds no DOM; only explicit surfaces receive decoration. Keep my markup, colors, events and focus styles. Use useSurface(options) inside Edge.Provider when a component already owns its host, passing the callback ref returned by useSurface to that host. Keep the existing className and style unchanged.
5. Keep the default motion="system" unless I request another mode. Wrap native inputs; use pseudoElement="before" if the host already uses ::after, and a wrapper if both pseudo-elements are occupied.
6. Run the project's relevant checks and summarize the changed files. Do not add a demo page or replace existing UI.`;
