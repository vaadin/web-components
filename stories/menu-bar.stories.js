import { html } from 'lit-html';
import '../packages/vaadin-menu-bar/vaadin-menu-bar.js';

export default {
  title: 'Components/<vaadin-menu-bar>',
  argTypes: {
    openOnHover: { control: 'boolean' },
    theme: {
      control: {
        type: 'inline-radio',
        options: ['primary', 'secondary', 'tertiary', 'tertiary-inline']
      }
    }
  }
};

const items = [
  { text: 'Home' },
  {
    text: 'Reports',
    children: [{ text: 'View Reports' }, { text: 'Generate Report' }]
  },
  { text: 'Dashboard', disabled: true },
  { text: 'Help' }
];

const MenuBar = ({ openOnHover, theme }) => {
  return html`<vaadin-menu-bar .openOnHover="${openOnHover}" theme="${theme}" .items="${items}"></vaadin-menu-bar>`;
};

export const Basic = (args) => MenuBar(args);

Basic.args = {
  theme: 'secondary'
};
