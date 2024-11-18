import { expect } from '@esm-bundle/chai';
import { enter, esc, fixtureSync, nextFrame, tab } from '@vaadin/testing-helpers';
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
  let grid, input;

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

    it('should focus cell next available for editing within a same row in non-edit mode on Tab', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 1, 1);
      const spy = sinon.spy(secondCell, 'focus');
      tab(input);
      expect(spy.calledOnce).to.be.true;
    });

    it('should focus previous cell available for editing within a same row in non-edit mode on Shift Tab', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 1);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 1, 0);
      const spy = sinon.spy(secondCell, 'focus');
      tab(input, ['shift']);
      expect(spy.calledOnce).to.be.true;
    });

    it('should focus cell next available for editing on the next row in non-edit mode on Tab', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 1);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 2, 0);
      const spy = sinon.spy(secondCell, 'focus');
      tab(input);
      expect(spy.calledOnce).to.be.true;
    });

    it('should focus previous cell available for editing on the previous in non-edit mode on Shift Tab', () => {
      const firstCell = getContainerCell(grid.$.items, 2, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 1, 1);
      const spy = sinon.spy(secondCell, 'focus');
      tab(input, ['shift']);
      expect(spy.calledOnce).to.be.true;
    });

    it('should focus editable cell on the next row in non-edit mode on Enter, if `enterNextRow` is true', () => {
      grid.enterNextRow = true;
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      enter(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 2, 0);
      const spy = sinon.spy(secondCell, 'focus');
      enter(input);
      expect(spy.calledOnce).to.be.true;
    });

    it('should exit the edit mode for the cell on Enter, if `enterNextRow` is false', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      enter(input);
      expect(getCellEditor(firstCell)).to.be.not.ok;
    });

    it('should focus editable cell on the previous row in non-edit mode on Shift Enter, if `enterNextRow` is true', () => {
      grid.enterNextRow = true;
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      enter(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 0, 0);
      const spy = sinon.spy(secondCell, 'focus');
      enter(input, ['shift']);
      expect(spy.calledOnce).to.be.true;
    });

    it('should exit the edit mode for the cell on Shift Enter, if `enterNextRow` is false', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      enter(input, ['shift']);
      expect(getCellEditor(firstCell)).to.be.not.ok;
    });

    it('should focus correct editable cell after column reordering', () => {
      grid.columnReorderingAllowed = true;
      const headerContent = [
        getContainerCell(grid.$.header, 0, 0)._content,
        getContainerCell(grid.$.header, 0, 1)._content,
      ];
      dragAndDropOver(headerContent[0], headerContent[1]);

      const firstCell = getContainerCell(grid.$.items, 1, 1);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 1, 0);
      const spy = sinon.spy(secondCell, 'focus');
      tab(input);
      expect(spy.calledOnce).to.be.true;
    });

    it('should focus correct editable cell when column is hidden', () => {
      const column = grid.querySelector('vaadin-grid-pro-edit-column');
      column.hidden = true;

      const firstCell = getContainerCell(grid.$.items, 1, 1);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 2, 1);
      const spy = sinon.spy(secondCell, 'focus');
      tab(input);
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('when `singleCellEdit` is false', () => {
    it('should focus cell next available for editing within a same row in edit mode on Tab', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 1, 1);
      tab(input);
      input = getCellEditor(secondCell);
      expect(input).to.be.ok;
    });

    it('should not focus cell next available for editing on Tab if default prevented for it', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      input.addEventListener('keydown', (e) => e.keyCode === 9 && e.preventDefault());
      tab(input);
      expect(getCellEditor(firstCell)).to.be.ok;
    });

    it('should not focus cell next available for editing on Tab if `internal-tab` was fired right before it', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      input.dispatchEvent(new CustomEvent('internal-tab'));
      tab(input);
      expect(getCellEditor(firstCell)).to.be.ok;
    });

    it('should be possible to switch edit cell on Tab with delay after `internal-tab` was fired', (done) => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      input.dispatchEvent(new CustomEvent('internal-tab'));
      const secondCell = getContainerCell(grid.$.items, 1, 1);
      requestAnimationFrame(() => {
        tab(input);
        expect(getCellEditor(secondCell)).to.be.ok;
        done();
      });
    });

    it('should focus previous cell available for editing within a same row in edit mode on Shift Tab', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 1);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 1, 0);
      tab(input, ['shift']);
      input = getCellEditor(secondCell);
      expect(input).to.be.ok;
    });

    it('should focus cell next available for editing on the next row in edit mode on Tab', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 1);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 2, 0);
      tab(input);
      input = getCellEditor(secondCell);
      expect(input).to.be.ok;
    });

    it('should focus previous cell available for editing on the previous row in edit mode on Shift Tab', () => {
      const firstCell = getContainerCell(grid.$.items, 2, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 1, 1);
      tab(input, ['shift']);
      input = getCellEditor(secondCell);
      expect(input).to.be.ok;
    });

    it('should focus editable cell on the next row in edit mode on Enter, if `enterNextRow` is true', () => {
      grid.enterNextRow = true;
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      enter(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 2, 0);
      enter(input);
      input = getCellEditor(secondCell);
      expect(input).to.be.ok;
    });

    it('should exit the edit mode for the cell on Enter, if `enterNextRow` is false', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      enter(input);
      expect(getCellEditor(firstCell)).to.be.not.ok;
    });

    it('should focus editable cell on the previous row in non-edit mode on Shift Enter, if `enterNextRow` is true', () => {
      grid.enterNextRow = true;
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      enter(firstCell._content);
      input = getCellEditor(firstCell);

      const secondCell = getContainerCell(grid.$.items, 0, 0);
      enter(input, ['shift']);
      input = getCellEditor(secondCell);
      expect(input).to.be.ok;
    });

    it('should not re-focus previous cell in edit mode on Enter, if `enterNextRow` is true', async () => {
      grid.enterNextRow = true;
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      enter(firstCell._content);
      await nextFrame();
      input = getCellEditor(firstCell).inputElement;

      const spy = sinon.spy(firstCell, 'focus');
      enter(input);
      expect(spy.called).to.be.false;
    });

    it('should exit the edit mode for the cell on Shift Enter, if `enterNextRow` is false', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      enter(input, ['shift']);
      expect(getCellEditor(firstCell)).to.be.not.ok;
    });
  });

  describe('Esc key', () => {
    it('should exit the edit mode for the cell when pressing ESC', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);

      esc(input);
      expect(getCellEditor(firstCell)).to.be.not.ok;
    });

    it('should re-focus cell after exit edit mode on ESC', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      firstCell.focus();
      enter(firstCell._content);
      input = getCellEditor(firstCell);

      const focusSpy = sinon.spy(firstCell, 'focus');
      const stopSpy = sinon.spy(grid, '_stopEdit');
      esc(input);

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
