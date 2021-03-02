
# &lt;vaadin-context-menu&gt;

[![Available in Vaadin_Directory](https://img.shields.io/vaadin-directory/v/vaadinvaadin-context-menu.svg)](https://vaadin.com/directory/component/vaadinvaadin-context-menu)

[&lt;vaadin-context-menu&gt;](https://vaadin.com/components/vaadin-context-menu) is a Web Component providing a contextual menu, part of the [Vaadin components](https://vaadin.com/components).


[<img src="https://raw.githubusercontent.com/vaadin/vaadin-context-menu/master/screenshot.png" width="493" alt="Screenshot of vaadin-context-menu">](https://vaadin.com/components/vaadin-context-menu)

## Example Usage
```html
<vaadin-context-menu>
  Open a context menu with <b>right click</b> or with <b>long touch.</b>
</vaadin-context-menu>

<script>
  const contextMenu = document.querySelector('vaadin-context-menu');
  contextMenu.renderer = function(root) {
    let listBox = root.firstElementChild;
    // Check if there is a list-box generated with the previous renderer call to update its content instead of recreation
    if (listBox) {
      listBox.innerHTML = '';
    } else {
      listBox = document.createElement('vaadin-list-box');
      root.appendChild(listBox);
    }

    ['First', 'Second', 'Third'].forEach(function(name) {
      const item = document.createElement('vaadin-item');
      item.textContent = name + ' menu item';
      listBox.appendChild(item);
    });
  };
</script>
```
