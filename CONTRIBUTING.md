# Contributing

Use the pinned Node and pnpm versions, then install with `pnpm install --frozen-lockfile`.

## Packages

- `packages/core`: framework-independent DOM controller and pure geometry. No React or StyleX imports.
- `packages/styles`: framework-independent surface bindings and internally compiled StyleX styles. No React dependency.
- `packages/react`: React lifetime integration; consumes the common engine and style bindings.
- `docs`: public documentation, homepage dashboard and browser integration tests. Documentation routes are prerendered during the site build.

Keep `index.ts` files limited to imports and re-exports. Name implementation files after their responsibility. Keep tests beside their implementation (`*.test.ts` / `*.test.tsx`); build configurations exclude those tests from distribution. Browser integration tests live beside `docs/src/App.tsx`.

Group code by each package's responsibilities, rather than requiring identical folder names across packages:

- `core/src/light/` owns shared-light creation, options, browser subscriptions and frame scheduling.
- `core/src/surface/` owns surface geometry, decorative output and restoration.
- `react/src/components/` owns the declarative Lighting scope, explicit hosts and their context. Keep component definitions at module scope. `react/src/hooks/` owns React lifetime adapters. Keep each hook's tests beside its implementation. Shared CSS-in-JS declarations live with their framework-independent bindings in `styles/src/`.
- Keep the root `index.ts` as the public barrel. Internal modules import their implementation dependencies directly; do not add internal barrels just to hide paths.
- Introduce another folder when it represents a distinct, named responsibility. Do not pre-create empty `components/`, `types/` or `lib/` folders.
- Keep code with its domain owner even when another module imports it. Extract shared utilities only when multiple contexts need genuinely domain-independent behavior.

The core keeps controller ownership in `light/create.ts`, browser subscriptions and frame scheduling in `light/session.ts`, option validation in `light/options.ts`, surface output and restoration in `surface/output.ts`, and pure lighting calculations in `surface/geometry.ts`. React exposes `hooks/useLight.ts` and `hooks/useSurface.ts`; both consume framework-independent surface bindings from `@bolerish/edge-styles`. `components/Lighting.tsx` composes those hooks behind the public `Lighting` and `Lighting.Surface` API.

This organization takes references from [Floating UI's React package](https://github.com/floating-ui/floating-ui/tree/master/packages/react/src) (`hooks/`, `components/`) and [react-spring's hooks](https://github.com/pmndrs/react-spring/tree/next/packages/core/src/hooks) (hook implementations with adjacent tests). These are structural references; the responsibility and dependency rules above are Wisp's own conventions.

Import other packages through their public exports. Declare direct dependencies in the package that uses them, use `workspace:^` internally, and reference shared external versions through catalogs in `pnpm-workspace.yaml`. Do not rely on undeclared root dependencies.

Dated catalogs identify jointly validated dependency combinations. Upgrade a compatibility group and its references/lockfile together, run the relevant checks, and remove unused catalogs. `stable` describes the tested workspace combination, not a performance or ecosystem guarantee.

## Checks

```sh
pnpm build
pnpm typecheck
pnpm test
pnpm test:mutation
pnpm --filter @bolerish/edge-docs exec playwright install chromium
pnpm test:browser
pnpm verify:packages
pnpm check
```

The browser test runner builds and owns its preview server. `WISP_CHROMIUM_EXECUTABLE` optionally selects an existing compatible Chromium installation. Standard runs use Playwright's installed browser. The complete check builds packages and the documentation site, checks types and tests, then validates package archives.

`pnpm dev` builds libraries first and starts their watchers with the documentation site. Run a complete build after changing public TypeScript declarations. `pnpm dev:docs` is an alias for the same site and library watchers. Do not bypass built package exports with application source aliases.

Future framework adapters must preserve the engine-owned `--wisp-angle` and `--wisp-strength` inline variables when updating appearance bindings. Avoid replacing the entire inline-style attribute. Framework-neutral primitives alone do not establish a tested Svelte, Solid or Vue integration.

Preserve StrictMode restartability, per-element ownership, SSR-safe imports, native interactions, and read-before-write ordering. A material or options update must work with a stationary pointer. Call explicit `refresh()` after application-controlled position changes that size observers cannot detect.

Keep changes scoped and independently verifiable. Include relevant tests and public documentation with behavior changes. Package build files whitelist distribution artifacts; avoid adding unreviewed files to package archives.

## Mutation testing

Run `pnpm test:mutation` from the repository root. It builds package dependencies and runs Stryker against core implementation files, common style bindings and React hooks. Run only one package with `pnpm --filter @bolerish/edge-core test:mutation` or `pnpm --filter @bolerish/edge test:mutation` after building dependencies.

Mutation testing supplements the adjacent Vitest tests: Stryker changes production code and checks whether those tests fail. Package unit tests import source through their source barrels; common-style tests use the StyleX compiler. React tests consume the built common style package, while Stryker tests its source separately. Packed-package checks independently exercise the published import paths.

Reports are local to `.private/mutation/core/`, `.private/mutation/styles/` and `.private/mutation/react/` (`index.html` and `report.json`). Review surviving and uncovered mutants for missing behavioral assertions; a completed run does not mean all mutants were detected. No score threshold is enforced until the remaining mutants have been reviewed. Excluded files are tests and the export-only package barrels. The static StyleX declaration section is explicitly excluded because mutation instrumentation makes compile-time style expressions dynamic; browser integration tests cover decorative output.

The Stryker sandbox preprocessor requires the JavaScript TypeScript compiler API. A scoped pnpm package extension supplies TypeScript 6 only to Stryker; the project build and type checks continue to use the pinned TypeScript 7 compiler. Stryker's [Vitest runner](https://stryker-mutator.io/docs/stryker-js/vitest-runner/) runs the existing tests with per-test mutation coverage.
