[![Available in Vaadin_Directory](https://img.shields.io/vaadin-directory/v/vaadinvaadin-app-layout.svg)](https://vaadin.com/directory/component/vaadinvaadin-app-layout)
[![Stars in Vaadin_Directory](https://img.shields.io/vaadin-directory/stars/vaadinvaadin-app-layout.svg)](https://vaadin.com/directory/component/vaadinvaadin-app-layout)

# &lt;vaadin-app-layout&gt;

[&lt;vaadin-app-layout&gt;](https://vaadin.com/components/vaadin-app-layout) is a Web Component providing a quick and easy way to get a common application layout structure done, part of the [Vaadin components](https://vaadin.com/components).

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-app-layout/master/screenshot.png" width="500" alt="Screenshot of vaadin-app-layout">](https://vaadin.com/components/vaadin-app-layout)

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-app-layout/master/screenshot-mobile.png" width="350" alt="Screenshot of vaadin-app-layout on mobile">](https://vaadin.com/components/vaadin-app-layout)

## Example Usage

```html
<vaadin-app-layout>
  <vaadin-drawer-toggle slot="navbar touch-optimized"></vaadin-drawer-toggle>
  <h3 slot="navbar touch-optimized">Application Name</h3>
  <vaadin-tabs orientation="vertical" slot="drawer">
    <vaadin-tab>
      <a href="/profile">
        <iron-icon icon="lumo:user"></iron-icon>
        Profile
      </a>
    </vaadin-tab>
    <vaadin-tab>
      <a href="/contact">
        <iron-icon icon="lumo:phone"></iron-icon>
        Contact
      </a>
    </vaadin-tab>
  </vaadin-tabs>
  <div>Page content</div>
</vaadin-app-layout>
```
