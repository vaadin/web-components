## Angular 2 Directive

This directory contains the `VaadinDatePicker` directive to be used with
Angular 2 framework.

## Installation

1) First install the `vaadin-date-picker` through Bower and add the following
configuration to your `index.html` file.

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

2) You also need to wrap the application startup into `WebComponentsReady` event
listener. For example as follows:
```javascript
window.addEventListener('WebComponentsReady', function() {
  System.import('app/main').then(null, console.error.bind(console));
});
```

3) Create a file called `bs-config.json` in the root of your project folder
with the following contents:
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
import { VaadinDatePicker } from 'vaadin-date-picker';

@Component({
  selector: 'my-component',
  template: '<vaadin-date-picker [(value)]="birthday"></vaadin-date-picker>',
  directives: [VaadinDatePicker]
})
```

The directive takes care of two-way data-binding support and also integration
with Angular forms.

```html
<form>
  <vaadin-date-picker ngControl="birthday" required></vaadin-date-picker>
</form>
```
