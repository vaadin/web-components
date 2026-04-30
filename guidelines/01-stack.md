# Stack

## Runtime stack

- [**Lit 3**](https://lit.dev) — base class and templating.
- **TypeScript 6** — type definitions for every public component (see
  [TypeScript](06-typescript.md)).

Every component is built as a Lit `LitElement`, layered with the Vaadin
mixins documented in [Common packages](04-common-packages.md). New components
use Lit-native features (`static properties`, `firstUpdated`, `updated`,
field initializers) rather than Polymer-style options.

## Test stack

- [**Web Test Runner**](https://modern-web.dev/docs/test-runner/overview/)
  with the [`@web/test-runner-playwright`](https://www.npmjs.com/package/@web/test-runner-playwright)
  launcher (Chromium by default; Firefox and WebKit configs at the repo root).
- **Mocha + Chai + Sinon** for unit tests, plus
  [`@vaadin/chai-plugins`](../test/plugins) for repo-specific assertions.
- [`@web/test-runner-visual-regression`](https://www.npmjs.com/package/@web/test-runner-visual-regression)
  for screenshot comparison (Lumo, Aura, base styles).
- DOM snapshot tests use `@vaadin/chai-plugins`'s `equalSnapshot` helper.
- Cross-component integration tests live in [`test/integration`](../test/integration)
  and are run with `yarn test:it`.

Versions are pinned in the root `package.json` and per-package `package.json`
files — refer to those rather than copying numbers into prose.

## Monorepo

The repo is a Lerna + Yarn workspaces monorepo (`lerna.json`, root
`package.json#workspaces`). Workspaces:

| Workspace            | Purpose                                                                  |
| -------------------- | ------------------------------------------------------------------------ |
| `packages/*`         | Public component packages (published to npm under `@vaadin/*`).          |
| `test/*`             | Private testing infrastructure (not published).                          |
| `dev`                | Manual-test playground; one HTML page per component.                     |
| `api-docs`           | Eleventy site that generates per-release API documentation.              |

### Private packages

These workspaces are not published — they support development and testing.

- **`test/test-runner-commands`** (`@vaadin/test-runner-commands`) — wrappers
  around `@web/test-runner-commands` (mouse, keyboard, fixtures).
- **`test/integration`** (`@vaadin/integration-tests`) — cross-component
  integration tests; declares every component as a devDependency.
- **`test/plugins`** (`@vaadin/chai-plugins`) — Mocha/Chai assertion plugins
  (`semantic-dom-diff`, `sinon-chai` integrations).
- **`test/types`** — TypeScript type stubs used by per-package typings tests.
- **`dev`** — manual-test playground with one `<component>.html` per component
  and a shared `common.js`. Started with `yarn start` and deployed to
  GitHub Pages from `main` by CI.
- **`api-docs`** — Eleventy 3.x static site built from the root `analysis.json`
  and per-package `custom-elements.json`. Generated for every release.

For repository commands (`yarn start`, `yarn test`, `yarn test:it`,
`yarn lint`, …) see `CLAUDE.md` at the repo root.
