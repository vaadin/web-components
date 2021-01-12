import { html } from 'lit-html';
import '../packages/vaadin-details/vaadin-details.js';

export default {
  title: 'Components/Details',
  argTypes: {
    disabled: { control: 'boolean' }
  }
};

const Details = ({ disabled = false }) => {
  return html`
    <vaadin-details .disabled="${disabled}">
      <div slot="summary">Summary</div>
      <span>Details</span>
    </vaadin-details>
  `;
};

export const Basic = (args) => Details(args);
