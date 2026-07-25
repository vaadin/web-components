import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-grid.js';
import { flushGrid, getBodyCellContent } from './helpers.js';

function getRowFirstCell(grid, rowIndex) {
  return grid.$.items.children[rowIndex].children[0];
}

describe('events', () => {
  let grid, column, spy;

  afterEach(async () => {
    await resetMouse();
  });

  describe('cell-activate', () => {
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

      spy = sinon.spy();
      grid.addEventListener('cell-activate', spy);
    });

    it('should fire on cell click', async () => {
      await sendMouseToElement({ type: 'click', element: getBodyCellContent(grid, 0, 0) });
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

    it('should not fire on focusable element click', async () => {
      column.renderer = (root) => {
        root.innerHTML = '<input>';
      };
      await sendMouseToElement({ type: 'click', element: getBodyCellContent(grid, 0, 0).firstElementChild });
      expect(spy).not.to.be.called;
    });

    it('should not fire on label click', async () => {
      column.renderer = (root) => {
        root.innerHTML = '<label for="foo">foo label</label><input id="foo">';
      };
      await sendMouseToElement({ type: 'click', element: getBodyCellContent(grid, 0, 0).firstElementChild });
      expect(spy).not.to.be.called;
    });
  });

  describe('row-activate', () => {
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

  describe('cell-focus', () => {
    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-column header="Header 0"></vaadin-grid-column>
          <vaadin-grid-column header="Header 1"></vaadin-grid-column>
        </vaadin-grid>
      `);
      grid.querySelectorAll('vaadin-grid-column').forEach((column, index) => {
        column.renderer = (root, _owner, model) => {
          root.textContent = `${model.index} ${model.item}`;
        };
        column.footerRenderer = (root) => {
          root.textContent = `Footer ${index}`;
        };
      });
      grid.items = ['foo', 'bar'];
      flushGrid(grid);
      await nextFrame();

      spy = sinon.spy();
      grid.addEventListener('cell-focus', spy);
    });

    it('should fire on header cell keyboard focus', async () => {
      // Focus header cell
      await sendKeys({ press: 'Tab' });
      expect(spy).to.be.calledOnce;

      const e = spy.firstCall.args[0];
      expect(e.detail.context).to.be.deep.equal({
        column: grid.querySelector('vaadin-grid-column'),
        section: 'header',
      });
    });

    it('should fire on footer cell keyboard focus', async () => {
      // Focus header cell
      await sendKeys({ press: 'Tab' });
      // Focus body cell
      await sendKeys({ press: 'Tab' });
      spy.resetHistory();

      // Focus footer cell
      await sendKeys({ press: 'Tab' });
      expect(spy).to.be.calledOnce;

      const e = spy.firstCall.args[0];
      expect(e.detail.context).to.be.deep.equal({
        column: grid.querySelector('vaadin-grid-column'),
        section: 'footer',
      });
    });

    it('should fire on body cell keyboard focus', async () => {
      // Focus header cell
      await sendKeys({ press: 'Tab' });
      spy.resetHistory();

      // Focus body cell
      await sendKeys({ press: 'Tab' });
      expect(spy).to.be.calledOnce;

      const e = spy.firstCall.args[0];
      expect(e.detail.context).to.be.deep.equal({
        column: grid.querySelector('vaadin-grid-column'),
        detailsOpened: false,
        expanded: false,
        hasChildren: false,
        index: 0,
        item: 'foo',
        level: 0,
        section: 'body',
        selected: false,
      });
    });

    it('should fire on cell content mousedown', async () => {
      const cell = getRowFirstCell(grid, 0);
      await sendMouseToElement({ type: 'move', element: cell._content });
      await sendMouse({ type: 'down' });
      expect(spy).to.be.calledOnce;
    });

    it('should fire on cell content mousedown when grid is in shadow DOM', async () => {
      // Move grid into a shadow DOM
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.attachShadow({ mode: 'open' });
      container.shadowRoot.appendChild(grid);
      await nextFrame();

      const cell = getRowFirstCell(grid, 0);
      await sendMouseToElement({ type: 'move', element: cell._content });
      await sendMouse({ type: 'down' });
      expect(spy).to.be.calledOnce;
    });

    it('should fire on cell content child mousedown', async () => {
      const cell = getRowFirstCell(grid, 0);
      const span = document.createElement('span');
      span.textContent = 'span';
      cell._content.appendChild(span);

      await sendMouseToElement({ type: 'move', element: span });
      await sendMouse({ type: 'down' });
      expect(spy).to.be.calledOnce;
    });
  });

  describe('cell-focus + lazy data provider', () => {
    let dataProviderCallbacks;

    function flushDataProvider() {
      dataProviderCallbacks.forEach((cb) => cb());
      dataProviderCallbacks = [];
    }

    function lazyDataProvider({ page, pageSize }, callback) {
      const items = [...Array(pageSize).keys()].map((i) => {
        return {
          name: `name-${page * pageSize + i}`,
        };
      });

      dataProviderCallbacks.push(() => callback(items, 1000));
    }

    beforeEach(async () => {
      dataProviderCallbacks = [];
      grid = fixtureSync(`
          <vaadin-grid>
            <vaadin-grid-column path="name"></vaadin-grid-column>
          </vaadin-grid>
        `);
      grid.dataProvider = lazyDataProvider;
      flushGrid(grid);
      flushDataProvider();

      // Focus the first body cell
      await sendMouseToElement({ type: 'click', element: getRowFirstCell(grid, 0) });
      spy = sinon.spy();
      grid.addEventListener('cell-focus', spy);
    });

    it('should fire for lazily loaded item', async () => {
      const expectedContext = {
        column: grid.querySelector('vaadin-grid-column'),
        detailsOpened: false,
        hasChildren: false,
        expanded: false,
        index: 999,
        item: { name: 'name-999' },
        level: 0,
        section: 'body',
        selected: false,
      };

      // Keyboard navigate to the last row cell
      await sendKeys({ press: 'Control+End' });

      flushDataProvider();
      await nextFrame();

      expect(spy).to.be.calledOnce;
      const e = spy.firstCall.args[0];
      expect(e.detail.context).to.be.deep.equal(expectedContext);
    });

    it('should not fire on scroll', async () => {
      grid.scrollToIndex(Infinity);

      flushDataProvider();
      await nextFrame();

      expect(spy).not.to.be.called;
    });

    it('should not fire an additional event when navigating in body', async () => {
      // Keyboard navigate to the last row cell
      await sendKeys({ press: 'Control+End' });
      // Keyboard navigate back to the first row cell
      await sendKeys({ press: 'Control+Home' });

      flushDataProvider();
      await nextFrame();

      expect(spy).to.be.calledOnce;
      const e = spy.firstCall.args[0];
      expect(e.detail.context.item).to.be.deep.equal({ name: 'name-0' });
    });

    it('should not fire an additional event when navigating to head', async () => {
      // Keyboard navigate to the last row cell
      await sendKeys({ press: 'Control+End' });
      // Keyboard navigate to header
      await sendKeys({ press: 'Shift+Tab' });

      flushDataProvider();
      await nextFrame();

      expect(spy).to.be.calledOnce;
      const e = spy.firstCall.args[0];
      expect(e.detail.context.section).to.be.equal('header');
    });

    it('should not fire an additional event when navigating back from head', async () => {
      // Scroll half way down to get grid in loading state
      grid.scrollToIndex(500);
      await sendKeys({ press: 'ArrowDown' });

      // Keyboard navigate to header
      await sendKeys({ press: 'Shift+Tab' });
      flushDataProvider();
      // Keyboard navigate back to body
      await sendKeys({ press: 'Tab' });
      spy.resetHistory();
      // Scroll to bottom
      grid.scrollToIndex(Infinity);

      flushDataProvider();
      await nextFrame();
      expect(spy).not.to.be.called;
    });

    it('should not fire when grid has no focus', async () => {
      // Keyboard navigate to the last row cell
      await sendKeys({ press: 'Control+End' });
      // Blur grid
      const focusable = fixtureSync('<input>');
      focusable.focus();

      spy.resetHistory();
      flushDataProvider();

      expect(spy).not.to.be.called;
    });
  });
});
