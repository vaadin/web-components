
# &lt;vaadin-combo-box&gt;

[![Available in Vaadin_Directory](https://img.shields.io/vaadin-directory/v/vaadinvaadin-combo-box.svg)](https://vaadin.com/directory/component/vaadinvaadin-combo-box)

[&lt;vaadin-combo-box&gt;](https://vaadin.com/components/vaadin-combo-box) is a [Polymer](http://polymer-project.org) element combining a dropdown list with an input field for filtering the list of items, part of the [Vaadin components](https://vaadin.com/components).


[<img src="https://raw.githubusercontent.com/vaadin/vaadin-combo-box/master/screenshot.png" width="208" alt="Screenshot of vaadin-combo-box" />](https://vaadin.com/components/vaadin-combo-box)

## Example Usage
```html
<dom-bind>
  <template>
    <iron-ajax url="https://randomuser.me/api?results=100&inc=name,email" last-response="{{response}}" auto></iron-ajax>
    <vaadin-combo-box label="User" placeholder="Please select" items="[[response.results]]" item-value-path="email" item-label-path="email"></vaadin-combo-box>
  </template>
</dom-bind>
```
