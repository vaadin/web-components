
# &lt;vaadin-context-menu&gt;

[![Available in Vaadin_Directory](https://img.shields.io/vaadin-directory/v/vaadinvaadin-context-menu.svg)](https://vaadin.com/directory/component/vaadinvaadin-context-menu)

[&lt;vaadin-context-menu&gt;](https://vaadin.com/components/vaadin-context-menu) is a Web Component providing a contextual menu, part of the [Vaadin components](https://vaadin.com/components).


[<img src="https://raw.githubusercontent.com/vaadin/vaadin-context-menu/master/screenshot.png" width="493" alt="Screenshot of vaadin-context-menu">](https://vaadin.com/components/vaadin-context-menu)

## Example Usage
```html
<vaadin-context-menu>
  <template>
    <vaadin-list-box>
      <vaadin-item>First menu item</vaadin-item>
      <vaadin-item>Second menu item</vaadin-item>
      <vaadin-item>Third menu item</vaadin-item>
      <hr>
      <vaadin-item disabled>Fourth menu item</vaadin-item>
      <vaadin-item disabled>Fifth menu item</vaadin-item>
      <hr>
      <vaadin-item>Sixth menu item</vaadin-item>
    </vaadin-list-box>
  </template>

  Open a context menu with <b>right click</b> or with <b>long touch.</b>
</vaadin-context-menu>
```
