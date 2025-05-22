import { expect } from '@vaadin/chai-plugins';
import { esc, fire, fixtureSync, isFirefox, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/grid/src/vaadin-grid.js';
import '@vaadin/context-menu/src/vaadin-context-menu.js';
import { flushGrid, getCell } from '@vaadin/grid/test/helpers.js';

function contextMenuOnCell(grid, rowIndex, colIndex) {
  const cell = getCell(grid, rowIndex, colIndex);
  const { left, top, bottom, right } = cell.getBoundingClientRect();
  const x = (left + right) / 2;
  const y = (top + bottom) / 2;
  fire(document.elementFromPoint(x, y), 'contextmenu', undefined, {
    composed: true,
    bubbles: true,
    clientX: x,
    clientY: y,
  });
}

async function overlayOpened(contextMenu) {
  await oneEvent(contextMenu._overlayElement, 'vaadin-overlay-open');
}

describe('grid in context-menu', () => {
  let grid, contextMenu;

  beforeEach(async () => {
    contextMenu = fixtureSync(`
      <vaadin-context-menu>
        <vaadin-grid>
          <vaadin-grid-column path="firstName"></vaadin-grid-column>
          <vaadin-grid-column path="lastName"></vaadin-grid-column>
        </vaadin-grid>
      </vaadin-context-menu>
    `);

    contextMenu.items = [{ text: 'Item 1' }, { text: 'Item 2' }];

    grid = contextMenu.querySelector('vaadin-grid');
    grid.items = [
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Doe' },
    ];
    flushGrid(grid);

    await nextFrame();
  });

  describe('close and re-open on contextmenu', () => {
    it('should have the last cell focused on context menu close', async () => {
      // Open context menu on a cell
      contextMenuOnCell(grid, 0, 0);
      await overlayOpened(contextMenu);

      // Open context menu on another cell
      contextMenuOnCell(grid, 1, 1);
      await overlayOpened(contextMenu);

      // Close the context menu with ESC
      esc(document.body);
      await nextRender();

      // Expect the last "context menued" cell to be focused
      expect(getCell(grid, 1, 1)).to.equal(grid.shadowRoot.activeElement);
    });

    it('should not focus the previous cell in between context menus', async () => {
      // Open context menu on cell A
      contextMenuOnCell(grid, 0, 0);
      await overlayOpened(contextMenu);

      // Open context menu on cell B
      contextMenuOnCell(grid, 1, 1);
      await overlayOpened(contextMenu);

      // Listen for focus event on cell B (the one with the context menu opened)
      const focusSpy = sinon.spy();
      getCell(grid, 1, 1).addEventListener('focusin', focusSpy);

      // Open context menu once again on cell A
      contextMenuOnCell(grid, 0, 0);
      await overlayOpened(contextMenu);

      // Expect cell B not to have been focused in between context menus
      expect(focusSpy.called).to.be.false;
    });
  });

  (isFirefox ? describe : describe.skip)('trigger context menu using the keyboard', () => {
    it('should position the context menu to the bottom left of the cell where the context menu was triggered', async () => {
      // Ensure isKeyboardActive() returns true
      fire(window, 'keydown', { key: 'Enter', keyCode: 13 });

      // Fire contextmenu event on a cell, with intentionally wrong coordinates
      // Reproduces an issue in Firefox, which reports wrong coordinates when
      // contextmenu is triggered through keyboard when a cell is focused
      const cell = getCell(grid, 1, 1);
      fire(cell, 'contextmenu', undefined, {
        composed: true,
        bubbles: true,
        clientX: 0,
        clientY: 0,
      });
      await overlayOpened(contextMenu);

      // Actual position should be close to the center of the cell
      const cellRect = cell.getBoundingClientRect();
      const overlay = contextMenu._overlayElement;
      const overlayRect = overlay.getBoundingClientRect();

      expect(overlayRect.left).to.closeTo(cellRect.left, 5);
      expect(overlayRect.top).to.closeTo(cellRect.bottom, 5);
    });
  });
});
