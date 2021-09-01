import { expect } from '@esm-bundle/chai';
import { down as mouseDown, fixtureSync, keyDownOn, nextRender, up as mouseUp } from '@vaadin/testing-helpers';
import { getCellContent } from './helpers.js';
import '../all-imports.js';

let grid, header, footer, body;

function clickItem(rowIndex) {
  return getCellContent(getRowFirstCell(rowIndex)).click();
}

function focusItem(rowIndex) {
  return getRowFirstCell(rowIndex).focus();
}

function isRowExpanded(rowIndex) {
  return grid._isExpanded(grid.$.items.children[rowIndex]._item);
}

function openRowDetails(rowIndex) {
  return grid.openItemDetails(grid.$.items.children[rowIndex]._item);
}

function getRowCell(rowIndex, cellIndex) {
  return grid.$.items.children[rowIndex].children[cellIndex];
}

function getRowFirstCell(rowIndex) {
  return getRowCell(rowIndex, 0);
}

function left(target) {
  keyDownOn(target || grid.shadowRoot.activeElement, 37, [], 'ArrowLeft');
}

function right(target) {
  keyDownOn(target || grid.shadowRoot.activeElement, 39, [], 'ArrowRight');
}

function down(target) {
  keyDownOn(target || grid.shadowRoot.activeElement, 40, [], 'ArrowDown');
}

function spaceDown(target) {
  keyDownOn(target || grid.shadowRoot.activeElement, 32, [], ' ');
}

function getFirstHeaderCell() {
  return grid.$.header.children[0].children[0];
}

function focusWithMouse(element, mouseTarget) {
  mouseTarget = mouseTarget || element;
  mouseDown(mouseTarget);
  element.focus();
  mouseUp(mouseTarget);
}

function focusFirstHeaderCell() {
  focusWithMouse(getFirstHeaderCell());
}

function tabToBody() {
  grid._itemsFocusable.focus();
}

function shiftTabToFooter() {
  grid._footerFocusable.focus();
}

function getFocusedCellIndex() {
  const focusedCell = grid.shadowRoot.activeElement;
  if (focusedCell instanceof HTMLTableCellElement) {
    return Array.from(focusedCell.parentNode.children).indexOf(focusedCell);
  } else {
    return -1;
  }
}

function getFocusedRowIndex() {
  const activeElement = grid.shadowRoot.activeElement;
  const focusedRow = activeElement instanceof HTMLTableRowElement ? activeElement : activeElement.parentNode;
  return Array.from(focusedRow.parentNode.children).indexOf(focusedRow);
}

function getTabbableElements(root) {
  return root.querySelectorAll('[tabindex]:not([tabindex="-1"])');
}

function hierarchicalDataProvider({ parentItem }, callback) {
  // Let's use a count lower than pageSize so we can ignore page + pageSize for now
  const itemsOnEachLevel = 5;

  const items = [...Array(itemsOnEachLevel)].map((_, i) => {
    return {
      name: `${parentItem ? parentItem.name + '-' : ''}${i}`,
      // Let's only have child items on odd items
      children: i % 2 === 0
    };
  });

  callback(items, itemsOnEachLevel);
}

describe('keyboard navigation - row focus', () => {
  beforeEach(async () => {
    grid = fixtureSync(`
    <vaadin-grid rows-focusable>
      <vaadin-grid-tree-column path="name" header="" width="100px" flex-shrink="0"></vaadin-grid-tree-column>
      <vaadin-grid-column path="name" width="200px" flex-shrink="0"></vaadin-grid-column>
    </vaadin-grid>
    `);

    grid.dataProvider = hierarchicalDataProvider;
    grid.firstElementChild.footerRenderer = (root) => (root.textContent = 'footer');
    grid.rowDetailsRenderer = (root) => (root.textContent = 'details');

    header = grid.$.header;
    body = grid.$.items;
    footer = grid.$.footer;

    await nextRender();

    // Make the grid enter row focus mode initially
    focusFirstHeaderCell();
    left();
  });

  describe('navigating with tab', () => {
    it('should have single tabbable row in every section', () => {
      const tabbableElements = getTabbableElements(grid.shadowRoot);
      expect(tabbableElements.length).to.equal(5);
      expect(tabbableElements[0]).to.equal(grid.$.table);
      expect(tabbableElements[1].parentNode).to.equal(grid.$.header);
      expect(tabbableElements[2].parentNode).to.equal(grid.$.items);
      expect(tabbableElements[3].parentNode).to.equal(grid.$.footer);
      expect(tabbableElements[4]).to.equal(grid.$.focusexit);
    });

    it('should have tabindex 0 on tabbable rows', () => {
      const tabbableElements = getTabbableElements(grid.shadowRoot);
      const tabIndexes = Array.from(tabbableElements).map((el) => el.tabIndex);
      expect(tabIndexes).to.eql([0, 0, 0, 0, 0]);
    });
  });

  describe('interacting with keys', () => {
    it('should remain in row focus mode on left', () => {
      left();

      expect(getFocusedCellIndex()).to.equal(-1);
    });

    it('should enter cell focus mode on right', () => {
      right();

      expect(getFocusedCellIndex()).to.equal(0);
    });

    it('should return to row focus mode on left', () => {
      right();
      left();

      expect(getFocusedCellIndex()).to.equal(-1);
    });

    it('should not enter row focus mode if rowsFocusable is false', () => {
      right();
      grid.rowsFocusable = false;
      left();

      expect(getFocusedCellIndex()).to.equal(0);
    });

    it('should expand an expandable row on right', () => {
      tabToBody();
      expect(isRowExpanded(0)).to.be.false;
      right();
      expect(isRowExpanded(0)).to.be.true;
    });

    it('should remain in row focus mode on right over an expandable row', () => {
      tabToBody();
      right();
      expect(getFocusedCellIndex()).to.equal(-1);
    });

    it('should enter cell focus mode on an expanded row on right', () => {
      tabToBody();
      right();
      right();
      expect(getFocusedCellIndex()).to.equal(0);
    });

    it('should enter cell focus mode on a leaf row on right', () => {
      tabToBody();
      down();
      right();
      expect(getFocusedCellIndex()).to.equal(0);
    });

    it('should collapse an expanded row on left', () => {
      tabToBody();
      right();
      left();
      expect(isRowExpanded(0)).to.be.false;
    });

    it('should skip row details on row navigation', () => {
      tabToBody();
      openRowDetails(0);
      down();
      expect(getFocusedRowIndex()).to.equal(1);
    });

    it('should return to row focus mode on left from details cell', () => {
      openRowDetails(1);
      tabToBody();
      // Focus the second row
      down();
      // Go to cell navigation mode
      right();
      // Focus the details cell
      down();
      // Go to row navigation mode
      left();
      expect(getFocusedCellIndex()).to.equal(-1);
    });

    it('should navigate rows after a cell gets click focused', () => {
      focusItem(0);
      clickItem(0);
      down();

      expect(getFocusedRowIndex()).to.equal(1);
      expect(getFocusedCellIndex()).to.equal(-1);
    });

    it('should navigate cells after a cell gets click focused', () => {
      right();
      focusItem(0);
      clickItem(0);
      down();

      expect(getFocusedRowIndex()).to.equal(1);
      expect(getFocusedCellIndex()).to.equal(0);
    });

    it('should enable navigation mode on down', () => {
      focusItem(0);

      down();

      expect(grid.hasAttribute('navigating')).to.be.true;
    });
  });

  describe('activating items', () => {
    it('should activate on space keydown', () => {
      tabToBody();

      spaceDown();

      expect(grid.activeItem.name).to.equal('0');
    });

    it('should deactivate on space keydown', () => {
      tabToBody();

      spaceDown();
      spaceDown();

      expect(grid.activeItem).to.be.null;
    });
  });

  describe('keyboard focus', () => {
    it('should have focused first row in header by default', () => {
      expect(grid.shadowRoot.activeElement).to.equal(header.children[0]);
    });

    it('should have focused first cell in body by default', () => {
      tabToBody();

      expect(grid.shadowRoot.activeElement).to.equal(body.children[0]);
    });

    it('should have focused first cell in footer by default', () => {
      shiftTabToFooter();

      expect(grid.shadowRoot.activeElement).to.equal(footer.children[0]);
    });
  });
});
