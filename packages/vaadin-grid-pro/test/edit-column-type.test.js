import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { TextFieldElement } from '@vaadin/vaadin-text-field/src/vaadin-text-field.js';
import { SelectElement } from '@vaadin/vaadin-select/src/vaadin-select.js';
import { CheckboxElement } from '@vaadin/vaadin-checkbox/src/vaadin-checkbox.js';
import {
  arrowDown,
  arrowUp,
  createItems,
  dblclick,
  enter,
  flushGrid,
  getCellEditor,
  getContainerCell,
  keyDownChar,
  nextRender,
  onceOpened,
  space
} from './helpers.js';
import './not-animated-styles.js';
import '../vaadin-grid-pro.js';
import '../vaadin-grid-pro-edit-column.js';

describe('edit column editor type', () => {
  describe('with representation template', () => {
    let grid, cell, column, editor;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name" editor-type="text">
            <template>[[item.name]]</template>
          </vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="title" editor-type="select">
            <template>[[item.title]]</template>
          </vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="married" editor-type="checkbox">
            <template>[[item.married]]</template>
          </vaadin-grid-pro-edit-column>
          <vaadin-grid-column>
            <template>[[item.age]]</template>
          </vaadin-grid-column>
        </vaadin-grid-pro>
      `);
      grid.items = createItems();
      flushGrid(grid);
    });

    it('should render the text field to cell with text editor type specified', () => {
      column = grid.querySelectorAll('vaadin-grid-pro-edit-column')[0];
      cell = getContainerCell(grid.$.items, 0, 0);
      dblclick(cell._content);
      editor = column._getEditorComponent(cell);
      expect(editor instanceof TextFieldElement).to.equal(true);
    });

    it('should render the select to cell with select editor type specified', () => {
      column = grid.querySelectorAll('vaadin-grid-pro-edit-column')[1];
      cell = getContainerCell(grid.$.items, 0, 1);
      dblclick(cell._content);
      editor = column._getEditorComponent(cell);
      expect(editor instanceof SelectElement).to.equal(true);
    });

    it('should render the checkbox to cell with text checkbox type specified', () => {
      column = grid.querySelectorAll('vaadin-grid-pro-edit-column')[2];
      cell = getContainerCell(grid.$.items, 0, 2);
      dblclick(cell._content);
      editor = column._getEditorComponent(cell);
      expect(editor instanceof CheckboxElement).to.equal(true);
    });
  });

  describe('checkbox', () => {
    let grid, cell, column, editor;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="married"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="title"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="name"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column>
            <template>[[item.married]]</template>
          </vaadin-grid-column>
        </vaadin-gri-pro>
      `);
      grid.items = createItems();
      column = grid.firstElementChild;
      column.editorType = 'checkbox';
      flushGrid(grid);
      cell = getContainerCell(grid.$.items, 0, 0);
    });

    it('should render the checkbox to cell in edit mode', () => {
      dblclick(cell._content);
      editor = column._getEditorComponent(cell);
      expect(editor instanceof CheckboxElement).to.equal(true);
      expect(editor.checked).to.be.equal(grid.items[0].married);
    });

    it('should set focus-ring on the checkbox', () => {
      dblclick(cell._content);
      editor = column._getEditorComponent(cell);
      expect(editor.hasAttribute('focus-ring')).to.be.true;
    });

    it('should update value from checkbox checked after edit mode exit', () => {
      dblclick(cell._content);
      editor = column._getEditorComponent(cell);
      editor.click();
      enter(editor);
      expect(cell._content.textContent.trim()).to.equal('false');
      expect(grid.items[0].married).to.equal(false);
    });
  });

  describe('select', () => {
    let grid, cell, column, editor;

    describe('with options', () => {
      beforeEach(async () => {
        grid = fixtureSync(`
          <vaadin-grid-pro>
            <vaadin-grid-pro-edit-column path="married"></vaadin-grid-pro-edit-column>
            <vaadin-grid-pro-edit-column path="title"></vaadin-grid-pro-edit-column>
            <vaadin-grid-pro-edit-column path="name"></vaadin-grid-pro-edit-column>
            <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
            <vaadin-grid-column>
              <template>[[item.married]]</template>
            </vaadin-grid-column>
          </vaadin-gri-pro>
        `);
        grid.items = createItems();
        column = grid.querySelector('[path="title"]');
        column.editorType = 'select';
        column.editorOptions = ['mr', 'mrs', 'ms'];
        flushGrid(grid);
        cell = getContainerCell(grid.$.items, 0, 1);
        enter(cell._content);
        editor = getCellEditor(cell);
        await onceOpened(editor);
      });

      it('should render the opened select to cell in edit mode', () => {
        expect(editor instanceof SelectElement).to.equal(true);
        expect(editor.value).to.be.equal('mrs');
        expect(editor.opened).to.equal(true);
      });

      it('should open the select and stop focusout on editor click', async () => {
        editor.opened = false;
        editor.focusElement.click();
        const focusout = new CustomEvent('focusout', { bubbles: true, composed: true });
        editor.dispatchEvent(focusout);
        const focusin = new CustomEvent('focusin', { bubbles: true, composed: true });
        editor._overlayElement.querySelector('vaadin-item').dispatchEvent(focusin);
        grid._flushStopEdit();
        await nextRender(editor._menuElement);
        expect(editor.opened).to.equal(true);
      });

      it('should close the select and exit edit mode on outside click', () => {
        document.body.click();
        expect(editor.opened).to.equal(false);
      });

      it('should open the select on space key', async () => {
        editor.opened = false;
        space(editor.focusElement);
        await nextRender(editor._menuElement);
        expect(editor.opened).to.equal(true);
      });

      it('should open the select on arrow down key', async () => {
        editor.opened = false;
        arrowDown(editor.focusElement);
        await nextRender(editor._menuElement);
        expect(editor.opened).to.equal(true);
      });

      it('should open the select on arrow up key', async () => {
        editor.opened = false;
        arrowUp(editor.focusElement);
        await nextRender(editor._menuElement);
        expect(editor.opened).to.equal(true);
      });

      it('should update value and exit edit mode when item is selected', () => {
        grid.singleCellEdit = true;
        const item = editor._overlayElement.querySelector('vaadin-item');
        const value = item.textContent;
        const spy = sinon.spy(cell, 'focus');
        item.click();
        expect(column._getEditorComponent(cell)).to.not.be.ok;
        expect(cell._content.textContent).to.equal(value);
        expect(spy.calledOnce).to.be.true;
      });

      it('should work with `enterNextRow`', async () => {
        grid.enterNextRow = true;
        const item = editor._overlayElement.querySelector('vaadin-item');
        enter(item);
        item.click();
        expect(column._getEditorComponent(cell)).to.not.be.ok;
        const secondCell = getContainerCell(grid.$.items, 1, 1);
        expect(getCellEditor(secondCell)).to.be.ok;
      });
    });

    describe('without options', () => {
      beforeEach(async () => {
        grid = fixtureSync(`
          <vaadin-grid-pro>
            <vaadin-grid-pro-edit-column path="married"></vaadin-grid-pro-edit-column>
            <vaadin-grid-pro-edit-column path="title"></vaadin-grid-pro-edit-column>
            <vaadin-grid-pro-edit-column path="name"></vaadin-grid-pro-edit-column>
            <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
            <vaadin-grid-column>
              <template>[[item.married]]</template>
            </vaadin-grid-column>
          </vaadin-gri-pro>
        `);
        grid.items = createItems();
        column = grid.querySelector('[path="title"]');
        column.editorType = 'select';
        column.editorOptions = [];
        flushGrid(grid);
        cell = getContainerCell(grid.$.items, 0, 1);
        enter(cell._content);
        editor = getCellEditor(cell);
        await nextRender(editor);

        sinon.stub(console, 'warn');
      });

      afterEach(() => {
        console.warn.restore();
      });

      it('should render the closed select to cell in edit mode', () => {
        expect(editor instanceof SelectElement).to.equal(true);
        expect(editor.value).to.be.equal('mrs');
        expect(editor.opened).to.equal(false);
      });

      it('should not throw when moving focus out of the select', () => {
        const evt = new CustomEvent('focusout', { bubbles: true, composed: true });
        editor.dispatchEvent(evt);
        grid._debouncerStopEdit && grid._debouncerStopEdit.flush();
        expect(column._getEditorComponent(cell)).to.not.be.ok;
      });

      it('should warn about missing options on enter key', async () => {
        enter(editor.focusElement);
        expect(console.warn.called).to.be.true;
      });

      it('should warn about missing options on space key', async () => {
        space(editor.focusElement);
        expect(console.warn.called).to.be.true;
      });

      it('should warn about missing options on arrow down key', async () => {
        arrowDown(editor.focusElement);
        expect(console.warn.called).to.be.true;
      });

      it('should warn about missing options on arrow up key', async () => {
        arrowUp(editor.focusElement);
        expect(console.warn.called).to.be.true;
      });
    });
  });

  describe('edit on typing', () => {
    let grid, cell, columns, column, editor;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="married"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="title"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="name"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column>
            <template>[[item.married]]</template>
          </vaadin-grid-column>
        </vaadin-gri-pro>
      `);
      grid.items = createItems();
      flushGrid(grid);
      columns = grid._columnTree[0];
    });

    it('should start edit on typing if numeric key pressed', () => {
      column = grid.querySelector('[path="age"]');
      cell = getContainerCell(grid.$.items, 0, columns.indexOf(column));
      keyDownChar(cell._content, '1');
      editor = column._getEditorComponent(cell);
      expect(editor).to.be.ok;
    });

    it('should start edit on typing if character key pressed', () => {
      column = grid.querySelector('[path="name"]');
      cell = getContainerCell(grid.$.items, 0, columns.indexOf(column));
      keyDownChar(cell._content, 'a');
      editor = column._getEditorComponent(cell);
      expect(editor).to.be.ok;
    });

    it('should not start edit on typing when editor type set to checkbox', () => {
      column = grid.querySelector('[path="married"]');
      cell = getContainerCell(grid.$.items, 0, columns.indexOf(column));
      column.editorType = 'checkbox';
      keyDownChar(cell._content, 'a');
      editor = column._getEditorComponent(cell);
      expect(editor).to.be.not.ok;
    });

    it('should not start edit on typing when editor type set to select', () => {
      column = grid.querySelector('[path="title"]');
      cell = getContainerCell(grid.$.items, 0, columns.indexOf(column));
      column.editorType = 'select';
      column.editorOptions = ['mr', 'mrs', 'ms'];
      keyDownChar(cell._content, 'a');
      editor = column._getEditorComponent(cell);
      expect(editor).to.be.not.ok;
    });

    it('should not start edit on typing when editor type set to custom', () => {
      column = grid.querySelector('[path="married"]');
      cell = getContainerCell(grid.$.items, 0, columns.indexOf(column));
      column.editModeRenderer = (root) => {
        root.innerHTML = '<input type="checkbox">';
      };
      keyDownChar(cell._content, 'a');
      editor = column._getEditorComponent(cell);
      expect(editor).to.be.not.ok;
    });
  });
});
