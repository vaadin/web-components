# &lt;vaadin-tabs&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-tabs/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-tabs/html-api)

[&lt;vaadin-tabs&gt;](https://vaadin.com/components/vaadin-tabs) is a Web Component providing item navigation part of the [Vaadin components](https://vaadin.com/components). It is designed for menu and tab components.

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-tabs)](https://www.npmjs.com/package/@vaadin/vaadin-tabs)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-tabs)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-tabs selected="3">
  <vaadin-tab>Page 1</vaadin-tab>
  <vaadin-tab>Page 2</vaadin-tab>
  <vaadin-tab>Page 3</vaadin-tab>
  <vaadin-tab>Page 4</vaadin-tab>
</vaadin-tabs>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-tabs/master/screenshot.png" width="355" alt="Screenshot of vaadin-tabs, using the default Lumo theme">](https://vaadin.com/components/vaadin-tabs)

## Installation

Install `vaadin-tabs`:

```sh
npm i @vaadin/vaadin-tabs --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-tabs/vaadin-tabs.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The components with the Lumo theme:

  `theme/lumo/vaadin-tab.js`
  `theme/lumo/vaadin-tabs.js`

- The components with the Material theme:

  `theme/material/vaadin-tab.js`
  `theme/material/vaadin-tabs.js`

- Alias for `theme/lumo/vaadin-tab.js`
  `theme/lumo/vaadin-tabs.js`:

  `vaadin-tab.js`
  `vaadin-tabs.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
