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

## Getting started

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

Run tests with code coverage:

```sh
yarn test --coverage
```

### Visual tests

To run the visual tests, please make sure that the `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` environment variables are defined.

Run tests for Lumo:

```sh
yarn test:lumo
```

Run tests for Material:

```sh
yarn test:material
```

Update reference screenshots for Lumo:

```sh
yarn update:lumo
```

Update reference screenshots for Material:

```sh
yarn update:material
```

Update screenshots for single package:

```sh
yarn update:lumo --group combo-box
```

### Snapshot tests

Run snapshot tests that are in `test/dom` folders under components:

```sh
yarn test:it
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

### Create a branch for the current major

Checkout master and pull latest changes:

```sh
git checkout master && git pull
```

Create a new branch from master:

```sh
git checkout -b 24.0
```

Push a newly created branch:

```sh
git push origin 24.0
```

The newly created branch for the current major is protected by default.
The rest of the changes to that branch should happen the usual way, through a PR.

Create another branch:

```sh
git checkout -b update-v24.0
```

Update [`wtr-utils.js`](https://github.com/vaadin/web-components/blob/master/wtr-utils.js) as follows:

```diff
const isLockfileChanged = () => {
-  const log = execSync('git diff --name-only origin/master HEAD').toString();
+  const log = execSync('git diff --name-only origin/24.0 HEAD').toString();
  return log.split('\n').some((line) => line.includes('yarn.lock'));
};
```

```diff
const getChangedPackages = () => {
-  const output = execSync('./node_modules/.bin/lerna ls --since origin/master --json --loglevel silent');
+  const output = execSync('./node_modules/.bin/lerna ls --since origin/24.0 --json --loglevel silent');
  return JSON.parse(output.toString());
};
```

Create a PR to the version branch ([example](https://github.com/vaadin/web-components/pull/4432)).

### Update the version in `master`

Create a new branch from master:

```sh
git checkout master && git checkout -b bump-v24.1
```

Prepare a new version for the `updateVersion` script by running the following command:

```sh
export npm_config_bump=24.1.0-alpha0
```

Run the script to bump static version getters in `ElementMixin`, `Lumo` and `Material`:

```sh
node scripts/updateVersion.js
```

Mark the new version with Lerna:

```sh
lerna version 24.1.0-alpha0 --no-push --no-git-tag-version --force-publish --exact --yes
```

Commit all the changes:

```sh
git commit -a -m "chore: update master branch to Vaadin 24.1"
```

Create a PR to the `master` branch ([example](https://github.com/vaadin/web-components/pull/4433)).

### CI build updates

Add the new version branch to the `CheckoutBranch` parameter:

- [Release build](https://bender.vaadin.com/admin/editBuildParams.html?id=buildType:VaadinWebComponents_ReleaseVaadinWebComponents)
- [API docs build](https://bender.vaadin.com/admin/editBuildParams.html?id=buildType:VaadinWebComponents_PublishWebComponentsApiDocs)

## Miscellaneous

### Generating icons

Re-generate SVG icon sets and icon fonts from individual SVG files for the packages that have them (e.g. `vaadin-icons`):

```sh
yarn icons
```

## Using a local clone of the repo

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

## Fixing npm dist-tag

When maintaining two stable majors (e.g. 22.0.x and 23.0.x), it is important to maintain `latest` npm tag.
For example, we release 22.0.7 after 23.0.1 but we still want to keep `latest` pointing to 23.0.1.

Use the following script on `master` branch to run `npm dist-tag` for all packages:

```sh
./scripts/fixDistTag.sh
```
