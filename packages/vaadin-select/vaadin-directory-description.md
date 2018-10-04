
# &lt;vaadin-select&gt;

[![Available in Vaadin_Directory](https://img.shields.io/vaadin-directory/v/vaadinvaadin-select.svg)](https://vaadin.com/directory/component/vaadinvaadin-select)


[&lt;vaadin-select&gt;](https://vaadin.com/components/vaadin-select) is a Web Component similar to a native browser select element, part of the [Vaadin components](https://vaadin.com/components).


[<img src="https://raw.githubusercontent.com/vaadin/vaadin-select/master/screenshot.gif" width="220" alt="Screenshot of vaadin-select">](https://vaadin.com/components/vaadin-select)

## Example Usage
```html
<vaadin-select label="Label" placeholder="Placeholder" value="Option one">
  <template>
    <vaadin-list-box>
      <vaadin-item>Option one</vaadin-item>
      <vaadin-item>Option two</vaadin-item>
      <vaadin-item>Option three</vaadin-item>
      <hr>
      <vaadin-item disabled>Option four</vaadin-item>
    </vaadin-list-box>
  </template>
</vaadin-select>
```
