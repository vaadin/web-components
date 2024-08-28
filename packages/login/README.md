# @vaadin/login

A web component for displaying a login form, either inline, or as an overlay.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/login)

[![npm version](https://badgen.net/npm/v/@vaadin/login)](https://www.npmjs.com/package/@vaadin/login)

```html
<vaadin-login-overlay opened></vaadin-login-overlay>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/login/screenshot.png" width="456" alt="Screenshot of vaadin-login-overlay">](https://vaadin.com/docs/latest/components/login)

## Installation

Install the component:

```sh
npm i @vaadin/login
```

Once installed, import the component in your application:

```js
import '@vaadin/login';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/main/packages/list-box/vaadin-list-box.js) of the package uses Lumo theme.

To use the Material theme, import the components from the `theme/material` folder:

```js
import '@vaadin/login/theme/material/vaadin-login-overlay.js';
import '@vaadin/login/theme/material/vaadin-login-form.js';
```

You can also import the Lumo version of the components explicitly:

```js
import '@vaadin/login/theme/lumo/vaadin-login-overlay.js';
import '@vaadin/login/theme/lumo/vaadin-login-form.js';
```

Finally, you can import the un-themed components from the `src` folder to get a minimal starting point:

```js
import '@vaadin/login/src/vaadin-login-overlay.js';
import '@vaadin/login/src/vaadin-login-form.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
