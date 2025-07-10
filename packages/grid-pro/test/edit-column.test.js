import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { enter, esc, fixtureSync, focusin, focusout, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../src/vaadin-grid-pro.js';
import '../src/vaadin-grid-pro-edit-column.js';
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

const isMac = navigator.platform.includes('Mac');

function indexNameRenderer(root, _, { index, item }) {
  root.textContent = `${index} ${item.name}`;
}

describe('edit column', () => {
  describe('select column', () => {
    let grid, textCell, selectCell, ageCell;

    beforeEach(async () => {
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
      ageCell = getContainerCell(grid.$.items, 1, 2);
      await nextFrame();
    });

    it('should focus cell next available for editing in edit mode on Tab', async () => {
      dblclick(textCell._content);
      expect(getCellEditor(textCell)).to.be.ok;
      await nextFrame();

      // Press Tab to edit the select cell
      await sendKeys({ press: 'Tab' });
      expect(getCellEditor(selectCell)).to.be.ok;
      await nextFrame();

      // Press Tab to edit the age cell
      await sendKeys({ press: 'Tab' });
      expect(getCellEditor(ageCell)).to.be.ok;
    });

    it('should focus previous cell available for editing in edit mode on Shift Tab', async () => {
      dblclick(ageCell._content);
      expect(getCellEditor(ageCell)).to.be.ok;
      await nextFrame();

      // Press Shift + Tab to edit the select cell
      await sendKeys({ press: 'Shift+Tab' });
      expect(getCellEditor(selectCell)).to.be.ok;
      await nextFrame();

      // Press Shift + Tab to edit the text cell
      await sendKeys({ press: 'Shift+Tab' });
      expect(getCellEditor(textCell)).to.be.ok;
    });
  });

  describe('wrapped fields in custom editor', () => {
    let grid, inputWrapper;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="custom"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.querySelector('[path="custom"]').editModeRenderer = (root) => {
        root.innerHTML = `
          <div>
            <input type="text">
            <input type="text">
          </div>
        `;
      };
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
      grid._debouncerStopEdit?.flush();

      expect(getCellEditor(customCell)).to.be.ok;
    });
  });

  describe('horizontal scrolling to cell', () => {
    let grid;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name" header="Name"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.querySelector('[path="name"]').renderer = indexNameRenderer;

      grid.items = createItems();
      grid.style.width = '100px'; // Column default min width is 100px
      flushGrid(grid);
    });

    it('should scroll to the right on tab when editable cell is outside the viewport', async () => {
      const firstCell = getContainerCell(grid.$.items, 1, 0);
      dblclick(firstCell._content);

      await sendKeys({ press: 'Tab' });

      expect(grid.$.table.scrollLeft).to.be.at.least(100);
    });

    it('should scroll to the left on tab when editable cell is outside the viewport', async () => {
      const firstCell = getContainerCell(grid.$.items, 1, 1);
      dblclick(firstCell._content);

      await sendKeys({ press: 'Shift+Tab' });

      expect(grid.$.table.scrollLeft).to.closeTo(1, 1);
    });
  });

  describe('item-property-changed event', () => {
    let grid, column, firstCell, input;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name" header="Name"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.querySelector('[path="name"]').renderer = indexNameRenderer;
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
          <vaadin-grid-pro-edit-column path="name" header="Name"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.querySelector('[path="name"]').renderer = indexNameRenderer;
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

    it('should cancel editing when disabled is set to true', async () => {
      const cell = getContainerCell(grid.$.items, 1, 0);
      const oldContent = cell._content.textContent;
      enter(cell);
      grid.disabled = true;
      await nextFrame();
      expect(cell._content.textContent).to.equal(oldContent);
    });
  });

  describe('disable editing for individual cells', () => {
    let grid, amountColumn;

    function isCellEditable(row, col) {
      const cell = getContainerCell(grid.$.items, row, col);
      enter(cell);
      const isEditable = !!getCellEditor(cell);
      esc(cell);
      return isEditable;
    }

    function hasEditablePart(row, col) {
      const cell = getContainerCell(grid.$.items, row, col);
      const target = cell._focusButton || cell;
      return !!target.getAttribute('part')?.includes('editable-cell');
    }

    function triggersNavigatingState(row, col) {
      const cell = getContainerCell(grid.$.items, row, col);
      // Mimic the real events sequence to avoid using fake focus shim from grid
      cell.dispatchEvent(new CustomEvent('mousedown', { bubbles: true, composed: true }));
      return grid.hasAttribute('navigating');
    }

    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-column path="id"></vaadin-grid-column>
          <vaadin-grid-pro-edit-column path="status"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="amount"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="notes"></vaadin-grid-pro-edit-column>
        </vaadin-grid-pro>
      `);
      grid.items = [
        { id: 1, status: 'draft', amount: 100, notes: 'foo' },
        { id: 2, status: 'completed', amount: 200, notes: 'bar' },
      ];
      // Disable editing for the amount when status is completed
      amountColumn = grid.querySelector('[path="amount"]');
      amountColumn.isCellEditable = (model) => model.item.status !== 'completed';
      flushGrid(grid);
      await nextFrame();
    });

    it('should not show editor when cell is not editable', () => {
      // Cells in first row are editable
      expect(isCellEditable(0, 1)).to.be.true;
      expect(isCellEditable(0, 2)).to.be.true;
      expect(isCellEditable(0, 3)).to.be.true;
      // Amount cell in second row is not editable
      expect(isCellEditable(1, 1)).to.be.true;
      expect(isCellEditable(1, 2)).to.be.false;
      expect(isCellEditable(1, 3)).to.be.true;
    });

    it('should show editor when cell becomes editable after updating provider function', () => {
      // Not editable initially
      expect(isCellEditable(1, 2)).to.be.false;
      // Enable editing
      amountColumn.isCellEditable = () => true;
      expect(isCellEditable(1, 2)).to.be.true;
    });

    it('should show editor when cell becomes editable after removing provider function', () => {
      // Not editable initially
      expect(isCellEditable(1, 2)).to.be.false;
      // Remove provider
      amountColumn.isCellEditable = null;
      expect(isCellEditable(1, 2)).to.be.true;
    });

    it('should stop editing when cell becomes non-editable after updating provider function', async () => {
      // Enable editing
      amountColumn.isCellEditable = () => true;
      const cell = getContainerCell(grid.$.items, 1, 2);
      enter(cell);
      expect(getCellEditor(cell)).to.be.ok;
      // Disable editing
      amountColumn.isCellEditable = () => false;
      await nextFrame();
      expect(getCellEditor(cell)).to.be.not.ok;
    });

    it('should not add editable-cell part to non-editable cells', () => {
      expect(hasEditablePart(0, 0)).to.be.false;
      expect(hasEditablePart(0, 1)).to.be.true;
      expect(hasEditablePart(0, 2)).to.be.true;
      expect(hasEditablePart(0, 3)).to.be.true;
      expect(hasEditablePart(1, 0)).to.be.false;
      expect(hasEditablePart(1, 1)).to.be.true;
      expect(hasEditablePart(1, 2)).to.be.false;
      expect(hasEditablePart(1, 3)).to.be.true;
    });

    it('should update part name when cell becomes editable after updating provider function', async () => {
      // Not editable initially
      expect(hasEditablePart(1, 2)).to.be.false;
      // Enable editing
      amountColumn.isCellEditable = () => true;
      await nextFrame();
      expect(hasEditablePart(1, 2)).to.be.true;
    });

    it('should not be in navigating state when clicking non-editable cells', () => {
      expect(triggersNavigatingState(0, 1)).to.be.true;
      expect(triggersNavigatingState(0, 2)).to.be.true;
      expect(triggersNavigatingState(1, 1)).to.be.true;
      expect(triggersNavigatingState(1, 2)).to.be.false;
    });

    it('should be in navigating state when cell becomes editable after updating provider function', () => {
      // Not editable initially
      expect(triggersNavigatingState(1, 2)).to.be.false;
      // Enable editing
      amountColumn.isCellEditable = () => true;
      expect(triggersNavigatingState(1, 2)).to.be.true;
    });

    describe('async data provider', () => {
      let dataProviderCallbacks;

      function flushDataProvider() {
        dataProviderCallbacks.forEach((cb) => cb()); // NOSONAR
        dataProviderCallbacks = [];
      }

      beforeEach(() => {
        grid.items = undefined;
        dataProviderCallbacks = [];
        /* prettier-ignore */
        grid.dataProvider = ({ page, pageSize }, callback) => { // NOSONAR
          const items = [...Array(pageSize).keys()].map((i) => {
            return {
              id: page * pageSize + i,
              status: 'draft',
              amount: 100,
              notes: 'foo'
            };
          });

          dataProviderCallbacks.push(() => callback(items, pageSize * 2));
        };
        amountColumn.isCellEditable = () => true; // NOSONAR
      });

      it('should add editable-cell part to rows that are not in loading state ', () => {
        flushDataProvider();
        expect(hasEditablePart(1, 2)).to.be.true;
      });

      it('should remove editable-cell part for rows that enter loading state', () => {
        flushDataProvider();
        grid.clearCache();
        expect(hasEditablePart(1, 2)).to.be.false;
      });
    });

    describe('editor navigation', () => {
      beforeEach(async () => {
        // Five rows, only second and forth are editable
        grid.items = [
          { id: 1, status: 'completed', amount: 100, notes: 'foo' },
          { id: 2, status: 'draft', amount: 200, notes: 'bar' },
          { id: 3, status: 'completed', amount: 100, notes: 'foo' },
          { id: 4, status: 'draft', amount: 100, notes: 'foo' },
          { id: 5, status: 'completed', amount: 200, notes: 'bar' },
        ];
        grid.querySelectorAll('vaadin-grid-pro-edit-column').forEach((column) => {
          column.isCellEditable = (model) => model.item.status !== 'completed';
        });
        flushGrid(grid);
        await nextFrame();
      });

      describe('with Tab', () => {
        it('should skip non-editable cells when navigating with Tab', async () => {
          let cell = getContainerCell(grid.$.items, 1, 2);
          cell.focus();
          await sendKeys({ press: 'Enter' });
          expect(getCellEditor(cell)).to.be.ok;

          await sendKeys({ press: 'Tab' });
          cell = getContainerCell(grid.$.items, 1, 3);
          expect(getCellEditor(cell)).to.be.ok;

          // Should skip non-editable row
          await sendKeys({ press: 'Tab' });
          cell = getContainerCell(grid.$.items, 3, 1);
          expect(getCellEditor(cell)).to.be.ok;

          await sendKeys({ press: 'Tab' });
          cell = getContainerCell(grid.$.items, 3, 2);
          expect(getCellEditor(cell)).to.be.ok;
        });

        it('should skip non-editable cells when navigating with Shift-Tab', async () => {
          let cell = getContainerCell(grid.$.items, 3, 2);
          cell.focus();
          await sendKeys({ press: 'Enter' });
          expect(getCellEditor(cell)).to.be.ok;

          await sendKeys({ press: 'Shift+Tab' });
          cell = getContainerCell(grid.$.items, 3, 1);
          expect(getCellEditor(cell)).to.be.ok;

          // Should skip non-editable rows
          await sendKeys({ press: 'Shift+Tab' });
          cell = getContainerCell(grid.$.items, 1, 3);
          expect(getCellEditor(cell)).to.be.ok;

          await sendKeys({ press: 'Shift+Tab' });
          cell = getContainerCell(grid.$.items, 1, 2);
          expect(getCellEditor(cell)).to.be.ok;
        });

        it('should skip cells that become non-editable after editing current cell', async () => {
          // Edit status in row 2 to be completed, so none of the cells in this
          // row should be editable anymore
          let cell = getContainerCell(grid.$.items, 1, 1);
          cell.focus();
          await sendKeys({ press: 'Enter' });
          const input = getCellEditor(cell);
          input.value = 'completed';
          await sendKeys({ press: 'Tab' });

          // Should skip to row 4
          cell = getContainerCell(grid.$.items, 3, 1);
          expect(getCellEditor(cell)).to.be.ok;
        });

        it('should stop editing and focus last edited cell if there are no more editable cells with Tab', async () => {
          const cell = getContainerCell(grid.$.items, 3, 3);
          cell.focus();
          await sendKeys({ press: 'Enter' });
          expect(getCellEditor(cell)).to.be.ok;
          expect(grid.querySelector('vaadin-grid-pro-edit-text-field')).to.be.ok;

          await sendKeys({ press: 'Tab' });
          expect(grid.querySelector('vaadin-grid-pro-edit-text-field')).to.not.be.ok;
          const target = cell._focusButton || cell;
          expect(grid.shadowRoot.activeElement).to.equal(target);
          expect(grid.hasAttribute('navigating')).to.be.true;
        });

        it('should stop editing and focus last edited cell if there are no more editable cells with Shift-Tab', async () => {
          const cell = getContainerCell(grid.$.items, 1, 1);
          cell.focus();
          await sendKeys({ press: 'Enter' });
          expect(getCellEditor(cell)).to.be.ok;
          expect(grid.querySelector('vaadin-grid-pro-edit-text-field')).to.be.ok;

          await sendKeys({ press: 'Shift+Tab' });
          expect(grid.querySelector('vaadin-grid-pro-edit-text-field')).to.not.be.ok;
          const target = cell._focusButton || cell;
          expect(grid.shadowRoot.activeElement).to.equal(target);
          expect(grid.hasAttribute('navigating')).to.be.true;
        });
      });

      describe('with Enter', () => {
        beforeEach(() => {
          grid.enterNextRow = true;
        });

        it('should skip non-editable cells when navigating with Enter', async () => {
          let cell = getContainerCell(grid.$.items, 1, 1);
          cell.focus();
          await sendKeys({ press: 'Enter' });
          expect(getCellEditor(cell)).to.be.ok;

          await sendKeys({ press: 'Enter' });
          cell = getContainerCell(grid.$.items, 3, 1);
          expect(getCellEditor(cell)).to.be.ok;
        });

        it('should skip non-editable cells when navigating with Shift-Enter', async () => {
          let cell = getContainerCell(grid.$.items, 3, 1);
          cell.focus();
          await sendKeys({ press: 'Enter' });
          expect(getCellEditor(cell)).to.be.ok;

          await sendKeys({ press: 'Shift+Enter' });
          cell = getContainerCell(grid.$.items, 1, 1);
          expect(getCellEditor(cell)).to.be.ok;
        });

        it('should stop editing and focus last edited cell if there are no more editable cells with Enter', async () => {
          const cell = getContainerCell(grid.$.items, 3, 1);
          cell.focus();
          await sendKeys({ press: 'Enter' });
          expect(getCellEditor(cell)).to.be.ok;
          expect(grid.querySelector('vaadin-grid-pro-edit-text-field')).to.be.ok;

          await sendKeys({ press: 'Enter' });
          expect(grid.querySelector('vaadin-grid-pro-edit-text-field')).to.not.be.ok;
          const target = cell._focusButton || cell;
          expect(grid.shadowRoot.activeElement).to.equal(target);
          expect(grid.hasAttribute('navigating')).to.be.true;
        });

        it('should stop editing and focus last edited cell if there are no more editable cells with Shift-Enter', async () => {
          const cell = getContainerCell(grid.$.items, 1, 1);
          cell.focus();
          await sendKeys({ press: 'Enter' });
          expect(getCellEditor(cell)).to.be.ok;
          expect(grid.querySelector('vaadin-grid-pro-edit-text-field')).to.be.ok;

          await sendKeys({ press: 'Shift+Enter' });
          expect(grid.querySelector('vaadin-grid-pro-edit-text-field')).to.not.be.ok;
          const target = cell._focusButton || cell;
          expect(grid.shadowRoot.activeElement).to.equal(target);
          expect(grid.hasAttribute('navigating')).to.be.true;
        });
      });
    });
  });

  describe('vertical scrolling', () => {
    let grid, input, firstCell;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name" header="Name"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.querySelector('[path="name"]').renderer = indexNameRenderer;
      grid.size = 1000;
      grid.dataProvider = infiniteDataProvider;
      flushGrid(grid);
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
          <vaadin-grid-pro-edit-column path="name" header="Name"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.querySelector('[path="name"]').renderer = indexNameRenderer;
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

    (isMac ? it : it.skip)('should call focus on the div element inside of the editable cell', () => {
      cell = getContainerCell(grid.$.items, 0, 0);
      const spy = sinon.spy(cell.firstChild, 'focus');
      cell.focus();
      expect(spy.calledOnce).to.be.true;
    });
  });

  (isMac ? describe : describe.skip)('role attribute', () => {
    let grid, firstCell, input;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.items = createItems();

      flushGrid(grid);
      firstCell = getContainerCell(grid.$.items, 0, 0);
    });

    it('should set role="button" on the focusable div inside the editable cell', () => {
      expect(firstCell.firstChild.getAttribute('role')).to.equal('button');
    });

    it('should remove role from the focusable div when entering edit mode', () => {
      enter(firstCell);
      expect(firstCell.firstChild.hasAttribute('role')).to.be.false;
    });

    it('should restore role on the focusable div after exiting edit mode', () => {
      enter(firstCell);
      expect(firstCell.firstChild.hasAttribute('role')).to.be.false;
      input = getCellEditor(firstCell);
      enter(input);
      expect(firstCell.firstChild.getAttribute('role')).to.equal('button');
    });
  });

  describe('grid behaviour', () => {
    let grid, cell;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name" header="Name"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="married" editor-type="checkbox"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.querySelector('[path="name"]').renderer = indexNameRenderer;
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

      it('should not fire the event on checkbox click in the editable column', async () => {
        cell = getContainerCell(grid.$.items, 0, 1);
        dblclick(cell._content);
        await nextFrame();
        cell._content.querySelector('input[type=checkbox]').click();
        expect(activeItemChangedSpy.called).to.be.false;
      });

      it('should fire the event on cell click in the not editable column', () => {
        cell = getContainerCell(grid.$.items, 0, 3);
        cell._content.click();
        expect(activeItemChangedSpy.called).to.be.true;
      });

      it('should not fire the event on focusable content click in the not editable column', () => {
        cell = getContainerCell(grid.$.items, 0, 3);
        cell._content.append(document.createElement('button'));
        cell._content.querySelector('button').click();
        expect(activeItemChangedSpy.called).to.be.false;
      });

      it('should not cancel click events on editable column cells', () => {
        const clickSpy = sinon.spy();
        grid.addEventListener('click', clickSpy);
        cell = getContainerCell(grid.$.items, 0, 1);
        cell._content.click();
        expect(clickSpy.called).to.be.true;
        expect(clickSpy.getCall(0).args[0].defaultPrevented).to.be.false;
      });
    });
  });

  describe('part attribute', () => {
    let grid, rows;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name" header="Name"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.querySelector('[path="name"]').renderer = indexNameRenderer;
      grid.items = createItems();
      flushGrid(grid);
      rows = Array.from(getRows(grid.$.items));
    });

    it('should have editable-cell attribute on edit column cells', () => {
      const editColumnCells = flatMap(rows, (row) => getRowCells(row).slice(0, 2));
      expect(editColumnCells).to.have.lengthOf(6);
      editColumnCells.forEach((cell) => {
        const target = cell._focusButton || cell;
        expect(target.getAttribute('part')).to.contain('editable-cell');
      });
    });

    it('should not have editable-cell attribute on normal column cells', () => {
      const normalColumnCells = rows.map((row) => getRowCells(row)[2]);
      expect(normalColumnCells).to.have.lengthOf(3);
      normalColumnCells.forEach((cell) => {
        expect(cell.getAttribute('part')).to.not.contain('editable-cell');
      });
    });
  });

  describe('row details', () => {
    let grid, rows;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name" header="Name"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.querySelector('[path="name"]').renderer = indexNameRenderer;
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
