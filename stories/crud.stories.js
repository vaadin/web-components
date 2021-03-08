import { html } from 'lit-html';
import { users } from './data/users.js';
import '../packages/vaadin-crud/vaadin-crud.js';

export default {
  title: 'Components/<vaadin-crud>',
  argTypes: {
    editOnClick: { control: 'boolean' },
    editorPosition: {
      control: {
        type: 'inline-radio',
        options: ['(not set)', 'bottom', 'aside']
      }
    }
  }
};

const Crud = ({ editOnClick, editorPosition }) => {
  return html`
    <vaadin-crud
      .editOnClick="${editOnClick}"
      .editorPosition="${editorPosition}"
      .items="${users}"
      style="height: calc(100vh - 16px)"
    ></vaadin-crud>
  `;
};

export const Basic = (args) => Crud(args);

Basic.args = {
  editorPosition: '(not set)'
};
