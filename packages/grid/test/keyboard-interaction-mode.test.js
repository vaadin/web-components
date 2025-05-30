import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, keyDownOn, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './grid-test-styles.js';
import '../all-imports.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { flushGrid, getCellContent, getFocusedCellIndex, getFocusedRowIndex } from './helpers.js';

let grid, focusable;

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

function f2(target) {
  keyDownOn(target || grid.shadowRoot.activeElement, 113, [], 'F2');
}

function tabToHeader() {
  grid._headerFocusable.focus();
}

function shiftTabToFooter() {
  grid._footerFocusable.focus();
}

function indexItemRenderer(root, _, { item, index }) {
  root.textContent = `${index} ${item}`;
}

function inputRenderer(root) {
  root.innerHTML = '<input>';
}

describe('keyboard interaction mode', () => {
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

    grid.querySelector('#column-2').headerRenderer = inputRenderer;
    grid.querySelector('#column-2').renderer = inputRenderer;
    grid.querySelector('#column-2').footerRenderer = inputRenderer;

    flushGrid(grid);

    grid._observer.flush();
    flushGrid(grid);

    await aTimeout(0);

    grid.items = ['foo', 'bar'];

    focusItem(0);
    clickItem(0);

    focusable = document.createElement('input');
    focusable.setAttribute('id', 'focusable');
    grid.parentNode.appendChild(focusable);
  });

  it('should enter interaction mode with enter', () => {
    right();

    enter();

    expect(grid.hasAttribute('interacting')).to.be.true;
  });

  it('should exit interaction mode when blurred', () => {
    grid._setInteracting(true);

    focusable.focus();

    expect(grid.hasAttribute('interacting')).to.be.false;
  });

  it('should exit interaction mode when tabbed into', () => {
    grid._setInteracting(true);

    tabToHeader();

    expect(grid.hasAttribute('interacting')).to.be.false;
  });

  it('should exit interaction mode when shift-tabbed into', () => {
    grid._setInteracting(true);

    shiftTabToFooter();

    expect(grid.hasAttribute('interacting')).to.be.false;
  });

  it('should focus the first element when entering interaction mode with enter', () => {
    const cell = getRowCell(0, 1);
    const input = getCellContent(cell).children[0];
    const spy = sinon.spy(input, 'focus');

    right(); // Focus the cell with input.

    enter();

    expect(spy.callCount).to.equal(1);
    spy.restore();
  });

  it('should focus the first actually focusable element when entering interaction mode', () => {
    const content = getCellContent(getRowCell(0, 1));
    const contentElements = fixtureSync(`
      <div>
        <label for="disabled-input">Label</label>
        <input id="disabled-input" disabled style="width: 20px">
        <input style="visibility: hidden; width: 20px;">
        <div hidden>
          <input>
        </div>
        <input id="focusable" style="width: 20px">
      </div>
    `);
    content.textContent = '';
    content.append(...contentElements.childNodes);
    const focusable = content.querySelector('#focusable');

    right(); // Focus the cell with input.

    enter();

    expect(getDeepActiveElement()).to.equal(focusable);
  });

  it('should exit interaction mode from focused single-line input with enter', () => {
    const cell = getRowCell(0, 1);
    const input = getCellContent(cell).children[0];
    input.type = 'text';

    right(); // Focus the cell with input.
    enter();

    enter(input);

    expect(grid.hasAttribute('interacting')).to.be.false;
  });

  it('should not exit interaction mode from focused non-single-line input with enter', () => {
    const cell = getRowCell(0, 1);
    const input = getCellContent(cell).children[0];
    input.type = 'button';

    right(); // Focus the cell with input.
    enter();

    enter(input);

    expect(grid.hasAttribute('interacting')).to.be.true;
  });

  it('should focus the first element when entering interaction mode with f2', () => {
    const cell = getRowCell(0, 1);
    const input = getCellContent(cell).children[0];
    const spy = sinon.spy(input, 'focus');

    right(); // Focus the cell with input.

    f2();
    expect(spy.callCount).to.equal(1);
    spy.restore();
  });

  it('should focus the next input element when tabbing in interaction mode', async () => {
    // Focus first input
    right();
    enter();

    const nextInput = getCellInput(0, 2);

    await sendKeys({ press: 'Tab' });

    expect(document.activeElement).to.equal(nextInput);
  });

  it('should skip the grid focus target when tabbing in interaction mode', async () => {
    // Focus last input
    right();
    right();
    enter();

    const previousInput = getCellInput(0, 1);

    // Shift+Tab to previous input
    await sendKeys({ press: 'Shift+Tab' });

    expect(document.activeElement).to.equal(previousInput);
  });

  it('should move cell focus target when focusing the next input element in interaction mode', async () => {
    // Focus first input
    right();
    enter();

    const nextCell = getRowCell(0, 2);

    await sendKeys({ press: 'Tab' });

    expect(grid._itemsFocusable).to.equal(nextCell);
  });

  it('should focus the element with `focus-target` when entering interaction mode', () => {
    const cell = getRowCell(0, 1);
    const input = getCellContent(cell).children[0];
    const spy = sinon.spy(input, 'focus');
    const div = document.createElement('div');
    input.parentElement.insertBefore(div, input);
    input.setAttribute('focus-target', '');

    right(); // Focus the cell with input.

    enter();

    expect(spy.callCount).to.equal(1);

    input.removeAttribute('focus-target');
    input.parentElement.removeChild(div);
    spy.restore();
  });

  it('should not navigate with arrow up when in interaction mode', () => {
    const input = focusFirstBodyInput(1);

    up(input);
    escape(input);

    expect(getFocusedRowIndex(grid)).to.equal(1);
    expect(getFocusedCellIndex(grid)).to.equal(1);
  });

  it('should not navigate with arrow down when in interaction mode', () => {
    const input = focusFirstBodyInput(0);

    down(input);
    escape(input);

    expect(getFocusedRowIndex(grid)).to.equal(0);
    expect(getFocusedCellIndex(grid)).to.equal(1);
  });

  it('should not navigate with arrow left when in interaction mode', () => {
    right();
    const input = focusFirstBodyInput(0);

    left(input);
    escape(input);

    expect(getFocusedRowIndex(grid)).to.equal(0);
    expect(getFocusedCellIndex(grid)).to.equal(1);
  });

  it('should not navigate with arrow right when in interaction mode', () => {
    const input = focusFirstBodyInput(0);

    right(input);
    escape(input);

    expect(getFocusedRowIndex(grid)).to.equal(0);
    expect(getFocusedCellIndex(grid)).to.equal(1);
  });

  it('should not navigate with home when in interaction mode', () => {
    right();
    const input = focusFirstBodyInput(0);

    home(input);
    escape(input);

    expect(getFocusedRowIndex(grid)).to.equal(0);
    expect(getFocusedCellIndex(grid)).to.equal(1);
  });

  it('should not navigate with ctrl+home when in interaction mode', () => {
    right();
    const input = focusFirstBodyInput(0);

    ctrlHome(input);
    escape(input);

    expect(getFocusedRowIndex(grid)).to.equal(0);
    expect(getFocusedCellIndex(grid)).to.equal(1);
  });

  it('should not navigate with end when in interaction mode', () => {
    const input = focusFirstBodyInput(0);

    end(input);
    escape(input);

    expect(getFocusedRowIndex(grid)).to.equal(0);
    expect(getFocusedCellIndex(grid)).to.equal(1);
  });

  it('should not navigate with ctrl+end when in interaction mode', () => {
    const input = focusFirstBodyInput(0);

    ctrlEnd(input);
    escape(input);

    expect(getFocusedRowIndex(grid)).to.equal(0);
    expect(getFocusedCellIndex(grid)).to.equal(1);
  });

  it('should not navigate with page down when in interaction mode', () => {
    const input = focusFirstBodyInput(0);

    pageDown(input);
    escape(input);

    expect(getFocusedRowIndex(grid)).to.equal(0);
    expect(getFocusedCellIndex(grid)).to.equal(1);
  });

  it('should not navigate with page up when in interaction mode', () => {
    const input = focusFirstBodyInput(1);

    pageUp(input);
    escape(input);

    expect(getFocusedRowIndex(grid)).to.equal(1);
    expect(getFocusedCellIndex(grid)).to.equal(1);
  });

  it('should not activate on space keydown when in interaction mode', () => {
    grid.activeItem = null;
    const input = focusFirstBodyInput(0);

    spaceDown(input);

    expect(grid.activeItem).to.be.null;
  });

  it('should enter interaction mode with F2', () => {
    right();

    f2();

    expect(grid.hasAttribute('interacting')).to.be.true;
  });

  it('should exit interaction mode with F2', () => {
    const input = getCellContent(getRowCell(0, 1)).children[0];

    right();
    f2();

    f2(input);

    expect(grid.hasAttribute('interacting')).to.be.false;
  });

  it('should remove focus from cell when exiting interaction mode with F2', () => {
    const input = getCellContent(getRowCell(0, 1)).children[0];

    right();
    enter();

    f2(input);

    expect(document.activeElement).to.not.equal(input);
  });

  it('should exit interaction mode with escape', () => {
    grid._setInteracting(true);

    escape();

    expect(grid.hasAttribute('interacting')).to.be.false;
  });

  it('should remove focus from cell with escape', () => {
    const input = focusFirstBodyInput(0);

    escape(input); // Revert to navigation first

    escape(); // Unfortunately this does not trigger native blur
    focusable.focus(); // Simulate native blur on escape

    expect(grid.hasAttribute('navigating')).to.be.false;
  });

  it('should revert to navigation from interaction mode with escape', () => {
    const input = focusFirstBodyInput(0);

    escape(input);

    expect(grid.hasAttribute('navigating')).to.be.true;
  });

  it('should revert to navigation from interaction mode with F2', () => {
    const input = focusFirstBodyInput(0);

    f2(input);

    expect(grid.hasAttribute('interacting')).to.be.false;
    expect(grid.hasAttribute('navigating')).to.be.true;
  });

  it('should cancel navigation mode with escape', () => {
    grid.setAttribute('navigating', '');
    grid.removeAttribute('interacting');

    escape();
    focusable.focus(); // Simulate native blur on escape

    expect(grid.hasAttribute('navigating')).to.be.false;
  });

  it('should enter interaction mode when cell contents are focused', () => {
    focusFirstBodyInput(0);

    expect(grid.hasAttribute('interacting')).to.be.true;
  });

  it('should not throw error when hit enter after focus on table body', () => {
    expect(() => {
      grid.$.items.focus();
      enter(grid);
    }).not.to.throw(Error);
  });

  it('should tab through the elements in order', async () => {
    // Add 100 items to the grid
    grid.items = Array.from(Array(100), (_, i) => `item-${i}`);

    // Remove an unused column
    const columns = grid.querySelectorAll('vaadin-grid-column');
    columns[2].hidden = true;
    flushGrid(grid);

    // Focus the input on the first row
    focusFirstBodyInput(0);

    const tabToIndex = 20;

    async function rendered() {
      await nextFrame();
      await nextRender();
      await nextFrame();
    }

    // Tab downwards
    for (let i = 1; i <= tabToIndex; i++) {
      await rendered();
      await sendKeys({ press: 'Tab' });
      await rendered();

      const focusedRow = document.activeElement.parentElement.assignedSlot.parentElement.parentElement;
      expect(focusedRow.index).to.equal(i);
    }

    // Tab upwards
    for (let i = tabToIndex - 1; i >= 0; i--) {
      await rendered();
      await sendKeys({ press: 'Shift+Tab' });
      await rendered();
      const focusedRow = document.activeElement.parentElement.assignedSlot.parentElement.parentElement;
      expect(focusedRow.index).to.equal(i);
    }
  });
});
