import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './grid-test-styles.js';
import '../all-imports.js';
import {
  fire,
  flushGrid,
  getBodyCell,
  getBodyCellContent,
  getHeaderCellContent,
  getRowBodyCells,
  getRows,
} from './helpers.js';

describe('selectable-provider', () => {
  let grid;
  let selectionColumn;
  let selectAllCheckbox;

  function getItemCheckbox(rowIndex) {
    return getBodyCellContent(grid, rowIndex, 0).querySelector('vaadin-checkbox');
  }

  beforeEach(async () => {
    grid = fixtureSync(`
        <vaadin-grid style="width: 200px; height: 400px;">
          <vaadin-grid-selection-column></vaadin-grid-selection-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid>
      `);

    // setup 10 items, first 5 are non-selectable
    grid.items = Array.from({ length: 10 }, (_, i) => {
      return { index: i, name: `item ${i}` };
    });
    grid.isItemSelectable = (item) => item.index >= 5;

    flushGrid(grid);
    await nextFrame();

    selectionColumn = grid.querySelector('vaadin-grid-selection-column');
    selectAllCheckbox = getHeaderCellContent(grid, 0, 0).querySelector('vaadin-checkbox');
  });

  describe('checkbox states', () => {
    it('should hide checkboxes for non-selectable items that are not selected', () => {
      for (let i = 0; i < grid.items.length; i++) {
        expect(getItemCheckbox(i).readonly).to.equal(i < 5);
        expect(getItemCheckbox(i).checkVisibility({ visibilityProperty: true })).to.equal(i >= 5);
      }
    });

    it('should show readonly checkboxes for non-selectable items that are selected', () => {
      grid.selectedItems = [...grid.items];

      for (let i = 0; i < grid.items.length; i++) {
        expect(getItemCheckbox(i).readonly).to.equal(i < 5);
        expect(getItemCheckbox(i).checkVisibility({ visibilityProperty: true })).to.be.true;
      }
    });

    it('should update checkboxes when changing isItemSelectable', () => {
      grid.isItemSelectable = (item) => item.index < 5;
      flushGrid(grid);

      for (let i = 0; i < grid.items.length; i++) {
        expect(getItemCheckbox(i).checkVisibility({ visibilityProperty: true })).to.equal(i < 5);
      }
    });
  });

  describe('individual selection', () => {
    it('should prevent selection on checkbox click', async () => {
      // prevents selection for non-selectable items
      getItemCheckbox(0).click();
      await nextFrame();
      expect(grid.selectedItems.length).to.equal(0);

      // allows selection for selectable items
      getItemCheckbox(5).click();
      await nextFrame();
      expect(grid.selectedItems.length).to.equal(1);
    });

    it('should prevent deselection on checkbox click', async () => {
      grid.selectedItems = [...grid.items];

      // prevents deselection for non-selectable items
      getItemCheckbox(0).click();
      await nextFrame();
      expect(grid.selectedItems.length).to.equal(10);

      // allows deselection for selectable items
      getItemCheckbox(5).click();
      await nextFrame();
      expect(grid.selectedItems.length).to.equal(9);
    });

    it('should prevent selection on row click when using auto-select', () => {
      selectionColumn.autoSelect = true;

      // prevents selection for non-selectable items
      getBodyCellContent(grid, 0, 1).click();
      expect(grid.selectedItems.length).to.equal(0);

      // allows selection for selectable items
      getBodyCellContent(grid, 5, 1).click();
      expect(grid.selectedItems.length).to.equal(1);
    });

    it('should prevent deselection on row click when using auto-select', () => {
      grid.selectedItems = [...grid.items];
      selectionColumn.autoSelect = true;

      // prevents deselection for non-selectable items
      getBodyCellContent(grid, 0, 1).click();
      expect(grid.selectedItems.length).to.equal(10);

      // allows deselection for selectable items
      getBodyCellContent(grid, 5, 1).click();
      expect(grid.selectedItems.length).to.equal(9);
    });

    it('should prevent selection when pressing space on cell', async () => {
      // prevents selection for non-selectable items
      getBodyCell(grid, 0, 0).focus();
      await sendKeys({ press: 'Space' });
      expect(grid.selectedItems.length).to.equal(0);

      // allows selection for selectable items
      getBodyCell(grid, 5, 0).focus();
      await sendKeys({ press: 'Space' });
      expect(grid.selectedItems.length).to.equal(1);
    });

    it('should prevent deselection when pressing space on cell', async () => {
      grid.selectedItems = [...grid.items];

      // prevents deselection for non-selectable items
      getBodyCell(grid, 0, 0).focus();
      await sendKeys({ press: 'Space' });
      expect(grid.selectedItems.length).to.equal(10);

      // allows deselection for selectable items
      getBodyCell(grid, 5, 0).focus();
      await sendKeys({ press: 'Space' });
      expect(grid.selectedItems.length).to.equal(9);
    });
  });

  describe('drag selection', () => {
    let clock;

    beforeEach(() => {
      selectionColumn.dragSelect = true;
      clock = sinon.useFakeTimers({
        shouldClearNativeTimers: true,
      });
    });

    afterEach(() => {
      clock.restore();
    });

    function fireTrackEvent(targetCell, startCell, eventState) {
      const targetCellRect = targetCell.getBoundingClientRect();
      const startCellRect = startCell.getBoundingClientRect();
      fire(
        'track',
        { state: eventState, y: targetCellRect.y, dy: targetCellRect.y - startCellRect.y },
        { node: targetCell },
      );
    }

    it('should prevent selection when drag selecting', () => {
      // drag select in reverse from selectable items to non-selectable items
      for (let i = 9; i >= 0; i--) {
        const cellContent = getBodyCellContent(grid, i, 0);
        const eventState = i === 9 ? 'start' : i === 0 ? 'end' : 'track';
        fireTrackEvent(cellContent, cellContent, eventState);
        clock.tick(10);
      }
      expect(grid.selectedItems.length).to.equal(5);
      expect(grid.selectedItems).to.include.members(grid.items.slice(5));
    });

    it('should prevent deselection when drag selecting', () => {
      grid.selectedItems = [...grid.items];

      // drag select in reverse from selectable items to non-selectable items
      for (let i = 9; i >= 0; i--) {
        const cellContent = getBodyCellContent(grid, i, 0);
        const eventState = i === 9 ? 'start' : i === 0 ? 'end' : 'track';
        fireTrackEvent(cellContent, cellContent, eventState);
        clock.tick(10);
      }
      expect(grid.selectedItems.length).to.equal(5);
      expect(grid.selectedItems).to.include.members(grid.items.slice(0, 5));
    });
  });

  describe('select all', () => {
    it('should hide select all checkbox when using isItemSelectable provider', () => {
      expect(selectAllCheckbox.checkVisibility({ visibilityProperty: true })).to.be.false;
    });

    it('should hide select all checkbox when adding a selection column to an existing grid with an isItemSelectable provider', async () => {
      // remove existing selection column
      selectionColumn.remove();
      // column mixin only removes cells after an animation frame
      await nextFrame();

      // add new selection column
      selectionColumn = document.createElement('vaadin-grid-selection-column');
      grid.prepend(selectionColumn);
      // column mixin only adds cells after an animation frame
      await nextFrame();
      selectAllCheckbox = getHeaderCellContent(grid, 0, 0).querySelector('vaadin-checkbox');

      expect(selectAllCheckbox.checkVisibility({ visibilityProperty: true })).to.be.false;
    });

    it('should show select all checkbox when removing isItemSelectable provider', async () => {
      grid.isItemSelectable = null;
      await nextFrame();

      expect(selectAllCheckbox.style.visibility).to.equal('');
      expect(selectAllCheckbox.hasAttribute('aria-hidden')).to.be.false;
    });
  });

  describe('programmatic selection', () => {
    it('should not prevent programmatic selection', () => {
      grid.selectItem(grid.items[0]);
      grid.selectItem(grid.items[1]);
      expect(grid.selectedItems.length).to.equal(2);

      grid.deselectItem(grid.items[0]);
      grid.deselectItem(grid.items[1]);
      expect(grid.selectedItems.length).to.equal(0);
    });
  });

  describe('part names', () => {
    it('should have part names for non-selectable rows', () => {
      const rows = getRows(grid.$.items);

      for (let i = 0; i < grid.items.length; i++) {
        const row = rows[i];
        if (i < 5) {
          expect(row.getAttribute('part')).to.include('nonselectable-row');
        } else {
          expect(row.getAttribute('part')).to.not.include('nonselectable-row');
        }
      }
    });

    it('should update part names for non-selectable rows when changing isItemSelectable', async () => {
      grid.isItemSelectable = (item) => item.index < 5;
      await nextFrame();

      const rows = getRows(grid.$.items);

      for (let i = 0; i < grid.items.length; i++) {
        const row = rows[i];
        if (i >= 5) {
          expect(row.getAttribute('part')).to.include('nonselectable-row');
        } else {
          expect(row.getAttribute('part')).to.not.include('nonselectable-row');
        }
      }
    });

    it('should have part names for non-selectable row cells', () => {
      const rows = getRows(grid.$.items);

      for (let i = 0; i < grid.items.length; i++) {
        const row = rows[i];
        const cells = getRowBodyCells(row);
        cells.forEach((cell) => {
          if (i < 5) {
            expect(cell.getAttribute('part')).to.include('nonselectable-row-cell');
          } else {
            expect(cell.getAttribute('part')).to.not.include('nonselectable-row-cell');
          }
        });
      }
    });

    it('should update part names for non-selectable row cells when changing isItemSelectable', async () => {
      grid.isItemSelectable = (item) => item.index < 5;
      await nextFrame();

      const rows = getRows(grid.$.items);

      for (let i = 0; i < grid.items.length; i++) {
        const row = rows[i];
        const cells = getRowBodyCells(row);
        cells.forEach((cell) => {
          if (i >= 5) {
            expect(cell.getAttribute('part')).to.include('nonselectable-row-cell');
          } else {
            expect(cell.getAttribute('part')).to.not.include('nonselectable-row-cell');
          }
        });
      }
    });
  });
});
