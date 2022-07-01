import { expect } from '@esm-bundle/chai';
import { enter, fixtureSync, focusin, focusout, isIOS, tab } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '../vaadin-grid-pro.js';
import '../vaadin-grid-pro-edit-column.js';
import {
  createItems,
  dblclick,
  flatMap,
  flushGrid,
  getCellEditor,
  getContainerCell,
  getRowCells,
  getRows,
  infiniteDataProvider,
} from './helpers.js';

describe('edit column', () => {
  (isIOS ? describe.skip : describe)('select column', () => {
    let grid, textCell, selectCell, checkboxCell;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="title" editor-type="select"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.items = createItems();
      grid.querySelector('[path="title"]').editorOptions = ['mr', 'mrs', 'ms'];
      flushGrid(grid);
      textCell = getContainerCell(grid.$.items, 1, 0);
      selectCell = getContainerCell(grid.$.items, 1, 1);
      checkboxCell = getContainerCell(grid.$.items, 1, 2);
    });

    it('should focus cell next available for editing in edit mode on Tab', async () => {
      dblclick(textCell._content);
      expect(getCellEditor(textCell)).to.be.ok;

      // Press Tab to edit the select cell
      await sendKeys({ press: 'Tab' });
      expect(getCellEditor(selectCell)).to.be.ok;

      // Press Tab to edit the checkbox cell
      await sendKeys({ press: 'Tab' });
      expect(getCellEditor(checkboxCell)).to.be.ok;
    });

    it('should focus previous cell available for editing in edit mode on Shift Tab', async () => {
      dblclick(checkboxCell._content);
      expect(getCellEditor(checkboxCell)).to.be.ok;

      // Press Shift + Tab to edit the select cell
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
      expect(getCellEditor(selectCell)).to.be.ok;

      // Press Shift + Tab to edit the text cell
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
      expect(getCellEditor(textCell)).to.be.ok;
    });
  });

  describe('wrapped fields in custom editor', () => {
    let grid, inputWrapper;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="custom">
            <template class="editor">
              <div>
                <input type="text">
                <input type="text">
              </div>
            </template>
          </vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.items = createItems();
      flushGrid(grid);
    });

    it('should not stop editing when focusing the input within the same cell', () => {
      const customCell = getContainerCell(grid.$.items, 1, 1);
      dblclick(customCell._content);
      inputWrapper = getCellEditor(customCell);
      const inputs = inputWrapper.querySelectorAll('input');

      expect(inputWrapper).to.be.ok;

      focusout(inputs[0]);
      focusin(inputs[1]);
      grid._debouncerStopEdit && grid._debouncerStopEdit.flush();

      expect(getCellEditor(customCell)).to.be.ok;
    });
  });

  describe('horizontal scrolling to cell', () => {
    let grid, input;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name">
            <template class="header">Name</template>
            <template>[[index]] [[item.name]]</template>
            <template class="footer"></template>
          </vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.items = createItems();
      grid.style.width = '100px'; // Column default min width is 100px
      flushGrid(grid);
    });

    it('should scroll to the right on tab when editable cell is outside the viewport', () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);
      tab(input);

      expect(grid.$.table.scrollLeft).to.be.at.least(100);
    });

    it('should scroll to the left on tab when editable cell is outside the viewport', (done) => {
      const firstCell = getContainerCell(grid.$.items, 1, 1);
      dblclick(firstCell._content);

      setTimeout(() => {
        input = getCellEditor(firstCell);
        tab(input, ['shift']);

        expect(grid.$.table.scrollLeft).to.closeTo(1, 1);
        done();
      });
    });
  });

  describe('item-property-changed event', () => {
    let grid, column, firstCell, input;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name">
            <template class="header">Name</template>
            <template>[[index]] [[item.name]]</template>
            <template class="footer"></template>
          </vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      column = grid.firstElementChild;
      grid.items = createItems();

      flushGrid(grid);
      firstCell = getContainerCell(grid.$.items, 0, 0);
    });

    it('should be fired once cell edit completed and value has changed', (done) => {
      grid.addEventListener('item-property-changed', (e) => {
        const { value, path } = e.detail;
        expect(value).to.equal('new');
        expect(path).to.equal(column.path);
        done();
      });
      enter(firstCell);
      input = getCellEditor(firstCell);
      input.value = 'new';
      enter(input);
    });

    it('should not be fired once cell edit completed if value has not changed', () => {
      const spy = sinon.spy();
      grid.addEventListener('item-property-changed', spy);
      enter(firstCell);
      input = getCellEditor(firstCell);
      const value = input.value;
      input.value = 'new';
      input.value = value;
      enter(input);
      expect(spy.called).to.be.false;
    });

    it('should be not modify the cell content if prevented by user', (done) => {
      grid.addEventListener('item-property-changed', (e) => {
        e.preventDefault();
        requestAnimationFrame(() => {
          expect(firstCell._content.textContent).to.equal('0 foo');
          done();
        });
      });
      enter(firstCell);
      input = getCellEditor(firstCell);
      input.value = 'new';
      enter(input);
    });
  });

  describe('disable editing', () => {
    let grid;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name">
            <template class="header">Name</template>
            <template>[[index]] [[item.name]]</template>
            <template class="footer"></template>
          </vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.items = createItems();
      flushGrid(grid);
    });

    it('should not show editor when editing is disabled', () => {
      const cell = getContainerCell(grid.$.items, 1, 0);
      grid._editingDisabled = true;
      enter(cell);
      const input = getCellEditor(cell);
      expect(input).to.be.not.ok;
    });

    it('should not show editor when disabled is set to true', () => {
      const cell = getContainerCell(grid.$.items, 1, 0);
      grid.disabled = true;
      enter(cell);
      const input = getCellEditor(cell);
      expect(input).to.be.not.ok;
    });

    it('should cancel editing when disabled is set to true', () => {
      const cell = getContainerCell(grid.$.items, 1, 0);
      const oldContent = cell._content.textContent;
      enter(cell);
      grid.disabled = true;
      expect(cell._content.textContent).to.equal(oldContent);
    });
  });

  describe('vertical scrolling', () => {
    let grid, input, firstCell;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name">
            <template class="header">Name</template>
            <template>[[index]] [[item.name]]</template>
            <template class="footer"></template>
          </vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.size = 1000;
      grid.dataProvider = infiniteDataProvider;
      flushGrid(grid);
    });

    it('should cancel edit for editable cell using template when scrolled out', () => {
      firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);

      grid.scrollToIndex(100);
      input = getCellEditor(firstCell);
      expect(input).to.be.not.ok;
    });

    it('should cancel edit for editable cell using renderer when scrolled out', () => {
      firstCell = getContainerCell(grid.$.items, 1, 1);
      dblclick(firstCell._content);

      grid.scrollToIndex(100);
      input = getCellEditor(firstCell);
      expect(input).to.be.not.ok;
    });
  });

  describe('cell focusing', () => {
    let grid, cell;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name">
            <template class="header">Name</template>
            <template>[[index]] [[item.name]]</template>
            <template class="footer"></template>
          </vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.items = createItems();
      flushGrid(grid);
    });

    it('should keep navigating state on the grid while focusing the editable cell', () => {
      cell = getContainerCell(grid.$.items, 0, 0);

      // Mimic the real events sequence to avoid using fake focus shim from grid
      cell.dispatchEvent(new CustomEvent('mousedown', { bubbles: true, composed: true }));
      expect(grid.hasAttribute('navigating')).to.be.true;

      cell.focus();
      focusout(cell);
      expect(grid.hasAttribute('navigating')).to.be.true;

      focusin(cell);
      expect(grid.hasAttribute('navigating')).to.be.true;
    });

    it('should not set navigating state on the grid while focusing the non-editable cell', () => {
      cell = getContainerCell(grid.$.items, 0, 2);

      cell.dispatchEvent(new CustomEvent('mousedown', { bubbles: true, composed: true }));
      expect(grid.hasAttribute('navigating')).to.be.false;

      cell.focus();
      focusout(cell);
      expect(grid.hasAttribute('navigating')).to.be.false;

      focusin(cell);
      expect(grid.hasAttribute('navigating')).to.be.false;
    });
  });

  describe('grid behaviour', () => {
    let grid, cell;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name">
            <template class="header">Name</template>
            <template>[[index]] [[item.name]]</template>
            <template class="footer"></template>
          </vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="married" editor-type="checkbox"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.items = createItems();
      flushGrid(grid);
    });

    it('should throw an error when no path is set for the edit column', () => {
      const column = grid.querySelector('vaadin-grid-pro-edit-column');
      expect(() => {
        column.path = undefined;
      }).to.throw(Error);
    });

    it('should throw an error when path is set to empty string for the edit column', () => {
      const column = grid.querySelector('vaadin-grid-pro-edit-column');
      expect(() => {
        column.path = '';
      }).to.throw(Error);
    });

    describe('active-item-changed event', () => {
      let activeItemChangedSpy;

      beforeEach(() => {
        activeItemChangedSpy = sinon.spy();
        grid.addEventListener('active-item-changed', activeItemChangedSpy);
      });

      it('should not fire the event on cell click in the editable column', () => {
        cell = getContainerCell(grid.$.items, 0, 1);
        cell._content.click();
        expect(activeItemChangedSpy.called).to.be.false;
      });

      it('should not fire the event on checkbox click in the editable column', () => {
        cell = getContainerCell(grid.$.items, 0, 1);
        dblclick(cell._content);
        cell._content.querySelector('input[type=checkbox]').click();
        expect(activeItemChangedSpy.called).to.be.false;
      });

      it('should fire the event on cell click in the not editable column', () => {
        cell = getContainerCell(grid.$.items, 0, 3);
        cell._content.click();
        expect(activeItemChangedSpy.called).to.be.true;
      });
    });
  });

  describe('part attribute', () => {
    let grid, rows;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name">
            <template class="header">Name</template>
            <template>[[index]] [[item.name]]</template>
            <template class="footer"></template>
          </vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.items = createItems();
      flushGrid(grid);
      rows = Array.from(getRows(grid.$.items));
    });

    it('should have editable-cell attribute on edit column cells', () => {
      const editColumnCells = flatMap(rows, (row) => getRowCells(row).slice(0, 2));
      expect(editColumnCells).to.have.lengthOf(6);
      editColumnCells.forEach((cell) => expect(cell.getAttribute('part')).to.equal('cell body-cell editable-cell'));
    });

    it('should not have editable-cell attribute on normal column cells', () => {
      const normalColumnCells = rows.map((row) => getRowCells(row)[2]);
      expect(normalColumnCells).to.have.lengthOf(3);
      normalColumnCells.forEach((cell) => expect(cell.getAttribute('part')).to.equal('cell body-cell'));
    });
  });

  describe('row details', () => {
    let grid, rows;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name">
            <template class="header">Name</template>
            <template>[[index]] [[item.name]]</template>
            <template class="footer"></template>
          </vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.items = createItems();
      grid.rowDetailsRenderer = (root) => {
        root.textContent = 'foo';
      };
      flushGrid(grid);
      rows = Array.from(getRows(grid.$.items));
    });

    it('should not throw on details cell click', () => {
      grid.detailsOpenedItems = [grid.items[0]];
      const detailsCell = rows[0].querySelector('[part~="details-cell"]');

      const dispatch = () => detailsCell.dispatchEvent(new CustomEvent('mousedown', { bubbles: true, composed: true }));
      expect(dispatch).to.not.throw(Error);
    });
  });
});
