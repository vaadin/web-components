## Angular 2 Directive

This directory contains the `VaadinComboBox` directive to be used with
Angular 2 framework.

## Installation

First install the `vaadin-combo-box` through Bower and add the following
configuration to your `index.html` file.

```javascript
System.config({
  map: {
    'vaadin-combo-box': 'bower_components/vaadin-combo-box/directives'
  },
  packages: {
    'vaadin-combo-box': {
      defaultExtension: 'js',
      main: 'vaadin-combo-box.js'
    }
  }
});
```

After the configuration is in place, you can import the directive into your
own Angular 2 component as follows.

```javascript
import { VaadinComboBox } from 'vaadin-combo-box';

@Component({
  selector: 'my-component',
  template: '<vaadin-combo-box></vaadin-combo-box>',
  directives: [VaadinComboBox]
})
```

The directive takes care of two-way data-binding support and also integration
with Angular forms.

```html
<form>
  <vaadin-combo-box ngControl="foobar" required></vaadin-combo-box>
</form>
```
