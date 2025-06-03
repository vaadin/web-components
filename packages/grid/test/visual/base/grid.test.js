import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-grid.js';
import '../../../src/vaadin-grid-column-group.js';
import '../../../src/vaadin-grid-selection-column.js';
import '../../../src/vaadin-grid-sorter.js';
import '../../../src/vaadin-grid-sort-column.js';
import '../../../src/vaadin-grid-tree-column.js';
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

  it('no-row-borders', async () => {
    element.setAttribute('theme', 'no-row-borders');
    await visualDiff(element, 'theme-no-row-borders');
  });

  it('row-stripes', async () => {
    element.setAttribute('theme', 'row-stripes');
    await visualDiff(element, 'theme-row-stripes');
  });
});
