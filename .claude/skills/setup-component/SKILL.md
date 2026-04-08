---
description: Sets up the scaffolding for a new Vaadin web component
argument-hint: <ComponentName>
---

You are setting up the file scaffolding for a new Vaadin web component. You will create ALL the required files following the WEB_COMPONENT_GUIDELINES.md precisely.

Arguments: [ComponentName]

The component name is given in PascalCase (e.g. `Breadcrumb`, `DatePicker`). Derive:
- **kebab-name**: PascalCase → kebab-case (e.g. `DatePicker` → `date-picker`)
- **tag**: `vaadin-{kebab-name}` (e.g. `vaadin-date-picker`)
- **package**: `@vaadin/{kebab-name}` (e.g. `@vaadin/date-picker`)
- **camelName**: PascalCase with lowercase first letter for style variable names (e.g. `datePicker`)

## Steps

### 1. Read the guidelines

Read `WEB_COMPONENT_GUIDELINES.md` in the repo root. Follow it precisely for all file contents.

### 2. Determine the current monorepo version

Read the version from an existing package, e.g. `packages/button/package.json`. Use that exact version string for the new package and all `@vaadin/*` dependency versions.

### 3. Create the component package directory structure

Create all these files under `packages/{kebab-name}/`:

```
packages/{kebab-name}/
├── package.json
├── README.md
├── LICENSE                              (copy from packages/button/LICENSE)
├── vaadin-{kebab-name}.js               (root export)
├── vaadin-{kebab-name}.d.ts             (root TS definition)
├── src/
│   ├── vaadin-{kebab-name}.js            (main element class)
│   ├── vaadin-{kebab-name}.d.ts          (element TS definition)
│   ├── vaadin-{kebab-name}-mixin.js      (component mixin)
│   ├── vaadin-{kebab-name}-mixin.d.ts    (mixin TS definition)
│   └── styles/
│       ├── vaadin-{kebab-name}-base-styles.js   (base styles)
│       └── vaadin-{kebab-name}-base-styles.d.ts (styles TS definition)
└── test/
    ├── {kebab-name}.test.ts              (unit tests)
    ├── typings/
    │   └── {kebab-name}.types.ts         (type tests)
    ├── dom/
    │   └── {kebab-name}.test.js          (DOM snapshot tests)
    └── visual/
        ├── lumo/
        │   └── {kebab-name}.test.js      (Lumo visual tests)
        ├── aura/
        │   └── {kebab-name}.test.js      (Aura visual tests)
        └── base/
            └── {kebab-name}.test.js      (base visual tests)
```

### 4. Create Lumo theme files

- `packages/vaadin-lumo-styles/components/{kebab-name}.css` — public CSS with injection markers
- `packages/vaadin-lumo-styles/src/components/{kebab-name}.css` — actual Lumo theme styles wrapped in `@media lumo_components_{underscored_name}` (use underscores not hyphens in the media query name)

### 5. Create Aura theme files

- `packages/aura/src/components/{kebab-name}.css` — Aura theme styles using `:is(vaadin-{kebab-name})` selectors
- Add an `@import` for this file in `packages/aura/aura.css`

### 6. Create the dev page

Create `dev/{kebab-name}.html` following the dev page structure from the guidelines, importing `./common.js` and the component.

### 7. Create the spec folder

Create an empty `spec/` directory under `packages/{kebab-name}/` for component specification files:

```
packages/{kebab-name}/
└── spec/
```

### 8. Run `yarn install`

Run `yarn install` to link the new package in the workspace.

## Important guidelines

- Use the **exact templates** from WEB_COMPONENT_GUIDELINES.md for all file contents
- The mixin chain MUST be: `{ComponentName}Mixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))))`
- Use `defineCustomElement()` from `@vaadin/component-base/src/define.js`
- All license headers must use: `Copyright (c) 2025 - 2026 Vaadin Ltd.`
- The component implementation should be minimal — just the skeleton structure with a basic render method, a slot, and standard disabled/focused state handling
- The mixin should use `ActiveMixin(TabindexMixin(FocusMixin(superClass)))` as a sensible default
- Do NOT implement any component-specific logic — this is just scaffolding
- Do NOT run tests or the dev server — just create the files and run yarn install
- Copy the LICENSE file content from `packages/button/LICENSE`
- **Feature flag**: The main element class MUST include `static get experimental() { return true; }`. This makes the component require `window.Vaadin.featureFlags.{camelName}Component = true` before it can be used. See `packages/badge/src/vaadin-badge.js` for the pattern. The feature flag name is auto-generated from the tag name by `defineCustomElement()` in `@vaadin/component-base/src/define.js`.
- **README warning**: The README.md must include a warning: `> ⚠️ This component is experimental and the API may change. In order to use it, enable the feature flag by setting \`window.Vaadin.featureFlags.{camelName}Component = true\`.`
- **Dev page**: The dev page must enable the feature flag between `common.js` and the component import, matching `dev/badge.html` exactly: first `<script type="module" src="./common.js"></script>`, then `<script>window.Vaadin ??= {}; window.Vaadin.featureFlags ??= {}; window.Vaadin.featureFlags.{camelName}Component = true;</script>`, then the component import.
- **Test files**: ALL test files (unit, DOM snapshot, visual base/lumo/aura) must enable the feature flag after imports, matching `packages/badge/test/badge.test.ts`: `window.Vaadin ??= {}; window.Vaadin.featureFlags ??= {}; window.Vaadin.featureFlags.{camelName}Component = true;`

When done, create a commit.
