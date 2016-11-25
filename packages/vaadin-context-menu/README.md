![Bower version](https://img.shields.io/bower/v/vaadin-context-menu.svg) [![Build Status](https://travis-ci.org/vaadin/vaadin-context-menu.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-context-menu) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-context-menu&gt;

[&lt;vaadin-context-menu&gt;](https://vaadin.com/elements/-/element/vaadin-context-menu) is a [Polymer](http://polymer-project.org) element providing a contextual menu, part of the [Vaadin Core Elements](https://vaadin.com/elements).

<!---
```
<custom-element-demo height="260">
  <template>
    <style>
     vaadin-context-menu {
       font-family: sans-serif;
     }
    </style>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="../paper-menu/paper-menu.html">
    <link rel="import" href="../paper-item/paper-item.html">
    <link rel="import" href="../paper-item/paper-item-body.html">
    <link rel="import" href="../iron-icons/iron-icons.html">
    <link rel="import" href="vaadin-context-menu.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-context-menu selector="#opener">
  <template>
    <paper-menu>
      <paper-item>Item 1</paper-item>
      <paper-item>Item 2</paper-item>
      <paper-item>Item 3</paper-item>
      <paper-item>
        <iron-icon icon="warning"></iron-icon>
        <paper-item-body two-line>
          <div>Item 4 - Line 1</div>
          <div secondary>Item 4 - Line 2</div>
        </paper-item-body>
      </paper-item>
    </paper-menu>
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
