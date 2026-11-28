# Manifest tooling

Private workspace with tooling for [custom elements manifest](https://github.com/open-wc/custom-elements-manifest) (CEM) generation.

The tooling is TypeScript. Node 24 runs it with type stripping, so it needs no build step.
Use only erasable syntax: no `enum`, `namespace` or parameter properties.

## Commands

Run the commands from the repo root.

```sh
yarn release:cem         # analyze the sources, write custom-elements.json, split it per package
yarn release:web-types   # write web-types.json and web-types.lit.json per package from the manifests
yarn test:manifest       # run the Node unit tests in manifest/test/
yarn lint:types:manifest # type-check the tooling
```

To see how the working tree changes the public API, compare it with a base ref.
The command prints the comment that the CEM API workflow posts on a pull request.
It regenerates the ignored `custom-elements.json` and web-types files of the
working tree, and skips the generation when no input of the manifests changed.

```sh
yarn workspace @vaadin/manifest-tools compare --base origin/main
```

## Files

| Path                                 | Purpose                                                                  |
| ------------------------------------ | ------------------------------------------------------------------------ |
| `custom-elements-manifest.config.js` | Analyzer config with the Vaadin plugins.                                 |
| `scripts/split-cem.ts`               | Splits the root `custom-elements.json` into one manifest per package.    |
| `scripts/cem-api.ts`                 | Writes API snapshots of both outputs and compares two of them.           |
| `lib/cem-helpers.ts`                 | Shared helpers that read packages and manifests.                         |
| `lib/split-paths.ts`                 | Functions that map module paths and split the root manifest per package. |
| `lib/api-snapshot.ts`                | Pure functions that build the snapshots, the diff and the PR comment.    |
| `lib/web-types.ts`                   | Functions that build the plain and the Lit web-types of a package.       |
| `lib/web-types-schema.ts`            | Types of the web-types fields that the tooling writes and reads.         |
| `lib/plugin-types.ts`                | Types of the analyzer plugin hooks, with the items of schema 2.1.0.      |
| `types/analyzer-utils.d.ts`          | Types of the internal analyzer helpers that the plugins import.          |
| `test/`                              | Unit tests that run with `node --test`.                                  |

## Plugins

The following custom [CEM analyzer plugins](https://custom-elements-manifest.open-wc.org/analyzer/plugins/authoring/) are used:

| Path                       | Purpose                                                                                                   |
| -------------------------- | --------------------------------------------------------------------------------------------------------- |
| `plugins/class-privacy.ts` | Sets the privacy of a class from its `@private` or `@protected` JSDoc tag.                                |
| `plugins/inheritance.ts`   | Applies inheritance from the own items of each class and mixin, nearest first.                            |
| `plugins/public-api.ts`    | Keeps only the public API: drops private items and internal attributes, sorts, and removes empty modules. |
| `plugins/readonly.ts`      | Marks the fields declared with `readOnly: true` as `readonly`.                                            |
