# @vaadin/vaadin

This package contains all the Vaadin web components, the free ones of
[`@vaadin/vaadin-core`](https://www.npmjs.com/package/@vaadin/vaadin-core) and the
commercial ones. Importing it registers every one of them, so that they can be
used without importing each package:

```js
import '@vaadin/vaadin';
```

Prefer importing the packages of the components that an application actually
uses, which leaves the rest out of its bundle.

See [vaadin/web-components](https://github.com/vaadin/web-components) for more details.

## License

Vaadin Commercial License and Service Terms. The free components keep their
Apache License 2.0. See the LICENSE file for details.
