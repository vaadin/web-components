# @vaadin/vaadin-template-renderer

Adds declarative `<template>` APIs with Polymer binding support to Vaadin components.

## Installation

```sh
npm i @vaadin/vaadin-template-renderer
```

## Example

```html
<script type="module">
  import '@vaadin/vaadin-template-renderer';
</script>

<vaadin-dialog>
  <template>
    <div>This simple dialog will close by pressing the Esc key,</div>
    <div> or by a mouse click anywhere outside the dialog area</div>
  </template>
</vaadin-dialog>
```

## License

Apache License 2.0
