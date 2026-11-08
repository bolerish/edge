# Contributing

## Setup

Use Node from `.node-version` and pnpm from `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000.

## Structure and conventions

- `packages/core/src/`: framework-independent light, geometry and frame scheduling.
- `packages/styles/src/`: shared CSS and surface appearance bindings.
- `packages/react/src/`: `Edge.tsx` composes the React adapter; `light/` owns light handles and context, and `surface/` owns surface rendering, appearance and registration.
- `docs/src/`: browser entry (`index.tsx`), common layout (`layout.tsx`), home (`page.tsx`), global `site.css` and browser tests.
- `docs/src/docs/`: document content and its registry, routes and types. Pages with interactive examples keep them in a local `_ui/`; `docs/_shared/` owns document rendering and shared previews.
- `docs/src/shared/`: search, preferences, installation and code presentation.
- `docs/src/_ui/`: home-private examples.
- `docs/scripts/`: prerendering and packed React compatibility verification with its fixtures.

Keep framework behavior in its adapter so a future Solid adapter can reuse core and styles. Group code by responsibility, colocate tests, and keep `index.ts` limited to imports and re-exports. Import workspace packages through public exports. Use the catalogs in `pnpm-workspace.yaml` and update the lockfile with dependency changes.

Keep server imports safe, preserve native controls and focus indicators, and clean up refs, listeners and pending frames. Pointer movement must not update React state. Read geometry before writing styles; option changes must work with a stationary pointer. Preserve engine-owned CSS variables such as `--wisp-angle` and `--wisp-strength`.

When changing a public API, update its types, documentation and examples together. Preserve existing documentation routes and section anchors. Document `page.tsx` files are a content convention; `docs/src/docs/_shared/routes.ts` and `page-registry.ts` remain the routing and catalog authorities. Site preferences live in `docs/src/shared/preferences/usePreferences.ts`; site defaults can differ from library defaults.

## Checks

Run the checks relevant to the change; use `pnpm check` before a release or after changes spanning packages and docs.

| Command | Purpose |
| --- | --- |
| `pnpm test:unit` | Vitest: individual functions and controller logic. |
| `pnpm test:integration` | Vitest + Testing Library: providers, hosts, events and cleanup. |
| `pnpm test:e2e` | Playwright: browser flows, CSS and accessibility. |
| `pnpm test:mutation` | StrykerJS: whether tests detect introduced defects. |
| `pnpm test:react-compat` | Packed React 18/19 consumers: types, rendering, hydration and cleanup. |
| `pnpm check` | Build, types, unit/integration tests, Chromium tests and package archives. |

Keep React integration tests in `.integration.test.tsx` files. Direct React rendering APIs are appropriate when testing hydration or rendering lifetimes. Inspect surviving and uncovered mutants rather than treating a mutation score as proof of correctness.

Before browser checks, install Chromium:

```sh
export PLAYWRIGHT_BROWSERS_PATH="$PWD/.private/playwright-browsers"
pnpm --filter @bolerish/edge-docs exec playwright install chromium
```

For a focused test, run Vitest from the owning package, for example `pnpm --filter @bolerish/edge exec vitest run src/surface/Surface.integration.test.tsx`. Run `pnpm verify:packages` after changing exports, declarations or package assets. Rendering coverage and its limits are described in the [React API documentation](docs/src/docs/react/api/page.tsx).

## Release

Keep library versions aligned. Publish only when explicitly requested, in order: core, styles, React. Verify packed installation before publishing.

Deploy only when requested with `pnpm deploy:docs`. Cloudflare Pages serves `docs/dist` at `edge.bolerish.com`; `.private/docs-ssr` is a build artifact and must not be deployed.
