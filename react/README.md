# React components tooling

This workspace holds the tooling for `@vaadin/react-components` and `@vaadin/react-components-pro`:
the wrapper generator and build (`scripts/`), the Vitest setup (`vite.config.ts`, `test/`) and the dev pages (`dev/`).

## Build

```sh
yarn release:react   # CEM and web-types inputs, then generate wrappers, bundle, emit types, update exports
yarn clean:react     # remove the generated sources and the build output
```

## Test

Specs live in `packages/react-components*/test/*.spec.tsx` and run in Chromium through Playwright.

```sh
npx playwright install chromium   # once
yarn release:react                # once, the bare `@vaadin/react-components` import uses the built index.js
yarn test:react
```

Subpath imports such as `@vaadin/react-components/Grid.js` resolve to the sources in tests, so changes in
`packages/react-components/src` are visible without a rebuild.
