<p align="center">
  <a href="https://vaadin.com" rel="noopener" target="_blank"><img width="100" src="https://raw.githubusercontent.com/vaadin/vaadin-web-components/master/vaadin-logo.svg" alt="Vaadin logo"></a></p>
</p>

<h1 align="center">Vaadin web components</h1>

<div align="center">

[Vaadin components](https://vaadin.com/components) is an evolving set of high-quality web components for business web applications.

[![Chrome](https://github.com/vaadin/vaadin-web-components/actions/workflows/chrome.yml/badge.svg)](https://github.com/vaadin/vaadin-web-components/actions/workflows/chrome.yml)
[![Firefox](https://github.com/vaadin/vaadin-web-components/actions/workflows/firefox.yml/badge.svg)](https://github.com/vaadin/vaadin-web-components/actions/workflows/firefox.yml)
[![WebKit](https://github.com/vaadin/vaadin-web-components/actions/workflows/webkit.yml/badge.svg)](https://github.com/vaadin/vaadin-web-components/actions/workflows/webkit.yml)
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
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
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
      import '@vaadin/vaadin-grid/vaadin-grid.js';
      import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';
      import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';

      // Use component's properties to populate data.
      const grid = document.querySelector('vaadin-grid');
      fetch('https://demo.vaadin.com/demo-data/1.0/people?count=200')
        .then(res => res.json())
        .then(json => grid.items = json.result);
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

| Component | npm version  | Issues             |
|-----------|--------------|--------------------|
| [`<vaadin-accordion>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-accordion) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-accordion/next)](https://www.npmjs.com/package/@vaadin/vaadin-accordion) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-accordion)
| [`<vaadin-app-layout>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-app-layout) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-app-layout/next)](https://www.npmjs.com/package/@vaadin/vaadin-app-layout) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-app-layout)
| [`<vaadin-avatar>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-avatar) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-avatar/next)](https://www.npmjs.com/package/@vaadin/vaadin-avatar) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-avatar)
| [`<vaadin-button>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-button) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-button/next)](https://www.npmjs.com/package/@vaadin/vaadin-button) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-button)
| [`<vaadin-checkbox>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-checkbox) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-checkbox/next)](https://www.npmjs.com/package/@vaadin/vaadin-checkbox) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-checkbox)
| [`<vaadin-combo-box>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-combo-box) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-combo-box/next)](https://www.npmjs.com/package/@vaadin/vaadin-combo-box) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-combo-box)
| [`<vaadin-context-menu>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-context-menu) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-context-menu/next)](https://www.npmjs.com/package/@vaadin/vaadin-context-menu) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-context-menu)
| [`<vaadin-custom-field>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-custom-field) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-custom-field/next)](https://www.npmjs.com/package/@vaadin/vaadin-custom-field) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-custom-field)
| [`<vaadin-date-picker>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-date-picker) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-date-picker/next)](https://www.npmjs.com/package/@vaadin/vaadin-date-picker) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-date-picker)
| [`<vaadin-date-time-picker>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-date-time-picker) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-date-time-picker/next)](https://www.npmjs.com/package/@vaadin/vaadin-date-time-picker) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-date-time-picker)
| [`<vaadin-details>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-details) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-details/next)](https://www.npmjs.com/package/@vaadin/vaadin-details) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-details)
| [`<vaadin-dialog>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-dialog) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-dialog/next)](https://www.npmjs.com/package/@vaadin/vaadin-dialog) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-dialog)
| [`<vaadin-form-layout>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-form-layout) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-form-layout/next)](https://www.npmjs.com/package/@vaadin/vaadin-form-layout) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-form-layout)
| [`<vaadin-grid>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-grid) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-grid/next)](https://www.npmjs.com/package/@vaadin/vaadin-grid) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-grid)
| [`<vaadin-icons>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-icons) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-icons/next)](https://www.npmjs.com/package/@vaadin/vaadin-icons) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-icons)
| [`<vaadin-item>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-item) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-item/next)](https://www.npmjs.com/package/@vaadin/vaadin-item) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-item)
| [`<vaadin-list-box>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-list-box) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-list-box/next)](https://www.npmjs.com/package/@vaadin/vaadin-list-box) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-list-box)
| [`<vaadin-login>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-login) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-login/next)](https://www.npmjs.com/package/@vaadin/vaadin-login) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-login)
| [`<vaadin-menu-bar>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-menu-bar) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-menu-bar/next)](https://www.npmjs.com/package/@vaadin/vaadin-menu-bar) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-menu-bar)
| [`<vaadin-messages>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-messages) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-messages/next)](https://www.npmjs.com/package/@vaadin/vaadin-messages) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-messages)
| [`<vaadin-notification>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-notification) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-notification/next)](https://www.npmjs.com/package/@vaadin/vaadin-notification) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-notification)
| [`<vaadin-ordered-layout>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-ordered-layout) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-ordered-layout/next)](https://www.npmjs.com/package/@vaadin/vaadin-ordered-layout) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-ordered-layout)
| [`<vaadin-progress-bar>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-progress-bar) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-progress-bar/next)](https://www.npmjs.com/package/@vaadin/vaadin-progress-bar) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-progress-bar)
| [`<vaadin-radio-button>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-radio-button) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-radio-button/next)](https://www.npmjs.com/package/@vaadin/vaadin-radio-button) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-radio-button)
| [`<vaadin-select>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-select) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-select/next)](https://www.npmjs.com/package/@vaadin/vaadin-select) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-select)
| [`<vaadin-split-layout>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-split-layout) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-split-layout/next)](https://www.npmjs.com/package/@vaadin/vaadin-split-layout) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-split-layout)
| [`<vaadin-tabs>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-tabs) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-tabs/next)](https://www.npmjs.com/package/@vaadin/vaadin-tabs) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-tabs)
| [`<vaadin-text-field>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-text-field) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-text-field/next)](https://www.npmjs.com/package/@vaadin/vaadin-text-field) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-text-field)
| [`<vaadin-time-picker>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-time-picker) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-time-picker/next)](https://www.npmjs.com/package/@vaadin/vaadin-time-picker) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-time-picker)
| [`<vaadin-upload>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-upload) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-upload/next)](https://www.npmjs.com/package/@vaadin/vaadin-upload) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-upload)

### Pro Components

The components below are licensed under [CVDL 4.0 license](https://vaadin.com/license/cvdl-4.0) and available as part of the [Vaadin Pro Subscription](https://vaadin.com/pricing).

| Component | npm version  | Issues             |
|-----------|--------------|--------------------|
| [`<vaadin-board>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-board) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-board/next)](https://www.npmjs.com/package/@vaadin/vaadin-board) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-board)
| [`<vaadin-charts>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-charts) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-charts/next)](https://www.npmjs.com/package/@vaadin/vaadin-charts) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-charts)
| [`<vaadin-confirm-dialog>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-confirm-dialog) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-confirm-dialog/next)](https://www.npmjs.com/package/@vaadin/vaadin-confirm-dialog) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-confirm-dialog)
| [`<vaadin-cookie-consent>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-cookie-consent) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-cookie-consent/next)](https://www.npmjs.com/package/@vaadin/vaadin-cookie-consent) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-cookie-consent)
| [`<vaadin-crud>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-crud) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-crud/next)](https://www.npmjs.com/package/@vaadin/vaadin-crud) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-crud)
| [`<vaadin-grid-pro>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-grid-pro) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-grid-pro/next)](https://www.npmjs.com/package/@vaadin/vaadin-grid-pro) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-grid-pro)
| [`<vaadin-rich-text-editor>`](https://github.com/vaadin/vaadin-web-components/tree/master/packages/vaadin-rich-text-editor) | [![npm version](https://badgen.net/npm/v/@vaadin/vaadin-rich-text-editor/next)](https://www.npmjs.com/package/@vaadin/vaadin-rich-text-editor) | [Issues](https://github.com/vaadin/web-components/labels/vaadin-rich-text-editor)

## Browser support

Vaadin components use [Custom Elements](https://caniuse.com/#feat=custom-elementsv1) and [Shadow DOM](https://caniuse.com/#feat=shadowdomv1)
that are natively supported by modern browsers.

## Documentation

Check out our [design system documentation](https://vaadin.com/docs-beta/latest/ds/overview/).

## Examples

Are you looking for an example project to get started? Visit [start.vaadin.com](https://start.vaadin.com/?preset=fusion) to create a Vaadin app.

## Questions

For help and support questions, please use our [community chat](https://vaad.in/chat).

## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com).

## Contributing

Read the [contributing guide](https://vaadin.com/docs-beta/latest/guide/contributing/overview/) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

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

Run all tests in Chrome:

```sh
yarn test
```

Run all tests in Firefox:

```sh
yarn test:firefox
```

Run all tests in WebKit:

```sh
yarn test:webkit
```

Run tests for single package:

```sh
yarn test --group vaadin-upload
```

Debug tests for single package:

```sh
yarn debug --group vaadin-upload
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

## LICENSE

For specific package(s), check the LICENSE file under the package folder.
