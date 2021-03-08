import { html } from 'lit-html';
import '../packages/vaadin-progress-bar/vaadin-progress-bar.js';

export default {
  title: 'Visualization/<vaadin-progress-bar>',
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    value: { control: 'number' },
    indeterminate: { control: 'boolean' }
  }
};

const ProgressBar = ({ min, max, value, indeterminate = false }) => {
  return html`
    <vaadin-progress-bar
      .min="${min}"
      .max="${max}"
      .value="${value}"
      .indeterminate="${indeterminate}"
    ></vaadin-progress-bar>
  `;
};

export const Basic = (args) => ProgressBar(args);

Basic.args = {
  min: 0,
  max: 100,
  value: 50
};
