import { html } from 'lit-html';
import '../packages/vaadin-list-box/vaadin-list-box.js';
import '../packages/vaadin-item/vaadin-item.js';

export default {
  title: 'Components/<vaadin-list-box>',
  argTypes: {
    multiple: { control: 'boolean' }
  }
};

const ListBox = ({ multiple = false }) => {
  return html`
    <vaadin-list-box .multiple="${multiple}">
      <vaadin-item>Option one</vaadin-item>
      <vaadin-item>Option two</vaadin-item>
      <vaadin-item>Option three</vaadin-item>
      <vaadin-item>Option four</vaadin-item>
    </vaadin-list-box>
  `;
};

export const Basic = (args) => ListBox(args);
