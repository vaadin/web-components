# @vaadin/upload

A web component for uploading files.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/upload)

[![npm version](https://badgen.net/npm/v/@vaadin/upload)](https://www.npmjs.com/package/@vaadin/upload)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-upload accept=".pdf">
  <span slot="drop-label">Drop your favourite Novels here (PDF files only)</span>
</vaadin-upload>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/master/packages/upload/screenshot.png" width="656" alt="Screenshot of vaadin-upload">](https://vaadin.com/docs/latest/components/upload)

## Installation

Install the component:

```sh
npm i @vaadin/upload
```

Once installed, import the component in your application:

```js
import '@vaadin/upload';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/upload/vaadin-upload.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/upload/theme/material/vaadin-upload.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/upload/theme/lumo/vaadin-upload.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/upload/src/vaadin-upload.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
