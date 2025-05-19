# @vaadin/context-menu

A web component that can be attached to any component to display a context menu.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/context-menu)

[![npm version](https://badgen.net/npm/v/@vaadin/context-menu)](https://www.npmjs.com/package/@vaadin/context-menu)

```html
<vaadin-context-menu>
  <span>Open a context menu with <b>right click</b> or with <b>long touch.</b></span>
</vaadin-context-menu>

<script>
  const contextMenu = document.querySelector('vaadin-context-menu');
  contextMenu.renderer = function (root) {
    let listBox = root.firstElementChild;
    // Check if there is a list-box generated with the previous renderer call to update its content instead of recreation
    if (listBox) {
      listBox.innerHTML = '';
    } else {
      listBox = document.createElement('vaadin-list-box');
      root.appendChild(listBox);
    }

    ['First', 'Second', 'Third'].forEach(function (name) {
      const item = document.createElement('vaadin-item');
      item.textContent = name + ' menu item';
      listBox.appendChild(item);
    });
  };
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/context-menu/screenshot.png" width="493" alt="Screenshot of vaadin-context-menu">](https://vaadin.com/docs/latest/components/context-menu)

**Note:** [`<vaadin-list-box>`](https://github.com/vaadin/vaadin-list-box) component used in the above example should be installed and imported separately.

## Installation

Install the component:

```sh
npm i @vaadin/context-menu
```

Once installed, import the component in your application:

```js
import '@vaadin/context-menu';
```

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
