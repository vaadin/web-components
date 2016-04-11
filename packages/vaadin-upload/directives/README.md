## Angular 2 Directive

This directory contains the `VaadinUpload` directive to be used with
Angular 2 framework.

## Installation

1) First install the `vaadin-upload` through Bower and add the following
configuration to your `index.html` file.

```javascript
System.config({
  map: {
    'vaadin-upload': 'bower_components/vaadin-upload/directives'
  },
  packages: {
    'vaadin-upload': {
      defaultExtension: 'js',
      main: 'vaadin-upload.js'
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
import { VaadinUpload } from 'vaadin-upload';

@Component({
  selector: 'my-component',
  template: '<vaadin-upload [(files)]="files"></vaadin-upload>',
  directives: [VaadinUpload]
})
```

The directive takes care of two-way data-binding support and also integration
with Angular forms.

```html
<form>
  <vaadin-upload ngControl="upload" required></vaadin-upload>
</form>
```
