# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monorepo containing React wrappers for Vaadin web components. Uses `@lit/react` to bridge Vaadin's Lit-based web components into React 19. Two packages:

- `packages/react-components/` — Open-source components (~80 components)
- `packages/react-components-pro/` — Commercial/premium components (Board, Charts, Crud, Dashboard, GridPro, Map, RichTextEditor)

## Commands

```bash
npm run dev              # Vite dev server at localhost:5173/dev/
npm run build            # Full build (schema load + code gen + compile)
npm run test             # Browser tests (Vitest + Playwright chromium)
npm run test:watch       # Tests in watch mode
npm run validate         # Type check + prettier check + build validation (parallel)
npm run validate:types   # tsc --noEmit
npm run validate:prettier # Check formatting only
```

Individual build steps:

```bash
npm run build:load-schema   # Load JSON schemas from Vaadin web component packages
npm run build:code:ts       # Compile with esbuild
npm run build:code:dts      # Generate .d.ts files
```

## Architecture

### Component Generation

Most components are **auto-generated** from Vaadin web component JSON schemas:

1. `scripts/generator.ts` reads schemas from `types/` directory
2. Generates React wrappers in `packages/*/src/generated/` using `createComponent()` from `@lit/react`
3. Each generated file exports the component, its element class, and prop types

### Hand-Written Component Wrappers

Complex components that need React-specific behavior live in `packages/react-components/src/*.tsx` (not in `generated/`). These wrap the generated base component and add:

- **Renderers**: Converting React JSX into web component slot content via portals
- **Generic types**: e.g., `Grid<TItem>`, `ComboBox<TItem>`
- **Ref forwarding** with `useMergedRefs()`
- **Layout effects** for synchronous DOM mutations

### Renderer System (`packages/react-components/src/renderers/`)

The renderer hooks are the core abstraction for bridging React rendering into web component slots:

- `useRenderer` — Base hook; creates React portals into web component shadow DOM slots
- `useModelRenderer` — Adds model data (used by Grid rows, ComboBox items)
- `useContextRenderer` — Adds context data (used by ContextMenu)
- `useSimpleOrChildrenRenderer` — Accepts either a renderer function or React children (used by Dialog, Popover)

### Utilities (`packages/react-components/src/utils/`)

- `createComponent` — Main factory wrapping `@lit/react`'s `createComponent`
- `createComponentWithOrderedProps` — Variant that preserves property application order
- `useMergedRefs` — Combines multiple React refs into one

## Development

- Dev pages in `dev/pages/` — one `.tsx` per component for manual testing
- Kitchen sink at `dev/kitchen-sink/` — all components in one view
- Tests in `test/*.spec.tsx` — browser-based, use `vitest-browser-react` render function
- Test helpers: `nextRender()` (wait for animation frame + microtask), `findByQuerySelector()`, `catchRender()`

## Code Style

- Prettier: single quotes, 120 char width, trailing commas
- Pure ESM — all imports use `.js` extensions
- Pre-commit hook runs prettier via lint-staged
- Strict TypeScript with `react-jsx` transform
