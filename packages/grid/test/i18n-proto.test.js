import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import './grid-test-styles.js';
import '../all-imports.js';
import { flushGrid, getBodyCellContent, getHeaderCellContent } from './helpers.js';

describe('grid i18n (prototype)', () => {
  let grid;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-selection-column></vaadin-grid-selection-column>
        <vaadin-grid-sort-column path="name" header="Name"></vaadin-grid-sort-column>
      </vaadin-grid>
    `);
    grid.items = [{ name: 'John' }, { name: 'Jane' }];
    flushGrid(grid);
    await nextFrame();
  });

  it('should expose default i18n', () => {
    expect(grid.i18n.selectAll).to.equal('Select all');
    expect(grid.i18n.selectRow).to.equal('Select row {0}');
    expect(grid.i18n.sortColumn).to.equal('Sort by {0}');
  });

  it('should label the sorter from i18n.sortColumn + header text', () => {
    const sorter = grid.querySelector('vaadin-grid-sorter');
    expect(sorter.getAttribute('aria-label')).to.equal('Sort by Name');
  });

  it('should relabel the sorter when i18n.sortColumn changes', async () => {
    grid.i18n = { ...grid.i18n, sortColumn: 'Sortera enligt {0}' };
    await nextFrame();
    const sorter = grid.querySelector('vaadin-grid-sorter');
    expect(sorter.getAttribute('aria-label')).to.equal('Sortera enligt Name');
  });

  it('should let explicit sorter accessibleName override i18n', async () => {
    const sorter = grid.querySelector('vaadin-grid-sorter');
    sorter.accessibleName = 'Custom';
    await nextFrame();
    expect(sorter.getAttribute('aria-label')).to.equal('Custom');
  });

  it('should label select-all checkbox from i18n.selectAll', async () => {
    grid.i18n = { ...grid.i18n, selectAll: 'Markera alla' };
    await nextFrame();
    const checkbox = getHeaderCellContent(grid, 0, 0).querySelector('vaadin-checkbox');
    expect(checkbox.accessibleName).to.equal('Markera alla');
  });

  it('should label select-row checkbox from i18n.selectRow (trimmed, no row-header text)', async () => {
    grid.i18n = { ...grid.i18n, selectRow: 'Markera rad {0}' };
    await nextFrame();
    const checkbox = getBodyCellContent(grid, 0, 0).querySelector('vaadin-checkbox');
    expect(checkbox.accessibleName).to.equal('Markera rad');
  });
});
