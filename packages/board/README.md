# @vaadin/board

A powerful and easy to use layout web component for building responsive views.

> ℹ️&nbsp; A commercial Vaadin [subscription](https://vaadin.com/pricing) is required to use Board in your project.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/board)

[![npm version](https://badgen.net/npm/v/@vaadin/board)](https://www.npmjs.com/package/@vaadin/board)

```html
<vaadin-board>
  <vaadin-board-row>
    <div class="top a" board-cols="2">top A</div>
    <div class="top b">top B</div>
    <div class="top c">top C</div>
  </vaadin-board-row>
  <vaadin-board-row>
    <div class="mid">mid</div>
  </vaadin-board-row>
  <vaadin-board-row>
    <div class="low a">low A</div>
    <vaadin-board-row>
      <div class="top a">low B / A</div>
      <div class="top b">low B / B</div>
      <div class="top c">low B / C</div>
      <div class="top d">low B / D</div>
    </vaadin-board-row>
  </vaadin-board-row>
</vaadin-board>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/board/screenshot.png" alt="Screenshot of vaadin-board">](https://vaadin.com/docs/latest/components/board)

## Installation

Install the component:

```sh
npm i @vaadin/board
```

Once installed, import the component in your application:

```js
import '@vaadin/board';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

This program is available under Vaadin Commercial License and Service Terms. For license terms, see LICENSE.

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
