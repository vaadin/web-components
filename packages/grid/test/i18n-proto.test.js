import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import './grid-test-styles.js';
import '../all-imports.js';
import { flushGrid, getBodyCellContent, getHeaderCellContent } from './helpers.js';

describe('grid i18n (minimal prototype, @lit/context)', () => {
  let grid;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-selection-column></vaadin-grid-selection-column>
        <vaadin-grid-sort-column path="firstName" header="First name" row-header></vaadin-grid-sort-column>
      </vaadin-grid>
    `);
    grid.items = [{ firstName: 'John', lastName: 'Doe' }];
    flushGrid(grid);
    await nextFrame();
  });

  it('should expose the default i18n', () => {
    expect(grid.i18n.selectAll).to.equal('Select all');
    expect(grid.i18n.selectRow).to.equal('Select row {0}');
    expect(grid.i18n.sortColumn).to.equal('Sort by {0}');
  });

  it('should label the sorter from i18n.sortColumn via context', () => {
    const sorter = grid.querySelector('vaadin-grid-sorter');
    expect(sorter.getAttribute('aria-label')).to.equal('Sort by First name');
  });

  it('should relabel the sorter when i18n changes', async () => {
    grid.i18n = { ...grid.i18n, sortColumn: 'Sortera enligt {0}' };
    await nextFrame();
    const sorter = grid.querySelector('vaadin-grid-sorter');
    expect(sorter.getAttribute('aria-label')).to.equal('Sortera enligt First name');
  });

  it('should label the select-all checkbox from i18n.selectAll', async () => {
    grid.i18n = { ...grid.i18n, selectAll: 'Markera alla' };
    await nextFrame();
    const checkbox = getHeaderCellContent(grid, 0, 0).querySelector('vaadin-checkbox');
    expect(checkbox.accessibleName).to.equal('Markera alla');
  });

  it('should fill selectRow {0} from the row-header column value', () => {
    const checkbox = getBodyCellContent(grid, 0, 0).querySelector('vaadin-checkbox');
    expect(checkbox.accessibleName).to.equal('Select row John');
  });

  it('should not add a sorter aria-label when there is no parent grid', async () => {
    const sorter = fixtureSync('<vaadin-grid-sorter>Name</vaadin-grid-sorter>');
    await nextFrame();
    expect(sorter.hasAttribute('aria-label')).to.be.false;
  });
});
