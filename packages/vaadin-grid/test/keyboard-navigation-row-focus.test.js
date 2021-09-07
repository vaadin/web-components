import { expect } from '@esm-bundle/chai';
import { down as mouseDown, fixtureSync, keyDownOn, nextRender, up as mouseUp } from '@vaadin/testing-helpers';
import { getCellContent } from './helpers.js';
import '../src/all-imports.js';

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

function end(target) {
  keyDownOn(target || grid.shadowRoot.activeElement, 35, [], 'End');
}

function home(target) {
  keyDownOn(target || grid.shadowRoot.activeElement, 36, [], 'Home');
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
      // Let's only have child items on every second item
      children: i % 2 === 0
    };
  });

  callback(items, itemsOnEachLevel);
}

describe('keyboard navigation - row focus', () => {
  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid>
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

    await nextRender(grid);

    // Make the grid enter row focus mode initially
    focusFirstHeaderCell();
    left();

    await nextRender(grid);
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

  [
    { direction: 'ltr', forwards: right, backwards: left },
    { direction: 'rtl', forwards: left, backwards: right }
  ].forEach(({ direction, forwards, backwards }) => {
    describe('interacting with keys - ' + direction, () => {
      beforeEach(async () => {
        document.dir = direction;
        await nextRender(grid);
      });

      afterEach(async () => {
        document.dir = undefined;
        await nextRender(grid);
      });

      it('should remain in row focus mode on backwards', () => {
        backwards();

        expect(getFocusedCellIndex()).to.equal(-1);
      });

      it('should enter cell focus mode on forwards', () => {
        forwards();

        expect(getFocusedCellIndex()).to.equal(0);
      });

      it('should return to row focus mode on backwards', () => {
        forwards();
        backwards();

        expect(getFocusedCellIndex()).to.equal(-1);
      });

      it('should expand an expandable row on forwards', () => {
        tabToBody();
        // Ensure we're still in row focus mode
        backwards();
        expect(isRowExpanded(0)).to.be.false;
        forwards();
        expect(isRowExpanded(0)).to.be.true;
      });

      it('should remain in row focus mode on forwards over an expandable row', () => {
        tabToBody();
        // Ensure we're still in row focus mode
        backwards();
        forwards();
        expect(getFocusedCellIndex()).to.equal(-1);
      });

      it('should enter cell focus mode on an expanded row on forwards', () => {
        tabToBody();
        // Ensure we're still in row focus mode
        backwards();
        forwards();
        forwards();
        expect(getFocusedCellIndex()).to.equal(0);
      });

      it('should enter cell focus mode on a leaf row on forwards', () => {
        tabToBody();
        // Ensure we're still in row focus mode
        backwards();
        down();
        forwards();
        expect(getFocusedCellIndex()).to.equal(0);
      });

      it('should collapse an expanded row on backwards', () => {
        tabToBody();
        // Ensure we're still in row focus mode
        backwards();
        forwards();
        backwards();
        expect(isRowExpanded(0)).to.be.false;
      });

      it('should skip row details on row navigation', () => {
        tabToBody();
        // Ensure we're still in row focus mode
        backwards();
        openRowDetails(0);
        down();
        expect(getFocusedRowIndex()).to.equal(1);
      });

      it('should return to row focus mode on backwards from details cell', () => {
        openRowDetails(1);
        tabToBody();
        // Ensure we're still in row focus mode
        backwards();
        // Focus the second row
        down();
        // Go to cell navigation mode
        forwards();
        // Focus the details cell
        down();
        // Go to row navigation mode
        backwards();
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
        forwards();
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

      it('should focus first row with home', () => {
        focusItem(0);
        down();

        home();

        expect(getFocusedRowIndex()).to.equal(0);
      });

      it('should focus last row with end', () => {
        focusItem(0);

        end();

        expect(getFocusedRowIndex()).to.equal(4);
      });
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
