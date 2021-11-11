<p align="center">
  <a href="https://vaadin.com" rel="noopener" target="_blank"><img width="100" src="https://raw.githubusercontent.com/vaadin/web-components/master/vaadin-logo.svg" alt="Vaadin logo"></a></p>
</p>

<h1 align="center">Vaadin web components</h1>

<div align="center">

[Vaadin components](https://vaadin.com/components) is an evolving set of high-quality web components for business web applications.

[![Chrome](https://github.com/vaadin/web-components/actions/workflows/chrome.yml/badge.svg)](https://github.com/vaadin/web-components/actions/workflows/chrome.yml)
[![Firefox](https://github.com/vaadin/web-components/actions/workflows/firefox.yml/badge.svg)](https://github.com/vaadin/web-components/actions/workflows/firefox.yml)
[![WebKit](https://github.com/vaadin/web-components/actions/workflows/webkit.yml/badge.svg)](https://github.com/vaadin/web-components/actions/workflows/webkit.yml)
[![Follow on Twitter](https://img.shields.io/twitter/follow/vaadin.svg?label=follow+vaadin)](https://twitter.com/vaadin)
[![Discord](https://discordapp.com/api/guilds/732335336448852018/widget.png)](https://vaad.in/chat)

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

## Components

This project contains components for Vaadin 20+. Please see individual repositories for older Vaadin versions.

### Core Components

The components below are licensed under the Apache License 2.0.

| Component                                                                                                            | npm version                                                                                                                                    | Issues                                                                            |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [`<vaadin-accordion>`](https://github.com/vaadin/web-components/tree/master/packages/accordion)               | [![npm version](https://badgen.net/npm/v/@vaadin/accordion/next)](https://www.npmjs.com/package/@vaadin/accordion)               | [Issues](https://github.com/vaadin/web-components/labels/vaadin-accordion)        |
| [`<vaadin-app-layout>`](https://github.com/vaadin/web-components/tree/master/packages/app-layout)             | [![npm version](https://badgen.net/npm/v/@vaadin/app-layout/next)](https://www.npmjs.com/package/@vaadin/app-layout)             | [Issues](https://github.com/vaadin/web-components/labels/vaadin-app-layout)       |
| [`<vaadin-avatar>`](https://github.com/vaadin/web-components/tree/master/packages/avatar)                     | [![npm version](https://badgen.net/npm/v/@vaadin/avatar/next)](https://www.npmjs.com/package/@vaadin/avatar)                     | [Issues](https://github.com/vaadin/web-components/labels/vaadin-avatar)           |
| [`<vaadin-avatar-group>`](https://github.com/vaadin/web-components/tree/master/packages/avatar-group)                     | [![npm version](https://badgen.net/npm/v/@vaadin/avatar-group/next)](https://www.npmjs.com/package/@vaadin/avatar-group)                     | [Issues](https://github.com/vaadin/web-components/labels/vaadin-avatar-group)           |
| [`<vaadin-button>`](https://github.com/vaadin/web-components/tree/master/packages/button)                     | [![npm version](https://badgen.net/npm/v/@vaadin/button/next)](https://www.npmjs.com/package/@vaadin/button)                     | [Issues](https://github.com/vaadin/web-components/labels/vaadin-button)           |
| [`<vaadin-checkbox>`](https://github.com/vaadin/web-components/tree/master/packages/checkbox)                 | [![npm version](https://badgen.net/npm/v/@vaadin/checkbox/next)](https://www.npmjs.com/package/@vaadin/checkbox)                 | [Issues](https://github.com/vaadin/web-components/labels/vaadin-checkbox)         |
| [`<vaadin-checkbox-group>`](https://github.com/vaadin/web-components/tree/master/packages/checkbox-group)                 | [![npm version](https://badgen.net/npm/v/@vaadin/checkbox-group/next)](https://www.npmjs.com/package/@vaadin/checkbox-group)                 | [Issues](https://github.com/vaadin/web-components/labels/vaadin-checkbox-group)         |
| [`<vaadin-combo-box>`](https://github.com/vaadin/web-components/tree/master/packages/combo-box)               | [![npm version](https://badgen.net/npm/v/@vaadin/combo-box/next)](https://www.npmjs.com/package/@vaadin/combo-box)               | [Issues](https://github.com/vaadin/web-components/labels/vaadin-combo-box)        |
| [`<vaadin-context-menu>`](https://github.com/vaadin/web-components/tree/master/packages/context-menu)         | [![npm version](https://badgen.net/npm/v/@vaadin/context-menu/next)](https://www.npmjs.com/package/@vaadin/context-menu)         | [Issues](https://github.com/vaadin/web-components/labels/vaadin-context-menu)     |
| [`<vaadin-custom-field>`](https://github.com/vaadin/web-components/tree/master/packages/custom-field)         | [![npm version](https://badgen.net/npm/v/@vaadin/custom-field/next)](https://www.npmjs.com/package/@vaadin/custom-field)         | [Issues](https://github.com/vaadin/web-components/labels/vaadin-custom-field)     |
| [`<vaadin-date-picker>`](https://github.com/vaadin/web-components/tree/master/packages/date-picker)           | [![npm version](https://badgen.net/npm/v/@vaadin/date-picker/next)](https://www.npmjs.com/package/@vaadin/date-picker)           | [Issues](https://github.com/vaadin/web-components/labels/vaadin-date-picker)      |
| [`<vaadin-date-time-picker>`](https://github.com/vaadin/web-components/tree/master/packages/date-time-picker) | [![npm version](https://badgen.net/npm/v/@vaadin/date-time-picker/next)](https://www.npmjs.com/package/@vaadin/date-time-picker) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-date-time-picker) |
| [`<vaadin-details>`](https://github.com/vaadin/web-components/tree/master/packages/details)                   | [![npm version](https://badgen.net/npm/v/@vaadin/details/next)](https://www.npmjs.com/package/@vaadin/details)                   | [Issues](https://github.com/vaadin/web-components/labels/vaadin-details)          |
| [`<vaadin-dialog>`](https://github.com/vaadin/web-components/tree/master/packages/dialog)                     | [![npm version](https://badgen.net/npm/v/@vaadin/dialog/next)](https://www.npmjs.com/package/@vaadin/dialog)                     | [Issues](https://github.com/vaadin/web-components/labels/vaadin-dialog)           |
| [`<vaadin-email-field>`](https://github.com/vaadin/web-components/tree/master/packages/email-field)                     | [![npm version](https://badgen.net/npm/v/@vaadin/email-field/next)](https://www.npmjs.com/package/@vaadin/email-field)                     | [Issues](https://github.com/vaadin/web-components/labels/vaadin-email-field)           |
| [`<vaadin-form-layout>`](https://github.com/vaadin/web-components/tree/master/packages/form-layout)           | [![npm version](https://badgen.net/npm/v/@vaadin/form-layout/next)](https://www.npmjs.com/package/@vaadin/form-layout)           | [Issues](https://github.com/vaadin/web-components/labels/vaadin-form-layout)      |
| [`<vaadin-grid>`](https://github.com/vaadin/web-components/tree/master/packages/grid)                         | [![npm version](https://badgen.net/npm/v/@vaadin/grid/next)](https://www.npmjs.com/package/@vaadin/grid)                         | [Issues](https://github.com/vaadin/web-components/labels/vaadin-grid)             |
| [`<vaadin-horizontal-layout>`](https://github.com/vaadin/web-components/tree/master/packages/horizontal-layout)                         | [![npm version](https://badgen.net/npm/v/@vaadin/horizontal-layout/next)](https://www.npmjs.com/package/@vaadin/horizontal-layout)                         | [Issues](https://github.com/vaadin/web-components/labels/vaadin-horizontal-layout)             |
| [`<vaadin-icon>`](https://github.com/vaadin/web-components/tree/master/packages/icon)                       | [![npm version](https://badgen.net/npm/v/@vaadin/icon/next)](https://www.npmjs.com/package/@vaadin/icon)                       | [Issues](https://github.com/vaadin/web-components/labels/vaadin-icon)            |
| [`<vaadin-icons>`](https://github.com/vaadin/web-components/tree/master/packages/icons)                       | [![npm version](https://badgen.net/npm/v/@vaadin/icons/next)](https://www.npmjs.com/package/@vaadin/icons)                       | [Issues](https://github.com/vaadin/web-components/labels/vaadin-icons)            |
| [`<vaadin-integer-field>`](https://github.com/vaadin/web-components/tree/master/packages/integer-field)                         | [![npm version](https://badgen.net/npm/v/@vaadin/integer-field/next)](https://www.npmjs.com/package/@vaadin/integer-field)                         | [Issues](https://github.com/vaadin/web-components/labels/vaadin-integer-field)             |
| [`<vaadin-item>`](https://github.com/vaadin/web-components/tree/master/packages/item)                         | [![npm version](https://badgen.net/npm/v/@vaadin/item/next)](https://www.npmjs.com/package/@vaadin/item)                         | [Issues](https://github.com/vaadin/web-components/labels/vaadin-item)             |
| [`<vaadin-list-box>`](https://github.com/vaadin/web-components/tree/master/packages/list-box)                 | [![npm version](https://badgen.net/npm/v/@vaadin/list-box/next)](https://www.npmjs.com/package/@vaadin/list-box)                 | [Issues](https://github.com/vaadin/web-components/labels/vaadin-list-box)         |
| [`<vaadin-login>`](https://github.com/vaadin/web-components/tree/master/packages/login)                       | [![npm version](https://badgen.net/npm/v/@vaadin/login/next)](https://www.npmjs.com/package/@vaadin/login)                       | [Issues](https://github.com/vaadin/web-components/labels/vaadin-login)            |
| [`<vaadin-menu-bar>`](https://github.com/vaadin/web-components/tree/master/packages/menu-bar)                 | [![npm version](https://badgen.net/npm/v/@vaadin/menu-bar/next)](https://www.npmjs.com/package/@vaadin/menu-bar)                 | [Issues](https://github.com/vaadin/web-components/labels/vaadin-menu-bar)         |
| [`<vaadin-message-input>`](https://github.com/vaadin/web-components/tree/master/packages/message-input)                 | [![npm version](https://badgen.net/npm/v/@vaadin/message-input/next)](https://www.npmjs.com/package/@vaadin/message-input)                 | [Issues](https://github.com/vaadin/web-components/labels/vaadin-message-input)         |
| [`<vaadin-message-list>`](https://github.com/vaadin/web-components/tree/master/packages/message-list)                 | [![npm version](https://badgen.net/npm/v/@vaadin/message-list/next)](https://www.npmjs.com/package/@vaadin/message-list)                 | [Issues](https://github.com/vaadin/web-components/labels/vaadin-message-list)         |
| [`<vaadin-notification>`](https://github.com/vaadin/web-components/tree/master/packages/notification)         | [![npm version](https://badgen.net/npm/v/@vaadin/notification/next)](https://www.npmjs.com/package/@vaadin/notification)         | [Issues](https://github.com/vaadin/web-components/labels/vaadin-notification)     |
| [`<vaadin-number-field>`](https://github.com/vaadin/web-components/tree/master/packages/number-field)         | [![npm version](https://badgen.net/npm/v/@vaadin/number-field/next)](https://www.npmjs.com/package/@vaadin/number-field)         | [Issues](https://github.com/vaadin/web-components/labels/vaadin-number-field)     |
| [`<vaadin-password-field>`](https://github.com/vaadin/web-components/tree/master/packages/password-field)         | [![npm version](https://badgen.net/npm/v/@vaadin/password-field/next)](https://www.npmjs.com/package/@vaadin/password-field)         | [Issues](https://github.com/vaadin/web-components/labels/vaadin-password-field)     |
| [`<vaadin-progress-bar>`](https://github.com/vaadin/web-components/tree/master/packages/progress-bar)         | [![npm version](https://badgen.net/npm/v/@vaadin/progress-bar/next)](https://www.npmjs.com/package/@vaadin/progress-bar)         | [Issues](https://github.com/vaadin/web-components/labels/vaadin-progress-bar)     |
| [`<vaadin-radio-group>`](https://github.com/vaadin/web-components/tree/master/packages/radio-group)         | [![npm version](https://badgen.net/npm/v/@vaadin/radio-group/next)](https://www.npmjs.com/package/@vaadin/radio-group)         | [Issues](https://github.com/vaadin/web-components/labels/vaadin-radio-group)     |
| [`<vaadin-scroller>`](https://github.com/vaadin/web-components/tree/master/packages/scroller)                     | [![npm version](https://badgen.net/npm/v/@vaadin/scroller/next)](https://www.npmjs.com/package/@vaadin/scroller)                     | [Issues](https://github.com/vaadin/web-components/labels/vaadin-scroller)           |
| [`<vaadin-select>`](https://github.com/vaadin/web-components/tree/master/packages/select)                     | [![npm version](https://badgen.net/npm/v/@vaadin/select/next)](https://www.npmjs.com/package/@vaadin/select)                     | [Issues](https://github.com/vaadin/web-components/labels/vaadin-select)           |
| [`<vaadin-split-layout>`](https://github.com/vaadin/web-components/tree/master/packages/split-layout)         | [![npm version](https://badgen.net/npm/v/@vaadin/split-layout/next)](https://www.npmjs.com/package/@vaadin/split-layout)         | [Issues](https://github.com/vaadin/web-components/labels/vaadin-split-layout)     |
| [`<vaadin-tabs>`](https://github.com/vaadin/web-components/tree/master/packages/tabs)                         | [![npm version](https://badgen.net/npm/v/@vaadin/tabs/next)](https://www.npmjs.com/package/@vaadin/tabs)                         | [Issues](https://github.com/vaadin/web-components/labels/vaadin-tabs)             |
| [`<vaadin-text-area>`](https://github.com/vaadin/web-components/tree/master/packages/text-area)             | [![npm version](https://badgen.net/npm/v/@vaadin/text-area/next)](https://www.npmjs.com/package/@vaadin/text-area)             | [Issues](https://github.com/vaadin/web-components/labels/vaadin-text-area)       |
| [`<vaadin-text-field>`](https://github.com/vaadin/web-components/tree/master/packages/text-field)             | [![npm version](https://badgen.net/npm/v/@vaadin/text-field/next)](https://www.npmjs.com/package/@vaadin/text-field)             | [Issues](https://github.com/vaadin/web-components/labels/vaadin-text-field)       |
| [`<vaadin-time-picker>`](https://github.com/vaadin/web-components/tree/master/packages/time-picker)           | [![npm version](https://badgen.net/npm/v/@vaadin/time-picker/next)](https://www.npmjs.com/package/@vaadin/time-picker)           | [Issues](https://github.com/vaadin/web-components/labels/vaadin-time-picker)      |
| [`<vaadin-upload>`](https://github.com/vaadin/web-components/tree/master/packages/upload)                     | [![npm version](https://badgen.net/npm/v/@vaadin/upload/next)](https://www.npmjs.com/package/@vaadin/upload)                     | [Issues](https://github.com/vaadin/web-components/labels/vaadin-upload)           |
| [`<vaadin-virtual-list>`](https://github.com/vaadin/web-components/tree/master/packages/virtual-list)         | [![npm version](https://badgen.net/npm/v/@vaadin/virtual-list/next)](https://www.npmjs.com/package/@vaadin/virtual-list)         | [Issues](https://github.com/vaadin/web-components/labels/vaadin-virtual-list)     |

### Pro Components

The components below are licensed under [CVDL 4.0 license](https://vaadin.com/license/cvdl-4.0) and available as part of the [Vaadin Pro Subscription](https://vaadin.com/pricing).

| Component                                                                                                            | npm version                                                                                                                                    | Issues                                                                            |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [`<vaadin-board>`](https://github.com/vaadin/web-components/tree/master/packages/board)                       | [![npm version](https://badgen.net/npm/v/@vaadin/board/next)](https://www.npmjs.com/package/@vaadin/board)                       | [Issues](https://github.com/vaadin/web-components/labels/vaadin-board)            |
| [`<vaadin-charts>`](https://github.com/vaadin/web-components/tree/master/packages/charts)                     | [![npm version](https://badgen.net/npm/v/@vaadin/charts/next)](https://www.npmjs.com/package/@vaadin/charts)                     | [Issues](https://github.com/vaadin/web-components/labels/vaadin-charts)           |
| [`<vaadin-confirm-dialog>`](https://github.com/vaadin/web-components/tree/master/packages/confirm-dialog)     | [![npm version](https://badgen.net/npm/v/@vaadin/confirm-dialog/next)](https://www.npmjs.com/package/@vaadin/confirm-dialog)     | [Issues](https://github.com/vaadin/web-components/labels/vaadin-confirm-dialog)   |
| [`<vaadin-cookie-consent>`](https://github.com/vaadin/web-components/tree/master/packages/cookie-consent)     | [![npm version](https://badgen.net/npm/v/@vaadin/cookie-consent/next)](https://www.npmjs.com/package/@vaadin/cookie-consent)     | [Issues](https://github.com/vaadin/web-components/labels/vaadin-cookie-consent)   |
| [`<vaadin-crud>`](https://github.com/vaadin/web-components/tree/master/packages/crud)                         | [![npm version](https://badgen.net/npm/v/@vaadin/crud/next)](https://www.npmjs.com/package/@vaadin/crud)                         | [Issues](https://github.com/vaadin/web-components/labels/vaadin-crud)             |
| [`<vaadin-grid-pro>`](https://github.com/vaadin/web-components/tree/master/packages/grid-pro)                 | [![npm version](https://badgen.net/npm/v/@vaadin/grid-pro/next)](https://www.npmjs.com/package/@vaadin/grid-pro)                 | [Issues](https://github.com/vaadin/web-components/labels/vaadin-grid-pro)         |
| [`<vaadin-rich-text-editor>`](https://github.com/vaadin/web-components/tree/master/packages/rich-text-editor) | [![npm version](https://badgen.net/npm/v/@vaadin/rich-text-editor/next)](https://www.npmjs.com/package/@vaadin/rich-text-editor) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-rich-text-editor) |

## Browser support

Vaadin components use [Custom Elements](https://caniuse.com/#feat=custom-elementsv1) and [Shadow DOM](https://caniuse.com/#feat=shadowdomv1)
that are natively supported by modern browsers.

## Documentation

Check out our [design system documentation](https://vaadin.com/docs/latest/ds/overview).

## Examples

Are you looking for an example project to get started? Visit [start.vaadin.com](https://start.vaadin.com/?preset=fusion) to create a Vaadin app.

## Questions

For help and support questions, please use our [community chat](https://vaad.in/chat).

## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com).

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

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
git checkout -b 22.0
```

Push a newly created branch:

```sh
git push origin 22.0
```

The newly created branch for the current major is protected by default.
The rest of the changes to that branch should happen the usual way, through a PR.

Create another branch:

```sh
git checkout -b update-v22
```

Update [`wtr-utils.js`](https://github.com/vaadin/web-components/blob/master/wtr-utils.js) as follows:

```diff
const getChangedPackages = () => {
-  const output = execSync('./node_modules/.bin/lerna ls --since origin/master --json --loglevel silent');
+  const output = execSync('./node_modules/.bin/lerna ls --since origin/22.0 --json --loglevel silent');
  return JSON.parse(output.toString());
};
```

Create a PR to the version branch ([example](https://github.com/vaadin/web-components/pull/260)).

#### Update the version in `master`

Create a new branch from master:

```sh
git checkout master && git checkout -b bump-v23
```

Prepare a new version for the `updateVersion` script by running the following command:

```sh
export npm_config_bump=23.0.0-alpha0
```

Run the script to bump static version getters in `ElementMixin`, `Lumo` and `Material`:

```sh
node scripts/updateVersion.js
```

Mark the new version with Lerna:

```sh
lerna version 23.0.0-alpha0 --no-push --no-git-tag-version --yes
```

Commit all the changes:

```sh
git commit -a -m "chore: update master to Vaadin 23 [skip ci]"
```

Create a PR to the `master` branch ([example](https://github.com/vaadin/web-components/pull/261)).

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
flowDefaults.resolve.modules = [
  '/Users/serhii/vaadin/web-components/node_modules',
  ...flowDefaults.resolve.modules,
],

module.exports = flowDefaults;
```

If you are merging into an existing config object, as is done in the Vaadin Starter apps:

```js
module.exports = merge({
  resolve:{
    modules: ['/Users/serhii/vaadin/web-components/node_modules', 'node_modules']
  }
}, flowDefaults);
```

**NOTE:** Make sure that the path is an absolute one and that it points to the `node_modules` directory in the web components monorepo.

Then run the following command in the web components monorepo:

```
yarn
```

This will symlink the individual component packages into the `node_modules` folder.

After that you can start / restart your application and it should use the source code from the monorepo.

## LICENSE

For specific package(s), check the LICENSE file under the package folder.
