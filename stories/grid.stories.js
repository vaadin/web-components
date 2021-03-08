import { html } from 'lit-html';
import { users } from './data/users.js';
import '../packages/vaadin-grid/vaadin-grid.js';
import '../packages/vaadin-grid/vaadin-grid-filter-column.js';
import '../packages/vaadin-grid/vaadin-grid-sort-column.js';

export default {
  title: 'Components/<vaadin-grid>',
  argTypes: {
    columnReorderingAllowed: { control: 'boolean' },
    rowsDraggable: { control: 'boolean' }
  }
};

const Grid = ({ columnReorderingAllowed, rowsDraggable }) => {
  return html`
    <vaadin-grid
      .columnReorderingAllowed="${columnReorderingAllowed}"
      .rowsDraggable="${rowsDraggable}"
      .items="${users}"
      style="height: calc(100vh - 16px)"
    >
      <vaadin-grid-column path="name.first" header="First name"></vaadin-grid-column>
      <vaadin-grid-column path="name.last" header="Last name"></vaadin-grid-column>
      <vaadin-grid-column path="details.email" header="Email"></vaadin-grid-column>
      <vaadin-grid-column path="role"></vaadin-grid-column>
    </vaadin-grid>
  `;
};

const FilterableGrid = ({ columnReorderingAllowed, rowsDraggable }) => {
  return html`
    <vaadin-grid
      .columnReorderingAllowed="${columnReorderingAllowed}"
      .rowsDraggable="${rowsDraggable}"
      .items="${users}"
      style="height: calc(100vh - 16px)"
    >
      <vaadin-grid-filter-column path="name.first" header="First name"></vaadin-grid-filter-column>
      <vaadin-grid-filter-column path="name.last" header="Last name"></vaadin-grid-filter-column>
      <vaadin-grid-filter-column path="details.email" header="Email"></vaadin-grid-filter-column>
      <vaadin-grid-filter-column path="role"></vaadin-grid-filter-column>
    </vaadin-grid>
  `;
};

const SortableGrid = ({ columnReorderingAllowed, rowsDraggable }) => {
  return html`
    <vaadin-grid
      .columnReorderingAllowed="${columnReorderingAllowed}"
      .rowsDraggable="${rowsDraggable}"
      .items="${users}"
      style="height: calc(100vh - 16px)"
    >
      <vaadin-grid-sort-column path="name.first" header="First name"></vaadin-grid-sort-column>
      <vaadin-grid-sort-column path="name.last" header="Last name"></vaadin-grid-sort-column>
      <vaadin-grid-sort-column path="details.email" header="Email"></vaadin-grid-sort-column>
      <vaadin-grid-sort-column path="role"></vaadin-grid-sort-column>
    </vaadin-grid>
  `;
};

export const Basic = (args) => Grid(args);

export const Filtering = (args) => FilterableGrid(args);

export const Sorting = (args) => SortableGrid(args);
