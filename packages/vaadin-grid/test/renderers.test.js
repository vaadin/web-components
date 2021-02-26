import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { keyDownOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import { flushGrid, getBodyCellContent, getCell, getContainerCell, isIOS } from './helpers.js';
import '../vaadin-grid.js';

function getHeaderCell(grid, index = 0) {
  return grid.$.header.querySelectorAll('[part~="cell"]')[index];
}

function getFooterCell(grid, index = 0) {
  return grid.$.footer.querySelectorAll('[part~="cell"]')[index];
}

describe('renderers', () => {
  let grid, column;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid>
    `);
    column = grid.firstElementChild;
    grid.items = [{ foo: 'bar' }, { foo: 'baz' }];
  });

  describe('column cells', () => {
    beforeEach(() => {
      column.renderer = function (root, owner, model) {
        root.innerHTML = '';
        const text = document.createTextNode(model.index + ' ' + model.item.foo);
        root.appendChild(text);
      };

      flushGrid(grid);
    });

    it('should have valid content when renderer is set', () => {
      expect(getCell(grid, 0)._content.innerHTML).to.eql('0 bar');
      expect(getCell(grid, 1)._content.innerHTML).to.eql('1 baz');
    });

    it('should be able to get model from cell parentElement', () => {
      const model = grid.__getRowModel(getCell(grid, 0).parentElement);
      expect(model).to.ok;
      expect(model.item.foo).to.be.eql('bar');
    });

    it('should pass column as `owner` and `this` to the renderer', () => {
      column.renderer = function (root, owner) {
        expect(this).to.eql(owner);
        expect(owner.localName).to.eql('vaadin-grid-column');
      };
    });

    it('should allow to change the renderer', () => {
      column.renderer = function (root, owner, model) {
        root.innerHTML = model.index + ' test';
      };
      expect(getCell(grid, 0)._content.innerHTML).to.eql('0 test');
      expect(getCell(grid, 1)._content.innerHTML).to.eql('1 test');
    });

    it('should throw an error when setting a template if there is already a renderer', () => {
      expect(() => (column._bodyTemplate = {})).to.throw(Error);
    });

    it('should initialize with instance properties', () => {
      column.renderer = function (root, owner, model) {
        expect(model.selected).to.be.false;
        expect(model.expanded).to.be.false;
        expect(model.detailsOpened).to.be.false;
        expect(model.level).to.equal(0);
      };
    });

    describe('row details', () => {
      beforeEach(() => {
        grid.rowDetailsRenderer = column.renderer;
        flushGrid(grid);
      });

      it('should have valid content when renderer is set', () => {
        grid.detailsOpenedItems = grid.items;
        expect(getBodyCellContent(grid, 0, 1).innerHTML).to.eql('0 bar');
        expect(getBodyCellContent(grid, 1, 1).innerHTML).to.eql('1 baz');
      });

      it('should be open when renderer is set', () => {
        grid.detailsOpenedItems = grid.items;
        expect(getContainerCell(grid.$.items, 1, 1).hidden).to.be.false;
      });

      it('should pass column as `owner` and `this` to the renderer', () => {
        grid.rowDetailsRenderer = function (root, owner) {
          expect(this).to.eql(owner);
          expect(owner.localName).to.eql('vaadin-grid');
        };
        grid.detailsOpenedItems = grid.items;
      });

      it('should allow to change the renderer', () => {
        grid.detailsOpenedItems = grid.items;
        grid.rowDetailsRenderer = function (root, owner, model) {
          root.innerHTML = model.index + ' test';
        };
        expect(getBodyCellContent(grid, 0, 1).innerHTML).to.eql('0 test');
        expect(getBodyCellContent(grid, 1, 1).innerHTML).to.eql('1 test');
      });

      it('should throw an error when setting a template if there is already a renderer', () => {
        expect(() => (grid._rowDetailsTemplate = {})).to.throw(Error);
      });

      it('should not invoke body cell renderer on assign', () => {
        column.renderer = sinon.spy();
        column.renderer.resetHistory();
        grid.rowDetailsRenderer = () => {};
        expect(column.renderer.called).to.be.false;
      });

      it('should invoke body cell renderer on assign if there are open details', () => {
        grid.detailsOpenedItems = grid.items;
        column.renderer = sinon.spy();
        column.renderer.resetHistory();
        grid.rowDetailsRenderer = () => {};
        expect(column.renderer.called).to.be.true;
      });

      it('should invoke only once per open details cell', () => {
        grid.rowDetailsRenderer = sinon.spy();
        grid.rowDetailsRenderer.resetHistory();
        grid.detailsOpenedItems = [grid.items[0]];
        expect(grid.rowDetailsRenderer.calledOnce).to.be.true;
      });

      it('should not invoke body renderers on detailsOpenedItems assign', () => {
        grid.rowDetailsRenderer = undefined;
        column.renderer = sinon.spy();
        column.renderer.resetHistory();
        grid.detailsOpenedItems = [grid.items[0]];
        expect(column.renderer.called).to.be.false;
      });
    });

    describe('cell-activate', () => {
      let spy;

      beforeEach(() => {
        spy = sinon.spy();
        grid.addEventListener('cell-activate', spy);
      });

      it('should fire a `cell-activate` event with correct model on cell click', () => {
        getCell(grid, 0)._content.click();
        expect(spy.calledOnce).to.be.true;

        const e = spy.firstCall.args[0];
        expect(e.detail.model.index).to.eql(0);
        expect(e.detail.model.item).to.be.ok;
      });

      (isIOS ? it.skip : it)('should fire a `cell-activate` event with correct model on space', () => {
        keyDownOn(getCell(grid, 0) || grid.shadowRoot.activeElement, 32, [], ' ');
        expect(spy.calledOnce).to.be.true;

        const e = spy.firstCall.args[0];
        expect(e.detail.model.index).to.eql(0);
        expect(e.detail.model.item).to.be.ok;
      });
    });
  });

  describe('header cell', () => {
    beforeEach(() => {
      column.headerRenderer = (root) => {
        root.innerHTML = 'RDR header';
      };

      flushGrid(grid);
    });

    it('should have valid content when renderer is set', () => {
      expect(getHeaderCell(grid)._content.innerHTML).to.eql('RDR header');
    });

    it('should throw an error when setting a template if there is already a renderer', () => {
      expect(() => (column._headerTemplate = {})).to.throw(Error);
    });

    it('should have a visible header with headerRenderer', () => {
      column.headerRenderer = (root) => (root.textContent = 'foo');
      const newColumn = document.createElement('vaadin-grid-column');
      newColumn.headerRenderer = (root) => (root.textContent = 'bar');
      grid.appendChild(newColumn);
      flushGrid(grid);
      grid.removeChild(newColumn);
      flushGrid(grid);
      expect(grid.$.header.firstElementChild.hidden).to.be.false;
    });

    it('should have a visible header with header', () => {
      column.header = 'foo';
      const newColumn = document.createElement('vaadin-grid-column');
      newColumn.header = 'bar';
      grid.appendChild(newColumn);
      flushGrid(grid);
      grid.removeChild(newColumn);
      flushGrid(grid);
      expect(grid.$.header.firstElementChild.hidden).to.be.false;
    });
  });

  describe('footer cell', () => {
    beforeEach(() => {
      column.footerRenderer = (root) => {
        root.innerHTML = 'RDR footer';
      };

      flushGrid(grid);
    });

    it('should have valid content when renderer is set', () => {
      expect(getFooterCell(grid)._content.innerHTML).to.eql('RDR footer');
    });

    it('should throw an error when setting a template if there is already a renderer', () => {
      expect(() => (column._footerTemplate = {})).to.throw(Error);
    });
  });

  describe('manual invocation', () => {
    it('should support `render()` method to invoke all the renderers', () => {
      column.renderer = sinon.spy();
      column.headerRenderer = sinon.spy();
      column.footerRenderer = sinon.spy();
      grid.rowDetailsRenderer = sinon.spy();
      grid.detailsOpenedItems = grid.items;
      const renderers = [column.renderer, column.headerRenderer, column.footerRenderer, grid.rowDetailsRenderer];
      flushGrid(grid);
      renderers.forEach((renderer) => renderer.resetHistory());
      grid.render();
      renderers.forEach((renderer) => {
        expect(renderer.called).to.be.true;
      });
    });
  });
});

describe('templates', () => {
  let grid, column;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid>
        <template class="row-details"></template>
        <vaadin-grid-column>
          <template class="header"></template>
          <template></template>
          <template class="footer"></template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);
    column = grid.querySelector('vaadin-grid-column');
    grid.items = [{ foo: 'bar' }, { foo: 'baz' }];
    flushGrid(grid);
  });

  describe('column cells', () => {
    it('should throw an error when setting a renderer if there is already a template', () => {
      expect(() => (column.renderer = () => {})).to.throw(Error);
    });
  });

  describe('row details', () => {
    it('should throw an error when setting a renderer if there is already a template', () => {
      expect(() => (grid.rowDetailsRenderer = () => {})).to.throw(Error);
    });
  });

  describe('header cell', () => {
    it('should throw an error when setting a renderer if there is already a template', () => {
      expect(() => (column.headerRenderer = () => {})).to.throw(Error);
    });
  });

  describe('footer cell', () => {
    it('should throw an error when setting a renderer if there is already a template', () => {
      expect(() => (column.footerRenderer = () => {})).to.throw(Error);
    });
  });
});
