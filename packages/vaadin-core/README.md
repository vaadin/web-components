# @vaadin/vaadin-core

This package contains all the free Vaadin web components.

```js
import '@vaadin/vaadin-core';
```

Components that are still experimental are not registered by importing it. Each of them is
only registered once its feature flag is enabled, e.g. `window.Vaadin.featureFlags.<flag> = true`,
as described in its documentation.

Prefer importing the packages of the components that an application actually
uses, which leaves the rest out of its bundle.

See [vaadin/web-components](https://github.com/vaadin/web-components) for more details.

## License

Apache License 2.0
