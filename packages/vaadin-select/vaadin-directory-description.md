
# &lt;vaadin-select&gt;

[![Available in Vaadin_Directory](https://img.shields.io/vaadin-directory/v/vaadinvaadin-select.svg)](https://vaadin.com/directory/component/vaadinvaadin-select)


[&lt;vaadin-select&gt;](https://vaadin.com/components/vaadin-select) is a Web Component similar to a native browser select element, part of the [Vaadin components](https://vaadin.com/components).


[<img src="https://raw.githubusercontent.com/vaadin/vaadin-select/master/screenshot.gif" width="220" alt="Screenshot of vaadin-select">](https://vaadin.com/components/vaadin-select)

## Example Usage
```html
<vaadin-select></vaadin-select>
<script>
  document.querySelector('vaadin-select').renderer = function(root) {
    // Check if there is a list-box generated with the previous renderer call to update its content instead of recreation
    if (root.firstChild) {
      return;
    }
    // create the <vaadin-list-box>
    const listBox = document.createElement('vaadin-list-box');
    // append 3 <vaadin-item> elements
    ['Jose', 'Manolo', 'Pedro'].forEach(function(name) {
      const item = document.createElement('vaadin-item');
      item.textContent = name;
      listBox.appendChild(item);
    });
    // update the content
    root.appendChild(listBox);
  };
</script>
```
