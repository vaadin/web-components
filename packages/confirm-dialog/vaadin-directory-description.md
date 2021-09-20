[![Available in Vaadin_Directory](https://img.shields.io/vaadin-directory/v/vaadinvaadin-confirm-dialog.svg)](https://vaadin.com/directory/component/vaadinvaadin-confirm-dialog)
[![Stars in Vaadin_Directory](https://img.shields.io/vaadin-directory/stars/vaadinvaadin-confirm-dialog.svg)](https://vaadin.com/directory/component/vaadinvaadin-confirm-dialog)

# &lt;vaadin-confirm-dialog&gt;

[&lt;vaadin-confirm-dialog&gt;](https://vaadin.com/components/vaadin-confirm-dialog) is a Web Component providing an easy way to ask the user to confirm a choice, part of the [Vaadin components](https://vaadin.com/components).

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-confirm-dialog/master/screenshot.png" width="200" alt="Screenshot of vaadin-confirm-dialog">](https://vaadin.com/components/vaadin-confirm-dialog)

## Example Usage

```html
  <vaadin-confirm-dialog header="Unsaved changes" confirm-text="Save" on-confirm="save"
    cancel on-cancel="cancel" reject reject-text="Discard" on-reject="discard">
    Do you want to save or discard your changes before navigating away?
  </vaadin-confirm-dialog>
```
