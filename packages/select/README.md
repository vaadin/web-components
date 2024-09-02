# @vaadin/select

A web component for selecting a single value from a list of options presented in an overlay.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/select)

[![npm version](https://badgen.net/npm/v/@vaadin/select)](https://www.npmjs.com/package/@vaadin/select)

```html
<vaadin-select label="Sort by"></vaadin-select>
<script>
  document.querySelector('vaadin-select').renderer = (root) => {
    if (root.firstElementChild) {
      return;
    }

    // Note that innerHTML is only used for demo purposes here!
    // Consider using Lit or another template library instead.
    root.innerHTML = `
      <vaadin-list-box>
        <vaadin-item value="recent">Most recent first</vaadin-item>
        <vaadin-item value="rating-desc">Rating: high to low</vaadin-item>
        <vaadin-item value="rating-asc">Rating: low to high</vaadin-item>
        <vaadin-item value="price-desc">Price: high to low</vaadin-item>
        <vaadin-item value="price-asc">Price: low to high</vaadin-item>
      </vaadin-list-box>
    `;
  };
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/select/screenshot.png" width="231" alt="Screenshot of vaadin-select">](https://vaadin.com/docs/latest/components/select)

## Installation

Install the component:

```sh
npm i @vaadin/select
```

Once installed, import the component in your application:

```js
import '@vaadin/select';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/main/packages/select/vaadin-select.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/select/theme/material/vaadin-select.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/select/theme/lumo/vaadin-select.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/select/src/vaadin-select.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
