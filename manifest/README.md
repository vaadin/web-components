# Manifest tooling

Private workspace with tooling for [custom elements manifest](https://github.com/open-wc/custom-elements-manifest) (CEM) generation.

## Commands

Run the commands from the repo root.

```sh
yarn release:cem         # analyze the sources, write custom-elements.json, split it per package
yarn release:web-types   # write web-types.json and web-types.lit.json per package from the manifests
yarn test:manifest       # run the Node unit tests in manifest/test/
```

## Files

| Path                                 | Purpose                                                               |
| ------------------------------------ | --------------------------------------------------------------------- |
| `custom-elements-manifest.config.js` | Analyzer config with the Vaadin plugins.                              |
| `scripts/split-cem.js`               | Splits the root `custom-elements.json` into one manifest per package. |
| `lib/cem-helpers.js`                 | Shared helpers that read packages and manifests.                      |
| `test/`                              | Unit tests that run with `node --test`.                               |
