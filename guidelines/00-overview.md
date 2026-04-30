# Web Component Guidelines

These guidelines describe how new web components are added to the Vaadin
`web-components` monorepo. They are intended to be detailed enough that an
agent (or a new contributor) can scaffold a component without having to read
existing source first, while still pointing back into the codebase for the
canonical references.

## Pre-requisites

These guidelines assume basic familiarity with:

- Web Components (Custom Elements, Shadow DOM, slots).
- [Lit 3](https://lit.dev) — templates, reactive properties, lifecycle.
- TypeScript — types, interfaces, and the mixin pattern.
- CSS custom properties.

For repository-level commands (install, start, lint, test) see `CLAUDE.md`.

## Chapters

| #   | File                                           | Topic                                                                          |
| --- | ---------------------------------------------- | ------------------------------------------------------------------------------ |
| 01  | [Stack](01-stack.md)                           | Tech and test stack, monorepo and private packages.                            |
| 02  | [Structure](02-structure.md)                   | Package layout, naming, root entrypoints, generated files, license.            |
| 03  | [Coding conventions](03-coding-conventions.md) | Lit lifecycle, mixins vs controllers.                                          |
| 04  | [Common packages](04-common-packages.md)       | Shared mixins, controllers, the virtualizer, gestures.                         |
| 05  | [Documenting](05-documenting.md)               | CEM vs Polymer Analyzer, the JSDoc tags actually used, `vscode-lit-plugin`.    |
| 06  | [TypeScript](06-typescript.md)                 | Why `.d.ts` is hand-authored, mixin types, event maps, `test/typings/`.        |
| 07  | [DOM](07-dom.md)                               | Shadow parts, `exportparts`, state attributes, slots, the `popover` attribute. |
| 08  | [Events](08-events.md)                         | `notify: true`, `change` / `unparsable-change`, `CustomEvent` conventions.     |
| 09  | [Theming](09-theming.md)                       | Base / Lumo / Aura split, `ThemableMixin`, `:where()` for low specificity.     |
| 10  | [Checklist](10-checklist.md)                   | New-component checklist.                                                       |
