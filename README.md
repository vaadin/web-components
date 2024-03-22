<p align="center">
  <a href="https://vaadin.com" rel="noopener" target="_blank"><img width="100" src="https://raw.githubusercontent.com/vaadin/web-components/master/vaadin-logo.svg" alt="Vaadin logo"></a></p>
</p>

<h1 align="center">Vaadin web components</h1>

<div align="center">

[Vaadin components](https://vaadin.com/components) is an evolving set of high-quality web components for business web applications.

[![Build](https://github.com/vaadin/web-components/actions/workflows/coverage.yml/badge.svg)](https://github.com/vaadin/web-components/actions/workflows/coverage.yml)
[![Follow on Twitter](https://img.shields.io/twitter/follow/vaadin.svg?label=follow+vaadin)](https://twitter.com/vaadin)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

</div>

## Installation

Install the components that you need from npm:

```sh
npm install @vaadin/vaadin-grid
```

## Usage

[Live demo →](https://webcomponents.dev/edit/JZcKP3kkHcJIgiCaI818/www/index.html)

Import the component's JavaScript module, use the component in your HTML, and control it with JavaScript:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Vaadin example</title>
  </head>
  <body>
    <!-- Use web components in your HTML like regular built-in elements. -->
    <vaadin-grid theme="row-dividers" column-reordering-allowed multi-sort>
      <vaadin-grid-selection-column auto-select frozen></vaadin-grid-selection-column>
      <vaadin-grid-sort-column width="9em" path="firstName"></vaadin-grid-sort-column>
      <vaadin-grid-sort-column width="9em" path="lastName"></vaadin-grid-sort-column>
      <vaadin-grid-column width="9em" path="address.city"></vaadin-grid-column>
    </vaadin-grid>

    <!-- Vaadin web components use standard JavaScript modules. -->
    <script type="module">
      // Importing the following modules registers <vaadin-grid> and its column
      // elements so that you can use them in this page.
      import '@vaadin/grid/vaadin-grid.js';
      import '@vaadin/grid/vaadin-grid-selection-column.js';
      import '@vaadin/grid/vaadin-grid-sort-column.js';

      // Use component's properties to populate data.
      const grid = document.querySelector('vaadin-grid');
      fetch('https://demo.vaadin.com/demo-data/1.0/people?count=200')
        .then((res) => res.json())
        .then((json) => (grid.items = json.result));
    </script>
  </body>
</html>
```

Serve your HTML with a development server that supports bare module specifiers, such as [`@web/dev-server`](https://modern-web.dev/docs/dev-server/overview/):

```sh
npm i -g @web/dev-server
web-dev-server --node-resolve --open
```

## Browser support

**Desktop:**

- Chrome (evergreen)
- Firefox (evergreen)
- Safari 14.1 or newer
- Edge (Chromium, evergreen)

**Mobile:**

- Chrome (evergreen) for Android (4.4 or newer)
- Safari for iOS (14.5 or newer)

## Documentation

Check out our [design system documentation](https://vaadin.com/docs/latest/components).

## Examples

Are you looking for an example project to get started? Visit [start.vaadin.com](https://start.vaadin.com/?preset=fusion) to create a Vaadin app.

## Questions

For help and support questions, please use our [community chat](https://vaad.in/chat).

## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com).

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## Development

Setup the repo:

```sh
yarn
```

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
yarn test --group vaadin-upload
```

Debug tests for single package:

```sh
yarn debug --group vaadin-upload
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
yarn update:lumo --group vaadin-upload
```

### Integration tests

Run integration tests that are in the separate `integration` folder:

```sh
yarn test:it
```

### Generating icons

Re-generate SVG icon sets and icon fonts from individual SVG files for the packages that have them (e.g. `vaadin-icons`):

```sh
yarn icons
```

### Making a major version bump

#### Create a branch for the current major

Checkout master and pull latest changes:

```sh
git checkout master && git pull
```

Create a new branch from master:

```sh
git checkout -b 23.3
```

Push a newly created branch:

```sh
git push origin 23.3
```

The newly created branch for the current major is protected by default.
The rest of the changes to that branch should happen the usual way, through a PR.

Create another branch:

```sh
git checkout -b update-v23.3
```

Update [`wtr-utils.js`](https://github.com/vaadin/web-components/blob/master/wtr-utils.js) as follows:

```diff
const isLockfileChanged = () => {
-  const log = execSync('git diff --name-only origin/master HEAD').toString();
+  const log = execSync('git diff --name-only origin/23.3 HEAD').toString();
  return log.split('\n').some((line) => line.includes('yarn.lock'));
};
```

```diff
const getChangedPackages = () => {
-  const output = execSync('./node_modules/.bin/lerna ls --since origin/master --json --loglevel silent');
+  const output = execSync('./node_modules/.bin/lerna ls --since origin/23.3 --json --loglevel silent');
  return JSON.parse(output.toString());
};
```

Create a PR to the version branch ([example](https://github.com/vaadin/web-components/pull/4432)).

#### Update the version in `master`

Create a new branch from master:

```sh
git checkout master && git checkout -b bump-v24
```

Prepare a new version for the `updateVersion` script by running the following command:

```sh
export npm_config_bump=24.0.0-alpha0
```

Run the script to bump static version getters in `ElementMixin`, `Lumo` and `Material`:

```sh
node scripts/updateVersion.js
```

Mark the new version with Lerna:

```sh
lerna version 24.0.0-alpha0 --no-push --no-git-tag-version --force-publish --exact --yes
```

Commit all the changes:

```sh
git commit -a -m "chore: update master branch to Vaadin 24"
```

Create a PR to the `master` branch ([example](https://github.com/vaadin/web-components/pull/4433)).

#### CI build updates

Add the new version branch to the `CheckoutBranch` parameter:

- [Release build](https://bender.vaadin.com/admin/editBuildParams.html?id=buildType:VaadinWebComponents_ReleaseVaadinWebComponents)
- [API docs build](https://bender.vaadin.com/admin/editBuildParams.html?id=buildType:VaadinWebComponents_PublishWebComponentsApiDocs)

### Using a local clone of the repo in Vaadin app

As long as your application uses webpack, you can modify the webpack config to resolve the web components modules from your local clone /instead of the versions downloaded from npm registry. This is possible for:

- Vaadin Starter apps created through https://start.vaadin.com
  - modify the `webpack.config.js` in the root folder
- running Jetty integration tests from the [Flow components repository](https://github.com/vaadin/flow-components)
  - running the tests will create a `webpack.config.js` in the root of the Maven module, which you can modify

In order to do this, modify the `webpack.config.js` in the root folder as follows:

```js
(flowDefaults.resolve.modules = ['/Users/serhii/vaadin/web-components/node_modules', ...flowDefaults.resolve.modules]),
  (module.exports = flowDefaults);
```

If you are merging into an existing config object, as is done in the Vaadin Starter apps:

```js
module.exports = merge(
  {
    resolve: {
      modules: ['/Users/serhii/vaadin/web-components/node_modules', 'node_modules']
    }
  },
  flowDefaults
);
```

**NOTE:** Make sure that the path is an absolute one and that it points to the `node_modules` directory in the web components monorepo.

Then run the following command in the web components monorepo:

```
yarn
```

This will symlink the individual component packages into the `node_modules` folder.

After that you can start / restart your application and it should use the source code from the monorepo.

### Fixing npm dist-tag

When maintaining two stable majors (e.g. 22.0.x and 23.0.x), it is important to maintain `latest` npm tag.
For example, we release 22.0.7 after 23.0.1 but we still want to keep `latest` pointing to 23.0.1.

Use the following script on `master` branch to run `npm dist-tag` for all packages:

```sh
./scripts/fixDistTag.sh
```

## LICENSE

For specific package(s), check the LICENSE file under the package folder.
