# &lt;vaadin-board&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-board/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-board/html-api)

[&lt;vaadin-board&gt;](https://vaadin.com/components/vaadin-board) is a Web component to create flexible responsive layouts and build nice looking dashboard.
Vaadin Board key feature is how it effectively reorders the widgets on different screen sizes, maximizing the use of space and looking stunning.

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-board)](https://www.npmjs.com/package/@vaadin/vaadin-board)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-board)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

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

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-board/master/screenshot.png" alt="Screenshot of vaadin-board">](https://vaadin.com/components/vaadin-board)

## Installation

Install `vaadin-board`:

```sh
npm i @vaadin/vaadin-board --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-board/vaadin-board.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Vaadin Board is distributed under [Commercial Vaadin Developer License 4.0](https://vaadin.com/license/cvdl-4.0) (CVDLv4). For license terms, see LICENSE.txt.

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
