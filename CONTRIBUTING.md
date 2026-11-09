# Contributing

## Setup

Use Node from `.node-version` and pnpm from `package.json`.

```sh
pnpm install
pnpm dev
```

Open http://localhost:3000.

Installation enables Lefthook locally. Before committing, it checks formatting and lint for staged files without rewriting them. Before pushing, it runs type checks and unit/integration tests. Run `pnpm exec lefthook install` to reinstall the hooks, or `pnpm exec lefthook run pre-push` to run the push checks manually. Browser and packed-consumer checks run in release preparation. CI disables local hooks with `LEFTHOOK=0`.

## Structure and conventions

- `packages/core/src/`: framework-independent light, geometry and frame scheduling.
- `packages/styles/src/`: shared CSS and surface appearance bindings.
- `packages/react/src/`: `Edge.tsx` composes the React adapter; `light/` owns light handles and context, and `surface/` owns surface rendering, appearance and registration.
- `docs/src/`: browser entry (`index.tsx`), common layout (`layout.tsx`), home (`page.tsx`), global `site.css` and browser tests.
- `docs/src/docs/`: document layout, route-owned content and the `_shared/` registry, routes and types. Pages with interactive examples keep them in a local `_ui/`; `docs/_shared/` owns document-only previews and content styles.
- `docs/src/shared/`: search, preferences, installation, code presentation and optional surface-light context. The document layout owns the light lifetime; shared lit surfaces reuse UI Card and Link hosts.
- `docs/src/_ui/`: home-private examples.
- `docs/scripts/`: prerendering and packed React compatibility verification with its fixtures.

Keep framework behavior in its adapter so a future Solid adapter can reuse core and styles. Group code by responsibility, colocate tests, and keep `index.ts` limited to imports and re-exports. Import workspace packages through public exports. Use the catalogs in `pnpm-workspace.yaml` and update the lockfile with dependency changes.

React embeds the shared styles package CSS without a runtime CSS import. Surface registration prepares one stylesheet per owner document; SSR applications render `Edge.Styles` once before application CSS and pass the request nonce when CSP requires it. Preserve this adoption path and the framework-independent CSS export. Surface appearance must not reverse the selected light direction.

Keep server imports safe, preserve native controls and focus indicators, and clean up refs, listeners and pending frames. Pointer movement must not update React state. Read geometry before writing styles; option changes must work with a stationary pointer. Preserve engine-owned CSS variables such as `--edge-angle` and `--edge-strength`.

Use installed `@bolerish/ui` components and public `@bolerish/tokens/semantic.stylex` roles before authoring site styles. Colocate layout and example styles in `stylex.create`; shared theme variables use `.stylex.ts`. The StyleX Vite plugin extracts production CSS and serves its collected SSR rules before development hydration. `site.css` is limited to the layer-order prelude, document color-scheme, focus scroll margin and universal reduced-motion preferences, which StyleX 0.19 cannot apply globally. Keep its prelude before package styles in production and development. Edge’s public `packages/styles/src/edge.css` remains a distribution asset.

When changing a public API, update its types, documentation and examples together. Preserve existing documentation routes and section anchors. Document `page.tsx` files are a content convention; `docs/src/docs/_shared/routes.ts` and `page-registry.ts` remain the routing and catalog authorities. Site preferences live in `docs/src/shared/preferences/usePreferences.ts`; site defaults can differ from library defaults.

## Documentation languages

The site supports English, Korean, Spanish, Simplified Chinese and Japanese. English keeps the existing URLs; other languages use `/ko`, `/es`, `/zh` and `/ja` prefixes. Keep section IDs and code examples unchanged across languages. Use the existing language menu, UI components and Paraglide messages rather than adding a separate translation runtime.

Translate complete sentences, including the text around code and links. Use `inlineMessage` with `<part0/>` slots when inline elements need a different position in another language; preserve every slot in each catalog. Do not assemble translated prose from sentence fragments. Keep API identifiers and option values intact. Use English labels or established transliterations when they read more naturally than literal translations; explain behavior in the surrounding prose.

Edit all five catalogs in `docs/messages/` together. `pnpm --filter @bolerish/edge-docs i18n:compile` checks keys and interpolation inputs and regenerates the ignored Paraglide output. Authored scripts remain TypeScript; generated JavaScript and declarations belong to Paraglide. Builds and development compile messages through the Vite plugin. The SSR entry owns request-local locale storage; metadata, HTML, search and Markdown use the same locale.

## Checks

Run the checks relevant to the change; use `pnpm check` before a release or after changes spanning packages and docs.

| Command                  | Purpose                                                                          |
| ------------------------ | -------------------------------------------------------------------------------- |
| `pnpm format`            | Oxfmt: format selected paths (defaults to the repository).                       |
| `pnpm format:check`      | Check formatting without writing files.                                          |
| `pnpm lint`              | Oxlint: JavaScript/TypeScript and React correctness.                             |
| `pnpm lint:fix`          | Apply safe automatic lint fixes to selected paths.                               |
| `pnpm test:unit`         | Vitest: individual functions and controller logic.                               |
| `pnpm test:integration`  | Vitest + Testing Library: providers, hosts, events and cleanup.                  |
| `pnpm test:e2e`          | Playwright: browser flows, CSS and accessibility.                                |
| `pnpm test:mutation`     | StrykerJS: whether tests detect introduced defects.                              |
| `pnpm test:react-compat` | Packed React 18/19 consumers: types, rendering, hydration and cleanup.           |
| `pnpm check`             | Lint, build, types, unit/integration tests, Chromium tests and package archives. |

Formatting is an explicit check while the existing repository formatting baseline is being adopted; `pnpm check` runs lint before its existing build and test pipeline. Format the files you change (for example `pnpm format docs/src/layout.tsx`), and preserve unrelated dirty files. Generated output, private artifacts, coverage and the lockfile are ignored by the tools. Oxlint does not replace TypeScript or the StyleX compiler and has no configured StyleX-specific plugin. Three file-scoped React Compiler exceptions preserve lazy light initialization, ref-callback cleanup and a test-only render observer; ordinary hook rules remain enabled.

Keep React integration tests in `.integration.test.tsx` files. Direct React rendering APIs are appropriate when testing hydration or rendering lifetimes. Inspect surviving and uncovered mutants rather than treating a mutation score as proof of correctness.

Before browser checks, install Chromium:

```sh
export PLAYWRIGHT_BROWSERS_PATH="$PWD/.private/playwright-browsers"
pnpm --filter @bolerish/edge-docs exec playwright install chromium
```

For a focused test, run Vitest from the owning package, for example `pnpm --filter @bolerish/edge exec vitest run src/surface/Surface.integration.test.tsx`. Run `pnpm verify:packages` after changing exports, declarations or package assets. Rendering coverage and its limits are described in the [React API documentation](docs/src/docs/react/api/page.tsx).

## Release

Keep library versions aligned. Run release preparation with Chromium installed as described above:

```sh
pnpm release:prepare
```

This runs `pnpm check` followed by `pnpm test:react-compat`. Verified archives remain at `.private/package-check/core.tgz`, `.private/package-check/styles.tgz` and `.private/package-check/react.tgz`. The compatibility check creates separate archives in `.private/react-compatibility` and preserves the package-check archives. Each preparation run replaces its previous package-check output.

The manually dispatched `.github/workflows/release-prepare.yml` runs preparation and uploads the three verified archives without publishing. `.github/workflows/publish.yml` runs the same preparation on `main`, verifies the requested stable version against all three manifests, uploads the archives, then publishes those exact archives in core → styles → React order. Concurrent publish runs are serialized. A failed partial publish needs manual investigation before retrying; published versions cannot be overwritten.

Before using the publish workflow, configure a Trusted Publisher in the npm settings for **each** package (`@bolerish/edge-core`, `@bolerish/edge-styles`, `@bolerish/edge`):

- GitHub organization: `bolerish`
- Repository: `edge`
- Workflow filename: `publish.yml`
- Environment: `npm`
- Allowed action: direct publishing with `npm publish`

Create the matching GitHub `npm` environment and configure its deployment branch as `main`. The workflow uses GitHub-hosted runners, `id-token: write` and npm 12.2.2 for OIDC; no npm token secret is required. See [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/). Local npm login is separate from this trust configuration.

After pushing the reviewed release commit, manually run **Publish npm packages** on `main` with the exact version. Do not run it until publication is authorized and all three versions are unused. The current candidate is `0.3.0`; `0.1.0` and `0.2.0` have already been published. After publication, verify the default registry install in a new consumer project before deploying documentation.

Check real iOS and Android devices separately before release; Chromium and React compatibility checks do not cover real devices. Publish only upon future explicit authorization, in order: core, styles, React. Publish the exact verified tarballs from that release preparation, rather than repacking source afterward. `release-prepare.yml` does not configure npm authentication.

Deploy only when requested with `pnpm deploy:docs`. Cloudflare Pages serves `docs/dist` at `edge.bolerish.com`; `.private/docs-ssr` is a build artifact and must not be deployed.
