# Labs

Experimental components live in `labs/`, one package `@vaadin/labs`, until they
graduate to `packages/<name>/`. For the layout of a regular package, see
[Package Structure](package-structure.md).

## Rules

1. **Same tag names, same feature flags**: a labs component uses the `vaadin-<name>` tag. It turns on a feature flag through `static get experimental()`. The main element returns `true`, and each sub-element returns the flag key of the main element.
2. **Graduation is a move**: `labs/<name>/` has the inner layout of `packages/<name>/`, so no import in `src/` or `test/` changes.
3. **Tests still run**: labs has a lower review bar, not a lower CI bar.
4. **One resolver**: scripts find component directories with `listComponentDirs()` from `manifest/lib/cem-helpers.js`.
5. **No dependency from `packages/` to `labs/`**: stable code never imports experimental code. ESLint enforces this rule.

## Layout

```
labs/
├── package.json              @vaadin/labs
├── vaadin-<name>.js          public entry: re-exports ./<name>/vaadin-<name>.js
├── vaadin-<name>.d.ts
└── <name>/                   same inner layout as packages/<name>/
    ├── vaadin-<name>.js      internal entry, used by tests and kept at graduation
    ├── vaadin-<name>.d.ts
    ├── src/
    ├── spec/                 optional spec.md or prd.md
    └── test/
```

The public import path is `@vaadin/labs/vaadin-<name>.js`.
The custom elements manifest and the web-types only list this path.
Do not import `@vaadin/labs/<name>/vaadin-<name>.js` in applications.

## Policies

- **Dependencies**: the package depends on the union of the dependencies of all components. Each component adds its own to `labs/package.json`. Do not use optional peer dependencies.
- **License**: the whole package is Apache-2.0. A component that must ship under the commercial license switches the license when it graduates.
- **Coverage**: the coverage report of `yarn test --coverage` only includes `packages/`. Labs components do not count toward the threshold.
- **Release**: `@vaadin/labs` has the same version and tag as every other package. `lerna publish from-git` publishes it with every release.
- **Meta packages and React**: `@vaadin/vaadin-core`, `@vaadin/vaadin` and the React wrappers do not include labs components.

## Add a component

1. Create `labs/<name>/` with `vaadin-<name>.js`, `vaadin-<name>.d.ts`, `src/` and `test/`.
2. Return `true` from `static get experimental()` in the main element. The flag key is `<camelName>Component`.
3. Return the flag key of the main element from `static get experimental()` in each sub-element.
4. Add `labs/vaadin-<name>.js` and `labs/vaadin-<name>.d.ts`, which re-export `./<name>/vaadin-<name>.js`.
5. Add the dependencies of the component to `labs/package.json`.
6. Add the Lumo styles to `packages/vaadin-lumo-styles/src/components/<name>.css` and `packages/vaadin-lumo-styles/components/<name>.css`.
7. Import the Lumo file in `packages/vaadin-lumo-styles/components/index.css`.
8. Add the Aura styles to `packages/aura/src/components/<name>.css` and import them in `packages/aura/aura.css`.
9. Add a dev page `dev/labs/<name>.html` that loads `../common.js`. Enable the feature flag in a script before the import.
10. Add unit tests, snapshot tests in `test/dom/` and visual tests in `test/visual/`.

Run the tests of one component with its name as the group:

```sh
yarn test --group <name>
yarn test:snapshots --group <name>
yarn test:base --group <name>
```

## Graduate a component

1. Run `git mv labs/<name> packages/<name>`.
2. Add `package.json`, `LICENSE` and `README.md` to `packages/<name>/`.
3. Delete `labs/vaadin-<name>.js` and `labs/vaadin-<name>.d.ts`.
4. Remove the dependencies that only the component used from `labs/package.json`.
5. Move the dev page from `dev/labs/` to `dev/` and update its imports.
6. Run `yarn release:cem && yarn release:meta` to add the package to the meta packages.
7. Add the package to the dependencies of `packages/react-components/package.json` for React wrappers.
8. Update the import path in Flow from `@vaadin/labs/vaadin-<name>.js` to `@vaadin/<name>`.

The import path changes at graduation.
Applications replace `@vaadin/labs/vaadin-<name>.js` with `@vaadin/<name>`.

## Drop a component

1. Delete `labs/<name>/`.
2. Delete `labs/vaadin-<name>.js` and `labs/vaadin-<name>.d.ts`.
3. Delete the dev page `dev/labs/<name>.html`.
4. Delete the Lumo and Aura styles of the component and their imports.
5. Remove the dependencies that only the component used from `labs/package.json`.
6. Remove the feature flag and the component from the Flow labs package. This package does not exist yet and is future work.
