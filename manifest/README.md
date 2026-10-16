# Manifest tooling

Private workspace with tooling for [custom elements manifest](https://github.com/open-wc/custom-elements-manifest) (CEM) generation.

## Commands

Run the commands from the repo root.

```sh
yarn release:cem         # analyze the sources, write custom-elements.json, split it per package
yarn release:web-types   # write web-types.json and web-types.lit.json per package from the manifests
yarn test:manifest       # run the Node unit tests in manifest/test/
```

To see how the working tree changes the public API, compare it with a base ref.
The command prints the comment that the CEM API workflow posts on a pull request.
It regenerates the ignored `custom-elements.json` and web-types files of the
working tree, and skips the generation when no input of the manifests changed.

```sh
yarn workspace @vaadin/manifest-tools compare --base origin/main
```

## Files

| Path                                 | Purpose                                                                                   |
| ------------------------------------ | ----------------------------------------------------------------------------------------- |
| `custom-elements-manifest.config.js` | Analyzer config with the Vaadin plugins.                                                  |
| `scripts/split-cem.js`               | Splits the root `custom-elements.json` into one manifest per package.                     |
| `scripts/cem-api.js`                 | Writes API snapshots of both outputs and compares two of them.                            |
| `lib/property-configs.js`            | Lists the property configs of a class or mixin node for the plugins of the analyze phase. |
| `lib/cem-helpers.js`                 | Shared helpers that read packages and manifests.                                          |
| `lib/api-snapshot.js`                | Pure functions that build the snapshots, the diff and the PR comment.                     |
| `test/`                              | Unit tests that run with `node --test`.                                                   |

## Plugins

The following custom [CEM analyzer plugins](https://custom-elements-manifest.open-wc.org/analyzer/plugins/authoring/) are used:

| Path                           | Purpose                                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `plugins/class-privacy.js`     | Sets the privacy of a class from its `@private` or `@protected` JSDoc tag.                                |
| `plugins/inheritance.js`       | Applies inheritance from the own items of each class and mixin, nearest first.                            |
| `plugins/property-defaults.js` | Records the `value` of a property config as the `default` of the field and its attribute.                 |
| `plugins/public-api.js`        | Keeps only the public API: drops private items and internal attributes, sorts, and removes empty modules. |
| `plugins/readonly.js`          | Marks the fields declared with `readOnly: true` as `readonly`.                                            |
