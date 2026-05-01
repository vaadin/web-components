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
| 02  | [Design](02-design.md)                           | Designing the API and behaviour of a new component before implementation.  |
| 03  | [Component Structure](03-component-structure.md) | Scaffolding a new component package.                                       |
| 04  | [Coding conventions](04-coding-conventions.md)   | Picking the right Lit lifecycle hook; mixin vs controller choices.         |
| 05  | [Common packages](05-common-packages.md)         | Reusing shared mixins, controllers, and utilities before reinventing them. |
| 06  | [Documenting](06-documenting.md)                 | Authoring JSDoc for proper API docs generation.                            |
| 07  | [TypeScript](07-typescript.md)                   | Authoring Typescript definitions.                                          |
| 08  | [DOM](08-dom.md)                                 | Designing a component's DOM surface — parts, attributes, slots.            |
| 09  | [Events](09-events.md)                           | Dispatching and documenting component events.                              |
| 10  | [Theming](10-theming.md)                         | Authoring base styles and integrating with Lumo and Aura.                  |
| 11  | [Checklist](11-checklist.md)                     | Final scan before submitting a new component.                              |
