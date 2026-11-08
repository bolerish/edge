# Working on Edge

Use natural Korean. Preserve unrelated working-tree and staged changes. Commit each coherent change after its relevant checks; do not wait for a separate review. Do not push unless asked. Do not create separate research or activity records unless explicitly requested.

Edge adds shared directional highlights to explicitly connected UI surfaces. Core and styles are framework-independent; React is the current adapter and Solid is planned. Keep framework-specific lifetimes in adapters.

Read [README.md](README.md) for the consumer API and [CONTRIBUTING.md](CONTRIBUTING.md) for package ownership, conventions and validation. Follow those rules without duplicating them here.

When changing public options, update `docs/src/pages/appearance/api-options.tsx`, relevant examples and public documentation. Keep copied code consistent with its demonstrated behavior.

Documentation entry points:

- `docs/src/pages/page-registry.ts`: sidebar and reading order.
- `docs/src/pages/routes.ts`: canonical routes and aliases; preserve existing routes and section anchors.
- `docs/src/shared/preferences/usePreferences.ts`: persisted site settings; distinguish site defaults from library defaults.

Run the relevant checks in CONTRIBUTING. Report checks actually run and remaining limitations. Do not infer performance gains from source structure alone.
