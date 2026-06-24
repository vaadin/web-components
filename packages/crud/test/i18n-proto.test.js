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

describe('crud grid filter i18n (prototype)', () => {
  let grid;

  const items = [{ name: { first: 'Grant', last: 'Andrews' }, role: 'operator' }];

  beforeEach(async () => {
    // no-sort => the filter is the root-level column content (label-less field)
    grid = fixtureSync('<vaadin-crud-grid style="width: 500px;" no-sort></vaadin-crud-grid>');
    grid.items = items;
    await nextRender();
    flushGrid(grid);
    await nextRender();
  });

  it('should expose the filter accessible name on the inner input via i18n.filterColumn', () => {
    const filter = grid.querySelector('vaadin-grid-filter');
    expect(filter).to.be.ok;
    const field = filter.querySelector('vaadin-text-field');
    // Accessible name comes from i18n.filterColumn (default "Filter by {0}"),
    // forwarded to the focusable input — not an aria-label on the wrapper.
    expect(field.accessibleName).to.match(/^Filter by /u);
    expect(filter.hasAttribute('aria-label')).to.be.false;
  });
});
