# @vaadin/vaadin

This package contains all the Vaadin web components, free and commercial. Use
[`@vaadin/vaadin-core`](https://www.npmjs.com/package/@vaadin/vaadin-core) instead to only include free components.

```js
import '@vaadin/vaadin';
```

Components that are still experimental are not registered by importing it. Each of them is
only registered once its feature flag is enabled, e.g. `window.Vaadin.featureFlags.<flag> = true`,
as described in its documentation.

Prefer importing the packages of the components that an application actually
uses, which leaves the rest out of its bundle.

See [vaadin/web-components](https://github.com/vaadin/web-components) for more details.

## License

The free components are available under the Apache License 2.0 and the commercial ones under the
[Vaadin Commercial License and Service Terms](https://vaadin.com/commercial-license-and-service-terms).
See the LICENSE files of the individual packages for details.
