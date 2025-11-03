# Vaadin components testing API

There are two ways of loading API:

1. Import the entrypoint, e.g. in the test file:

```js
import '@vaadin/component/testing-api';
```

2. Use a static method, e.g. in DevTools console:

```js
document.querySelector('vaadin-button').constructor.loadTestingAPI();
```
