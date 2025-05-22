import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import {
  arrowDown,
  arrowUp,
  enter,
  fixtureSync,
  focusin,
  focusout,
  isFirefox,
  keyDownChar,
  nextFrame,
  nextRender,
  space,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../src/vaadin-grid-pro.js';
import '../src/vaadin-grid-pro-edit-column.js';
import { createItems, dblclick, flushGrid, getCellEditor, getContainerCell, onceOpened } from './helpers.js';

function itemPropertyRenderer(root, column, model) {
  root.textContent = model.item[column.getAttribute('renderer-property')];
}

describe('edit column editor type', () => {
  describe('with representation renderer', () => {
    let grid, cell, column, editor;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column renderer-property="name" path="name" editor-type="text"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column renderer-property="title" path="title" editor-type="select"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column renderer-property="married" path="married" editor-type="checkbox"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column renderer-property="age"></vaadin-grid-column>
        </vaadin-grid-pro>
      `);

      grid.querySelectorAll('[renderer-property]').forEach((column) => {
        column.renderer = itemPropertyRenderer;
      });

      grid.items = createItems();
      flushGrid(grid);
    });

    it('should render the text field to cell with text editor type specified', () => {
      column = grid.querySelectorAll('vaadin-grid-pro-edit-column')[0];
      cell = getContainerCell(grid.$.items, 0, 0);
      dblclick(cell._content);
      editor = column._getEditorComponent(cell);
      expect(editor instanceof customElements.get('vaadin-text-field')).to.equal(true);
    });

    it('should render the select to cell with select editor type specified', () => {
      column = grid.querySelectorAll('vaadin-grid-pro-edit-column')[1];
      cell = getContainerCell(grid.$.items, 0, 1);
      dblclick(cell._content);
      editor = column._getEditorComponent(cell);
      expect(editor instanceof customElements.get('vaadin-select')).to.equal(true);
    });

    it('should render the checkbox to cell with text checkbox type specified', () => {
      column = grid.querySelectorAll('vaadin-grid-pro-edit-column')[2];
      cell = getContainerCell(grid.$.items, 0, 2);
      dblclick(cell._content);
      editor = column._getEditorComponent(cell);
      expect(editor instanceof customElements.get('vaadin-checkbox')).to.equal(true);
    });
  });

  describe('checkbox', () => {
    let grid, cell, column, checkbox;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="married"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="title"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="name"></vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age"></vaadin-grid-pro-edit-column>
          <vaadin-grid-column renderer-property="married"></vaadin-grid-column>
        </vaadin-gri-pro>
      `);

      grid.querySelectorAll('[renderer-property]').forEach((column) => {
        column.renderer = itemPropertyRenderer;
      });

      grid.items = createItems();
      column = grid.firstElementChild;
      column.editorType = 'checkbox';
      flushGrid(grid);
      cell = getContainerCell(grid.$.items, 0, 0);
    });

    it('should render the checkbox to cell in edit mode', () => {
      dblclick(cell._content);
      checkbox = column._getEditorComponent(cell);
      expect(checkbox instanceof customElements.get('vaadin-checkbox')).to.equal(true);
      expect(checkbox.checked).to.be.equal(grid.items[0].married);
    });

    it('should set focus-ring on the checkbox', async () => {
      dblclick(cell._content);
      await nextFrame();
      checkbox = column._getEditorComponent(cell);
      expect(checkbox.hasAttribute('focus-ring')).to.be.true;
    });

    it('should update value from checkbox checked after edit mode exit', async () => {
      dblclick(cell._content);
      await nextFrame();
      checkbox = column._getEditorComponent(cell);
      checkbox.click();
      enter(checkbox);
      expect(cell._content.textContent.trim()).to.equal('false');
      expect(grid.items[0].married).to.equal(false);
    });

    describe('editOnClick mode', () => {
      beforeEach(() => {
        grid.editOnClick = true;
      });

      it('should update value from checkbox checked after edit mode exit', async () => {
        cell._content.click();
        await nextFrame();
        checkbox = column._getEditorComponent(cell);
        checkbox.click();
        enter(checkbox);
        expect(cell._content.textContent.trim()).to.equal('false');
        expect(grid.items[0].married).to.equal(false);
      });
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
            <vaadin-grid-column renderer-property="married"></vaadin-grid-column>
          </vaadin-gri-pro>
        `);

        grid.querySelectorAll('[renderer-property]').forEach((column) => {
          column.renderer = itemPropertyRenderer;
        });
        grid.items = createItems();
        column = grid.querySelector('[path="title"]');
        column.editorType = 'select';
        column.editorOptions = ['mr', 'mrs', 'ms'];
        flushGrid(grid);
        cell = getContainerCell(grid.$.items, 0, 1);
        enter(cell._content);
        editor = getCellEditor(cell);
        await onceOpened(editor);
        await nextFrame();
      });

      it('should render the opened select to cell in edit mode', () => {
        expect(editor instanceof customElements.get('vaadin-select')).to.equal(true);
        expect(editor.value).to.be.equal('mrs');
        expect(editor.opened).to.equal(true);
      });

      it('should open the select and stop focusout on editor click', async () => {
        editor.opened = false;
        await nextFrame();
        editor.focusElement.click();
        focusout(editor);
        focusin(editor._overlayElement.querySelector('vaadin-select-item'));
        grid._flushStopEdit();
        await nextRender();
        expect(editor.opened).to.equal(true);
      });

      it('should close the select and exit edit mode on outside click', () => {
        document.body.click();
        expect(editor.opened).to.equal(false);
      });

      it('should open the select on space key', async () => {
        editor.opened = false;
        await nextFrame();
        space(editor.focusElement);
        await nextRender();
        expect(editor.opened).to.equal(true);
      });

      it('should open the select on arrow down key', async () => {
        editor.opened = false;
        await nextFrame();
        arrowDown(editor.focusElement);
        await nextRender();
        expect(editor.opened).to.equal(true);
      });

      it('should open the select on arrow up key', async () => {
        editor.opened = false;
        await nextFrame();
        arrowUp(editor.focusElement);
        await nextRender();
        expect(editor.opened).to.equal(true);
      });

      it('should update value and exit edit mode when item is selected', async () => {
        grid.singleCellEdit = true;
        const item = editor._overlayElement.querySelector('vaadin-select-item');
        const value = item.textContent;
        const spy = sinon.spy(cell, 'focus');
        item.click();
        await nextFrame();
        expect(column._getEditorComponent(cell)).to.not.be.ok;
        expect(cell._content.textContent).to.equal(value);
        expect(spy.called).to.be.true;
      });

      it('should work with `enterNextRow`', async () => {
        grid.enterNextRow = true;
        const item = editor._overlayElement.querySelector('vaadin-select-item');
        enter(item);
        await nextFrame();
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
            <vaadin-grid-column renderer-property="married"></vaadin-grid-column>
          </vaadin-gri-pro>
        `);

        grid.querySelectorAll('[renderer-property]').forEach((column) => {
          column.renderer = itemPropertyRenderer;
        });
        grid.items = createItems();
        column = grid.querySelector('[path="title"]');
        column.editorType = 'select';
        column.editorOptions = [];
        flushGrid(grid);
        cell = getContainerCell(grid.$.items, 0, 1);
        enter(cell._content);
        editor = getCellEditor(cell);
        await nextRender();

        sinon.stub(console, 'warn');
      });

      afterEach(() => {
        console.warn.restore();
      });

      it('should render the closed select to cell in edit mode', () => {
        expect(editor instanceof customElements.get('vaadin-select')).to.equal(true);
        expect(editor.value).to.be.equal('mrs');
        expect(editor.opened).to.equal(false);
      });

      it('should warn about missing options on enter key', () => {
        enter(editor.focusElement);
        expect(console.warn.called).to.be.true;
      });

      it('should warn about missing options on space key', () => {
        space(editor.focusElement);
        expect(console.warn.called).to.be.true;
      });

      it('should warn about missing options on arrow down key', () => {
        arrowDown(editor.focusElement);
        expect(console.warn.called).to.be.true;
      });

      it('should warn about missing options on arrow up key', () => {
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
          <vaadin-grid-column renderer-property="married"></vaadin-grid-column>
        </vaadin-gri-pro>
      `);

      grid.querySelectorAll('[renderer-property]').forEach((column) => {
        column.renderer = itemPropertyRenderer;
      });
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

    (isFirefox ? it.skip : it)('should not start edit with first character selected', async () => {
      column = grid.querySelector('[path="name"]');
      cell = getContainerCell(grid.$.items, 0, columns.indexOf(column));
      cell.focus();
      await sendKeys({ down: 'a' });
      await sendKeys({ down: 'b' });
      await sendKeys({ down: 'Enter' });
      expect(cell._content.textContent).to.equal('ab');
    });
  });
});
