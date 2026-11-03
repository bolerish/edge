# Contributing

Use the pinned Node and pnpm versions, then install with `pnpm install --frozen-lockfile`.

## Packages

- `packages/core`: framework-independent DOM controller and pure geometry. No React or StyleX imports.
- `packages/react`: React lifetime integration and internally compiled StyleX surface styles, colocated with `useSurface`.
- `docs`: public documentation, homepage dashboard and browser integration tests. Documentation routes are prerendered during the site build.

Keep `index.ts` files limited to imports and re-exports. Name implementation files after their responsibility. Keep tests beside their implementation (`*.test.ts` / `*.test.tsx`); build configurations exclude those tests from distribution. Browser integration tests live beside `docs/src/App.tsx`.

Group code by each package's responsibilities, rather than requiring identical folder names across packages:

- `core/src/light/` owns shared-light creation, options, browser subscriptions and frame scheduling.
- `core/src/surface/` owns surface geometry, decorative output and restoration.
- `react/src/hooks/` owns React lifetime adapters. Keep each hook's tests and exclusive CSS-in-JS declarations beside its implementation.
- Keep the root `index.ts` as the public barrel. Internal modules import their implementation dependencies directly; do not add internal barrels just to hide paths.
- Introduce another folder when it represents a distinct, named responsibility. Do not pre-create empty `components/`, `types/` or `lib/` folders.
- Keep code with its domain owner even when another module imports it. Extract shared utilities only when multiple contexts need genuinely domain-independent behavior.

The core keeps controller ownership in `light/create.ts`, browser subscriptions and frame scheduling in `light/session.ts`, option validation in `light/options.ts`, surface output and restoration in `surface/output.ts`, and pure lighting calculations in `surface/geometry.ts`. React exposes `hooks/useLight.ts` and `hooks/useSurface.ts`; the latter owns its CSS-in-JS declarations.

This organization takes references from [Floating UI's React package](https://github.com/floating-ui/floating-ui/tree/master/packages/react/src) (`hooks/`, `components/`) and [react-spring's hooks](https://github.com/pmndrs/react-spring/tree/next/packages/core/src/hooks) (hook implementations with adjacent tests). These are structural references; the responsibility and dependency rules above are Wisp's own conventions.

Import other packages through their public exports. Declare direct dependencies in the package that uses them, use `workspace:^` internally, and reference shared external versions through catalogs in `pnpm-workspace.yaml`. Do not rely on undeclared root dependencies.

Dated catalogs identify jointly validated dependency combinations. Upgrade a compatibility group and its references/lockfile together, run the relevant checks, and remove unused catalogs. `stable` describes the tested workspace combination, not a performance or ecosystem guarantee.

## Checks

```sh
pnpm build
pnpm typecheck
pnpm test
pnpm --filter @bolerish/wisp-docs exec playwright install chromium
pnpm test:browser
pnpm verify:packages
pnpm check
```

The browser test runner builds and owns its preview server. `WISP_CHROMIUM_EXECUTABLE` optionally selects an existing compatible Chromium installation. Standard runs use Playwright's installed browser. The complete check builds packages and the documentation site, checks types and tests, then validates package archives.

`pnpm dev` builds libraries first and starts their watchers with the documentation site. Run a complete build after changing public TypeScript declarations. `pnpm dev:docs` is an alias for the same site and library watchers. Do not bypass built package exports with application source aliases.

Preserve StrictMode restartability, per-element ownership, SSR-safe imports, native interactions, and read-before-write ordering. A material or options update must work with a stationary pointer. Call explicit `refresh()` after application-controlled position changes that size observers cannot detect.

Keep changes scoped and independently verifiable. Include relevant tests and public documentation with behavior changes. Package build files whitelist distribution artifacts; avoid adding unreviewed files to package archives.
