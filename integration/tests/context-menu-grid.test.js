import { expect } from '@esm-bundle/chai';
import { esc, fire, fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/grid';
import '@vaadin/context-menu';
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

async function overlayClosed(contextMenu) {
  await oneEvent(contextMenu._overlayElement, 'vaadin-overlay-closed');
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
      await overlayClosed(contextMenu);

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
});
