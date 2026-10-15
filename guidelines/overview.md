# Web Component Guidelines

These guidelines describe how Vaadin Web components should be designed and
implemented in the `web-components` repository. Chapters can be read selectively
for the topics your work touches.

Treat these as guidelines, not hard rules. They are best practices that should
be followed by default, but can be deviated from when necessary to make
something work.

## Pre-requisites

These guidelines assume basic familiarity with:

- Web Components (Custom Elements, Shadow DOM, slots).
- [Lit 3](https://lit.dev) — templates, reactive properties, lifecycle.
- TypeScript — types, interfaces, and the mixin pattern.
- CSS custom properties.

For repository-level commands (install, start, lint, test) see `CLAUDE.md`.

## Chapters

| Chapter                                                 | Topic                                                                         |
| ------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [Repository](repository.md)                             | Looking up the tech stack, test tooling, and workspace layout.                |
| [Design](design.md)                                     | Designing the API and behavior of a new component before implementation.      |
| [Package Structure](package-structure.md)               | Scaffolding a new component package.                                          |
| [Component Implementation](component-implementation.md) | Building the element class: mixins, properties, lifecycle hooks, controllers. |
| [Common packages](common-packages.md)                   | Reusing shared mixins, controllers, and utilities before reinventing them.    |
| [Documenting](documenting.md)                           | Authoring JSDoc for proper API docs generation.                               |
| [TypeScript](typescript.md)                             | Authoring Typescript definitions.                                             |
| [DOM](dom.md)                                           | Designing a component's DOM surface — parts, attributes, slots.               |
| [Events](events.md)                                     | Dispatching and documenting component events.                                 |
| [Theming](theming.md)                                   | Authoring base styles and integrating with Lumo and Aura.                     |
| [Accessibility](a11y.md)                                | Implementing accessible roles, labels, focus, and keyboard support.           |
| [Testing](testing.md)                                   | Authoring unit, snapshot, visual, and integration tests.                      |
