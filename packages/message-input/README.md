# @vaadin/message-input

A web component that allows users to author and send messages.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/message-input)

```html
<vaadin-message-input></vaadin-message-input>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/master/packages/message-input/screenshot.png" width="656" alt="Screenshot of vaadin-message-input">](https://vaadin.com/docs/latest/components/message-input)

## Installation

Install the component:

```sh
npm i @vaadin/message-input
```

Once installed, import the component in your application:

```js
import '@vaadin/message-input';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/message-input/vaadin-message-input.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/message-input/theme/material/vaadin-message-input.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/message-input/theme/lumo/vaadin-message-input.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/message-input/src/vaadin-message-input.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
