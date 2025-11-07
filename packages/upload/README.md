# @vaadin/upload

A web component for uploading files.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/upload)

[![npm version](https://badgen.net/npm/v/@vaadin/upload)](https://www.npmjs.com/package/@vaadin/upload)

```html
<vaadin-upload accept=".pdf">
  <span slot="drop-label">Drop your favourite Novels here (PDF files only)</span>
</vaadin-upload>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/upload/screenshot.png" width="656" alt="Screenshot of vaadin-upload">](https://vaadin.com/docs/latest/components/upload)

## Installation

Install the component:

```sh
npm i @vaadin/upload
```

Once installed, import the component in your application:

```js
import '@vaadin/upload';
```

## Performance Considerations

When uploading large numbers of files, the component automatically throttles concurrent uploads to prevent browser performance degradation. By default, a maximum of 10 files are uploaded simultaneously, with additional files queued automatically.

You can customize this limit using the `max-concurrent-uploads` attribute:

```html
<!-- Limit to 5 concurrent uploads for slower connections -->
<vaadin-upload max-concurrent-uploads="5"></vaadin-upload>
```

```js
// Or set it programmatically
upload.maxConcurrentUploads = 5;
```

This helps prevent:
- Browser XHR limitations (failures when uploading 2000+ files simultaneously)
- Performance degradation with hundreds of concurrent uploads
- Network congestion on slower connections

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
