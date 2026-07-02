# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the Vaadin Web Components monorepo - a collection of web components built with Lit. The repository contains both Apache-licensed core components and commercially-licensed Pro components.

### Monorepo Structure

- `packages/`: Individual component packages (each has src/, test/, and entry files)
- `packages/component-base/`: Core utilities and mixins shared across components
- `packages/a11y-base/`: Accessibility mixins and utilities
- `packages/field-base/`: Field component mixins and utilities
- `packages/aura/`: Aura theme
- `packages/vaadin-lumo-styles/`: Lumo theme
- `packages/vaadin-themable-mixin/`: Theming infrastructure
- `test/integration/`: Cross-component integration tests
- `dev/`: Development playground with component examples for manual testing

See [01-repository.md](guidelines/01-repository.md) for the full setup.

## Component development guidelines

Before designing, scaffolding, or changing a component, read the relevant chapter in `guidelines/`. These are the authoritative reference; CLAUDE.md only covers repo-level orientation and commands.

| When you're...                                     | Read                                                              |
| -------------------------------------------------- | ----------------------------------------------------------------- |
| Doing anything component-related (start here)      | [guidelines/00-overview.md](guidelines/00-overview.md)            |
| Designing a new component's API/behavior           | [02-design.md](guidelines/02-design.md)                           |
| Scaffolding a package                              | [03-component-structure.md](guidelines/03-component-structure.md) |
| Choosing Lit lifecycle hooks, mixin vs. controller | [04-coding-conventions.md](guidelines/04-coding-conventions.md)   |
| Reusing shared mixins, controllers, utilities      | [05-common-packages.md](guidelines/05-common-packages.md)         |
| Writing JSDoc / API docs                           | [06-documenting.md](guidelines/06-documenting.md)                 |
| Authoring TypeScript `.d.ts`                       | [07-typescript.md](guidelines/07-typescript.md)                   |
| Designing DOM surface (parts, attributes, slots)   | [08-dom.md](guidelines/08-dom.md)                                 |
| Dispatching events                                 | [09-events.md](guidelines/09-events.md)                           |
| Theming (base styles, Lumo, Aura)                  | [10-theming.md](guidelines/10-theming.md)                         |
| Implementing accessibility, keyboard support       | [11-a11y.md](guidelines/11-a11y.md)                               |
| Writing unit, snapshot, visual, integration tests  | [12-testing.md](guidelines/12-testing.md)                         |

### Component Package Structure

All component packages under `packages/` follow the same file structure:

```
packages/button/
├── src/                     # Implementation files
├── test/                    # Test files
├── vaadin-button.js         # Main entry point
├── vaadin-button.d.ts       # TypeScript definition entry point
├── package.json
```

### Component Architecture

All components follow a consistent pattern:

- Use LitElement as the base class
- Use mixins for shared functionality (ElementMixin, ThemableMixin, etc.)
- Have TypeScript definitions alongside JavaScript implementations
- Include comprehensive test suites (unit, visual, integration)
- Support both Lumo and Aura themes

See [04-coding-conventions.md](guidelines/04-coding-conventions.md) and [05-common-packages.md](guidelines/05-common-packages.md).

### Testing Strategy

- Unit tests: Mocha + Chai + Sinon using Web Test Runner
- Visual tests: Screenshot comparison for themes
- Snapshot tests: DOM structure validation
- Integration tests: Cross-component interaction testing

## Development Commands

### Setup and Development

```bash
yarn install          # Install dependencies
yarn start            # Start development server (opens /dev)
yarn start:lumo       # Start with Lumo theme specifically
yarn start:aura       # Start with Aura theme specifically
```

### Testing

```bash
yarn test                                            # Run tests for changed packages only
yarn test --all                                      # Run tests for all packages
yarn test --group combo-box                          # Run tests for specific component
yarn test --group combo-box --glob="data-provider*"  # Run specific tests for specific component
yarn test:firefox                                    # Run tests in Firefox
yarn test:webkit                                     # Run tests in WebKit
```

### Visual and Snapshot Tests

```bash
yarn test:base               # Visual tests for component base styles
yarn test:lumo               # Visual tests for Lumo theme
yarn test:aura               # Visual tests for Aura theme
yarn test:snapshots          # DOM snapshot tests
yarn update:base             # Update component base styles reference screenshots
yarn update:lumo             # Update Lumo reference screenshots
yarn update:aura             # Update Aura reference screenshots
yarn update:snapshots        # Update DOM snapshots
```

All visual and snapshot test commands support the same `--group` option to target specific components.

### Integration Tests

```bash
yarn test:it           # Run integration tests
```

### Linting and Type Checking

```bash
yarn lint              # Run all linting checks
yarn lint:js           # ESLint and Prettier
yarn lint:css          # Stylelint for themes
yarn lint:types        # TypeScript type checking
```
