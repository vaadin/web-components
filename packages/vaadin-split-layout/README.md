![Bower version](https://img.shields.io/bower/v/vaadin-split-layout.svg)
[![Build status](https://travis-ci.org/vaadin/vaadin-split-layout.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-split-layout)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-split-layout&gt;

[&lt;vaadin-split-layout&gt;](https://vaadin.com/elements/-/element/vaadin-split-layout) is a  [Polymer](http://polymer-project.org) element implementing a split layout for two content elements with a draggable splitter between them, part of the [vaadin-core-elements](https://vaadin.com/elements) element bundle.

<!---
```
<custom-element-demo height="218">
  <template>
    <style>
     vaadin-split-layout {
       height: 200px;
     }
     vaadin-split-layout > div {
       font-family: sans-serif;
       background: #e0e0e0;
       display:flex;
       justify-content:center;
       align-items:center;
     }
    </style>
    <script src="../webcomponentsjs/webcomponents-lite.min.js"></script>
    <link rel="import" href="vaadin-split-layout.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-split-layout>
  <vaadin-split-layout vertical>
    <div>First layout content</div>
    <div>Second layout content</div>
  </vaadin-split-layout>
  <vaadin-split-layout vertical>
    <div>Third layout content</div>
    <div>Fourth layout content</div>
  </vaadin-split-layout>
</vaadin-split-layout>
```


<!--- ## Getting started --->

<!--- Visit https://vaadin.com/elements/-/element/vaadin-split-layout for features, demos and documentation. --->

## Contributing

See the [contribution instructions](https://github.com/vaadin/vaadin-core-elements#contributing) which apply to all Vaadin core elements.

## Development

See the [development instructions](https://github.com/vaadin/vaadin-core-elements/blob/master/DEVELOPMENT.md) which apply to all Vaadin core elements.

## License

Apache License 2.0
