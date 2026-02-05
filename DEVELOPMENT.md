# Development

This document describes the process for running this project on your local computer, and the list
of steps to perform when creating a new major or minor version branch of the monorepo.

- [Getting started](#getting-started)
- [Linting](#linting)
- [Testing](#testing)
  - [Environment variables](#environment-variables)
  - [Unit tests](#unit-tests)
  - [Visual tests](#visual-tests)
  - [Snapshot tests](#snapshot-tests)
  - [Integration tests](#integration-tests)
- [Making a version bump](#making-a-version-bump)
- [Miscellaneous](#miscellaneous)
  - [Generating icons](#generating-icons)
  - [Using a local clone of the repo](#using-a-local-clone-of-the-repo)
  - [Fixing npm dist-tag](#fixing-npm-dist-tag)
  - [Testing Tab on WebKit](#testing-tab-on-webkit)

## Getting started

First of all, make sure you have [yarn](https://classic.yarnpkg.com/en/docs/install) installed.

Setup the repo:

```sh
yarn
```

Start the development server:

```sh
yarn start
```

## Linting

Run all the code style checks:

```sh
yarn lint
```

Run ESLint and Prettier checks:

```sh
yarn lint:js
```

Run Stylelint to check themes:

```sh
yarn lint:css
```

Run TypeScript to check typings:

```sh
yarn lint:types
```

## Testing

### Environment variables

Setup the environment variables needed by the scripts below, by copying the `.env.dist` template file to `.env`:

```
cp .env.dist .env
```

and then configure the individual variable values in the newly created `.env` file.

Not all variables are necessary for all scripts, individual sections below will note which variables are required to run a command.

### Unit tests

Run tests in Chrome:

```sh
yarn test
```

Run tests in Firefox:

```sh
yarn test:firefox
```

Run tests in WebKit:

```sh
yarn test:webkit
```

By default, tests will only run for changed packages. To run tests for all packages, use the `--all` flag:

```sh
yarn test --all
```

Run tests for single package:

```sh
yarn test --group combo-box
```

Debug tests for single package:

```sh
yarn debug --group combo-box
```

Run or debug specific test files filtered by a glob pattern:

```sh
yarn test --group combo-box --glob="data-provider*" # all data provider tests

yarn debug --group combo-box --glob="data-provider*" # all data provider tests
```

Run tests with code coverage:

```sh
yarn test --coverage
```

### Visual tests

To run the visual tests, please make sure that the `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` environment variables are defined.

Run tests for base styles:

```sh
yarn test:base
```

Update reference screenshots for base styles:

```sh
yarn update:base
```

Run tests for Lumo:

```sh
yarn test:lumo
```

Update reference screenshots for Lumo:

```sh
yarn update:lumo
```

Update screenshots for single package:

```sh
yarn update:lumo --group combo-box
```

Run tests for Aura:

```sh
yarn test:aura
```

Update reference screenshots for Aura:

```sh
yarn update:aura
```

### Snapshot tests

Run snapshot tests that are in `test/dom` folders under components:

```sh
yarn test:snapshots
```

Update snapshots for all components that have corresponding tests:

```sh
yarn update:snapshots
```

Update snapshots for single package:

```sh
yarn update:snapshots --group combo-box
```

### Integration tests

Run integration tests that are in the separate `integration` folder:

```sh
yarn test:it
```

## Making a version bump

Use the [`scripts/createVersionBranch.sh`](scripts/createVersionBranch.sh) script to bump versions:

```sh
./scripts/createVersionBranch.sh <base-branch> <version-branch> <bump-version>
```

The script requires:
- Node / NPM
- GitHub CLI (`gh`)

### Scenarios

**New minor from main**:

```sh
# Assuming latest major is 25, 25.1 is the current minor and we want to bump main to 25.2
./scripts/createVersionBranch.sh main 25.1 25.2.0-alpha0
```

- Creates branch `25.1` from `main`
- Creates PR against `main` to bump version to `25.2.0-alpha0`
- Creates PR against `25.1` to update WTR script to detect changes against `25.1` branch

**New major from main**:

```sh
# Assuming latest major is 25, 25.1 is the current minor and we want to bump main to 26.0
./scripts/createVersionBranch.sh main 25.1 26.0.0-alpha0
```

- Creates branch `25.1` from `main`
- Creates PR against `main` to bump version to `26.0.0-alpha0`
- Creates PR against `25.1` to update WTR script to detect changes against `25.1` branch

**New minor for a previous major**:

```sh
# Assuming 24 is a previous major, its current minor is 24.9 and we want to create 24.10
./scripts/createVersionBranch.sh 24.9 24.10 24.10.0-alpha0
```

- Creates branch `24.10` from `24.9`
- Creates PR against `24.10` to bump version to `24.10.0-alpha0`
- Creates PR against `24.10` to update WTR script to detect changes against `24.10` branch

### Manual steps after running the script

1. Review and merge the created PRs
2. Add the new version branch to CI build parameters:
   - [Release build](https://bender.vaadin.com/admin/editBuildParams.html?id=buildType:VaadinWebComponents_ReleaseVaadinWebComponents)
   - [API docs build](https://bender.vaadin.com/admin/editBuildParams.html?id=buildType:VaadinWebComponents_PublishWebComponentsApiDocs)
3. Update [`check-branches.js`](https://github.com/vaadin/components-team-tasks/blob/master/release-app/check-branches.js) in the release app to include the new version branch

## Miscellaneous

### Generating icons

Re-generate SVG icon sets and icon fonts from individual SVG files for the packages that have them (e.g. `vaadin-icons`):

```sh
npm -i @web-padawan/wc-icon-tool
```

```sh
wc-icon-tool
```

### Using a local clone of the repo

When using a Vaadin app, you can modify the frontend build tool config to resolve the web components modules from your local clone, instead of the versions downloaded from npm registry.

<details>
<summary>Using webpack</summary>

Modify the `webpack.config.js` in the root folder as follows:

```js
module.exports = merge(
  {
    resolve: {
      modules: ['/path/to/web-components/node_modules', 'node_modules'],
    },
  },
  flowDefaults,
);
```

</details>

<details>
<summary>Using Vite</summary>

Modify the `vite.config.ts` in the root folder as follows:

```ts
import path from 'path';
import { PluginOption, UserConfigFn } from 'vite';
import { overrideVaadinConfig } from './vite.generated';

function useLocalWebComponents(webComponentsNodeModulesPath: string): PluginOption {
  return {
    name: 'use-local-web-components',
    enforce: 'pre',
    config(config) {
      config.server = config.server ?? {};
      config.server.fs = config.server.fs ?? {};
      config.server.fs.allow = config.server.fs.allow ?? [];
      config.server.fs.allow.push(webComponentsNodeModulesPath);
      config.server.watch = config.server.watch ?? {};
      config.server.watch.ignored = [`!${webComponentsNodeModulesPath}/**`];
    },
    resolveId(id) {
      if (/^(@polymer|@vaadin)/.test(id)) {
        return this.resolve(path.join(webComponentsNodeModulesPath, id));
      }
    },
  };
}

const customConfig: UserConfigFn = (env) => ({
  // Disable the Vite dependencies pre-bundling
  optimizeDeps: {
    disabled: true,
  },
  plugins: [useLocalWebComponents('/path/to/web-components/node_modules')],
});

export default overrideVaadinConfig(customConfig);
```

</details>

> **Note**
> Make sure that the path you provide is an absolute one and that it points to the `node_modules` directory in the web components monorepo.

Then run the following command in the web components monorepo:

```
yarn
```

This will symlink the individual component packages into the `node_modules` folder.

After that you can start / restart your application and it should use the source code from the monorepo.

### Fixing npm dist-tag

When maintaining two stable majors (e.g. 22.0.x and 23.0.x), it is important to maintain `latest` npm tag.
For example, we release 22.0.7 after 23.0.1 but we still want to keep `latest` pointing to 23.0.1.

Use the following script on `main` branch to run `npm dist-tag` for all packages:

```sh
./scripts/fixDistTag.sh
```

### Testing Tab on WebKit

When running tests in Playwright WebKit on Mac OS, some tests using `sendKeys({ press: 'Tab' })` might fail for components using native `<button>` elements internally e.g. `<vaadin-upload>`. To fix this, [activate "Keyboard navigation"](https://www.a11y-collective.com/blog/how-to-activate-keyboard-navigation-on-macos/) toggle in "System Preferences > Keyboard".
