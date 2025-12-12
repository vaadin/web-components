import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, nextFrame, nextResize } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-grid-pro.js';
import '../src/vaadin-grid-pro-edit-column.js';
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

  beforeEach(async () => {
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
    await nextResize(grid);
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
      await sendKeys({ press: 'Shift+Tab' });
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
      await sendKeys({ press: 'Shift+Tab' });
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
      await sendKeys({ press: 'Shift+Enter' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should exit the edit mode for the cell on Shift Enter, if `enterNextRow` is false', async () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      firstCell.focus();
      await sendKeys({ press: 'Enter' });

      await sendKeys({ press: 'Shift+Enter' });
      expect(getCellEditor(firstCell)).to.be.not.ok;
    });

    it('should focus correct editable cell after column reordering', async () => {
      grid.columnReorderingAllowed = true;
      const headerContent = [
        getContainerCell(grid.$.header, 0, 0)._content,
        getContainerCell(grid.$.header, 0, 1)._content,
      ];
      dragAndDropOver(headerContent[0], headerContent[1]);

      // After physical DOM reordering, cells are in visual order:
      // DOM index 0 is visually first, DOM index 1 is visually second
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      firstCell.focus();
      await sendKeys({ press: 'Enter' });

      const secondCell = getContainerCell(grid.$.items, 1, 1);
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
      await sendKeys({ press: 'Shift+Tab' });
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
      await sendKeys({ press: 'Shift+Tab' });
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
      await sendKeys({ press: 'Shift+Enter' });
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

      await sendKeys({ press: 'Shift+Enter' });
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
      expect(secondCellContent.contains(document.activeElement)).to.be.true;
    });

    it('should allow escaping from edit mode while the editor is loading', async () => {
      const firstCell = getContainerCell(grid.$.items, 0, 0);
      dblclick(firstCell._content);

      await sendKeys({ press: 'Escape' });
      expect(getContainerCellContent(grid.$.items, 0, 0).textContent).to.equal('0 foo');
    });

    it('should not fire event when tabbed through cells with slow editor', async () => {
      const itemPropertyChangedSpy = sinon.spy();
      grid.addEventListener('item-property-changed', itemPropertyChangedSpy);

      const column = grid.querySelector('vaadin-grid-pro-edit-column');

      // Custom editor with delayed operations
      column.editModeRenderer = (root, _, __) => {
        if (!root.firstElementChild) {
          const input = document.createElement('input');
          let actualValue = '';
          Object.defineProperty(input, 'value', {
            async get() {
              await aTimeout(100);
              return actualValue;
            },
            async set(v) {
              await aTimeout(100);
              actualValue = v;
            },
          });
          root.appendChild(input);
        }
      };

      const firstCell = getContainerCell(grid.$.items, 0, 0);
      dblclick(firstCell._content);

      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      await nextFrame();

      expect(itemPropertyChangedSpy.called).to.be.false;
    });
  });

  describe('updating cell', () => {
    it('should hide cell content while cell is updating', async () => {
      grid.cellPartNameGenerator = () => 'updating-cell';
      await nextFrame();
      const container = getContainerCellContent(grid.$.items, 0, 0);
      expect(getComputedStyle(container).opacity).to.equal('0');
    });
  });
});
