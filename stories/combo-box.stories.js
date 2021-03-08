import { html } from 'lit-html';
import '../packages/vaadin-combo-box/vaadin-combo-box.js';

export default {
  title: 'Components/<vaadin-combo-box>',
  argTypes: {
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    allowCustomValue: { control: 'boolean' },
    autoOpenDisabled: { control: 'boolean' },
    clearButtonVisible: { control: 'boolean' }
  }
};

const dataProvider = async ({ page, pageSize, filter }, callback) => {
  const url =
    'https://demo.vaadin.com/demo-data/1.0/filtered-countries?index=' +
    page * pageSize +
    '&count=' +
    pageSize +
    '&filter=' +
    filter;
  const response = await fetch(url);
  const data = await response.json();
  await new Promise(requestAnimationFrame);
  callback(data.result, data.size);
};

const ComboBox = ({
  label,
  helperText,
  errorMessage,
  disabled = false,
  readonly = false,
  required = false,
  invalid = false,
  allowCustomValue = false,
  autoOpenDisabled = false,
  clearButtonVisible = false
}) => {
  return html`
    <vaadin-combo-box
      .label="${label}"
      .dataProvider="${dataProvider}"
      .helperText="${helperText}"
      .errorMessage="${errorMessage}"
      .disabled="${disabled}"
      .readonly="${readonly}"
      .required="${required}"
      .invalid="${invalid}"
      .allowCustomValue="${allowCustomValue}"
      .autoOpenDisabled="${autoOpenDisabled}"
      .clearButtonVisible="${clearButtonVisible}"
    ></vaadin-combo-box>
  `;
};

export const Basic = (args) => ComboBox(args);

Basic.args = {
  label: 'Country'
};
