import { html } from 'lit-html';
import '../packages/vaadin-context-menu/vaadin-context-menu.js';

export default {
  title: 'Components/Context Menu'
};

const items = [
  {
    text: 'Menu Item 1',
    children: [
      { text: 'Menu Item 1-1', checkable: true, checked: true },
      { text: 'Menu Item 1-2', checkable: true }
    ]
  },
  { component: 'hr' },
  {
    text: 'Menu Item 2',
    children: [
      { text: 'Menu Item 2-1' },
      {
        text: 'Menu Item 2-2',
        children: [
          { text: 'Menu Item 2-2-1' },
          { text: 'Menu Item 2-2-2', disabled: true },
          { component: 'hr' },
          { text: 'Menu Item 2-2-3' }
        ]
      }
    ]
  },
  { text: 'Menu Item 3', disabled: true }
];

const ContextMenu = () => {
  return html`
    <vaadin-context-menu .items="${items}">
      <p>This paragraph has a context menu.</p>
      <p>Opened the menu with <b>right click</b> or with <b>long touch.</b></p>
    </vaadin-context-menu>
  `;
};

export const Basic = (args) => ContextMenu(args);
