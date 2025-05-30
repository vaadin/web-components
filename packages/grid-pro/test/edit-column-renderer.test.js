import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { enter, esc, fixtureSync, focusout, nextFrame, space } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-grid-pro.js';
import '../src/vaadin-grid-pro-edit-column.js';
import {
  createItems,
  dblclick,
  flushGrid,
  getCellEditor,
  getContainerCell,
  getContainerCellContent,
} from './helpers.js';

customElements.define(
  'user-editor',
  class extends HTMLElement {
    #user;

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `<input>`;
      this.user = { name: null };
    }

    get user() {
      return this.#user;
    }

    set user(value) {
      this.#user = value;
      this.shadowRoot.querySelector('input').value = value.name;
    }
  },
);

function nameRenderer(root, _, { item }) {
  root.textContent = item.name;
}

describe('edit column renderer', () => {
  describe('default mode', () => {
    let grid, column, firstCell, input;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      column = grid.firstElementChild;
      grid.items = createItems();

      column.renderer = function (root, _owner, model) {
        root.innerHTML = '';
        const wrapper = document.createElement('div');
        const text = document.createTextNode(`${model.index} ${model.item.name}`);
        wrapper.appendChild(text);
        root.appendChild(wrapper);
      };

      grid.querySelector('vaadin-grid-column').renderer = nameRenderer;

      flushGrid(grid);

      firstCell = getContainerCell(grid.$.items, 0, 0);
    });

    it('should replace renderer and render text-field on editable cell dblclick', () => {
      dblclick(firstCell._content);
      expect(firstCell._renderer).to.not.equal(column.renderer);
      expect(getCellEditor(firstCell)).to.be.ok;
    });

    it('should not call start edit on second dblclick if the cell is in edit mode', () => {
      const spy = sinon.spy(grid, '_startEdit');
      dblclick(firstCell._content);
      input = getCellEditor(firstCell);
      dblclick(input);
      expect(spy.calledOnce).to.be.true;
    });

    it('should replace renderer and render text-field on editable cell Enter', () => {
      enter(firstCell);
      expect(firstCell._renderer).to.not.equal(column.renderer);
      expect(getCellEditor(firstCell)).to.be.ok;
    });

    it('should replace renderer and render text-field on editable cell Space', () => {
      space(firstCell);
      expect(firstCell._renderer).to.not.equal(column.renderer);
      expect(getCellEditor(firstCell)).to.be.ok;
    });

    it('should restore renderer and render updated content on edited cell Enter', () => {
      enter(firstCell);
      input = getCellEditor(firstCell);
      input.value = 'new';
      enter(input);
      expect(firstCell._renderer).to.equal(column.renderer);
      expect(firstCell._content.textContent).to.equal('0 new');
    });

    it('should restore renderer and reset old content on edited cell Esc', () => {
      const old = firstCell._content.textContent;
      enter(firstCell);
      input = getCellEditor(firstCell);
      input.value = 'new';
      esc(input);
      expect(firstCell._renderer).to.equal(column.renderer);
      expect(firstCell._content.textContent).to.equal(old);
    });

    it('should updated content in the cell of another column using renderer on Enter', () => {
      enter(firstCell);
      input = getCellEditor(firstCell);
      input.value = 'new';
      enter(input);
      const secondCell = getContainerCell(grid.$.items, 0, 2);
      expect(secondCell._content.textContent).to.equal('new');
    });

    describe('single click edit', () => {
      beforeEach(() => {
        grid.editOnClick = true;
      });

      it('should enter edit mode on single click', () => {
        firstCell._content.dispatchEvent(new CustomEvent('click', { bubbles: true, composed: true }));
        expect(getCellEditor(firstCell)).to.be.ok;
      });

      it('should not enter edit mode on single click', () => {
        grid.editOnClick = false;
        firstCell._content.dispatchEvent(new CustomEvent('click', { bubbles: true, composed: true }));
        expect(getCellEditor(firstCell)).not.to.be.ok;
      });
    });
  });

  describe('custom edit mode renderer', () => {
    let grid, column, cell, editor;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.querySelector('vaadin-grid-column').renderer = nameRenderer;

      column = grid.firstElementChild;
      grid.items = createItems();
      flushGrid(grid);
      cell = getContainerCell(grid.$.items, 0, 0);
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('should call the edit mode renderer to cell when entering edit mode', () => {
      column.editModeRenderer = function (root) {
        root.innerHTML = '<input>';
      };

      dblclick(cell._content);
      expect(cell._renderer).to.equal(column.editModeRenderer);
      editor = getCellEditor(cell);
      expect(editor).to.be.ok;
      expect(editor.value).to.be.equal(grid.items[0].name);
    });

    it('should call `focus()` on the custom editor component after entering the cell edit mode', () => {
      let spy;

      column.editModeRenderer = function (root) {
        root.innerHTML = '';
        const input = document.createElement('input');
        spy = sinon.spy(input, 'focus');
        root.appendChild(input);
      };

      dblclick(cell._content);
      expect(spy.calledOnce).to.be.true;
    });

    it('should call `select()` on the custom editor component, if the <input> was rendered', () => {
      let spy;

      column.editModeRenderer = function (root) {
        root.innerHTML = '';
        const input = document.createElement('input');
        spy = sinon.spy(input, 'select');
        root.appendChild(input);
      };

      dblclick(cell._content);
      expect(spy.calledOnce).to.be.true;
    });

    it('should exit the edit mode on custom editor component focusout event', () => {
      column.editModeRenderer = function (root, _, model) {
        root.innerHTML = '';
        const input = document.createElement('input');
        input.value = model.item.name;
        root.appendChild(input);
      };

      dblclick(cell._content);
      editor = getCellEditor(cell);
      editor.value = 'Foo';
      focusout(editor);
      grid._flushStopEdit();
      expect(getCellEditor(cell)).to.not.be.ok;
      expect(cell._content.textContent).to.equal('Foo');
    });

    it('should set the column `editorType` to custom when renderer is defined', () => {
      column.editModeRenderer = function (root) {
        root.innerHTML = '<input>';
      };
      expect(column.editorType).to.be.equal('custom');
    });

    it('should reset the column `editorType` to text when renderer is removed', () => {
      column.editModeRenderer = function (root) {
        root.innerHTML = '<input>';
      };
      column.editModeRenderer = null;
      expect(column.editorType).to.be.equal('text');
    });

    it('should close editor and update value when scrolling edited cell out of view', () => {
      grid.items = null;
      grid.items = Array.from({ length: 40 }, () => ({ ...createItems()[0] }));
      flushGrid(grid);

      cell = getContainerCell(grid.$.items, 0, 0);
      column.editModeRenderer = function (root) {
        root.innerHTML = '<input>';
      };

      dblclick(cell._content);
      getCellEditor(cell).value = 'Bar';
      grid.scrollToIndex(39);
      expect(getCellEditor(cell)).to.be.not.ok;
      expect(grid.items[0].name).to.equal('Bar');

      grid.scrollToIndex(0);
      flushGrid(grid);

      expect(getContainerCellContent(grid.$.items, 0, 0).innerHTML).to.equal('Bar');
    });

    it('should not exit the edit mode if clear button is clicked in the text-field', async () => {
      column.editModeRenderer = function (root, _, model) {
        root.innerHTML = '';
        const field = document.createElement('vaadin-text-field');
        field.value = model.item.name;
        field.clearButtonVisible = true;
        root.appendChild(field);
      };
      dblclick(cell._content);
      await nextFrame();
      editor = getCellEditor(cell);

      await sendMouseToElement({ type: 'click', element: editor.$.clearButton });
      await nextFrame();
      expect(getCellEditor(cell)).to.be.ok;
    });
  });

  describe('editorValuePath property', () => {
    let grid, column, cell, editor;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column></vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.querySelector('vaadin-grid-column').renderer = nameRenderer;

      column = grid.firstElementChild;
      column.editorValuePath = 'user.name';
      column.editModeRenderer = function (root) {
        root.innerHTML = '<user-editor>';
      };
      grid.items = createItems();
      flushGrid(grid);
      cell = getContainerCell(grid.$.items, 0, 0);
    });

    it('should map the cell value to valid path passed to `editorValuePath` value', () => {
      dblclick(cell._content);
      editor = getCellEditor(cell);
      expect(editor).to.be.ok;
      expect(editor.user.name).to.be.equal(grid.items[0].name);
    });

    it('should read the updated value based on `editorValuePath` after edit mode exit', () => {
      dblclick(cell._content);
      editor = getCellEditor(cell);
      editor.user = { name: 'New' };
      enter(editor);
      expect(cell._content.textContent.trim()).to.equal('New');
      expect(grid.items[0].name).to.equal('New');
    });
  });
});
