
# &lt;vaadin-notification&gt;

[![Available in Vaadin_Directory](https://img.shields.io/vaadin-directory/v/vaadinvaadin-notification.svg)](https://vaadin.com/directory/component/vaadinvaadin-notification)


[&lt;vaadin-notification&gt;](https://vaadin.com/components/vaadin-notification) is a Web Component providing accessible and customizable notifications (toasts), part of the [Vaadin components](https://vaadin.com/components).


[<img src="https://raw.githubusercontent.com/vaadin/vaadin-notification/master/screenshot.png" width="336" alt="Screenshot of vaadin-notification">](https://vaadin.com/components/vaadin-notification)

## Example Usage
```html
<vaadin-notification opened position="middle" duration="-1"></vaadin-notification>

<script>
  const notification = document.querySelector('vaadin-notification');

  notification.renderer = function(root) {
    root.textContent = 'Your work has been saved';
  };
</script>
```
