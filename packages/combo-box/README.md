# &lt;vaadin-combo-box&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-combo-box/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-combo-box/html-api)

[&lt;vaadin-combo-box&gt;](https://vaadin.com/components/vaadin-combo-box) is a Web Component combining a dropdown list with an input field for filtering the list of items, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-combo-box)](https://www.npmjs.com/package/@vaadin/vaadin-combo-box)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-combo-box)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-combo-box
  label="User"
  placeholder="Please select"
  item-value-path="email"
  item-label-path="email"
></vaadin-combo-box>

<script>
  const comboBox = document.querySelector('vaadin-combo-box');

  fetch('https://randomuser.me/api?results=100&inc=name,email')
    .then((res) => res.json())
    .then((json) => (comboBox.items = json.results));
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-combo-box/master/screenshot.png" width="208" alt="Screenshot of vaadin-combo-box" />](https://vaadin.com/components/vaadin-combo-box)

## Installation

Install `vaadin-combo-box`:

```sh
npm i @vaadin/vaadin-combo-box --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-combo-box/vaadin-combo-box.js';
```

## Getting Started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The components with the Lumo theme:

  `theme/lumo/vaadin-combo-box.js`
  `theme/lumo/vaadin-combo-box-light.js`

- The components with the Material theme:

  `theme/material/vaadin-combo-box.js`
  `theme/material/vaadin-combo-box-light.js`

- Alias for `theme/lumo/vaadin-combo-box.js`
  `theme/lumo/vaadin-combo-box-light.js`

  `vaadin-combo-box.js`
  `vaadin-combo-box-light.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
