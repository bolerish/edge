# Contributing

Use the pinned Node and pnpm versions, then install with `pnpm install --frozen-lockfile`.

## Packages

- `packages/core`: framework-independent DOM controller and pure geometry. No React or StyleX imports.
- `packages/react`: React lifetime integration and precompiled StyleX surface styles.
- `docs`: public documentation, homepage dashboard and browser integration tests. Documentation routes are prerendered during the site build.

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
