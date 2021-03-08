import { html } from 'lit-html';
import '../packages/vaadin-tabs/vaadin-tabs.js';

export default {
  title: 'Interaction/<vaadin-tabs>',
  argTypes: {
    orientation: {
      control: {
        type: 'inline-radio',
        options: ['horizontal', 'vertical']
      }
    }
  }
};

const Tabs = ({ orientation }) => {
  return html`
    <vaadin-tabs .orientation="${orientation}">
      <vaadin-tab>Tab one</vaadin-tab>
      <vaadin-tab>Tab two</vaadin-tab>
      <vaadin-tab>Tab three</vaadin-tab>
    </vaadin-tabs>
  `;
};

export const Basic = (args) => Tabs(args);

Basic.args = {
  orientation: 'horizontal'
};
