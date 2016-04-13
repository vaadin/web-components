## Angular 2 Directive

This directory contains the `VaadinComboBox` directive to be used with
Angular 2 framework.

## Installation

1) First install the `vaadin-combo-box` through Bower.

```bash
bower install --save vaadin-combo-box
```


2) Add the webcomponents-lite.min.js polyfill to the `<head>` section of your
page and configure SystemJS as follows.

```html
<script src="bower_components/webcomponentsjs/webcomponents-lite.min.js"></script>
```

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

3) If you are using the `lite-server` or `browser-sync`, create a file called
`bs-config.json` in the root of your project folder with the following contents.

```json
{
  "snippetOptions": {
    "ignorePaths": "bower_components/**/*.html"
  }
}
```

## Usage

After the configuration is in place, you can import the directive into your
own Angular 2 component as follows.

```javascript
import { VaadinComboBox } from '../bower_components/vaadin-combo-box/directives/vaadin-combo-box';


@Component({
  selector: 'my-component',
  template: '<vaadin-combo-box [items]="comboItems"></vaadin-combo-box>',
  directives: [VaadinComboBox]
})
```

The directive takes care of two-way data-binding support and also integration
with Angular forms.

```html
<form>
  <vaadin-combo-box ngControl="foobar" [(value)]="selectedValue" required></vaadin-combo-box>
</form>
```
