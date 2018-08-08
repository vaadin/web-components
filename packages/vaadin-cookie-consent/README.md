[![Build Status](https://travis-ci.org/vaadin/vaadin-cookie-consent.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-cookie-consent)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-cookie-consent&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-cookie-consent/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-cookie-consent/html-api)


[&lt;vaadin-cookie-consent&gt;](https://vaadin.com/components/vaadin-cookie-consent) is a web component used for showing a cookie consent banner the first time a user visits the application. Cookie Consent is part of the [Vaadin components](https://vaadin.com/components).


## Getting Started

### Install Vaadin Cookie Consent in your project
```
$ bower install --save vaadin/vaadin-cookie-consent
```

### Import Vaadin Cookie Consent
Add html import
```html
<link rel="import" href="../../bower_components/vaadin-cookie-consent/vaadin-cookie-consent.html">
```

### Use Vaadin Cookie Consent
Create your first Vaadin Cookie Consent
```html
<vaadin-cookie-consent></vaadin-cookie-consent>
```

### Install License Key
After one day using Vaadin Cookie Consent in a development environment you will see a pop-up that asks you to enter the license key.
You can get your trial key from [https://vaadin.com/pro/licenses](https://vaadin.com/pro/licenses).
If the license is valid, it will be saved to the local storage of the browser and you will not see the pop-up again.

- **Trial license** https://vaadin.com/pro/licenses


## Customizing Vaadin Cookie Consent
<!--
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-cookie-consent.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-cookie-consent
  message="We are using cookies to make your visit here awesome!"
  dismiss="Accept"
  learn-more="Why?"
  learn-more-link="https://yourdomain.com/terms-of-service">
</vaadin-cookie-consent>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-cookie-consent/master/screenshot.png" width="100%" alt="Screenshot of vaadin-cookie-consent">](https://vaadin.com/components/vaadin-cookie-consent)


## The file structure for Vaadin components

Vaadin components use the Lumo theme by default.

- `src/vaadin-cookie-consent.html`

  Unstyled component.

- `theme/lumo/vaadin-cookie-consent.html`

  Component with Lumo theme.

- `vaadin-cookie-consent.html`

  Alias for theme/lumo/vaadin-cookie-consent.html


## Running demos and tests in browser

1. Fork the `vaadin-cookie-consent` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-cookie-consent` directory, run `npm install` and then `bower install` to install dependencies.

1. Make sure you have [polymer-cli](https://www.npmjs.com/package/polymer-cli) installed globally: `npm i -g polymer-cli`.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-cookie-consent/demo
  - http://127.0.0.1:8080/components/vaadin-cookie-consent/test


## Running tests from the command line

1. When in the `vaadin-cookie-consent` directory, run `polymer test`


### Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com).


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Contributing

  To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.


## License

Commercial Vaadin Add-on License version 3 (CVALv3). For license terms, see LICENSE.

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
