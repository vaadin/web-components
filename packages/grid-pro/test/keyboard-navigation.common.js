import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import {
  createItems,
  dblclick,
  dragAndDropOver,
  flushGrid,
  getCellEditor,
  getContainerCell,
  getContainerCellContent,
} from './helpers.js';

describe('keyboard navigation', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid-pro>
        <vaadin-grid-pro-edit-column path="name" header="Name"></vaadin-grid-pro-edit-column>
        <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
        <vaadin-grid-column path="name"></vaadin-grid-column>
      </vaadin-grid-pro>
    `);
    grid.querySelector('[path="name"]').renderer = (root, _, { index, item }) => {
      root.textContent = `${index} ${item.name}`;
    };

    grid.items = createItems();
    flushGrid(grid);
  });

  describe('when `singleCellEdit` is true', () => {
    beforeEach(() => {
      grid.singleCellEdit = true;
    });

    it('should focus cell next available for editing within a same row in non-edit mode on Tab', async () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      firstCell.focus();
      await sendKeys({ press: 'Enter' });

      const secondCell = getContainerCell(grid.$.items, 1, 1);
      const spy = sinon.spy(secondCell, 'focus');
      await sendKeys({ press: 'Tab' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should focus previous cell available for editing within a same row in non-edit mode on Shift Tab', async () => {
      const firstCell = getContainerCell(grid.$.items, 1, 1);
      firstCell.focus();
      await sendKeys({ press: 'Enter' });

      const secondCell = getContainerCell(grid.$.items, 1, 0);
      const spy = sinon.spy(secondCell, 'focus');
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should focus cell next available for editing on the next row in non-edit mode on Tab', async () => {
      const firstCell = getContainerCell(grid.$.items, 1, 1);
      firstCell.focus();
      await sendKeys({ press: 'Enter' });

      const secondCell = getContainerCell(grid.$.items, 2, 0);
      const spy = sinon.spy(secondCell, 'focus');
      await sendKeys({ press: 'Tab' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should focus previous cell available for editing on the previous in non-edit mode on Shift Tab', async () => {
      const firstCell = getContainerCell(grid.$.items, 2, 0);
      firstCell.focus();
      await sendKeys({ press: 'Enter' });

      const secondCell = getContainerCell(grid.$.items, 1, 1);
      const spy = sinon.spy(secondCell, 'focus');
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should focus editable cell on the next row in non-edit mode on Enter, if `enterNextRow` is true', async () => {
      grid.enterNextRow = true;
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      firstCell.focus();
      await sendKeys({ press: 'Enter' });

      const secondCell = getContainerCell(grid.$.items, 2, 0);
      const spy = sinon.spy(secondCell, 'focus');
      await sendKeys({ press: 'Enter' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should exit the edit mode for the cell on Enter, if `enterNextRow` is false', async () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      firstCell.focus();
      await sendKeys({ press: 'Enter' });

      await sendKeys({ press: 'Enter' });
      expect(getCellEditor(firstCell)).to.be.not.ok;
    });

    it('should focus editable cell on the previous row in non-edit mode on Shift Enter, if `enterNextRow` is true', async () => {
      grid.enterNextRow = true;
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      firstCell.focus();
      await sendKeys({ press: 'Enter' });

      const secondCell = getContainerCell(grid.$.items, 0, 0);
      const spy = sinon.spy(secondCell, 'focus');
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Enter' });
      await sendKeys({ up: 'Shift' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should exit the edit mode for the cell on Shift Enter, if `enterNextRow` is false', async () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      firstCell.focus();
      await sendKeys({ press: 'Enter' });

      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Enter' });
      await sendKeys({ up: 'Shift' });
      expect(getCellEditor(firstCell)).to.be.not.ok;
    });

    it('should focus correct editable cell after column reordering', async () => {
      grid.columnReorderingAllowed = true;
      const headerContent = [
        getContainerCell(grid.$.header, 0, 0)._content,
        getContainerCell(grid.$.header, 0, 1)._content,
      ];
      dragAndDropOver(headerContent[0], headerContent[1]);

      const firstCell = getContainerCell(grid.$.items, 1, 1);
      firstCell.focus();
      await sendKeys({ press: 'Enter' });

      const secondCell = getContainerCell(grid.$.items, 1, 0);
      const spy = sinon.spy(secondCell, 'focus');
      await sendKeys({ press: 'Tab' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should focus correct editable cell when column is hidden', async () => {
      const column = grid.querySelector('vaadin-grid-pro-edit-column');
      column.hidden = true;
      flushGrid(grid);

      const firstCell = getContainerCell(grid.$.items, 1, 0);
      firstCell.focus();
      await sendKeys({ press: 'Enter' });

      const secondCell = getContainerCell(grid.$.items, 2, 0);
      const spy = sinon.spy(secondCell, 'focus');
      await sendKeys({ press: 'Tab' });
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('when `singleCellEdit` is false', () => {
    it('should focus cell next available for editing within a same row in edit mode on Tab', async () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);

      const secondCell = getContainerCell(grid.$.items, 1, 1);
      await sendKeys({ press: 'Tab' });
      expect(getCellEditor(secondCell)).to.be.ok;
    });

    it('should not focus cell next available for editing on Tab if default prevented for it', async () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);

      getCellEditor(firstCell).addEventListener('keydown', (e) => e.keyCode === 9 && e.preventDefault());
      await sendKeys({ press: 'Tab' });
      expect(getCellEditor(firstCell)).to.be.ok;
    });

    it('should focus previous cell available for editing within a same row in edit mode on Shift Tab', async () => {
      const firstCell = getContainerCell(grid.$.items, 1, 1);
      dblclick(firstCell._content);

      const secondCell = getContainerCell(grid.$.items, 1, 0);
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
      expect(getCellEditor(secondCell)).to.be.ok;
    });

    it('should focus cell next available for editing on the next row in edit mode on Tab', async () => {
      const firstCell = getContainerCell(grid.$.items, 1, 1);
      dblclick(firstCell._content);

      const secondCell = getContainerCell(grid.$.items, 2, 0);
      await sendKeys({ press: 'Tab' });
      expect(getCellEditor(secondCell)).to.be.ok;
    });

    it('should focus previous cell available for editing on the previous row in edit mode on Shift Tab', async () => {
      const firstCell = getContainerCell(grid.$.items, 2, 0);
      dblclick(firstCell._content);

      const secondCell = getContainerCell(grid.$.items, 1, 1);
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
      expect(getCellEditor(secondCell)).to.be.ok;
    });

    it('should focus editable cell on the next row in edit mode on Enter, if `enterNextRow` is true', async () => {
      grid.enterNextRow = true;
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      firstCell.focus();
      await sendKeys({ press: 'Enter' });

      const secondCell = getContainerCell(grid.$.items, 2, 0);
      await sendKeys({ press: 'Enter' });
      expect(getCellEditor(secondCell)).to.be.ok;
    });

    it('should exit the edit mode for the cell on Enter, if `enterNextRow` is false', async () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);

      await sendKeys({ press: 'Enter' });
      expect(getCellEditor(firstCell)).to.be.not.ok;
    });

    it('should focus editable cell on the previous row in non-edit mode on Shift Enter, if `enterNextRow` is true', async () => {
      grid.enterNextRow = true;
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      firstCell.focus();
      await sendKeys({ press: 'Enter' });

      const secondCell = getContainerCell(grid.$.items, 0, 0);
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Enter' });
      await sendKeys({ up: 'Shift' });
      expect(getCellEditor(secondCell)).to.be.ok;
    });

    it('should not re-focus previous cell in edit mode on Enter, if `enterNextRow` is true', async () => {
      grid.enterNextRow = true;
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      firstCell.focus();
      await sendKeys({ press: 'Enter' });

      const spy = sinon.spy(firstCell, 'focus');
      await sendKeys({ press: 'Enter' });
      expect(spy.called).to.be.false;
    });

    it('should exit the edit mode for the cell on Shift Enter, if `enterNextRow` is false', async () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);

      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Enter' });
      await sendKeys({ up: 'Shift' });
      expect(getCellEditor(firstCell)).to.be.not.ok;
    });
  });

  describe('Esc key', () => {
    it('should exit the edit mode for the cell when pressing ESC', async () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);

      await sendKeys({ press: 'Escape' });
      expect(getCellEditor(firstCell)).to.be.not.ok;
    });

    it('should re-focus cell after exit edit mode on ESC', async () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      firstCell.focus();
      await sendKeys({ press: 'Enter' });

      const focusSpy = sinon.spy(firstCell, 'focus');
      const stopSpy = sinon.spy(grid, '_stopEdit');
      await sendKeys({ press: 'Escape' });

      expect(focusSpy.calledAfter(stopSpy)).to.be.true;
    });
  });

  describe('loading-editor', () => {
    beforeEach(() => {
      grid.toggleAttribute('loading-editor', true);
    });

    it('should not allow typing while the editor is loading', async () => {
      const firstCell = getContainerCell(grid.$.items, 0, 0);
      dblclick(firstCell._content);

      await sendKeys({ press: 'a' });
      await sendKeys({ press: 'Enter' });

      grid.toggleAttribute('loading-editor', false);

      expect(getContainerCellContent(grid.$.items, 0, 0).textContent).to.equal('0 foo');
    });

    it('should not allow keyboard interactions while the editor is loading', async () => {
      const firstCell = getContainerCell(grid.$.items, 0, 0);
      dblclick(firstCell._content);
      const spy = sinon.spy();

      const editor = getCellEditor(firstCell);
      editor.addEventListener('keydown', spy);

      await sendKeys({ press: 'ArrowDown' });

      expect(spy.called).to.be.false;
    });

    it('should not allow pointer events while the editor is loading', async () => {
      const firstCell = getContainerCell(grid.$.items, 0, 0);
      dblclick(firstCell._content);
      await nextFrame();
      const editor = getCellEditor(firstCell);
      expect(getComputedStyle(editor).pointerEvents).to.equal('none');
    });

    it('should hide cell content while the editor is loading', async () => {
      const firstCell = getContainerCell(grid.$.items, 0, 0);
      dblclick(firstCell._content);
      await nextFrame();
      const container = getContainerCellContent(grid.$.items, 0, 0);
      expect(getComputedStyle(container).opacity).to.equal('0');
    });

    it('should allow tabbing to another cell while the editor is loading', async () => {
      const firstCell = getContainerCell(grid.$.items, 0, 0);
      dblclick(firstCell._content);

      await sendKeys({ press: 'Tab' });
      const secondCellContent = getContainerCellContent(grid.$.items, 0, 1);
      console.log(secondCellContent);
      expect(secondCellContent.contains(document.activeElement)).to.be.true;
    });

    it('should allow escaping from edit mode while the editor is loading', async () => {
      const firstCell = getContainerCell(grid.$.items, 0, 0);
      dblclick(firstCell._content);

      await sendKeys({ press: 'Escape' });
      expect(getContainerCellContent(grid.$.items, 0, 0).textContent).to.equal('0 foo');
    });
  });
});
