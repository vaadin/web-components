import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import { fire, flushGrid, getBodyCell, getBodyCellContent, getHeaderCell, getHeaderCellContent } from './helpers.js';

describe('selectable-provider', () => {
  let grid;
  let selectionColumn;
  let selectAllCheckbox;

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

  describe('individual selection', () => {
    it('should disable checkboxes for non-selectable items', () => {
      for (let i = 0; i < grid.items.length; i++) {
        expect(getItemCheckbox(i).disabled).to.equal(i < 5);
      }
    });

    it('should update disabled checkboxes when changing isItemSelectable', () => {
      grid.isItemSelectable = (item) => item.index < 5;
      flushGrid(grid);

      for (let i = 0; i < grid.items.length; i++) {
        expect(getItemCheckbox(i).disabled).to.equal(i >= 5);
      }
    });

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
    function isSelectAllChecked() {
      return selectAllCheckbox.checked && !selectAllCheckbox.indeterminate;
    }

    function isSelectAllIndeterminate() {
      return selectAllCheckbox.checked && selectAllCheckbox.indeterminate;
    }

    function isSelectAllUnchecked() {
      return !selectAllCheckbox.checked && !selectAllCheckbox.indeterminate;
    }

    it('should be checked when all selectable items are selected', () => {
      grid.selectedItems = grid.items.slice(5);

      expect(isSelectAllChecked()).to.be.true;
    });

    it('should be indeterminate when some selectable items are not selected', () => {
      grid.selectedItems = grid.items.slice(6);

      expect(isSelectAllIndeterminate()).to.be.true;
    });

    it('should be unchecked when only unselectable items are selected', () => {
      grid.selectedItems = grid.items.slice(0, 5);

      expect(isSelectAllUnchecked()).to.be.true;
    });

    it('should update when changing isItemSelectable', async () => {
      // change provider so that some selectable items are not checked
      grid.selectedItems = grid.items.slice(5);
      grid.isItemSelectable = (item) => item.index > 1;
      await nextFrame();

      expect(isSelectAllIndeterminate()).to.be.true;

      // revert provider so that only non-selectable items are not checked
      grid.isItemSelectable = (item) => item.index >= 5;
      await nextFrame();

      expect(isSelectAllChecked()).to.be.true;
    });

    it('should only check selectable items on click', async () => {
      selectAllCheckbox.click();
      await nextFrame();

      expect(grid.selectedItems.length).to.equal(5);
      expect(grid.selectedItems).to.include.members(grid.items.slice(5));
    });

    it('should not uncheck non-selectable items on click', async () => {
      grid.selectedItems = grid.items.slice(0, 5);
      selectAllCheckbox.click();
      await nextFrame();

      expect(grid.selectedItems.length).to.equal(10);
      expect(grid.selectedItems).to.include.members(grid.items);
    });

    it('should only uncheck selectable items on click', async () => {
      grid.selectedItems = [...grid.items];
      await nextFrame();

      selectAllCheckbox.click();
      await nextFrame();

      expect(grid.selectedItems.length).to.equal(5);
      expect(grid.selectedItems).to.include.members(grid.items.slice(0, 5));
    });

    it('should only check selectable items when pressing space on cell', async () => {
      getHeaderCell(grid, 0, 0).focus();
      await sendKeys({ press: 'Space' });

      expect(grid.selectedItems.length).to.equal(5);
      expect(grid.selectedItems).to.include.members(grid.items.slice(5));
    });

    it('should only uncheck selectable items when pressing space on cell', async () => {
      grid.selectedItems = [...grid.items];

      getHeaderCell(grid, 0, 0).focus();
      await sendKeys({ press: 'Space' });

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
