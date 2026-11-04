# Working on Edge

Use natural Korean for conversation. Preserve unrelated working-tree and staged changes. Make small, coherent local commits for completed work; do not push unless asked. Do not create separate research or activity records unless explicitly requested.

## Start here

- [README.md](README.md): consumer API, package status and supported rendering modes.
- [CONTRIBUTING.md](CONTRIBUTING.md): package boundaries, folder ownership, coding conventions and validation commands. Follow it rather than duplicating its rules here.
- `packages/core/src/index.ts`, `packages/styles/src/index.ts`, `packages/react/src/index.ts`: public exports. Import workspace dependencies through their package exports.
- `docs/src/pages/page-registry.ts`: sidebar and reading order; `docs/src/pages/routes.ts`: canonical routes and aliases.
- `docs/src/settings/usePreferences.ts`: persisted site settings. Site defaults and library defaults can differ; keep this distinction explicit in documentation.

## Change boundaries

Keep pointer scheduling and geometry in core, appearance bindings in styles, and React lifetime integration in the React adapter. Preserve SSR-safe imports, StrictMode cleanup, native controls and focus indicators. Pointer frames must not update React state.

Keep tests beside implementation files. Reserve `index.ts` for imports and re-exports. Group files by named responsibilities; avoid generic utility folders without an actual shared responsibility.

When changing public options, update the exhaustive API metadata in `docs/src/pages/appearance/api-options.tsx`, relevant examples and public documentation. Preserve existing route aliases and section anchors. Keep copied code consistent with the behavior it demonstrates.

## Verification

Use the pinned Node and pnpm versions. Run `pnpm --filter @bolerish/edge-docs typecheck` for documentation changes and the relevant existing browser tests for UI behavior. `pnpm test` checks package behavior; `pnpm test:mutation` supplements those tests. See CONTRIBUTING for browser setup and focused commands.

Run `pnpm verify:packages` after changing public exports, declarations, package assets or prerendering. Report the checks actually run and any remaining limitations. Do not infer performance gains from source structure alone.
