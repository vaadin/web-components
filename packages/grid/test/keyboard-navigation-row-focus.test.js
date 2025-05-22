import { expect } from '@vaadin/chai-plugins';
import {
  down as mouseDown,
  fixtureSync,
  keyDownOn,
  listenOnce,
  nextFrame,
  nextRender,
  up as mouseUp,
} from '@vaadin/testing-helpers';
import '../src/all-imports.js';
import { flushGrid, getCellContent, getFocusedCellIndex, getFocusedRowIndex } from './helpers.js';

let grid, header, footer, body;

function getRowCell(rowIndex, cellIndex) {
  return grid.$.items.children[rowIndex].children[cellIndex];
}

function getRowFirstCell(rowIndex) {
  return getRowCell(rowIndex, 0);
}

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

function tab(target) {
  keyDownOn(target || grid.shadowRoot.activeElement, 9, [], 'Tab');
}

function shiftTab(target) {
  keyDownOn(target || grid.shadowRoot.activeElement, 9, 'shift', 'Tab');
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
  mouseTarget ||= element;
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

function getTabbableElements(root) {
  return [...root.querySelectorAll('[tabindex]:not([tabindex="-1"])')].filter((el) => el.offsetParent !== null);
}

function getTabbableRows(root) {
  return root.querySelectorAll('tr[tabindex]:not([hidden]):not([tabindex="-1"])');
}

function hierarchicalDataProvider({ parentItem, page, pageSize }, callback) {
  const items = Array.from({ length: 100 }, (_, i) => {
    return {
      name: `${parentItem ? `${parentItem.name}-` : ''}${i}`,
      // Let's only have child items on every second item
      children: i % 2 === 0,
    };
  });

  const offset = page * pageSize;
  callback(items.slice(offset, offset + pageSize), items.length);
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
    grid.firstElementChild.footerRenderer = (root) => {
      root.textContent = 'footer';
    };
    grid.rowDetailsRenderer = (root) => {
      root.textContent = 'details';
    };

    flushGrid(grid);
    header = grid.$.header;
    body = grid.$.items;
    footer = grid.$.footer;

    await nextRender();

    // Make the grid enter row focus mode initially
    focusFirstHeaderCell();
    left();

    await nextRender();
  });

  describe('scrolling and navigating', () => {
    it('should scroll focused nested row into view on arrow key', async () => {
      focusItem(0);
      // Expand first row
      right();
      // Focus first nested row
      down();
      // Simulate real scrolling to get the virtualizer to render
      // the focused item in a different element.
      grid.$.table.scrollTop = grid.$.table.scrollHeight / 2;
      await nextFrame();
      down();
      expect(getFocusedRowIndex(grid)).to.equal(2);
    });

    it('should scroll focused nested row into view on Tab', async () => {
      focusItem(0);
      // Expand first row
      right();
      // Focus first nested row
      down();
      // Move focus to header
      shiftTab();
      // Simulate real scrolling to get the virtualizer to render
      // the focused item in a different element.
      grid.$.table.scrollTop = grid.$.table.scrollHeight / 2;
      await nextFrame();
      // Move focus back to items
      tab();
      expect(getFocusedRowIndex(grid)).to.equal(1);
    });
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

    it('should be possible to exit grid with tab', () => {
      const tabbableElements = getTabbableElements(grid.shadowRoot);
      tabbableElements[3].focus(); // Focus footer row

      let keydownEvent;
      listenOnce(grid.shadowRoot.activeElement, 'keydown', (e) => {
        keydownEvent = e;
      });
      tab();

      // Expect programmatic focus on focus exit element
      expect(grid.shadowRoot.activeElement).to.equal(grid.$.focusexit);
      // Ensure native focus jump is allowed
      expect(keydownEvent.defaultPrevented).to.be.false;
    });

    it('should be possible to exit grid with shift+tab', () => {
      const tabbableElements = getTabbableElements(grid.shadowRoot);
      tabbableElements[1].focus(); // Focus header row

      let keydownEvent;
      listenOnce(grid.shadowRoot.activeElement, 'keydown', (e) => {
        keydownEvent = e;
      });
      shiftTab();

      // Expect programmatic focus on focus exit element
      expect(grid.shadowRoot.activeElement).to.equal(grid.$.table);
      // Ensure native focus jump is allowed
      expect(keydownEvent.defaultPrevented).to.be.false;
    });
  });

  [
    { direction: 'ltr', forwards: right, backwards: left },
    { direction: 'rtl', forwards: left, backwards: right },
  ].forEach(({ direction, forwards, backwards }) => {
    describe(`interacting with keys - ${direction}`, () => {
      beforeEach(async () => {
        document.dir = direction;
        await nextRender();
      });

      afterEach(async () => {
        document.dir = undefined;
        await nextRender();
      });

      it('should remain in row focus mode on backwards', () => {
        backwards();

        expect(getFocusedCellIndex(grid)).to.equal(-1);
      });

      it('should enter cell focus mode on forwards', () => {
        forwards();

        expect(getFocusedCellIndex(grid)).to.equal(0);
      });

      it('should return to row focus mode on backwards', () => {
        forwards();
        backwards();

        expect(getFocusedCellIndex(grid)).to.equal(-1);
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
        expect(getFocusedCellIndex(grid)).to.equal(-1);
      });

      it('should enter cell focus mode on an expanded row on forwards', () => {
        tabToBody();
        // Ensure we're still in row focus mode
        backwards();
        forwards();
        forwards();
        expect(getFocusedCellIndex(grid)).to.equal(0);
      });

      it('should enter cell focus mode on a leaf row on forwards', () => {
        tabToBody();
        // Ensure we're still in row focus mode
        backwards();
        down();
        forwards();
        expect(getFocusedCellIndex(grid)).to.equal(0);
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
        expect(getFocusedRowIndex(grid)).to.equal(1);
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
        expect(getFocusedCellIndex(grid)).to.equal(-1);
      });

      it('should navigate rows after a cell gets click focused', () => {
        focusItem(0);
        clickItem(0);
        down();

        expect(getFocusedRowIndex(grid)).to.equal(1);
        expect(getFocusedCellIndex(grid)).to.equal(-1);
      });

      it('should navigate cells after a cell gets click focused', () => {
        forwards();
        focusItem(0);
        clickItem(0);
        down();

        expect(getFocusedRowIndex(grid)).to.equal(1);
        expect(getFocusedCellIndex(grid)).to.equal(0);
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

        expect(getFocusedRowIndex(grid)).to.equal(0);
      });

      it('should focus last row with end', () => {
        focusItem(0);

        end();

        expect(getFocusedRowIndex(grid)).to.equal(99);
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

describe('keyboard navigation on column groups - row focus', () => {
  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column-group header="main group header">
          <vaadin-grid-column-group header="sub group header">
            <vaadin-grid-column header="column header"></vaadin-grid-column>
          </vaadin-grid-column-group>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);
    grid.items = ['foo', 'bar'];
    grid.querySelector('vaadin-grid-column').renderer = (root, _, model) => {
      root.textContent = model.item;
    };
    flushGrid(grid);

    await nextRender();

    // Make the grid enter row focus mode initially
    focusFirstHeaderCell();
    left();

    await nextRender();
  });

  describe('updating tabbable rows', () => {
    describe('updating tabbable rows - header', () => {
      let header;
      let mainGroup;
      let subGroup;
      let column;

      beforeEach(() => {
        header = grid.$.header;
        mainGroup = grid.querySelector('vaadin-grid-column-group');
        subGroup = mainGroup.querySelector('vaadin-grid-column-group');
        column = subGroup.querySelector('vaadin-grid-column');
      });

      it('should update tabbable header row on header row hide', async () => {
        const initialTabbableHeaderRow = getTabbableRows(header)[0];

        // Hide the first header row
        mainGroup.header = null;
        await nextFrame();

        const tabbableHeaderRow = getTabbableRows(header)[0];
        expect(tabbableHeaderRow.offsetHeight).not.to.equal(0);
        expect(tabbableHeaderRow).not.to.equal(initialTabbableHeaderRow);
      });

      it('should have no tabbable header rows when header is hidden', async () => {
        // Hide all header rows
        mainGroup.header = null;
        subGroup.header = null;
        column.header = null;
        await nextFrame();

        expect(getTabbableRows(header)).to.be.empty;
      });

      it('should update tabbable header row on header row unhide', async () => {
        // Hide all header rows
        mainGroup.header = null;
        subGroup.header = null;
        column.header = null;
        await nextFrame();

        column.header = 'column';
        await nextFrame();

        const tabbableHeaderRow = getTabbableRows(header)[0];
        expect(tabbableHeaderRow.offsetHeight).not.to.equal(0);
      });
    });

    describe('updating tabbable rows - body', () => {
      let body;

      beforeEach(() => {
        body = grid.$.items;
      });

      it('should update tabbable body row on body row hide', async () => {
        // Focus the second body row / make it tabbable
        tabToBody();
        down();

        // Hide the second body row
        grid.items = [grid.items[0]];

        await nextFrame();

        // Expect the tabbable body row to be on the first row
        const tabbableBodyRow = getTabbableRows(body)[0];
        expect(tabbableBodyRow.index).to.equal(0);
        expect(tabbableBodyRow.offsetHeight).not.to.equal(0);
      });

      it('should have no tabbable body row when there are no rows', () => {
        // Remove all body rows
        grid.items = [];

        const tabbableBodyRow = getTabbableRows(body)[0];
        expect(tabbableBodyRow).not.to.be.ok;
      });

      it('should update tabbable body row on body row unhide', async () => {
        // Remove all body rows
        grid.items = [];
        await nextFrame();

        grid.items = ['foo', 'bar'];
        await nextFrame();

        const tabbableBodyRow = getTabbableRows(body)[0];
        expect(tabbableBodyRow.index).to.equal(0);
        expect(tabbableBodyRow.offsetHeight).not.to.equal(0);
      });
    });
  });
});

['header', 'footer', 'body'].forEach((section) => {
  describe(`empty grid - row focus - ${section}`, () => {
    beforeEach(() => {
      grid = fixtureSync(`<vaadin-grid>
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid>`);
      const column = grid.firstElementChild;

      if (section === 'header') {
        column.header = 'header';
      } else if (section === 'footer') {
        column.footerRenderer = (root) => {
          root.textContent = 'footer';
        };
      } else if (section === 'body') {
        grid.items = ['foo'];
      }

      flushGrid(grid);
    });

    it(`should enter row focus mode - ${section}`, () => {
      getTabbableElements(grid.$.table)[0].focus();
      left();

      const tabbableRow = getTabbableRows(grid.shadowRoot)[0];
      expect(tabbableRow).to.be.ok;
    });

    it(`should return to cell focus mode - ${section}`, () => {
      getTabbableElements(grid.$.table)[0].focus();
      left();

      const tabbableRow = getTabbableRows(grid.shadowRoot)[0];
      right();

      const tabbableCell = getTabbableElements(tabbableRow)[0];
      expect(tabbableCell.parentElement).to.equal(tabbableRow);
    });
  });
});
