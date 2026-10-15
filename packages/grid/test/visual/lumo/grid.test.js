import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/grid.css';
import '@vaadin/vaadin-lumo-styles/components/grid-selection-column.css';
import '@vaadin/vaadin-lumo-styles/components/grid-sort-column.css';
import '@vaadin/vaadin-lumo-styles/components/grid-tree-column.css';
import '../../../vaadin-grid.js';
import '../../../vaadin-grid-column-group.js';
import '../../../vaadin-grid-selection-column.js';
import '../../../vaadin-grid-sort-column.js';
import '../../../vaadin-grid-tree-column.js';
import '../grid.common.js';
import { flushGrid } from '../../helpers.js';
import { users } from '../users.js';

describe('theme', () => {
  let element;

  beforeEach(async () => {
    element = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-column path="name.first" header="First name"></vaadin-grid-column>
          <vaadin-grid-column path="name.last" header="Last name"></vaadin-grid-column>
          <vaadin-grid-column path="email"></vaadin-grid-column>
        </vaadin-grid>
      `);
    element.items = users;
    flushGrid(element);
    await nextRender();
  });

  it('column-borders', async () => {
    element.setAttribute('theme', 'column-borders');
    await visualDiff(element, 'theme-column-borders');
  });

  it('compact', async () => {
    element.setAttribute('theme', 'compact');
    await visualDiff(element, 'theme-compact');
  });

  it('empty state compact', async () => {
    element.setAttribute('theme', 'compact');
    element.items = [];
    element.appendChild(
      fixtureSync(`
        <div slot="empty-state">
          No items found.
        </div>
      `),
    );
    await visualDiff(element, 'empty-state-compact');
  });

  it('no-row-borders', async () => {
    element.setAttribute('theme', 'no-row-borders');
    await visualDiff(element, 'theme-no-row-borders');
  });

  it('row-stripes', async () => {
    element.setAttribute('theme', 'row-stripes');
    await visualDiff(element, 'theme-row-stripes');
  });
});
