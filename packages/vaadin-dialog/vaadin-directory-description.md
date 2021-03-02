
# &lt;vaadin-dialog&gt;

[![Available in Vaadin_Directory](https://img.shields.io/vaadin-directory/v/vaadinvaadin-dialog.svg)](https://vaadin.com/directory/component/vaadinvaadin-dialog)


[&lt;vaadin-dialog&gt;](https://vaadin.com/components/vaadin-dialog) is a Web Component for customized modal dialogs, part of the [Vaadin components](https://vaadin.com/components).


[<img src="https://raw.githubusercontent.com/vaadin/vaadin-dialog/master/screenshot.png" width="264" alt="Screenshot of vaadin-dialog">](https://vaadin.com/components/vaadin-dialog)

## Example Usage
```html
<vaadin-dialog opened>
</vaadin-dialog>

<script>
  const dialog = document.querySelector('vaadin-dialog');
  dialog.renderer = function(root, dialog) {
    root.textContent = 'Sample dialog';
  };
</script>
```
