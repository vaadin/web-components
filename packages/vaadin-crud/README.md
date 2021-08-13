# &lt;vaadin-crud&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-crud/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-crud/html-api)

[&lt;vaadin-crud&gt;](https://vaadin.com/components/vaadin-crud) is a Web Component for
[CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations.
It is part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-crud)](https://www.npmjs.com/package/@vaadin/vaadin-crud)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-crud)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-crud items='[{"name": "Juan", "surname": "Garcia"}]'></vaadin-crud>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-crud/master/screenshot.gif" width="700" alt="Screenshot of vaadin-crud">](https://vaadin.com/components/vaadin-crud)

## Installation

Install `vaadin-crud`:

```sh
npm i @vaadin/vaadin-crud --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-crud/vaadin-crud.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-crud.js`

- The component with the Material theme:

  `theme/material/vaadin-crud.js`

- Alias for `theme/lumo/vaadin-crud.js`:

  `vaadin-crud.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Commercial Vaadin Developer License 4.0 (CVDLv4). For license terms, see LICENSE.

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
