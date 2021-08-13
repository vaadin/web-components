# &lt;vaadin-select&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-select/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-select/html-api)

[&lt;vaadin-select&gt;](https://vaadin.com/components/vaadin-select) is a Web Component similar to a native browser select element, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-select)](https://www.npmjs.com/package/@vaadin/vaadin-select)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-select)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-select></vaadin-select>
<script>
  document.querySelector('vaadin-select').renderer = (root) => {
    if (root.firstElementChild) {
      return;
    }

    // Note that innerHTML is only used for demo purposes here!
    // Prefer using a templating library instead.
    root.innerHTML = `
      <vaadin-list-box>
        <vaadin-item>Option one</vaadin-item>
        <vaadin-item>Option two</vaadin-item>
        <vaadin-item>Option three</vaadin-item>
        <hr>
        <vaadin-item disabled>Option four</vaadin-item>
      </vaadin-list-box>
    `;
  };
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-select/master/screenshot.gif" width="220" alt="Screenshot of vaadin-select">](https://vaadin.com/components/vaadin-select)

## Installation

Install `vaadin-select`:

```sh
npm i @vaadin/vaadin-select --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-select/vaadin-select.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-select.js`

- The component with the Material theme:

- `theme/material/vaadin-select.js`

- Alias for `theme/lumo/vaadin-select.js`:

- `vaadin-select.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
