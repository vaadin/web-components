![Bower version](https://img.shields.io/bower/v/vaadin-upload.svg)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-upload)
![Polymer 2 supported](https://img.shields.io/badge/Polymer2-supported-blue.svg)
[![Build Status](https://travis-ci.org/vaadin/vaadin-upload.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-upload)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-upload&gt;

[Live Demo ↗](https://vaadin.com/elements/vaadin-upload/html-examples)

[&lt;vaadin-upload&gt;](https://vaadin.com/elements/vaadin-upload) is a  [Polymer](http://polymer-project.org) element for uploading files, part of the [vaadin-core-elements](https://vaadin.com/elements) element bundle.

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
  <iron-icon slot="drop-label-icon" icon="description"></iron-icon>
  <span slot="drop-label">Drop your favourite Novels here (PDF files only)</span>
</vaadin-upload>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-upload/master/docs/img/vaadin-upload-overview.png" alt="Screenshot of vaadin-upload" width="723" />](https://vaadin.com/elements/-/element/vaadin-upload)

## Running demos and tests in browser

1. Fork the `vaadin-upload` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-upload` directory, run `npm install` and then `polymer install --variants` to install dependencies.

1. Run `polymer serve`, after that you will be able to access:

  - Polymer1-compatible version:

    - API documentation: http://127.0.0.1:8000/components/vaadin-upload/
    - Examples: http://127.0.0.1:8000/components/vaadin-upload/demo/
    - Tests: http://127.0.0.1:8000/components/vaadin-upload/test/

  - Polymer2-compatible version:

    - API documentation: http://127.0.0.1:8001/components/vaadin-upload/
    - Examples: http://127.0.0.1:8001/components/vaadin-upload/demo/
    - Tests: http://127.0.0.1:8001/components/vaadin-upload/test/

Note that ports `8000` and `8001` could be different in your environment.


## Running tests from the command line

1. When in the `vaadin-upload` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Creating a pull request

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `npm test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin Elements team members


## License

Apache License 2.0
