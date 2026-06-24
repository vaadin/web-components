import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-crud-grid.js';
import { flushGrid } from './helpers.js';

describe('crud grid i18n (prototype)', () => {
  let grid;

  const items = [{ name: { first: 'Grant', last: 'Andrews' }, role: 'operator' }];

  beforeEach(async () => {
    grid = fixtureSync('<vaadin-crud-grid style="width: 500px;" no-filter></vaadin-crud-grid>');
    grid.items = items;
    await nextRender();
    flushGrid(grid);
    await nextRender();
  });

  it('should label the bare sorter from the grid default i18n.sortColumn', () => {
    const sorter = grid.querySelector('vaadin-grid-sorter');
    expect(sorter).to.be.ok;
    const label = sorter.getAttribute('aria-label');
    // Bare sorter (created by CRUD, not a sort-column) — relies solely on grid
    // __a11yUpdateSorters distribution.
    expect(label).to.match(/^Sort by /u);
  });
});
