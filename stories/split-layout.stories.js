import { html } from 'lit-html';
import '../packages/vaadin-split-layout/vaadin-split-layout.js';

export default {
  title: 'Layouts/<vaadin-split-layout>',
  argTypes: {
    orientation: {
      control: {
        type: 'inline-radio',
        options: ['horizontal', 'vertical']
      }
    }
  }
};

const SplitLayout = ({ orientation }) => {
  return html`
    <vaadin-split-layout .orientation="${orientation}">
      <div>Item one</div>
      <div>Item two</div>
    </vaadin-split-layout>
  `;
};

export const Horizontal = (args) => SplitLayout(args);

Horizontal.args = {
  orientation: 'horizontal'
};

export const Vertical = (args) => SplitLayout(args);

Vertical.args = {
  orientation: 'vertical'
};
