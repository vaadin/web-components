# &lt;vaadin-login&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-login/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-login/html-api)

[Vaadin Login](https://vaadin.com/components/vaadin-login) consists of two components:

&lt;vaadin-login-overlay&gt; is a Web Component providing a painless login experience, part of the [Vaadin components](https://vaadin.com/components). Component shows the &lt;vaadin-login-form&gt; inside of an overlay.

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-login)](https://www.npmjs.com/package/@vaadin/vaadin-login)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-login)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-login-overlay opened></vaadin-login-overlay>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-login/master/screenshot.png" width="700" alt="Screenshot of vaadin-login-overlay">](https://vaadin.com/components/vaadin-login)

&lt;vaadin-login-form&gt; is a Web Component providing a form to require users to log in into an application.

```html
<vaadin-login-form></vaadin-login-form>
```

## Installation

Install `vaadin-login`:

```sh
npm i @vaadin/vaadin-login --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-login/vaadin-login-overlay.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-login-overlay.js`
  `theme/lumo/vaadin-login-form.js`

- The component with the Material theme:

  `theme/material/vaadin-login-overlay.js`
  `theme/material/vaadin-login-form.js`

- Aliases for lumo themed components:

  `vaadin-login-overlay.js`
  `vaadin-login-form.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
