# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the Vaadin Web Components monorepo - a collection of high-quality, accessible web components built with Polymer and Lit, and designed for business web applications. The repository contains both Apache-licensed core components and commercially-licensed Pro components.

### Monorepo Structure

- `packages/`: Individual component packages (each has src/, test/, and entry files)
- `packages/component-base/`: Core utilities and mixins shared across components
- `packages/a11y-base/`: Accessibility mixins and utilities
- `packages/field-base/`: Field component mixins and utilities
- `packages/vaadin-lumo-styles/`: Lumo theme
- `packages/vaadin-material-styles/`: Material theme
- `packages/vaadin-themable-mixin/`: Theming infrastructure
- `test/integration/`: Cross-component integration tests
- `dev/`: Development playground with component examples for manual testing

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
- Use PolymerElement or LitElement as the base class
- Use mixins for shared functionality (ElementMixin, ThemableMixin, etc.)
- Have TypeScript definitions alongside JavaScript implementations
- Include comprehensive test suites (unit, visual, integration)
- Support both Lumo and Material themes

### Notable Mixins

- `ElementMixin`: Core Vaadin functionality
- `ThemableMixin`: Theme registration and style injection
- `FocusMixin`: Focus and focus-ring state management
- `ButtonMixin`, `FieldMixin`, etc.: Component-specific shared behavior
- `PolylitMixin`: Bridge between Polymer and Lit APIs

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
yarn test:lumo               # Visual tests for Lumo theme
yarn test:material           # Visual tests for Material theme
yarn test:snapshots          # DOM snapshot tests
yarn update:lumo             # Update Lumo reference screenshots
yarn update:material         # Update Material reference screenshots
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
