import { html } from 'lit-html';
import '../packages/vaadin-item/vaadin-item.js';

export default {
  title: 'Components/Item',
  argTypes: {
    disabled: { control: 'boolean' },
    selected: { control: 'boolean' }
  }
};

const Item = ({ disabled = false, selected = false }) => {
  return html`
    <vaadin-item
      ?selected="${selected}"
      ?disabled="${disabled}"
      tabindex="0"
      style="--_lumo-item-selected-icon-display: block"
    >
      Item content
    </vaadin-item>
  `;
};

export const Basic = (args) => Item(args);
