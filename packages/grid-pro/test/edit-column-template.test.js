import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { enter, esc, fixtureSync, space } from '@vaadin/testing-helpers';
import '@vaadin/vaadin-template-renderer';
import { createItems, dblclick, flushGrid, getCellEditor, getContainerCell } from './helpers.js';
import '../vaadin-grid-pro.js';
import '../vaadin-grid-pro-edit-column.js';

describe('edit column template', () => {
  describe('default', () => {
    let grid, column, cell, input;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name">
            <template class="header">Name</template>
            <template>[[index]] [[item.name]]</template>
            <template class="footer"></template>
          </vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column id="custom" path="name">
            <template>[[item.name]]</template>
            <template class="editor">
              <input value="{{item.name::input}}">
            </template>
          </vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age">
            <template class="editor">
              <input type="number" value="{{item.age::input}}">
            </template>
          </vaadin-grid-pro-edit-column>
        </vaadin-grid-pro>
      `);
      column = grid.firstElementChild;
      grid.items = createItems();

      flushGrid(grid);
      cell = getContainerCell(grid.$.items, 0, 0);
    });

    it('should replace template and render text-field on editable cell dblclick', () => {
      dblclick(cell._content);
      expect(cell._template).to.be.not.ok;
      expect(cell._renderer).to.be.ok;
      expect(getCellEditor(cell)).to.be.ok;
    });

    it('should not call start edit on second dblclick if the cell is in edit mode', () => {
      const spy = sinon.spy(grid, '_startEdit');
      dblclick(cell._content);
      input = getCellEditor(cell);
      dblclick(input);
      expect(spy.calledOnce).to.be.true;
    });

    it('should replace template and render text-field on editable cell Enter', () => {
      enter(cell);
      expect(cell._template).to.be.not.ok;
      expect(cell._renderer).to.be.ok;
      expect(getCellEditor(cell)).to.be.ok;
    });

    it('should replace template and render text-field on editable cell Space', () => {
      space(cell);
      expect(cell._template).to.be.not.ok;
      expect(cell._renderer).to.be.ok;
      expect(getCellEditor(cell)).to.be.ok;
    });

    it('should restore template and render updated content on edited cell Enter', () => {
      enter(cell);
      input = getCellEditor(cell);
      input.value = 'new';
      enter(input);
      expect(cell._renderer).to.equal(column.renderer);
      expect(getCellEditor(cell)).to.be.not.ok;
      expect(cell._content.textContent).to.equal('0 new');
    });

    it('should restore template and reset old content on edited cell Esc', () => {
      const old = cell._content.textContent;
      enter(cell);
      input = getCellEditor(cell);
      input.value = 'new';
      esc(input);
      expect(cell._renderer).to.equal(column.renderer);
      expect(getCellEditor(cell)).to.be.not.ok;
      expect(cell._content.textContent).to.equal(old);
    });
  });

  describe('custom edit mode template', () => {
    let grid, column, cell, input;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid-pro>
          <vaadin-grid-pro-edit-column path="name">
            <template class="header">Name</template>
            <template>[[index]] [[item.name]]</template>
            <template class="footer"></template>
          </vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column id="custom" path="name">
            <template>[[item.name]]</template>
            <template class="editor">
              <input value="{{item.name::input}}">
            </template>
          </vaadin-grid-pro-edit-column>
          <vaadin-grid-pro-edit-column path="age">
            <template class="editor">
              <input type="number" value="{{item.age::input}}">
            </template>
          </vaadin-grid-pro-edit-column>
        </vaadin-grid-pro>
      `);
      grid.items = createItems();
      flushGrid(grid);
    });

    it('should stamp the edit mode template to cell when entering edit mode', () => {
      column = grid.querySelector('#custom');
      cell = getContainerCell(grid.$.items, 0, 1);
      dblclick(cell._content);
      expect(cell._template).to.equal(column._editModeTemplate);
      expect(cell._content.querySelector('input')).to.be.ok;
    });

    it('should restore the cell body template after edit mode exit', () => {
      column = grid.querySelector('#custom');
      cell = getContainerCell(grid.$.items, 0, 1);
      dblclick(cell._content);
      input = cell._content.querySelector('input');
      input.value = 'New';
      enter(input);
      expect(cell._renderer).to.equal(column.renderer);
      expect(cell._content.textContent).to.equal('New');
      expect(cell._content.querySelector('input')).to.not.be.ok;
    });

    it('should restore the cell path renderer after edit mode exit', () => {
      column = grid.querySelector('[path="age"]');
      cell = getContainerCell(grid.$.items, 0, 2);
      dblclick(cell._content);
      input = cell._content.querySelector('input');
      input.value = '32';
      enter(input);
      expect(cell._renderer).to.be.ok;
      expect(cell._template).to.be.not.ok;
      expect(cell._content.textContent.trim()).to.equal('32');
      expect(cell._content.querySelector('input')).to.not.be.ok;
    });

    it('should set the column `editorType` to custom when template is added', () => {
      column = grid.querySelector('#custom');
      expect(column.editorType).to.be.equal('custom');
    });
  });
});
