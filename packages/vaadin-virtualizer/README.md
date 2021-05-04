# Vaadin virtualizer

Virtual scrolling engine meant for internal use in Vaadin components. Note that the package doesn't strictly follow semver and thus may introduce breaking changes even in minor version bumps.

```html
<div id="virtualized-list" style="height: 200px; overflow: auto">
  <div id="scroll-container"></div>
</div>

<script type="module">
  import { Virtualizer } from '@vaadin/vaadin-virtualizer';

  const virtualizedList = new Virtualizer({
    createElements: (count) => Array.from(Array(count)).map(() => document.createElement('div')),
    updateElement: (el, index) => (el.textContent = index),
    scrollTarget: document.querySelector('#virtualized-list'),
    scrollContainer: document.querySelector('#scroll-container')
  });

  virtualizedList.size = 1000;
</script>
```

## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `npm run lint`, which will automatically lint all `.js` files.

## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com).

## Contributing

To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
