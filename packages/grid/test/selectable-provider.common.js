import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import { fire, flushGrid, getBodyCell, getBodyCellContent } from './helpers.js';

describe('selectable-provider', () => {
  let grid;
  let selectionColumn;
  let clock;

  function getItemCheckbox(rowIndex) {
    return getBodyCellContent(grid, rowIndex, 0).querySelector('vaadin-checkbox');
  }

  function fireTrackEvent(targetCell, startCell, eventState) {
    const targetCellRect = targetCell.getBoundingClientRect();
    const startCellRect = startCell.getBoundingClientRect();
    fire(
      'track',
      { state: eventState, y: targetCellRect.y, dy: targetCellRect.y - startCellRect.y },
      { node: targetCell },
    );
  }

  beforeEach(() => {
    grid = fixtureSync(`
        <vaadin-grid style="width: 200px; height: 400px;">
          <vaadin-grid-selection-column></vaadin-grid-selection-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid>
      `);
    selectionColumn = grid.querySelector('vaadin-grid-selection-column');

    // setup 10 items, first 5 are non-selectable
    grid.items = Array.from({ length: 10 }, (_, i) => {
      return { name: `item ${i}` };
    });
    grid.isItemSelectable = (model) => model.index >= 5;

    flushGrid(grid);

    clock = sinon.useFakeTimers({
      shouldClearNativeTimers: true,
    });
  });

  afterEach(() => {
    clock.restore();
  });

  describe('individual selection', () => {
    it('should disable checkboxes for non-selectable items', () => {
      for (let i = 0; i < grid.items.length; i++) {
        expect(getItemCheckbox(i).disabled).to.equal(i < 5);
      }
    });

    it('should update disabled checkboxes when changing isItemSelectable', () => {
      grid.isItemSelectable = (model) => model.index < 5;
      flushGrid(grid);

      for (let i = 0; i < grid.items.length; i++) {
        expect(getItemCheckbox(i).disabled).to.equal(i >= 5);
      }
    });

    it('should prevent selection on checkbox click', () => {
      // prevents selection for non-selectable items
      getItemCheckbox(0).click();
      expect(grid.selectedItems.length).to.equal(0);

      // allows selection for selectable items
      getItemCheckbox(5).click();
      expect(grid.selectedItems.length).to.equal(1);
    });

    it('should prevent deselection on checkbox click', () => {
      grid.selectedItems = [...grid.items];

      // prevents deselection for non-selectable items
      getItemCheckbox(0).click();
      expect(grid.selectedItems.length).to.equal(10);

      // allows deselection for selectable items
      getItemCheckbox(5).click();
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

    it('should prevent selection when drag selecting', () => {
      selectionColumn.dragSelect = true;

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
      selectionColumn.dragSelect = true;

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
});
