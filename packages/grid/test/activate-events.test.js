import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, keyDownOn, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-grid.js';
import { flushGrid, getBodyCellContent, getCell } from './helpers.js';

describe('activate events', () => {
  let grid, column;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid>
    `);
    column = grid.firstElementChild;
    column.renderer = (root, _owner, model) => {
      root.textContent = `${model.index} ${model.item.name}`;
    };
    grid.items = [{ name: 'Item 0' }, { name: 'Item 1' }];
    flushGrid(grid);
    // Focus grid
    await sendKeys({ press: 'Tab' });
  });

  describe('cell-activate', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy();
      grid.addEventListener('cell-activate', spy);
    });

    it('should fire on cell click', () => {
      getBodyCellContent(grid, 0, 0).click();
      expect(spy).to.be.calledOnce;

      const e = spy.firstCall.args[0];
      expect(e.detail.model.index).to.equal(0);
      expect(e.detail.model.item).to.be.ok;
    });

    it('should fire on cell Space', async () => {
      await sendKeys({ press: 'Space' });
      expect(spy).to.be.calledOnce;

      const e = spy.firstCall.args[0];
      expect(e.detail.model.index).to.equal(0);
      expect(e.detail.model.item).to.be.ok;
    });

    it('should not fire on row Space', async () => {
      await sendKeys({ press: 'ArrowLeft' });
      await sendKeys({ press: 'Space' });
      expect(spy).not.to.be.called;
    });

    it('should not fire on focusable element click', () => {
      column.renderer = (root) => {
        root.innerHTML = '<input>';
      };
      getBodyCellContent(grid, 0, 0).firstElementChild.click();
      expect(spy).not.to.be.called;
    });

    it('should not fire on label click', () => {
      column.renderer = (root) => {
        root.innerHTML = '<label for="foo">foo label</label><input id="foo">';
      };
      getBodyCellContent(grid, 0, 0).firstElementChild.click();
      expect(spy).not.to.be.called;
    });
  });

  describe('row-activate', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy();
      grid.addEventListener('row-activate', spy);
    });

    it('should fire on row Space', async () => {
      await sendKeys({ press: 'ArrowLeft' });
      await sendKeys({ press: 'Space' });
      expect(spy).to.be.calledOnce;

      const e = spy.firstCall.args[0];
      expect(e.detail.model.index).to.equal(0);
      expect(e.detail.model.item).to.be.ok;
    });

    it('should not fire on cell Space', async () => {
      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'Space' });
      expect(spy).not.to.be.called;
    });
  });

  describe('loading row', () => {
    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-grid style="width: 200px; height: 300px;">
          <vaadin-grid-column path="foo"></vaadin-grid-column>
        </vaadin-grid>
      `);

      // Async data provider: store the latest request and resolve it on demand.
      let resolveRequest;
      grid.dataProvider = ({ page, pageSize }, callback) => {
        resolveRequest = () => {
          const items = Array.from({ length: pageSize }, (_, i) => ({ foo: `${page * pageSize + i}` }));
          callback(items, 100);
        };
      };

      flushGrid(grid);
      // Resolve the initial request so rows render with items.
      resolveRequest();
      await nextFrame();

      // Reload data and leave the request unanswered, so the rows stay loading
      // with no item.
      grid.clearCache();
      flushGrid(grid);
    });

    it('should fire a `cell-activate` event with undefined item on click', () => {
      const spy = sinon.spy();
      grid.addEventListener('cell-activate', spy);

      getCell(grid, 0)._content.click();

      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail.model.item).to.be.undefined;
    });

    it('should fire a `row-activate` event with undefined item on space', () => {
      const spy = sinon.spy();
      grid.addEventListener('row-activate', spy);

      keyDownOn(grid.$.items.children[0], 32, [], ' ');

      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail.model.item).to.be.undefined;
    });

    it('should not set activeItem on click', () => {
      getCell(grid, 0)._content.click();

      expect(grid.activeItem).to.be.null;
    });
  });
});
