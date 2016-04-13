## Angular 2 Directive

This directory contains the `VaadinDatePicker` directive to be used with
Angular 2 framework.

## Installation

1) First install the `vaadin-date-picker` through Bower.

```bash
bower install --save vaadin-date-picker
```


2) Add the webcomponents-lite.min.js polyfill to the `<head>` section of your
page and configure SystemJS as follows.

```html
<script src="bower_components/webcomponentsjs/webcomponents-lite.min.js"></script>
```

```javascript
System.config({
  map: {
    'vaadin-date-picker': 'bower_components/vaadin-date-picker/directives'
  },
  packages: {
    'vaadin-date-picker': {
      defaultExtension: 'js',
      main: 'vaadin-date-picker.js'
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
import { VaadinDatePicker } from '../bower_components/vaadin-date-picker/directives/vaadin-date-picker';


@Component({
  selector: 'my-component',
  template: '<vaadin-date-picker [value]="birthDay"></vaadin-date-picker>',
  directives: [VaadinDatePicker]
})
```

The directive takes care of two-way data-binding support and also integration
with Angular forms.

```html
<form>
  <vaadin-date-picker ngControl="birthday" [(value)]="birthday" required></vaadin-date-picker>
</form>
```
