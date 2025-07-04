import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import {
  aTimeout,
  down as mouseDown,
  fixtureSync,
  focusin,
  isChrome,
  isDesktopSafari,
  keyboardEventFor,
  keyDownOn,
  keyUpOn,
  listenOnce,
  nextFrame,
  up as mouseUp,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './grid-test-styles.js';
import '../all-imports.js';
import {
  attributeRenderer,
  flushGrid,
  getCell,
  getCellContent,
  getContainerCell,
  getFirstVisibleItem,
  getFocusedCellIndex,
  getFocusedRowIndex,
  getLastVisibleItem,
  getPhysicalItems,
  getRowCells,
  getRows,
  infiniteDataProvider,
  scrollToEnd,
} from './helpers.js';

let grid, focusable, scroller, header, footer, body;

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

function getCellInput(rowIndex, colIndex) {
  const cell = getRowCell(rowIndex, colIndex);
  const input = getCellContent(cell).children[0];

  if (!input.nodeName || input.nodeName.toLowerCase() !== 'input') {
    throw new Error('Cell does not contain an input');
  }

  return input;
}

function focusFirstBodyInput(rowIndex) {
  const input = getCellInput(rowIndex || 0, 1);
  input.focus();
  return input;
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

function up(target) {
  keyDownOn(target || grid.shadowRoot.activeElement, 38, [], 'ArrowUp');
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

function spaceUp(target) {
  keyUpOn(target || grid.shadowRoot.activeElement, 32, [], ' ');
}

function pageUp(target) {
  keyDownOn(target || grid.shadowRoot.activeElement, 33, [], 'PageUp');
}

function pageDown(target) {
  keyDownOn(target || grid.shadowRoot.activeElement, 34, [], 'PageDown');
}

function end(target) {
  keyDownOn(target || grid.shadowRoot.activeElement, 35, [], 'End');
}

function ctrlEnd(target) {
  keyDownOn(target || grid.shadowRoot.activeElement, 35, 'ctrl', 'End');
}

function home(target) {
  keyDownOn(target || grid.shadowRoot.activeElement, 36, [], 'Home');
}

function ctrlHome(target) {
  keyDownOn(target || grid.shadowRoot.activeElement, 36, 'ctrl', 'Home');
}

function enter(target) {
  keyDownOn(target || grid.shadowRoot.activeElement, 13, [], 'Enter');
}

function escape(target) {
  keyDownOn(target || grid.shadowRoot.activeElement, 27, [], 'Escape');
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

function focusFirstFooterCell() {
  focusWithMouse(grid.$.footer.children[0].children[0]);
}

function focusFirstBodyCell() {
  focusWithMouse(grid.$.items.children[0].children[0]);
}

function tabToHeader() {
  grid._headerFocusable.focus();
}

function tabToBody() {
  grid._itemsFocusable.focus();
}

function shiftTabToFooter() {
  grid._footerFocusable.focus();
}

function getTabbableElements(root) {
  return [...root.querySelectorAll('[tabindex]:not([tabindex="-1"])')].filter((el) => {
    let parent = el;
    while (parent) {
      if (getComputedStyle(parent).display === 'none') {
        return false;
      }
      parent = parent.parentElement;
    }
    return true;
  });
}

function getTabbableCells(root) {
  return root.querySelectorAll('tr:not([hidden]) *:is(td, th)[tabindex]:not([tabindex="-1"])');
}

function indexItemRenderer(root, _, { item, index }) {
  root.textContent = `${index} ${item}`;
}

function inputRenderer(root) {
  root.innerHTML = '<input>';
}

describe('keyboard navigation', () => {
  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid theme="no-border">
        <vaadin-grid-column id="column-0"></vaadin-grid-column>
        <vaadin-grid-column id="column-1"></vaadin-grid-column>
        <vaadin-grid-column id="column-2"></vaadin-grid-column>
      </vaadin-grid>
    `);

    grid.rowDetailsRenderer = inputRenderer;
    grid.querySelector('#column-0').renderer = indexItemRenderer;

    grid.querySelector('#column-1').headerRenderer = inputRenderer;
    grid.querySelector('#column-1').renderer = inputRenderer;
    grid.querySelector('#column-1').footerRenderer = inputRenderer;

    grid.querySelector('#column-2').headerRenderer = (root) => {
      root.innerHTML = '<div></div><div></div>';
    };
    grid.querySelector('#column-2').renderer = (root, _, { item, index }) => {
      root.innerHTML = `<span>${index} ${item}</span>`;
    };

    flushGrid(grid);
    scroller = grid.$.scroller;
    header = grid.$.header;
    body = grid.$.items;
    footer = grid.$.footer;

    grid.items = ['foo', 'bar'];

    grid._observer.flush();
    flushGrid(grid);

    focusable = document.createElement('input');
    focusable.setAttribute('id', 'focusable');
    grid.parentNode.appendChild(focusable);

    await aTimeout(0);
  });

  describe('navigation mode', () => {
    it('should not be in navigation mode by default', () => {
      expect(grid.hasAttribute('navigating')).to.be.false;
    });

    it('should not enable navigation mode when cell is clicked', () => {
      focusFirstHeaderCell();

      expect(grid.hasAttribute('navigating')).to.be.false;
    });

    it('should disable navigation mode when blurred', () => {
      focusFirstHeaderCell();
      grid.setAttribute('navigating', '');

      focusable.focus();

      expect(grid.hasAttribute('navigating')).to.be.false;
    });

    it('should enable navigation mode when tabbed into header', () => {
      // Simulating tabbing into header
      tabToHeader();

      expect(grid.hasAttribute('navigating')).to.be.true;
    });

    it('should enable navigation mode when tabbed inside header', () => {
      focusFirstHeaderCell();

      tab();

      expect(grid.hasAttribute('navigating')).to.be.true;
    });

    it('should enable navigation mode when tabbed into footer', () => {
      // Simulating tabbing into footer
      focusable.focus();
      shiftTabToFooter();

      expect(grid.hasAttribute('navigating')).to.be.true;
    });

    it('should enable navigation mode when tabbed inside footer', () => {
      focusFirstFooterCell();

      tab();

      expect(grid.hasAttribute('navigating')).to.be.true;
    });

    it('should enable navigation mode with page down', () => {
      focusItem(0);

      pageDown();

      expect(grid.hasAttribute('navigating')).to.be.true;
    });

    it('should enable navigation mode with page up', () => {
      focusItem(0);

      pageUp();

      expect(grid.hasAttribute('navigating')).to.be.true;
    });

    it('should enable navigation mode with home', () => {
      focusItem(0);

      home();

      expect(grid.hasAttribute('navigating')).to.be.true;
    });

    it('should enable navigation mode with end', () => {
      focusItem(0);

      end();

      expect(grid.hasAttribute('navigating')).to.be.true;
    });

    it('should not enable navigation mode on mouse cell focus', () => {
      focusWithMouse(getRowFirstCell(0));

      expect(grid.hasAttribute('navigating')).to.be.false;
    });

    it('should not enable navigation mode on mouse cell content focus', () => {
      const cell = getRowFirstCell(0);
      focusWithMouse(cell, getCellContent(cell));

      expect(grid.hasAttribute('navigating')).to.be.false;
    });

    it('should disable navigation mode on mousedown', () => {
      focusFirstHeaderCell();
      grid.setAttribute('navigating', '');

      mouseDown(grid);

      expect(grid.hasAttribute('navigating')).to.be.false;
    });

    it('should enable navigation mode on header navigation', () => {
      focusFirstHeaderCell();

      right();

      expect(grid.hasAttribute('navigating')).to.be.true;
    });

    it('should not leave navigation mode on enter in a cell with only non-focusable elements', async () => {
      // Focus a cell with only non-focusable elements
      focusItem(0);
      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'ArrowRight' });
      // Press Enter
      await sendKeys({ press: 'Enter' });
      // Since the element (span) in the cell isn't focusable, the grid should stay in navigation mode
      expect(grid.hasAttribute('navigating')).to.be.true;
    });
  });

  describe('navigating with tab', () => {
    beforeEach(() => {
      grid.setAttribute('navigating', '');

      grid._observer.flush();
    });

    it('should have single tabbable cell in every section', () => {
      const tabbableElements = getTabbableElements(grid.shadowRoot);
      expect(tabbableElements.length).to.equal(5);
      expect(tabbableElements[0]).to.equal(grid.$.table);
      expect(tabbableElements[1].parentNode.parentNode).to.equal(grid.$.header);
      expect(tabbableElements[2].parentNode.parentNode).to.equal(grid.$.items);
      expect(tabbableElements[3].parentNode.parentNode).to.equal(grid.$.footer);
      expect(tabbableElements[4]).to.equal(grid.$.focusexit);
    });

    it('should have tabindex 0 on tabbable cells', () => {
      const tabbableElements = getTabbableElements(grid.shadowRoot);
      const tabIndexes = Array.from(tabbableElements).map((el) => el.tabIndex);
      expect(tabIndexes).to.eql([0, 0, 0, 0, 0]);
    });

    it('should have a focus exit as the very last child', () => {
      expect(grid.$.focusexit).to.be.ok;
      expect(grid.$.focusexit.tabIndex).to.equal(0);
      const lastChild = Array.from(grid.shadowRoot.children)
        .filter((child) => child.localName !== 'style')
        .pop();
      expect(lastChild).to.equal(grid.$.focusexit);
    });

    it('should be possible to tab through the grid', () => {
      const tabbableElements = getTabbableElements(grid.shadowRoot);

      let keydownEvent;
      const listener = (e) => {
        keydownEvent = e;
      };

      // Assuming grid has been tabbed into.
      tabbableElements[1].focus();

      listenOnce(scroller, 'keydown', listener);
      tab(); // To body cell
      expect(keydownEvent.defaultPrevented).to.be.true;
      expect(grid.shadowRoot.activeElement).to.equal(tabbableElements[2]);

      listenOnce(scroller, 'keydown', listener);
      tab(); // To footer cell
      expect(keydownEvent.defaultPrevented).to.be.true;
      expect(grid.shadowRoot.activeElement).to.equal(tabbableElements[3]);
    });

    it('should be possible to shift-tab through grid', () => {
      const tabbableElements = getTabbableElements(grid.shadowRoot);

      let keydownEvent;
      const listener = (e) => {
        keydownEvent = e;
      };

      // Assuming grid has been shift-tabbed into.
      tabbableElements[3].focus();

      listenOnce(grid.$.scroller, 'keydown', listener);
      shiftTab(); // To body cell
      expect(keydownEvent.defaultPrevented).to.be.true;
      expect(grid.shadowRoot.activeElement).to.equal(tabbableElements[2]);

      listenOnce(grid.$.scroller, 'keydown', listener);
      shiftTab(); // To header cell
      expect(keydownEvent.defaultPrevented).to.be.true;
      expect(grid.shadowRoot.activeElement).to.equal(tabbableElements[1]);
    });

    it('should be possible to tab through the grid when first column is hidden', () => {
      const firstColumn = grid.querySelectorAll('vaadin-grid-column')[0];
      firstColumn.hidden = true;

      const tabbableElements = getTabbableElements(grid.shadowRoot);

      let keydownEvent;
      const listener = (e) => {
        keydownEvent = e;
      };

      // Assuming grid has been tabbed into.
      tabbableElements[1].focus();

      listenOnce(grid.$.scroller, 'keydown', listener);
      tab(); // To body cell
      expect(keydownEvent.defaultPrevented).to.be.true;
      expect(grid.shadowRoot.activeElement).to.equal(tabbableElements[2]);

      listenOnce(grid.$.scroller, 'keydown', listener);
      tab(); // To footer cell
      expect(keydownEvent.defaultPrevented).to.be.true;
      expect(grid.shadowRoot.activeElement).to.equal(tabbableElements[3]);
    });

    it('should be possible to shift-tab through grid when first column is hidden', () => {
      const firstColumn = grid.querySelectorAll('vaadin-grid-column')[0];
      firstColumn.hidden = true;

      const tabbableElements = getTabbableElements(grid.shadowRoot);

      let keydownEvent;
      const listener = (e) => {
        keydownEvent = e;
      };

      // Assuming grid has been shift-tabbed into.
      tabbableElements[3].focus();

      listenOnce(grid.$.scroller, 'keydown', listener);
      shiftTab(); // To body cell
      expect(keydownEvent.defaultPrevented).to.be.true;
      expect(grid.shadowRoot.activeElement).to.equal(tabbableElements[2]);

      listenOnce(grid.$.scroller, 'keydown', listener);
      shiftTab(); // To header cell
      expect(keydownEvent.defaultPrevented).to.be.true;
      expect(grid.shadowRoot.activeElement).to.equal(tabbableElements[1]);
    });

    it('should be possible to exit grid with tab', () => {
      const tabbableElements = getTabbableElements(grid.shadowRoot);
      tabbableElements[3].focus(); // Focus footer cell

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
      tabbableElements[1].focus(); // Focus header cell

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

    it('should be possible to enter grid with tab', () => {
      const tabbableElements = getTabbableElements(grid.shadowRoot);

      // Focusin on table element — same as tab from above the grid
      focusin(tabbableElements[0], focusable);

      // Expect programmatic focus on header cell
      expect(grid.shadowRoot.activeElement).to.equal(tabbableElements[1]);
    });

    it('should be possible to enter grid with shift+tab', () => {
      const tabbableElements = getTabbableElements(grid.shadowRoot);

      // Focusin on focusexit element — same as shift+tab from below the grid
      focusin(tabbableElements[4], focusable);

      // Expect programmatic focus on footer cell
      expect(grid.shadowRoot.activeElement).to.equal(tabbableElements[3]);
    });

    it('should not enter grid on table click', () => {
      const tabbableElements = getTabbableElements(grid.shadowRoot);

      // Click and focusin on table element
      mouseDown(tabbableElements[0]);
      focusin(tabbableElements[0], focusable);

      // Expect no focus on header cell
      expect(grid.shadowRoot.activeElement).to.be.null;
    });

    it('should set native focus to header on header cell click', () => {
      const tabbableElements = getTabbableElements(grid.shadowRoot);
      focusFirstHeaderCell();

      expect(grid.shadowRoot.activeElement).to.equal(tabbableElements[1]);
    });

    it('should set native focus to body on body cell click', () => {
      const tabbableElements = getTabbableElements(grid.shadowRoot);
      focusItem(0);
      clickItem(0);

      expect(grid.shadowRoot.activeElement).to.equal(tabbableElements[2]);
    });

    it('should set native focus to footer on footer cell click', () => {
      const tabbableElements = getTabbableElements(grid.shadowRoot);
      focusFirstFooterCell();

      expect(grid.shadowRoot.activeElement).to.equal(tabbableElements[3]);
    });

    it('should move header tabbable cell when navigating with keys', () => {
      tabToHeader();

      right();

      expect(getTabbableElements(header)[0]).to.equal(header.children[0].children[1]);
    });

    it('should move body tabbable cell when navigating with keys', () => {
      tabToBody();

      right();

      expect(getTabbableElements(body)[0]).to.equal(body.children[0].children[1]);
    });

    it('should move footer tabbable cell when navigating with keys', () => {
      shiftTabToFooter();

      right();

      expect(getTabbableElements(footer)[0]).to.equal(footer.children[0].children[1]);
    });
  });

  describe('navigating with keys', () => {
    it('should enable navigation mode on down', () => {
      focusItem(0);

      down();

      expect(grid.hasAttribute('navigating')).to.be.true;
    });

    it('should navigate on down when navigation mode is off', () => {
      focusItem(0);

      down();

      expect(getFocusedRowIndex(grid)).to.equal(1);
    });

    it('should enable navigation mode on up', () => {
      focusItem(0);

      up();

      expect(grid.hasAttribute('navigating')).to.be.true;
    });

    it('should navigate on up when navigation mode is off', () => {
      focusItem(1);

      up();

      expect(getFocusedRowIndex(grid)).to.equal(0);
    });

    it('should enable navigation mode on left', () => {
      focusItem(0);

      left();

      expect(grid.hasAttribute('navigating')).to.be.true;
    });

    it('should enable navigation mode on right', () => {
      focusItem(0);

      right();

      expect(grid.hasAttribute('navigating')).to.be.true;
    });

    ['rtl', 'ltr'].forEach((direction) => {
      describe(`navigation left / right in ${direction}`, () => {
        beforeEach(() => grid.setAttribute('dir', direction));

        it('should navigate on left when navigation mode is off', () => {
          getRows(body)[0].children[1].focus();

          left();

          expect(getFocusedCellIndex(grid)).to.equal(direction === 'rtl' ? 2 : 0);
        });

        it('should navigate on right when navigation mode is off', () => {
          getRows(body)[0].children[1].focus();

          right();

          expect(getFocusedCellIndex(grid)).to.equal(direction === 'rtl' ? 0 : 2);
        });
      });
    });

    it('should focus cell below with down', () => {
      focusItem(0);

      down();

      expect(getFocusedRowIndex(grid)).to.equal(1);
      expect(getFocusedCellIndex(grid)).to.equal(0);
    });

    it('should focus cell above with up', () => {
      focusItem(0);
      down();

      up();

      expect(getFocusedRowIndex(grid)).to.equal(0);
      expect(getFocusedCellIndex(grid)).to.equal(0);
    });

    it('should focus cell left with left', () => {
      focusItem(0);
      right();

      left();

      expect(getFocusedCellIndex(grid)).to.equal(0);
      expect(getFocusedRowIndex(grid)).to.equal(0);
    });

    it('should focus cell right with right', () => {
      focusItem(0);

      right();

      expect(getFocusedCellIndex(grid)).to.equal(1);
      expect(getFocusedRowIndex(grid)).to.equal(0);
    });

    describe('column _order support', () => {
      beforeEach(() => {
        grid._columnTree[0][0]._order = 100000000;
        grid._columnTree[0][1]._order = 200000000;
        grid._columnTree[0][2]._order = 1100000000;
      });

      it('should follow _order when navigating right', () => {
        focusItem(0);

        right();

        expect(getFocusedCellIndex(grid)).to.equal(1);
      });

      it('should follow _order when navigating left', () => {
        getRowCell(0, 2).focus();

        left();

        expect(getFocusedCellIndex(grid)).to.equal(1);
      });
    });

    describe('mixing keyboard and mouse', () => {
      it('should update column after mousedown on other cell', () => {
        // Focus cell in third column
        focusWithMouse(getRowCell(0, 2));

        down();

        expect(getFocusedCellIndex(grid)).to.equal(2);

        // Focus cell in first column
        focusWithMouse(getRowCell(0, 0));

        down();

        expect(getFocusedCellIndex(grid)).to.equal(0);
      });
    });

    describe('with hidden columns', () => {
      it('should skip over hidden column with right arrow', () => {
        grid._columnTree[0][1].hidden = true;
        flushGrid(grid);

        body.children[0].children[0].focus();

        right();

        expect(getFocusedCellIndex(grid)).to.equal(1);
        const columnFocusedCell = grid.shadowRoot.activeElement._column;
        expect(columnFocusedCell.hidden).to.be.false;
      });

      it('should skip over hidden column with left arrow', () => {
        grid._columnTree[0][1].hidden = true;
        body.children[0].children[0].focus();
        right();

        left();

        expect(getFocusedCellIndex(grid)).to.equal(0);
      });

      it('should not navigate to hidden column with left arrow', () => {
        grid._columnTree[0][0].hidden = true;
        flushGrid(grid);

        body.children[0].children[1].focus();

        left();

        expect(getFocusedCellIndex(grid)).to.equal(0);
        const columnFocusedCell = grid.shadowRoot.activeElement._column;
        expect(columnFocusedCell.hidden).to.be.false;
      });

      it('should not navigate to hidden column with right arrow', () => {
        grid._columnTree[0][2].hidden = true;
        body.children[0].children[0].focus();

        right();
        right();

        expect(getFocusedCellIndex(grid)).to.equal(1);
      });

      it('should not navigate to hidden column with home', () => {
        grid._columnTree[0][0].hidden = true;
        flushGrid(grid);

        body.children[0].children[1].focus();

        home();

        expect(getFocusedCellIndex(grid)).to.equal(0);
        const columnFocusedCell = grid.shadowRoot.activeElement._column;
        expect(columnFocusedCell.hidden).to.be.false;
      });

      it('should not navigate to hidden column with end', () => {
        grid._columnTree[0][2].hidden = true;
        flushGrid(grid);

        body.children[0].children[0].focus();

        end();

        expect(getFocusedCellIndex(grid)).to.equal(1);
        const columnFocusedCell = grid.shadowRoot.activeElement._column;
        expect(columnFocusedCell.hidden).to.be.false;
      });
    });

    describe('with row details', () => {
      beforeEach(() => {
        flushGrid(grid);
        grid.openItemDetails(grid.items[0]);

        tabToBody();
      });

      function findRowDetailsCell(scope) {
        return scope.querySelector('[part~="details-cell"]');
      }

      it('should not navigate to row details with right arrow', () => {
        right(); // Index 1
        right(); // Index 2

        right();
        expect(findRowDetailsCell(grid.shadowRoot.activeElement.parentNode)).to.not.equal(
          grid.shadowRoot.activeElement,
        );
        expect(getFocusedCellIndex(grid)).to.equal(2);
      });

      it('should not navigate to row details with end', () => {
        end();

        expect(getFocusedCellIndex(grid)).to.equal(2);
        expect(findRowDetailsCell(grid.shadowRoot.activeElement.parentNode)).to.not.equal(
          grid.shadowRoot.activeElement,
        );
      });

      it('should navigate to row details with down arrow', () => {
        down();

        expect(findRowDetailsCell(grid.shadowRoot.activeElement.parentNode)).to.equal(grid.shadowRoot.activeElement);
        expect(getFocusedRowIndex(grid)).to.equal(0);
      });

      it('should navigate from row details with down arrow', () => {
        down();

        down();

        expect(findRowDetailsCell(grid.shadowRoot.activeElement.parentNode)).to.not.equal(
          grid.shadowRoot.activeElement,
        );
        expect(getFocusedRowIndex(grid)).to.equal(1);
        expect(getFocusedCellIndex(grid)).to.equal(0);
      });

      it('should preserve the focused cell index while navigating through details', () => {
        right();
        down();

        down();

        expect(getFocusedRowIndex(grid)).to.equal(1);
        expect(getFocusedCellIndex(grid)).to.equal(1);
      });

      it('should not navigate right while in details', () => {
        down();

        right();
        down();

        expect(getFocusedRowIndex(grid)).to.equal(1);
        expect(getFocusedCellIndex(grid)).to.equal(0);
      });

      it('should not navigate to end while in details', () => {
        down();

        end();
        down();

        expect(getFocusedRowIndex(grid)).to.equal(1);
        expect(getFocusedCellIndex(grid)).to.equal(0);
      });

      it('should not navigate to home while in details', () => {
        right();
        down();

        home();
        down();

        expect(getFocusedRowIndex(grid)).to.equal(1);
        expect(getFocusedCellIndex(grid)).to.equal(1);
      });

      it('should navigate to row details with arrow up', () => {
        down();
        down();

        up();

        expect(findRowDetailsCell(grid.shadowRoot.activeElement.parentNode)).to.equal(grid.shadowRoot.activeElement);
        expect(getFocusedRowIndex(grid)).to.equal(0);
        expect(getFocusedCellIndex(grid)).to.not.equal(0);
      });

      it('should navigate from row details with arrow up', () => {
        down();
        down();
        up();

        up();

        expect(findRowDetailsCell(grid.shadowRoot.activeElement.parentNode)).to.not.equal(
          grid.shadowRoot.activeElement,
        );
        expect(getFocusedRowIndex(grid)).to.equal(0);
        expect(getFocusedCellIndex(grid)).to.equal(0);
      });

      it('should set focused cell when tapping on details cell', () => {
        const rowDetailsCell = findRowDetailsCell(body.children[0]);
        focusWithMouse(rowDetailsCell, rowDetailsCell._content);

        expect(findRowDetailsCell(grid.shadowRoot.activeElement.parentNode)).to.equal(grid.shadowRoot.activeElement);
      });

      it('should focus on the first element inside details with enter', async () => {
        down();

        await nextFrame();

        const input = getCellContent(grid.shadowRoot.activeElement).children[0];
        const spy = sinon.spy(input, 'focus');
        enter();

        expect(spy.callCount).to.equal(1);
      });
    });

    it('should focus first cell with home', () => {
      focusItem(0);
      right();

      home();

      expect(getFocusedCellIndex(grid)).to.equal(0);
    });

    it('should focus first cell in the column with ctrl+home', () => {
      focusItem(0);
      // Move the focus to the second column
      right();

      ctrlHome();

      expect(getFocusedCellIndex(grid)).to.equal(1);
      expect(getFocusedRowIndex(grid)).to.equal(0);
    });

    it('should focus last cell with end', () => {
      focusItem(0);

      end();

      expect(getFocusedCellIndex(grid)).to.equal(2);
    });

    it('should focus last cell in the column with ctrl+end', () => {
      focusItem(0);

      ctrlEnd();

      expect(getFocusedCellIndex(grid)).to.equal(0);
      expect(getFocusedRowIndex(grid)).to.equal(1);
    });

    it('should focus to last row element after scrolling to end', () => {
      grid.items = undefined;
      grid.size = 200;
      grid.dataProvider = infiniteDataProvider;
      flushGrid(grid);

      focusItem(0);

      ctrlEnd();

      expect(grid.shadowRoot.activeElement.parentNode.index).to.equal(grid.size - 1);
    });

    describe('horizontal scrolling', () => {
      beforeEach(() => {
        grid.style.width = '100px'; // Column default min width is 100px
      });

      it('should scroll cells visible with right arrow on header', () => {
        focusFirstHeaderCell();
        down();

        right();

        expect(grid.$.table.scrollLeft).to.be.at.least(100);
      });

      it('should scroll cells visible with right arrow on body', () => {
        focusItem(0);
        down();

        right();

        expect(grid.$.table.scrollLeft).to.be.at.least(100);
      });

      it('should scroll cells visible with right arrow on footer', () => {
        focusFirstFooterCell();
        down();

        right();

        expect(grid.$.table.scrollLeft).to.be.at.least(100);
      });

      it('should scroll cells visible with left arrow on header', () => {
        focusFirstHeaderCell();
        down();
        right();

        flushGrid(grid);
        left();

        expect(grid.$.table.scrollLeft).to.equal(0);
      });

      it('should scroll cells visible with left arrow on body', () => {
        focusItem(0);
        down();
        right();

        flushGrid(grid);
        left();

        expect(grid.$.table.scrollLeft).to.equal(0);
      });

      it('should scroll cells visible with home', () => {
        focusItem(0);
        grid.$.table.scrollLeft = 999999999;

        flushGrid(grid);
        home();

        expect(grid.$.table.scrollLeft).to.equal(0);
      });

      it('should scroll cells visible with end', async () => {
        await nextFrame();

        focusItem(0);
        await nextFrame();

        end();
        await nextFrame();

        flushGrid(grid);

        // Force reflow to workaround a Safari rendering issue
        if (isDesktopSafari) {
          grid.style.display = 'flex';
          await nextFrame();
          grid.style.display = '';
        }

        expect(grid.$.table.scrollLeft).to.equal(grid.$.table.scrollWidth - grid.$.table.offsetWidth);
      });

      it('should scroll cell visible under from frozen cells with left arrow', async () => {
        const scrollbarWidth = grid.$.table.offsetWidth - grid.$.table.clientWidth;
        grid.style.width = `${200 + scrollbarWidth}px`; // Column default min width is 100px
        grid.style.border = 'none';
        grid._columnTree[0][0].frozen = true;

        focusItem(0);
        right();
        right();
        await aTimeout(0);
        left();
        expect(grid.$.table.scrollLeft).to.equal(0);
      });

      it('should scroll cell visible under from frozen to end cells with right arrow', async () => {
        const scrollbarWidth = grid.$.table.offsetWidth - grid.$.table.clientWidth;
        grid.style.width = `${200 + scrollbarWidth}px`; // Column default min width is 100px
        grid.style.border = 'none';
        grid._columnTree[0][2].frozenToEnd = true;
        await aTimeout(0);

        getRowCell(0, 2).focus();
        left();
        left();
        await aTimeout(0);
        right();
        expect(grid.$.table.scrollLeft).to.equal(grid.$.table.scrollWidth - grid.$.table.offsetWidth);
      });

      it('should scroll cells visible with left arrow on footer', async () => {
        focusFirstFooterCell();
        down();
        right();
        await nextFrame();
        left();
        expect(grid.$.table.scrollLeft).to.equal(0);
      });

      it('should not scroll to the start when tabbed from header to body', () => {
        tabToHeader();
        end();
        tab();
        expect(grid.$.table.scrollLeft).to.be.at.least(100);
      });

      it('should not scroll to the start when shift-tabbed from footer to body', () => {
        shiftTabToFooter();
        end();
        shiftTab();
        expect(grid.$.table.scrollLeft).to.be.at.least(100);
      });

      it('should not scroll to the start when tabbed from body to footer', () => {
        tabToBody();
        end();
        tab();
        expect(grid.$.table.scrollLeft).to.be.at.least(100);
      });

      it('should not scroll to the start when shift-tabbed from body to header', () => {
        tabToBody();
        end();
        shiftTab();
        expect(grid.$.table.scrollLeft).to.be.at.least(100);
      });

      it('should not throw when focusing a group header cell', () => {
        // Wrap the columns in a group
        const group = document.createElement('vaadin-grid-column-group');
        group.append(...grid.querySelectorAll('vaadin-grid-column'));
        group.header = 'group';
        grid.appendChild(group);
        flushGrid(grid);

        // Move focused header cell to the group header row
        tabToBody();
        shiftTab();
        up();

        // Tab to body
        tab();

        // Tab back to header
        shiftTab();
      });
    });

    describe('vertical scrolling', () => {
      beforeEach(async () => {
        grid.items = undefined;
        grid.size = 200;
        grid.dataProvider = infiniteDataProvider;
        grid.scrollToIndex(0);
        flushGrid(grid);
        await nextFrame();
      });

      it('should scroll rows visible with up arrow', () => {
        focusItem(0);
        grid.scrollToIndex(100);

        up();

        expect(grid.$.table.scrollTop).to.equal(0);
      });

      it('should scroll half visible rows fully visible with up arrow', () => {
        focusItem(0);
        grid.$.table.scrollTop = 20;

        up();

        expect(grid.$.table.scrollTop).to.equal(0);
      });

      it('should scroll rows visible with down arrow', () => {
        focusItem(getLastVisibleItem(grid).index);

        down();
        flushGrid(grid);

        expect(grid.$.table.scrollTop).to.be.above(0);
      });

      it('should scroll to the first row with ctrl+home', () => {
        focusItem(0);

        scrollToEnd(grid);

        ctrlHome();
        expect(grid.$.table.scrollTop).to.equal(0);
      });

      it('should scroll to the last row with ctrl+end', () => {
        focusItem(0);

        ctrlEnd();

        expect(grid.$.table.scrollTop).to.equal(grid.$.table.scrollHeight - grid.$.table.clientHeight);
      });

      it('should scroll down one page with page down', () => {
        focusItem(0);
        const previousLastVisibleIndex = getLastVisibleItem(grid).index;

        pageDown();

        expect(getLastVisibleItem(grid).index).to.be.gt(1); // Sanity check
        expect(getFocusedRowIndex(grid)).to.equal(previousLastVisibleIndex - 1);
      });

      it('should previous focused item be first visible item after third page down', () => {
        focusItem(0);
        pageDown();
        pageDown();

        const previousLastIndex = getFocusedRowIndex(grid);
        pageDown();

        expect(getFirstVisibleItem(grid).index).to.equal(previousLastIndex);
      });

      it('should scroll up one page with page up', async () => {
        focusItem(0);
        pageDown();

        await aTimeout(0);
        pageUp();

        expect(getFocusedRowIndex(grid)).to.equal(0);
      });

      it('should scroll the focused item visible when focus is set to body', async () => {
        scrollToEnd(grid);
        await nextFrame();

        tabToHeader();
        tab();
        tabToBody();

        flushGrid(grid);

        expect(grid.$.table.scrollTop).to.equal(0);
      });

      it('should have the right cell focused after size change', () => {
        scrollToEnd(grid);
        getCell(grid, 0).focus();
        up();
        flushGrid(grid);

        const focusedRowIndexBefore = getFocusedRowIndex(grid);

        grid.size *= 2;

        const focusedRowIndexAfter = getFocusedRowIndex(grid);
        expect(focusedRowIndexBefore).to.equal(focusedRowIndexAfter);
      });

      it('should not focus a cell on size change if the focus is outside the body', () => {
        getContainerCell(grid.$.header, 0, 0).focus();
        up();

        grid.size *= 2;
        expect(grid.shadowRoot.activeElement).to.equal(getContainerCell(grid.$.header, 0, 0));
      });

      it('should not scroll if the new focused item in viewport', () => {
        focusItem(0);
        ctrlEnd();
        const scrollTop = grid.$.table.scrollTop;
        up();
        expect(grid.$.table.scrollTop).to.equal(scrollTop);
      });
    });

    describe('scrolling and navigating', () => {
      beforeEach(() => {
        grid.items = undefined;
        grid.size = 200;
        grid.dataProvider = infiniteDataProvider;
        flushGrid(grid);
      });

      it('should hide navigation mode when a focused row goes off screen', () => {
        focusItem(0);
        right();

        expect(grid.hasAttribute('navigating')).to.be.true;

        grid.scrollToIndex(100);
        flushGrid(grid);

        expect(grid.hasAttribute('navigating')).to.be.false;
      });

      it('should reveal navigation mode when a focused row is back on screen', () => {
        focusItem(0);
        right();
        grid.scrollToIndex(100);
        flushGrid(grid);

        grid.scrollToIndex(0);
        flushGrid(grid);

        expect(grid.hasAttribute('navigating')).to.be.true;
      });

      it('should not hide navigation mode if a header cell is focused', () => {
        tabToHeader();
        right();

        expect(grid.hasAttribute('navigating')).to.be.true;

        grid.scrollToIndex(100);
        flushGrid(grid);

        expect(grid.hasAttribute('navigating')).to.be.true;
      });

      it('should scroll focused row into view on arrow key', () => {
        focusItem(0);
        // Simulate real scrolling to get the virtualizer to render
        // the focused item in a different element.
        grid.$.table.scrollTop = grid.$.table.scrollHeight / 2;
        flushGrid(grid);
        down();
        expect(getFocusedRowIndex(grid)).to.equal(1);
        expect(getFocusedCellIndex(grid)).to.equal(0);
      });

      it('should scroll focused row into view on Tab', () => {
        focusItem(0);
        tabToHeader();
        // Simulate real scrolling to get the virtualizer to render
        // the focused item in a different element.
        grid.$.table.scrollTop = grid.$.table.scrollHeight / 2;
        flushGrid(grid);
        tab();
        expect(getFocusedRowIndex(grid)).to.equal(0);
        expect(getFocusedCellIndex(grid)).to.equal(0);
      });
    });
  });

  describe('activating items', () => {
    it('should activate on space keydown', () => {
      tabToBody();

      spaceDown();

      expect(grid.activeItem).to.equal('foo');
    });

    it('should activate item another on space keydown', () => {
      focusItem(0);
      clickItem(0);

      down();
      spaceDown();

      expect(grid.activeItem).to.equal('bar');
    });

    it('should deactivate item on space keydown', () => {
      focusItem(0);
      clickItem(0); // Activates first item on click

      spaceDown();

      expect(grid.activeItem).to.be.null;
    });

    it('should be null by default', () => {
      expect(grid.activeItem).to.be.null;
    });

    it('should activate on click', () => {
      clickItem(0);

      expect(grid.activeItem).to.equal('foo');
    });

    it('should activate another on click', () => {
      clickItem(0);

      clickItem(1);

      expect(grid.activeItem).to.equal('bar');
    });

    it('should deactivate on click', () => {
      clickItem(0);

      clickItem(0);

      expect(grid.activeItem).to.be.null;
    });

    it('should activate when clicking on non-focusable child', () => {
      const span = getCellContent(getRowCell(0, 2)).children[0];
      // Normally non-focusables like span should not focus, but in MSIE they can
      span.focus();
      span.click();

      expect(grid.activeItem).to.equal('foo');
    });

    it('should not activate when clicking on a native input', () => {
      const input = focusFirstBodyInput(0);
      input.click();

      expect(grid.activeItem).to.be.null;
    });

    it('should not activate on space keydown click on a native input', () => {
      const input = focusFirstBodyInput(0);
      escape(input);
      spaceDown();

      expect(grid.activeItem).to.be.null;
    });

    it('should not deactivate on space keydown in non-body row', () => {
      clickItem(0);

      tabToHeader();
      spaceDown();

      expect(grid.activeItem).to.equal('foo');
    });

    it('should not deactivate on click in non-body row', () => {
      clickItem(0);

      focusFirstHeaderCell();

      expect(grid.activeItem).to.equal('foo');
    });

    it('should toggle when equaling item is clicked', () => {
      grid.itemIdPath = 'name';
      grid.items = [{ name: 'foo' }, { name: 'bar' }];
      grid.activeItem = { name: 'foo' };
      clickItem(0);

      expect(grid.activeItem).to.be.null;
    });

    describe('space click shortcut', () => {
      beforeEach(() => {
        header.children[0].children[1].focus();
        right();
      });

      it('should dispatch click event on first cell child on space keyup', () => {
        const firstChild = getCellContent(header.children[0].children[2]).children[0];
        const dispatchEventStub = sinon.stub(firstChild, 'dispatchEvent');

        spaceDown();
        expect(dispatchEventStub.called).to.be.false;

        spaceUp();
        expect(dispatchEventStub.called).to.be.true;
        expect(dispatchEventStub.args[0][0] instanceof MouseEvent).to.be.true;
        expect(dispatchEventStub.args[0][0].type).to.equal('click');
      });

      it('should not dispatch click event on other cell children on space keyup', () => {
        const secondChild = getCellContent(header.children[0].children[2]).children[1];
        const dispatchEventStub = sinon.stub(secondChild, 'dispatchEvent');

        spaceDown();
        spaceUp();

        expect(dispatchEventStub.called).to.be.false;
      });

      it('should prevent default keydown action when clicking on space', () => {
        const event = keyboardEventFor('keydown', 32, [], ' ');

        grid.dispatchEvent(event);

        expect(event.defaultPrevented).to.be.true;
      });

      it('should not activate if synthetic click has default prevented', () => {
        const firstBodyRowFirstChild = getCellContent(getRows(body)[0].children[2]).children[0];

        const spy = sinon.spy();
        listenOnce(firstBodyRowFirstChild, 'click', (e) => {
          spy();
          e.preventDefault();
        });

        // Navigate to body, row 1, column 3
        tabToBody();
        right();
        right();

        spaceDown();
        spaceUp();

        expect(spy.called).to.be.true;
        expect(grid.activeItem).to.be.null;
      });

      it('should allow toggling a checkbox with space keypress', async () => {
        // Add a selection column
        grid.appendChild(document.createElement('vaadin-grid-selection-column'));
        await nextFrame();
        flushGrid(grid);

        // Get a reference to a checkbox, focus it and hit space
        const vaadinCheckbox = getCellContent(getRowCell(0, 3)).children[0];
        vaadinCheckbox.focus();
        await sendKeys({ press: 'Space' });

        expect(vaadinCheckbox.checked).to.be.true;
      });
    });
  });

  describe('keyboard focus', () => {
    it('should have focused first cell in header by default', () => {
      expect(grid.shadowRoot.activeElement).to.be.null;

      tabToHeader();

      expect(grid.shadowRoot.activeElement).to.equal(header.children[0].children[0]);
    });

    it('should have focused first cell in body by default', () => {
      expect(grid.shadowRoot.activeElement).to.be.null;

      tabToBody();

      expect(grid.shadowRoot.activeElement).to.equal(body.children[0].children[0]);
    });

    it('should have focused first cell in footer by default', () => {
      expect(grid.shadowRoot.activeElement).to.be.null;

      shiftTabToFooter();

      expect(grid.shadowRoot.activeElement).to.equal(footer.children[0].children[0]);
    });

    it('should not throw an error when switching focus between body and header', () => {
      expect(() => {
        focusItem(1);
        clickItem(1);
        getRowCells(getRows(grid.$.header)[0])[0].focus();
        getRowCells(getRows(grid.$.header)[0])[0].click();
        focusItem(0);
        clickItem(0);
      }).to.not.throw(Error);
    });
  });

  describe('focused-cell part', () => {
    beforeEach(() => {
      grid.items = undefined;
      grid.size = 200;
      grid.dataProvider = infiniteDataProvider;
      flushGrid(grid);
    });

    it('should add the part to cell when focused', () => {
      focusItem(5);
      const cell = getPhysicalItems(grid)[5].firstChild;
      expect(cell.getAttribute('part')).to.contain('focused-cell');
    });

    it('should remove the part from cell when blurred', () => {
      focusItem(5);
      focusable.focus();
      const cell = getPhysicalItems(grid)[5].firstChild;
      expect(cell.getAttribute('part')).to.not.contain('focused-cell');
    });

    it('should keep the part when focused item is scrolled but still visible', () => {
      focusItem(5);
      grid.scrollToIndex(2);
      flushGrid(grid);
      const cell = getPhysicalItems(grid)[5].firstChild;
      expect(cell.getAttribute('part')).to.contain('focused-cell');
    });

    it('should remove the part when focused item is scrolled out of view', () => {
      focusItem(5);
      grid.scrollToIndex(100);
      flushGrid(grid);
      expect(grid.$.items.querySelector(':not([hidden]) [part~="focused-cell"')).to.be.null;
    });

    it('should restore the part when focused item is scrolled back to view', () => {
      focusItem(5);
      grid.scrollToIndex(100);
      flushGrid(grid);

      // Simulate real scrolling to get the virtualizer to render
      // the focused item in a different element.
      grid.$.table.scrollTop = 0;
      flushGrid(grid);

      const cell = getPhysicalItems(grid)[5].firstChild;
      expect(cell.getAttribute('part')).to.contain('focused-cell');
    });

    it('should not add the part to any element when focused item is scrolled back to view - row focus mode', () => {
      focusItem(5);
      left();
      grid.scrollToIndex(100);
      flushGrid(grid);
      grid.scrollToIndex(0);
      flushGrid(grid);
      expect(grid.$.items.querySelector(':not([hidden]) [part~="focused-cell"')).to.be.null;
    });

    it('should not remove the part from header cell when scrolling items', () => {
      focusFirstHeaderCell();
      grid.scrollToIndex(100);
      flushGrid(grid);
      expect(getFirstHeaderCell().getAttribute('part')).to.contain('focused-cell');

      grid.scrollToIndex(0);
      flushGrid(grid);
      expect(getFirstHeaderCell().getAttribute('part')).to.contain('focused-cell');
    });
  });

  describe('focus events on cell content', () => {
    it('should dispatch cell-focus on keyboard navigation', () => {
      const expectedContext = {
        column: grid.querySelector('vaadin-grid-column'),
        detailsOpened: false,
        expanded: false,
        index: 0,
        item: 'foo',
        level: 0,
        section: 'body',
        selected: false,
      };

      tabToBody();
      right();

      const spy = sinon.spy();

      grid.addEventListener('cell-focus', spy);

      left();

      expect(spy.calledOnce).to.be.true;

      const e = spy.firstCall.args[0];

      expect(e.detail.context).to.be.deep.equal(expectedContext);

      grid.removeEventListener('cell-focus', spy);
    });

    // Separate test suite for Chrome, where we use a workaround to dispatch
    // cell-focus on mouse up
    (isChrome ? describe : describe.skip)('chrome', () => {
      it('should dispatch cell-focus on mouse up on cell content', () => {
        const spy = sinon.spy();
        grid.addEventListener('cell-focus', spy);

        // Mouse down and release on cell content element
        const cell = getRowFirstCell(0);
        mouseDown(cell._content);
        mouseUp(cell._content);
        expect(spy.calledOnce).to.be.true;
      });

      it('should dispatch cell-focus on mouse up on cell content when grid is in shadow DOM', () => {
        const spy = sinon.spy();
        grid.addEventListener('cell-focus', spy);

        // Move grid into a shadow DOM
        const container = document.createElement('div');
        document.body.appendChild(container);
        container.attachShadow({ mode: 'open' });
        container.shadowRoot.appendChild(grid);

        // Mouse down and release on cell content element
        const cell = getRowFirstCell(0);
        mouseDown(cell._content);
        mouseUp(cell._content);
        expect(spy.calledOnce).to.be.true;
      });

      it('should dispatch cell-focus on mouse up within cell content', () => {
        const spy = sinon.spy();
        grid.addEventListener('cell-focus', spy);

        // Mouse down and release on cell content child
        const cell = getRowFirstCell(0);
        const contentSpan = document.createElement('span');
        cell._content.appendChild(contentSpan);

        mouseDown(contentSpan);
        mouseUp(contentSpan);
        expect(spy.calledOnce).to.be.true;
      });

      // Regression test for https://github.com/vaadin/flow-components/issues/2863
      it('should not dispatch cell-focus on mouse up outside of cell', () => {
        const spy = sinon.spy();
        grid.addEventListener('cell-focus', spy);

        mouseDown(getRowFirstCell(0)._content);
        mouseUp(document.body);
        expect(spy.calledOnce).to.be.false;
      });
    });
  });
});

describe('keyboard navigation on column groups', () => {
  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column-group header="main group header" footer="main group footer">
          <vaadin-grid-column-group header="sub group header">
            <vaadin-grid-column header="column header" footer="column footer"></vaadin-grid-column>
          </vaadin-grid-column-group>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);

    grid.querySelectorAll('[footer]').forEach((col) => {
      col.footerRenderer = attributeRenderer('footer');
    });

    grid.querySelector('vaadin-grid-column').renderer = indexItemRenderer;

    grid.items = ['foo', 'bar'];
    flushGrid(grid);
    await nextFrame();
  });

  it('should focus first header row first', () => {
    tabToHeader();

    expect(grid.$.header.contains(grid.shadowRoot.activeElement)).to.be.true;
    expect(getFocusedRowIndex(grid)).to.equal(0);
  });

  it('should focus header cell below with arrow down', () => {
    tabToHeader();

    down();

    expect(grid.$.header.contains(grid.shadowRoot.activeElement)).to.be.true;
    expect(getFocusedRowIndex(grid)).to.equal(1);
  });

  it('should focus header cell above with arrow up', () => {
    tabToHeader();

    down();
    up();

    expect(getFocusedRowIndex(grid)).to.equal(0);
  });

  it('should focus first footer cell first', () => {
    shiftTabToFooter();

    expect(grid.$.footer.contains(grid.shadowRoot.activeElement)).to.be.true;
    expect(getFocusedRowIndex(grid)).to.equal(0);
  });

  it('should focus footer cell below with arrow down', () => {
    shiftTabToFooter();

    down();

    expect(grid.$.footer.contains(grid.shadowRoot.activeElement)).to.be.true;
    // Second how is hidden because of missing renderers.
    // Should skip to the third one, index 2.
    expect(getFocusedRowIndex(grid)).to.equal(2);
  });

  it('should focus footer cell above with arrow up', () => {
    shiftTabToFooter();

    down();
    up();

    expect(getFocusedRowIndex(grid)).to.equal(0);
  });

  it('should not scroll body on header pagedown', () => {
    grid.items = Array.from({ length: 1000 }, (_, i) => String(i));

    // Focus a body cell
    tabToBody();

    // Scroll down
    pageDown();
    pageDown();

    const firstVisibleIndex = getFirstVisibleItem(grid).index;
    expect(firstVisibleIndex).to.be.above(5);

    // Tab to header
    tabToHeader();

    pageDown();

    expect(getFirstVisibleItem(grid).index).to.equal(firstVisibleIndex);
  });

  describe('updating tabbable cells', () => {
    describe('header', () => {
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

      it('should update tabbable header cell on header row hide', async () => {
        const initialTabbableHeaderCell = getTabbableCells(header)[0];

        // Hide the first header row
        mainGroup.header = null;
        await nextFrame();

        const tabbableHeaderCell = getTabbableCells(header)[0];
        expect(tabbableHeaderCell.offsetHeight).not.to.equal(0);
        expect(tabbableHeaderCell).not.to.equal(initialTabbableHeaderCell);
      });

      it('should have no tabbable header cells when header is hidden', async () => {
        // Hide all header rows
        mainGroup.header = null;
        subGroup.header = null;
        column.header = null;
        await nextFrame();

        const tabbableHeaderCell = getTabbableCells(header)[0];
        expect(tabbableHeaderCell).not.to.be.ok;
      });

      it('should update tabbable header cell on header row unhide', async () => {
        // Hide all header rows
        mainGroup.header = null;
        subGroup.header = null;
        column.header = null;
        await nextFrame();

        column.header = 'column';
        await nextFrame();

        const tabbableHeaderCell = getTabbableCells(header)[0];
        expect(tabbableHeaderCell.offsetHeight).not.to.equal(0);
      });
    });

    describe('body', () => {
      let body;

      beforeEach(() => {
        body = grid.$.items;
      });

      it('should update tabbable body cell on body row hide', async () => {
        // Focus the second body row / make it tabbable
        tabToBody();
        down();

        // Hide the second body row
        grid.items = [grid.items[0]];

        await nextFrame();

        // Expect the tabbable body cell to be on the first row
        const tabbableBodyCell = getTabbableCells(body)[0];
        expect(tabbableBodyCell.parentElement.index).to.equal(0);
        expect(tabbableBodyCell.offsetHeight).not.to.equal(0);
      });

      it('should have no tabbable body cell when there are no rows', () => {
        // Remove all body rows
        grid.items = [];

        const tabbableBodyCell = getTabbableCells(body)[0];
        expect(tabbableBodyCell).not.to.be.ok;
      });

      it('should update tabbable body cell on body row unhide', async () => {
        // Remove all body rows
        grid.items = [];
        await nextFrame();

        grid.items = ['foo', 'bar'];
        await nextFrame();

        const tabbableBodyCell = getTabbableCells(body)[0];
        expect(tabbableBodyCell.parentElement.index).to.equal(0);
        expect(tabbableBodyCell.offsetHeight).not.to.equal(0);
      });

      it('should remain on the first column after a tabbable cell row is hidden', async () => {
        // Add a second column
        const column = document.createElement('vaadin-grid-column');
        grid.appendChild(column);
        await nextFrame();

        // Focus the second cell on the second row
        tabToBody();
        right();
        down();

        // Hide the second body row
        grid.items = [grid.items[0]];

        // Focus the first row (should focus the first cell)
        tabToBody();
        // Hit down
        down();

        // Expect the focus to be on the first column
        expect(getFocusedCellIndex(grid)).to.equal(0);
      });

      it('should tab to body after reducing rows', async () => {
        // Focus a cell on the second row
        tabToBody();
        down();

        // Hide the second body row
        grid.items = [grid.items[0]];

        // Navigate from header to body with tab
        tabToHeader();
        await sendKeys({ press: 'Tab' });

        // Expect the focus to be in the body
        expect(body.contains(grid.shadowRoot.activeElement)).to.be.true;
      });
    });
  });
});

describe('empty grid', () => {
  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column header="header"></vaadin-grid-column>
      </vaadin-grid>
    `);
    flushGrid(grid);
  });

  it('should be possible to exit an empty grid with tab', () => {
    flushGrid(grid);

    tabToHeader();
    tab();

    // Expect programmatic focus on focus exit element
    expect(grid.shadowRoot.activeElement).to.equal(grid.$.focusexit);
  });

  it('should not throw on Shift + Tab when grid has tabindex', () => {
    grid.setAttribute('tabindex', '0');

    grid.focus();

    expect(() => {
      shiftTab(grid);
    }).to.not.throw(Error);
  });
});

describe('hierarchical data', () => {
  // Let's use a count that equals the pageSize so we can ignore page + pageSize in the data provider
  const itemsOnEachLevel = 50;

  function hierarchicalDataProvider({ parentItem }, callback) {
    const items = [...Array(itemsOnEachLevel).keys()].map((i) => {
      return {
        name: `${parentItem ? `${parentItem.name}-` : ''}${i}`,
        children: true,
      };
    });

    callback(items, itemsOnEachLevel);
  }

  function getItemForIndex(index) {
    const { item } = grid._dataProviderController.getFlatIndexContext(index);
    return item;
  }

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-tree-column path="name"></vaadin-grid-tree-column>
      </vaadin-grid>
    `);

    grid.dataProvider = hierarchicalDataProvider;
    flushGrid(grid);
  });

  it('should not change focused cell on expand', async () => {
    // Focus the first cell/row
    focusItem(0);
    // Press ctrl+end to move the focus to the last cell/row
    ctrlEnd();
    expect(grid.shadowRoot.activeElement.parentNode.index).to.equal(itemsOnEachLevel - 1);
    // Press space to expand the row
    await sendKeys({ press: 'Space' });
    // Expect the focus to not have changed
    expect(grid.shadowRoot.activeElement.parentNode.index).to.equal(itemsOnEachLevel - 1);
  });

  it('should not change focused cell on expand - row focus mode', async () => {
    // Focus the first cell/row
    focusItem(0);
    // Press ctrl+end to move the focus to the last cell/row
    ctrlEnd();
    // Enter row focus mode
    left();
    expect(grid.shadowRoot.activeElement.index).to.equal(itemsOnEachLevel - 1);
    // Press ArrowRight to expand the row
    await sendKeys({ press: 'ArrowRight' });
    // Expect the focus to not have changed
    expect(grid.shadowRoot.activeElement.index).to.equal(itemsOnEachLevel - 1);
  });

  it('should previous focused item be first visible item after second page down on expanded tree', () => {
    grid.expandItem(getItemForIndex(0));
    focusItem(0);

    pageDown();
    const previousLastIndex = getFocusedRowIndex(grid);
    pageDown();

    expect(getFirstVisibleItem(grid).index).to.equal(previousLastIndex);
  });
});

describe('lazy data provider', () => {
  let dataProviderCallbacks;
  let cellFocusSpy;

  function flushDataProvider() {
    dataProviderCallbacks.forEach((cb) => cb());
    dataProviderCallbacks = [];
  }

  function lazyDataProvider({ page, pageSize }, callback) {
    const items = [...Array(pageSize).keys()].map((i) => {
      return {
        name: `name-${page * pageSize + i}`,
      };
    });

    dataProviderCallbacks.push(() => callback(items, 1000));
  }

  beforeEach(() => {
    dataProviderCallbacks = [];
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column path="name"></vaadin-grid-column>
      </vaadin-grid>
    `);
    cellFocusSpy = sinon.spy();
    grid.addEventListener('cell-focus', cellFocusSpy);

    grid.dataProvider = lazyDataProvider;
    flushGrid(grid);
    flushDataProvider();
    focusFirstBodyCell();
    cellFocusSpy.resetHistory();
  });

  it('should dispatch cell-focused event for lazily loaded item', async () => {
    const expectedContext = {
      column: grid.querySelector('vaadin-grid-column'),
      detailsOpened: false,
      expanded: false,
      index: 999,
      item: { name: 'name-999' },
      level: 0,
      section: 'body',
      selected: false,
    };

    // Keyboard navigate to the last row cell
    ctrlEnd();

    flushDataProvider();
    await nextFrame();

    expect(cellFocusSpy.calledOnce).to.be.true;
    const e = cellFocusSpy.firstCall.args[0];
    expect(e.detail.context).to.be.deep.equal(expectedContext);
  });

  it('should not dispatch cell-focused event on scroll', async () => {
    grid.scrollToIndex(Infinity);

    flushDataProvider();
    await nextFrame();

    expect(cellFocusSpy.called).to.be.false;
  });

  it('should not dispatch an additional cell-focused event when navigating in body', async () => {
    // Keyboard navigate to the last row cell
    ctrlEnd();
    // Keyboard navigate back to the first row cell
    ctrlHome();

    flushDataProvider();
    await nextFrame();

    expect(cellFocusSpy.calledOnce).to.be.true;
    const e = cellFocusSpy.firstCall.args[0];
    expect(e.detail.context.item).to.be.deep.equal({ name: 'name-0' });
  });

  it('should not dispatch an additional cell-focused event when navigating to head', async () => {
    // Keyboard navigate to the last row cell
    ctrlEnd();
    // Keyboard navigate to header
    shiftTab();

    flushDataProvider();
    await nextFrame();

    expect(cellFocusSpy.calledOnce).to.be.true;
    const e = cellFocusSpy.firstCall.args[0];
    expect(e.detail.context.section).to.be.equal('header');
  });

  it('should not dispatch an additional cell-focused event when navigating back from head', async () => {
    // Scroll half way down to get grid in loading state
    grid.scrollToIndex(500);
    down();

    // Keyboard navigate to header
    shiftTab();
    flushDataProvider();
    // Keyboard navigate back to body
    tab();
    cellFocusSpy.resetHistory();
    // Scroll to bottom
    grid.scrollToIndex(Infinity);

    flushDataProvider();
    await nextFrame();
    expect(cellFocusSpy.called).to.be.false;
  });

  it('should not dispatch a cell-focus event when grid has no focus', () => {
    // Keyboard navigate to the last row cell
    ctrlEnd();
    // Blur grid
    focusable = fixtureSync('<input>');
    focusable.focus();

    cellFocusSpy.resetHistory();
    flushDataProvider();

    expect(cellFocusSpy.called).to.be.false;
  });
});

describe('empty state', () => {
  function getEmptyState() {
    return grid.querySelector('[slot="empty-state"]');
  }

  function getEmptyStateFocusables() {
    return [...getEmptyState().querySelectorAll('input')];
  }

  function getEmptyStateBody() {
    return grid.$.emptystatebody;
  }

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column path="name"></vaadin-grid-column>
        <div slot="empty-state">
          No items <input /> <input />
        </div>
      </vaadin-grid>
    `);
    await nextFrame();
  });

  it('should tab to empty state body', async () => {
    tabToHeader();
    tab();

    await nextFrame();
    expect(getEmptyStateBody().contains(grid.shadowRoot.activeElement)).to.be.true;
    expect(getEmptyStateBody().querySelector('td[part~="focused-cell"]')).to.be.ok;
  });

  it('should shift tab back to header from empty state body', () => {
    tabToHeader();
    tab();
    shiftTab();

    expect(grid.$.header.contains(grid.shadowRoot.activeElement)).to.be.true;
    expect(getEmptyStateBody().querySelector('td[part~="focused-cell"]')).to.be.null;
  });

  it('should enter interaction mode on empty state body', () => {
    tabToHeader();
    tab();
    enter();

    expect(grid.hasAttribute('interacting')).to.be.true;
  });

  it('should focus the first focusable element in empty state content', () => {
    tabToHeader();
    tab();
    enter();
    expect(document.activeElement).to.equal(getEmptyStateFocusables()[0]);
  });

  it('should tab to the next focusable element in empty state content', async () => {
    tabToHeader();
    tab();
    enter();
    await sendKeys({ press: 'Tab' });
    expect(document.activeElement).to.equal(getEmptyStateFocusables()[1]);
  });

  it('should exit interaction mode on escape on empty state content', () => {
    tabToHeader();
    tab();
    enter();
    escape(document.activeElement);
    expect(grid.hasAttribute('interacting')).to.be.false;
    expect(getEmptyStateBody().contains(grid.shadowRoot.activeElement)).to.be.true;
  });

  it('should not dispatch cell-focus event on empty state body', () => {
    tabToHeader();

    const spy = sinon.spy();
    grid.addEventListener('cell-focus', spy);
    tab();

    expect(spy.called).to.be.false;
  });
});
