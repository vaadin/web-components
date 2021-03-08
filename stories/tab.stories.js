import { html } from 'lit-html';
import '../packages/vaadin-tabs/vaadin-tab.js';

export default {
  title: 'Components/<vaadin-tab>',
  argTypes: {
    disabled: { control: 'boolean' },
    selected: { control: 'boolean' }
  }
};

const Tab = ({ disabled = false, selected = false }) => {
  return html`
    <vaadin-tab ?selected="${selected}" ?disabled="${disabled}" style="display: inline-flex">Tab content</vaadin-tab>
  `;
};

export const Basic = (args) => Tab(args);
