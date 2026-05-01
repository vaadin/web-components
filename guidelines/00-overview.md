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

| #   | File                                             | Topic                                                                      |
| --- | ------------------------------------------------ | -------------------------------------------------------------------------- |
| 01  | [Repository](01-repository.md)                   | Looking up the tech stack, test tooling, and workspace layout.             |
| 02  | [Component Structure](02-component-structure.md) | Scaffolding a new component package.                                       |
| 03  | [Coding conventions](03-coding-conventions.md)   | Picking the right Lit lifecycle hook; mixin vs controller choices.         |
| 04  | [Common packages](04-common-packages.md)         | Reusing shared mixins, controllers, and utilities before reinventing them. |
| 05  | [Documenting](05-documenting.md)                 | Authoring JSDoc for proper API docs generation.                            |
| 06  | [TypeScript](06-typescript.md)                   | Authoring Typescript definitions.                                          |
| 07  | [DOM](07-dom.md)                                 | Designing a component's DOM surface — parts, attributes, slots.            |
| 08  | [Events](08-events.md)                           | Dispatching and documenting component events.                              |
| 09  | [Theming](09-theming.md)                         | Authoring base styles and integrating with Lumo and Aura.                  |
| 10  | [Checklist](10-checklist.md)                     | Final scan before submitting a new component.                              |
