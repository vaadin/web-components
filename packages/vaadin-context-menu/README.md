![Bower version](https://img.shields.io/bower/v/vaadin-context-menu.svg) [![Build Status](https://travis-ci.org/vaadin/vaadin-context-menu.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-context-menu) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-context-menu&gt;

[&lt;vaadin-context-menu&gt;](https://vaadin.com/elements/-/element/vaadin-context-menu) is a [Polymer](http://polymer-project.org) element providing a contextual menu, part of the [Vaadin Core Elements](https://vaadin.com/elements).

<!---
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-context-menu.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-context-menu selector="a">
  <template>
    <style>
      div[role="menu"] {
        padding: 16px 0;
        background: #fff;
      }

      div[role="option"] {
        min-height: 32px;
        padding: 0 24px;
        font-size: 16px;
        display: flex;
        align-items: center;
      }

      div[role="option"]:hover {
        background: #d6d6d6;
      }
    </style>
    <div role="menu">
      <div role="option">Item 1</div>
      <div role="option">Item 2</div>
    </div>
  </template>
  Right click on this <a id="opener" href="#">link</a> to open the context menu.
</vaadin-context-menu>
```
## Contributing

See the [contribution instructions](https://github.com/vaadin/vaadin-core-elements#contributing) which apply to all Vaadin core elements.

## Development

See the [development instructions](https://github.com/vaadin/vaadin-core-elements#development) which apply to all Vaadin core elements.

## License

Apache License 2.0
