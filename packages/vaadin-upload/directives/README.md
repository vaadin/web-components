## Angular 2 Directive

This directory contains the `VaadinUpload` directive to be used with
Angular 2 framework.

## Installation

1) First install the `vaadin-upload` through Bower.

```bash
bower install --save vaadin-upload
```


2) Add the webcomponents-lite.min.js polyfill to the `<head>` section of your
page and configure SystemJS as follows.

```html
<script src="bower_components/webcomponentsjs/webcomponents-lite.min.js"></script>
```

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
import { VaadinUpload } from '../bower_components/vaadin-upload/directives/vaadin-upload';


@Component({
  selector: 'my-component',
  template: '<vaadin-upload [(files)]="files"></vaadin-upload>',
  directives: [VaadinUpload]
})
```
