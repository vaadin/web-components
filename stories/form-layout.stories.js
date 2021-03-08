import { html } from 'lit-html';
import '../packages/vaadin-form-layout/vaadin-form-layout.js';
import '../packages/vaadin-text-field/vaadin-text-field.js';
import '../packages/vaadin-text-field/vaadin-text-area.js';
import '../packages/vaadin-date-picker/vaadin-date-picker.js';

export default {
  title: 'Layouts/<vaadin-form-layout>'
};

const FormLayout = () => {
  return html`
    <vaadin-form-layout>
      <vaadin-text-field label="First Name" value="Jane"></vaadin-text-field>
      <vaadin-text-field label="Last Name" value="Doe"></vaadin-text-field>
      <vaadin-text-field label="Email" value="jane.doe@example.com"></vaadin-text-field>
      <vaadin-date-picker label="Birthday" value="1993-06-23"></vaadin-date-picker>
      <vaadin-text-area label="Bio" colspan="2" value="My name is Jane."></vaadin-text-area>
    </vaadin-form-layout>
  `;
};

export const Basic = (args) => FormLayout(args);
