![Bower version](https://img.shields.io/bower/v/vaadin-upload.svg) [![Build status](https://travis-ci.org/vaadin/vaadin-upload.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-upload)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-upload&gt;

[&lt;vaadin-upload&gt;](https://vaadin.com/elements/-/element/vaadin-upload) is a  [Polymer](http://polymer-project.org) element for uploading multiple files, part of the [vaadin-core-elements](https://vaadin.com/elements) element bundle.

<!---
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <script src="https://cdn.vaadin.com/vaadin-elements/master/mock-http-request/lib/mock.js"></script>
    <link rel="import" href="vaadin-upload.html">
    <script>
      function mockXhrGenerator(file) {
        var xhr = new MockHttpRequest();
        xhr.upload = {};
        xhr.onsend = function() {
          var total = file && file.size || 1024, done = 0;
          function start() {
            setTimeout(progress, 1000);
          }
          function progress() {
            xhr.upload.onprogress({total: total, loaded: done});
            if (done < total) {
              setTimeout(progress, 200);
              done = Math.min(total, done + 254000);
            } else if (!file.abort) {
              setTimeout(finish, 1000);
            }
          }
          function finish() {
            xhr.receive(200, '{"message":"OK"}');
          }
          start();
        };
        return xhr;
      }

      window.addEventListener('WebComponentsReady', function() {
        // Monkey-patch vaadin-upload prototype to use MockHttpRequest
        Object.getPrototypeOf(document.createElement('vaadin-upload'))._createXhr = mockXhrGenerator;
      });
    </script>

    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-upload accept=".pdf">
  <div class="drop-label">
    <iron-icon icon="description"></iron-icon>
    Drop your favourite Novels here (PDF files only)
  </div>
</vaadin-upload>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-upload/master/docs/img/vaadin-upload-overview.png" alt="Screenshot of vaadin-upload" width="723" />](https://vaadin.com/elements/-/element/vaadin-upload)

## Getting started

Visit https://vaadin.com/elements/-/element/vaadin-upload for features, demos and documentation.

## Contributing

See the [contribution instructions](https://github.com/vaadin/vaadin-core-elements#contributing) which apply to all Vaadin core elements.

## Development

See the [development instructions](https://github.com/vaadin/vaadin-core-elements/blob/master/DEVELOPMENT.md) which apply to all Vaadin core elements.

## License

Apache License 2.0
