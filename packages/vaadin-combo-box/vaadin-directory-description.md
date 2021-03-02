
# &lt;vaadin-combo-box&gt;

[![Available in Vaadin_Directory](https://img.shields.io/vaadin-directory/v/vaadinvaadin-combo-box.svg)](https://vaadin.com/directory/component/vaadinvaadin-combo-box)

[&lt;vaadin-combo-box&gt;](https://vaadin.com/components/vaadin-combo-box) is a Web Component combining a dropdown list with an input field for filtering the list of items, part of the [Vaadin components](https://vaadin.com/components).


[<img src="https://raw.githubusercontent.com/vaadin/vaadin-combo-box/master/screenshot.png" width="208" alt="Screenshot of vaadin-combo-box" />](https://vaadin.com/components/vaadin-combo-box)

## Example Usage
```html
<vaadin-combo-box label="User" placeholder="Please select" item-value-path="email" item-label-path="email"></vaadin-combo-box>

<script>
  const comboBox = document.querySelector('vaadin-combo-box');

  fetch('https://randomuser.me/api?results=100&inc=name,email')
    .then(res => res.json())
    .then(json => comboBox.items = json.results);
</script>
```
