# React components tooling

This workspace holds the tooling for `@vaadin/react-components` and `@vaadin/react-components-pro`:
the wrapper generator and build (`scripts/`), the Vitest setup (`vite.config.ts`, `test/`) and the dev pages (`dev/`).

## Build

```sh
yarn build:react     # CEM input, then `yarn release:react`: generate wrappers, bundle, emit types, update exports for both packages
yarn release:react   # only the React packages, the step `yarn release` runs after it has built the inputs
yarn clean:react     # remove the generated sources and the build output
```

## Test

Specs live in `packages/react-components*/test/*.spec.tsx` and run in Chromium through Playwright.

```sh
npx playwright install chromium   # once
yarn build:react                  # once: the wrappers re-export the gitignored `src/generated`, and the bare `@vaadin/react-components` import uses the built `index.js`
yarn test:react
```

Subpath imports such as `@vaadin/react-components/Grid.js` resolve to the sources in tests, so changes in
`packages/react-components/src` are visible without a rebuild.

## Dev pages

```sh
yarn build:react     # once, see above
yarn start:react     # opens /dev/ with one page per file in react/dev/pages/, e.g. /dev/grid.html
```

Add a page for a component by adding `react/dev/pages/<Component>.tsx` with a default export.
