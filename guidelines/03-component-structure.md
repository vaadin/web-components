# Component Structure

## Naming

| Item               | Pattern                         | Example                             |
| ------------------ | ------------------------------- | ----------------------------------- |
| Custom element tag | `vaadin-{name}` (kebab-case)    | `vaadin-date-picker`                |
| Package            | `@vaadin/{name}` (no `vaadin-`) | `@vaadin/date-picker`               |
| Element class      | PascalCase of the name          | `DatePicker`                        |
| Mixin              | `{Class}Mixin`                  | `DatePickerMixin`                   |
| Main element file  | `vaadin-{name}.js`              | `vaadin-date-picker.js`             |
| Mixin file         | `vaadin-{name}-mixin.js`        | `vaadin-date-picker-mixin.js`       |
| Base styles file   | `vaadin-{name}-base-styles.js`  | `vaadin-date-picker-base-styles.js` |
| Test file          | `{name}.test.{js,ts}`           | `date-picker.test.ts`               |

## Package layout

```
packages/{name}/
├── package.json
├── README.md
├── LICENSE
├── vaadin-{name}.js                   # Root export — re-exports from src/
├── vaadin-{name}.d.ts                 # Root type — re-exports from src/
├── custom-elements.json               # Generated, see "Generated files"
├── web-types.json                     # Generated
├── web-types.lit.json                 # Generated
├── src/
│   ├── vaadin-{name}.js               # Element class
│   ├── vaadin-{name}.d.ts
│   ├── vaadin-{name}-mixin.js         # Component logic mixin (optional)
│   ├── vaadin-{name}-mixin.d.ts
│   └── styles/
│       ├── vaadin-{name}-base-styles.js
│       └── vaadin-{name}-base-styles.d.ts
└── test/
    ├── {name}.test.{js,ts}
    ├── typings/{name}.types.ts
    ├── dom/{name}.test.js + __snapshots__/
    └── visual/{base,lumo,aura}/{name}.test.js
```

The Lumo and Aura per-component CSS files live in `packages/vaadin-lumo-styles/`
and `packages/aura/` respectively — see [Theming](10-theming.md).

## Root-level entrypoints

Only **publicly exposed components** get `vaadin-{name}.js` files at the
package root. The root entrypoint is what makes the component show up in the
generated React wrappers and in `web-types.json`.

Internal-only packages can skip root-level entries and keep files in `src/`:

- `a11y-base`
- `component-base`
- `field-base`
- `lit-renderer`

### Multi-element packages

A few packages publish more than one custom element (e.g. `grid` exposes
`vaadin-grid`, `vaadin-grid-column`, `vaadin-grid-column-group`,
`vaadin-grid-sorter`, …). Each publicly used element gets its own
`vaadin-{name}.js` root entrypoint. Convenience bundles such as
`packages/grid/all-imports.js` can be provided; keep them documented in the
`README.md`.

## Root export file

The root `vaadin-{name}.js` only re-exports from `src/`:

```js
import './src/vaadin-{name}.js';

export * from './src/vaadin-{name}.js';
```

The root `vaadin-{name}.d.ts` mirrors that:

```ts
export * from './src/vaadin-{name}.js';
```

## Generated files

These files are not checked into the VCS and produced by scripts — do **not**
hand-edit them.

| File                   | Generator                                                                          | Purpose                                                                |
| ---------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `custom-elements.json` | `yarn release:cem` (`custom-elements-manifest.config.js` + `scripts/split-cem.js`) | Per-package CEM manifest. Drives `api-docs/` and the web-types files.  |
| `web-types.json`       | `yarn release:web-types` (`scripts/buildWebtypes.js` reads `custom-elements.json`) | IDE autocomplete for plain HTML; also drives React wrapper generation. |
| `web-types.lit.json`   | Same as `web-types.json`                                                           | IDE autocomplete for Lit 3 binding syntax.                             |

See [Documenting](06-documenting.md) for the JSDoc tags that drive these.

## License

Two license types are used, picked per package:

- **Apache 2.0** — most components and all private packages.
- **Vaadin Commercial** — `board`, `charts`, `crud`, `dashboard`, `grid-pro`.

Each package contains a `LICENSE` file with the full text. JS source files
carry a short header comment:

**Apache 2.0:**

```js
/**
 * @license
 * Copyright (c) {year} - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
```

**Commercial:**

```js
/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
```

## Example `package.json`

```json
{
  "name": "@vaadin/{name}",
  "version": "25.2.0-alpha0",
  "description": "vaadin-{name}",
  "license": "Apache-2.0",
  "type": "module",
  "main": "vaadin-{name}.js",
  "module": "vaadin-{name}.js",
  "files": ["src", "vaadin-*.d.ts", "vaadin-*.js", "custom-elements.json", "web-types.json", "web-types.lit.json"],
  "dependencies": {
    "@open-wc/dedupe-mixin": "^1.4.0",
    "@vaadin/component-base": "25.2.0-alpha0",
    "@vaadin/vaadin-themable-mixin": "25.2.0-alpha0",
    "lit": "^3.0.0"
  },
  "devDependencies": {
    "@vaadin/chai-plugins": "25.2.0-alpha0",
    "@vaadin/test-runner-commands": "25.2.0-alpha0",
    "@vaadin/testing-helpers": "^2.0.0",
    "sinon": "^22.0.0"
  },
  "customElements": "custom-elements.json",
  "web-types": ["web-types.json", "web-types.lit.json"]
}
```

For a Pro component, set `"license": "SEE LICENSE IN https://vaadin.com/commercial-license-and-service-terms"`.

Copy `repository`, `homepage`, `bugs`, `keywords`, `publishConfig`, and
`author` from a sibling package to keep them consistent.

## Dev pages

Dev pages are flat HTML files under `dev/` — one per component, plus a
shared `dev/common.js` that wires up the theme switcher and global styles.
They're served by `yarn start` and deployed to GitHub Pages from `main`.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>vaadin-{name}</title>
    <script type="module" src="./common.js"></script>
    <script type="module">
      import '@vaadin/{name}';
    </script>
  </head>
  <body>
    <vaadin-{name}>Example</vaadin-{name}>
  </body>
</html>
```

Keep dev pages focused: include the major variants and states, but they are
not exhaustive demos and they are not published as part of the package.
