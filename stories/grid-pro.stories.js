import { html } from 'lit-html';
import { users } from './data/users.js';
import '../packages/vaadin-grid-pro/vaadin-grid-pro.js';
import '../packages/vaadin-grid-pro/vaadin-grid-pro-edit-column.js';

export default {
  title: 'Components/Grid Pro',
  argTypes: {
    singleCellEdit: { control: 'boolean' },
    enterNextRow: { control: 'boolean' }
  }
};

const GridPro = ({ singleCellEdit, enterNextRow }) => {
  return html`
    <vaadin-grid-pro
      .singleCellEdit="${singleCellEdit}"
      .enterNextRow="${enterNextRow}"
      .items="${users}"
      style="height: calc(100vh - 16px)"
    >
      <vaadin-grid-pro-edit-column path="name.first" header="First name"></vaadin-grid-pro-edit-column>
      <vaadin-grid-pro-edit-column path="name.last" header="Last name"></vaadin-grid-pro-edit-column>
      <vaadin-grid-pro-edit-column path="details.email" header="Email"></vaadin-grid-pro-edit-column>
      <vaadin-grid-pro-edit-column
        path="role"
        editor-type="select"
        editor-options='["admin", "operator", "user"]'
      ></vaadin-grid-pro-edit-column>
    </vaadin-grid-pro>
  `;
};

export const Basic = (args) => GridPro(args);
