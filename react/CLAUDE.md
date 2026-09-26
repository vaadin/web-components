# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React wrappers for Vaadin web components, living in the web-components monorepo. Uses `@lit/react` to bridge Vaadin's Lit-based web components into React 19. Two packages:

- `packages/react-components/` — Open-source components (~80 components)
- `packages/react-components-pro/` — Commercial/premium components (Board, Charts, Crud, Dashboard, GridPro, Map, RichTextEditor)

## Commands

Run from the repository root:

```bash
yarn react:build         # Build web-types, then generate and compile both React packages
yarn react:dev           # Vite dev server at localhost:5173/dev/
yarn react:test          # Browser tests (Vitest + Playwright chromium)
yarn react:validate      # Type check + prettier check + build validation (parallel)
```

The React code generator reads the `web-types.json` files of the local web component packages, so `yarn react:build` runs `yarn release:cem` and `yarn release:web-types` first. Tooling (`scripts/`, `test/`, `dev/`, `types/`, Vite and Vitest configs) lives in `react/`.

## Architecture

### Component Generation

Most components are **auto-generated** from Vaadin web component JSON schemas:

1. `react/scripts/generator.ts` reads the `web-types.json` of each web component package
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

- Dev pages in `react/dev/pages/` — one `.tsx` per component for manual testing
- Kitchen sink at `react/dev/kitchen-sink/` — all components in one view
- Tests in `react/test/*.spec.tsx` — browser-based, use `vitest-browser-react` render function
- Test helpers: `nextRender()` (wait for animation frame + microtask), `findByQuerySelector()`, `catchRender()`

## Code Style

- Prettier: single quotes, 120 char width, trailing commas
- Pure ESM — all imports use `.js` extensions
- Strict TypeScript with `react-jsx` transform
