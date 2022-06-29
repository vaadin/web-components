import { expect } from '@esm-bundle/chai';
import { fixtureSync, isIOS, keyDownOn } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-grid.js';
import { flushGrid, getBodyCellContent, getCell, getContainerCell } from './helpers.js';

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
        const text = document.createTextNode(`${model.index} ${model.item.foo}`);
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
        root.innerHTML = `${model.index} test`;
      };
      expect(getCell(grid, 0)._content.innerHTML).to.eql('0 test');
      expect(getCell(grid, 1)._content.innerHTML).to.eql('1 test');
    });

    it('should clear the content when changing the renderer', () => {
      column.renderer = (_root, _column, _model) => {};

      expect(getCell(grid, 0)._content.textContent).to.be.empty;
      expect(getCell(grid, 1)._content.textContent).to.be.empty;
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

      it('should pass the `root`, `owner`, `model` arguments to the renderer', () => {
        const detailsCell = getBodyCellContent(grid, 0, 1);

        grid.rowDetailsRenderer = sinon.spy();
        grid.detailsOpenedItems = [grid.items[0]];

        expect(grid.rowDetailsRenderer.calledOnce).to.be.true;
        expect(grid.rowDetailsRenderer.thisValues[0]).to.equal(grid);
        expect(grid.rowDetailsRenderer.args[0][0]).to.equal(detailsCell);
        expect(grid.rowDetailsRenderer.args[0][1]).to.equal(grid);
        expect(grid.rowDetailsRenderer.args[0][2]).to.deep.equal({
          index: 0,
          level: 0,
          expanded: false,
          selected: false,
          detailsOpened: true,
          item: grid.items[0],
        });
      });

      it('should allow to change the renderer', () => {
        grid.detailsOpenedItems = grid.items;
        grid.rowDetailsRenderer = function (root, owner, model) {
          root.innerHTML = `${model.index} test`;
        };
        flushGrid(grid);
        expect(getBodyCellContent(grid, 0, 1).innerHTML).to.eql('0 test');
        expect(getBodyCellContent(grid, 1, 1).innerHTML).to.eql('1 test');
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
        flushGrid(grid);
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
    let headerCell;

    beforeEach(() => {
      column.headerRenderer = (root) => {
        root.textContent = 'header';
      };

      flushGrid(grid);

      headerCell = getHeaderCell(grid);
    });

    it('should have valid content when renderer is set', () => {
      expect(headerCell._content.textContent).to.eql('header');
    });

    it('should have a visible header with headerRenderer', () => {
      column.headerRenderer = (root) => {
        root.textContent = 'foo';
      };
      const newColumn = document.createElement('vaadin-grid-column');
      newColumn.headerRenderer = (root) => {
        root.textContent = 'bar';
      };
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

    it('should clear the content when changing the renderer', () => {
      column.headerRenderer = (_root, _column) => {};

      expect(headerCell._content.textContent).to.be.empty;
    });
  });

  describe('footer cell', () => {
    let footerCell;

    beforeEach(() => {
      column.footerRenderer = (root) => {
        root.textContent = 'footer';
      };

      flushGrid(grid);

      footerCell = getFooterCell(grid);
    });

    it('should have valid content when renderer is set', () => {
      expect(footerCell._content.textContent).to.eql('footer');
    });

    it('should clear the content when changing the renderer', () => {
      column.footerRenderer = (_root, _column) => {};

      expect(footerCell._content.textContent).to.be.empty;
    });
  });

  it('should run renderers when requesting content update', () => {
    column.renderer = sinon.spy();
    column.headerRenderer = sinon.spy();
    column.footerRenderer = sinon.spy();
    grid.rowDetailsRenderer = sinon.spy();
    grid.detailsOpenedItems = grid.items;
    const renderers = [column.renderer, column.headerRenderer, column.footerRenderer, grid.rowDetailsRenderer];
    flushGrid(grid);

    renderers.forEach((renderer) => renderer.resetHistory());
    grid.requestContentUpdate();

    renderers.forEach((renderer) => {
      expect(renderer.called).to.be.true;
    });
  });
});
