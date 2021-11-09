# @vaadin/message-list

A web component that allows you to show a list of messages, for example, a chat log.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/ds/components/message-list)

```html
<vaadin-message-list></vaadin-message-list>
<script>
  document.querySelector('vaadin-message-list').items = [
    { userName: 'Alice', time: '8 Minutes ago', text: 'Lunch at the usual place?' },
    { userName: 'Bob', time: '6 Minutes ago', text: `Yeah, let's go together.` },
    { userName: 'Alice', time: '2 Minutes ago', text: 'Great! What about you, Charlie?' },
    { userName: 'Charlie', time: 'A few seconds ago', text: 'I will meet you there.' }
  ];
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/master/packages/message-list/screenshot.png" width="504" alt="Screenshot of vaadin-message-list">](https://vaadin.com/docs/latest/ds/components/message-list)

## Installation

Install the component:

```sh
npm i @vaadin/message-list
```

Once installed, import the component in your application:

```js
import '@vaadin/message-list';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/ds/customization/using-themes), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/message-list/vaadin-message-list.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/message-list/theme/material/vaadin-message-list.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/message-list/theme/lumo/vaadin-message-list.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/message-list/src/vaadin-message-list.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
