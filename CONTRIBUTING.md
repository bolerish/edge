# Contributing

## Setup

Use Node from `.node-version` and pnpm from `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000. The dev command builds libraries, then starts their watchers and the documentation site.

## Code organization

- `packages/core/src/light/`: light ownership, options and frame scheduling.
- `packages/core/src/surface/`: geometry, output and restoration.
- `packages/styles/src/`: appearance bindings and `edge.css`; no React dependency.
- `packages/react/src/components/` and `hooks/`: declarative hosts and React lifetimes.
- `docs/src/`: documentation, examples and browser tests.

Group files by responsibility. Keep tests beside implementation and `index.ts` limited to imports and re-exports. Import workspace dependencies through public package exports; use `workspace:^` and the catalogs in `pnpm-workspace.yaml`. Update catalog groups and their lockfile together.

Preserve SSR-safe imports, StrictMode cleanup, native controls and focus indicators. Pointer frames must not update React state. Read geometry before writing output; option changes must work with a stationary pointer. Appearance updates must preserve engine-owned inline variables, including `--wisp-angle` and `--wisp-strength`.

## Validation

```sh
export PLAYWRIGHT_BROWSERS_PATH="$PWD/.private/playwright-browsers"
pnpm --filter @bolerish/edge-docs exec playwright install chromium
pnpm check
```

`pnpm check` builds packages and prerendered docs, checks types (including Node scripts), runs unit and Chromium tests, and verifies package archives. The browser runner owns its preview server.

Use the following test layers. Keep tests beside the implementation; use `.integration.test.tsx` for React integration tests. Existing low-level hydration tests may use React's rendering APIs directly where the lifecycle itself is under test.

| Layer | Tool | Purpose | Command |
| --- | --- | --- | --- |
| Unit | Vitest | Validate individual functions and controller logic. | `pnpm test:unit` |
| Integration | Vitest + Testing Library | Validate providers, surfaces, existing hosts, native events and cleanup together. | `pnpm test:integration` |
| E2E | Playwright | Validate real browser user flows, CSS, navigation and accessibility. | `pnpm test:e2e` |
| Mutation | StrykerJS | Check whether tests detect deliberately introduced defects. | `pnpm test:mutation` |

`pnpm test` runs unit and integration tests together. Mutation testing supplements these layers; a completed run or a high score does not prove correctness. Inspect surviving and uncovered mutants before deciding whether to add a behavioral test or document a limitation.

For focused work, use `pnpm test`, `pnpm --filter @bolerish/edge-docs typecheck`, or `pnpm test:browser`. Run `pnpm verify:packages` after rebuilding changed exports, declarations, package assets or prerendering.

```sh
pnpm --filter @bolerish/edge-docs exec playwright install firefox webkit
pnpm --filter @bolerish/edge-docs test:browser --browser=firefox
pnpm --filter @bolerish/edge-docs test:browser --browser=webkit
```

Keep the same `PLAYWRIGHT_BROWSERS_PATH`; leave `WISP_CHROMIUM_EXECUTABLE` unset for Firefox and WebKit. If Firefox on macOS fails with `Could not find profile folder`, create `.private/firefox-home` and prefix its command with `CFFIXED_USER_HOME="$PWD/.private/firefox-home"`.

`pnpm test:react-compat` packs the libraries and installs isolated React 18.0, 18.3, 19.0 and 19.3 consumers. It checks declarations without skipping library types, SSR, hydration, refs and native interactions in Chromium. Use the same browser cache above. The original React 18.0 types use classic JSX; later types use the automatic runtime. The docs site itself stays on React 19. Run this check before releasing React compatibility changes.

The same command checks CSR, Node and Web streaming SSR with delayed Suspense content, SSG that waits for all content, and non-hydratable static markup without JavaScript. Server checks run in development and production. Each streaming API runs in its own process so React's different server renderers do not share context state. Web Streams use React 18's server.browser entry and React 19's server.edge entry in Node; React 19's browser scheduler otherwise keeps a MessagePort open in this Node test host. Browser checks hydrate completed stream output; incomplete-stream selective hydration, individual SSR frameworks and deployed Web runtimes are outside this matrix.

`pnpm test:mutation` supplements unit tests. Review surviving and uncovered mutants in `.private/mutation/{core,styles,react}/report.json`; completion alone does not establish coverage. CSS behavior is checked in browser tests.

## Release

Keep the three library versions aligned; the root and docs remain private. Run `pnpm check` and, after packaging changes, verify installation in an isolated consumer using the archives in `.private/package-check/`.

Publish only when authorized, in order: `core.tgz`, `styles.tgz`, `react.tgz`. Manifests target the public npm registry with the `latest` tag. Confirm registry availability before deploying installation instructions.

Deploy `docs/dist` at the domain root with directory `index.html` resolution, trailing-slash handling and a real 404 for unknown paths. Do not deploy `.private/docs-ssr`. Production uses Cloudflare Pages (`bolerish-edge`) at `edge.bolerish.com`. Run `pnpm deploy:docs` after authenticating with Wrangler.
