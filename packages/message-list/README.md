# &lt;vaadin-message-list&gt;

[Live demo and examples ↗ ](https://vaadin.com/docs/latest/ds/components/messages)
|
[API documentation ↗](https://cdn.vaadin.com/vaadin-messages/1.0.1/)

[&lt;vaadin-message-list&gt;](https://vaadin.com/components/vaadin-messages) is a Web Component for showing a list of messages, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/message-list)](https://www.npmjs.com/package/@vaadin/message-list)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinmessage-list)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<!-- Example of single messages -->
<vaadin-message></vaadin-message>
<vaadin-message foo="bar"></vaadin-message>

<!-- Example of a list of messages -->
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

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-messages/master/screenshot.png" width="418" alt="Screenshot of vaadin-message">](https://vaadin.com/components/message-list)

## Installation

Install `vaadin-message-list`:

```sh
npm i @vaadin/message-list --save
```

Once installed, import it in your application:

```js
import '@vaadin/message-list/vaadin-message-list.js'; // for a list of messages
import '@vaadin/message-list/vaadin-message.js'; // for a single message
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The components with the Lumo theme:

  `theme/lumo/vaadin-message.js`

  `theme/lumo/vaadin-message-list.js`

- The components with the Material theme:

  `theme/material/vaadin-message.js`

  `theme/material/vaadin-message.-list.js`

- Alias for `theme/lumo/vaadin-message.js` and `theme/lumo/vaadin-message-list.js`:

  `vaadin-message.js`

  `vaadin-message-list.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
