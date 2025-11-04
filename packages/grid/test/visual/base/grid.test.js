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
      <style>
        vaadin-grid::part(highlight-row) {
          --vaadin-grid-row-highlight-background-color: #ede;
        }
      </style>
    `);
    element.items = users;
    flushGrid(element);
    await nextRender();
  });

  it('column-border-width', async () => {
    element.style.setProperty('--vaadin-grid-column-border-width', '1px');
    await visualDiff(element, 'column-border-width');
  });

  it('row-border-width', async () => {
    element.style.setProperty('--vaadin-grid-row-border-width', '0px');
    await visualDiff(element, 'row-border-width');
  });

  it('row-stripes', async () => {
    element.setAttribute('theme', 'row-stripes');
    await visualDiff(element, 'theme-row-stripes');
  });

  it('selected-row-color', async () => {
    element.selectedItems = [element.items[0]];
    element.style.setProperty('--vaadin-grid-row-selected-background-color', '#dee');
    await visualDiff(element, 'selected-row-color');
  });

  it('highlight-row-color', async () => {
    element.cellPartNameGenerator = (_, model) => {
      if (model.item === users[1]) {
        return 'highlight-row';
      }
    };
    await nextRender();
    await visualDiff(element, 'highlight-row-color');
  });
});
