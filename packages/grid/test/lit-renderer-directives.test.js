import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-grid.js';
import { html, render } from 'lit';
import { columnBodyRenderer, columnFooterRenderer, columnHeaderRenderer, gridRowDetailsRenderer } from '../lit.js';
import { getCellContent, getContainerCell } from './helpers.js';

async function renderGrid(container, { items, header, footer, rowDetails }) {
  render(
    html`<vaadin-grid
      .items="${items}"
      ${rowDetails ? gridRowDetailsRenderer(() => html`${rowDetails}`, rowDetails) : null}
    >
      <vaadin-grid-column
        ${items ? columnBodyRenderer((item) => html`${item}`, items) : null}
        ${header ? columnHeaderRenderer(() => html`${header}`, header) : null}
        ${footer ? columnFooterRenderer(() => html`${footer}`, footer) : null}
      ></vaadin-grid-column>
    </vaadin-grid>`,
    container,
  );
  return container.querySelector('vaadin-grid');
}

describe('lit renderer directives', () => {
  let container, grid, column;

  beforeEach(() => {
    container = fixtureSync('<div></div>');
  });

  describe('gridRowDetailsRenderer', () => {
    describe('basic', () => {
      let cell;

      beforeEach(async () => {
        grid = await renderGrid(container, { items: ['Item'], rowDetails: 'Row Details' });
        grid.openItemDetails(grid.items[0]);
        cell = getContainerCell(grid.$.items, 0, 1 /* column count + 1 = the row details cell */);
      });

      it('should set `rowDetailsRenderer` property when the directive is attached', () => {
        expect(grid.rowDetailsRenderer).to.exist;
      });

      it('should unset `rowDetailsRenderer` property when the directive is detached', async () => {
        await renderGrid(container, { items: ['Item'] });
        expect(grid.rowDetailsRenderer).not.to.exist;
      });

      it('should render the row details cell content with the renderer', () => {
        expect(getCellContent(cell).textContent).to.equal('Row Details');
      });

      it('should re-render the row details cell content when a renderer dependency changes', async () => {
        await renderGrid(container, { items: ['Item'], rowDetails: 'New Row Details' });
        expect(getCellContent(cell).textContent).to.equal('New Row Details');
      });
    });

    describe('arguments', () => {
      let rendererSpy;

      beforeEach(async () => {
        rendererSpy = sinon.spy();
        render(
          html`<vaadin-grid .items="${['Item']}" ${gridRowDetailsRenderer(rendererSpy)}>
            <vaadin-grid-column></vaadin-grid-column>
          </vaadin-grid>`,
          container,
        );
        grid = container.querySelector('vaadin-grid');
        grid.openItemDetails(grid.items[0]);
      });

      it('should pass the item to the renderer', () => {
        expect(rendererSpy.firstCall.args[0]).to.equal('Item');
      });

      it('should pass the model to the renderer', () => {
        const cell = getContainerCell(grid.$.items, 0, 1 /* column count + 1 = the row details cell */);
        const model = grid.__getRowModel(cell.parentElement);
        expect(rendererSpy.firstCall.args[1]).to.deep.equal(model);
      });

      it('should pass the grid instance to the renderer', () => {
        expect(rendererSpy.firstCall.args[2]).to.equal(grid);
      });
    });
  });

  describe('columnBodyRenderer', () => {
    describe('basic', () => {
      let cell;

      beforeEach(async () => {
        grid = await renderGrid(container, { items: ['Item'] });
        cell = getContainerCell(grid.$.items, 0, 0);
        column = grid.querySelector('vaadin-grid-column');
      });

      it('should set `renderer` property when the directive is attached', () => {
        expect(column.renderer).to.exist;
      });

      it('should unset `renderer` property when the directive is detached', async () => {
        await renderGrid(container, {});
        expect(column.renderer).not.to.exist;
      });

      it('should render the body cells content with the renderer', () => {
        expect(getCellContent(cell).textContent).to.equal('Item');
      });

      it('should re-render the body cells content when a renderer dependency changes', async () => {
        await renderGrid(container, { items: ['New Item'] });
        expect(getCellContent(cell).textContent).to.equal('New Item');
      });
    });

    describe('arguments', () => {
      let rendererSpy;

      beforeEach(async () => {
        rendererSpy = sinon.spy();
        render(
          html`<vaadin-grid .items="${['Item']}">
            <vaadin-grid-column ${columnBodyRenderer(rendererSpy)}></vaadin-grid-column>
          </vaadin-grid>`,
          container,
        );
        grid = container.querySelector('vaadin-grid');
      });

      it('should pass the item to the renderer', () => {
        expect(rendererSpy.firstCall.args[0]).to.equal('Item');
      });

      it('should pass the model to the renderer', () => {
        const cell = getContainerCell(grid.$.items, 0, 0);
        const model = grid.__getRowModel(cell.parentElement);
        expect(rendererSpy.firstCall.args[1]).to.deep.equal(model);
      });

      it('should pass the column instance to the renderer', () => {
        const column = grid.querySelector('vaadin-grid-column');
        expect(rendererSpy.firstCall.args[2]).to.equal(column);
      });
    });
  });

  describe('columnHeaderRenderer', () => {
    describe('basic', () => {
      let cell;

      beforeEach(async () => {
        grid = await renderGrid(container, { header: 'Header' });
        cell = getContainerCell(grid.$.header, 0, 0);
        column = grid.querySelector('vaadin-grid-column');
      });

      it('should set `headerRenderer` property when the directive is attached', () => {
        expect(column.headerRenderer).to.exist;
      });

      it('should unset `headerRenderer` property when the directive is detached', async () => {
        await renderGrid(container, {});
        expect(column.headerRenderer).not.to.exist;
      });

      it('should render the header cell content with the renderer', () => {
        expect(getCellContent(cell).textContent).to.equal('Header');
      });

      it('should re-render the header cell content when a renderer dependency changes', async () => {
        await renderGrid(container, { header: 'New Header' });
        expect(getCellContent(cell).textContent).to.equal('New Header');
      });
    });

    describe('arguments', () => {
      let rendererSpy;

      beforeEach(async () => {
        rendererSpy = sinon.spy();
        render(
          html`<vaadin-grid>
            <vaadin-grid-column ${columnHeaderRenderer(rendererSpy)}></vaadin-grid-column>
          </vaadin-grid>`,
          container,
        );
        grid = container.querySelector('vaadin-grid');
      });

      it('should pass the column instance to the renderer', () => {
        const column = grid.querySelector('vaadin-grid-column');
        expect(rendererSpy.firstCall.args[0]).to.equal(column);
      });
    });
  });

  describe('columnFooterRenderer', () => {
    describe('basic', () => {
      let cell;

      beforeEach(async () => {
        grid = await renderGrid(container, { footer: 'Footer' });
        cell = getContainerCell(grid.$.footer, 0, 0);
        column = grid.querySelector('vaadin-grid-column');
      });

      it('should set `footerRenderer` property when the directive is attached', () => {
        expect(column.footerRenderer).to.exist;
      });

      it('should unset `footerRenderer` property when the directive is detached', async () => {
        await renderGrid(container, {});
        expect(column.footerRenderer).not.to.exist;
      });

      it('should render the footer cell content with the renderer', () => {
        expect(getCellContent(cell).textContent).to.equal('Footer');
      });

      it('should re-render the footer cell content when a renderer dependency changes', async () => {
        await renderGrid(container, { footer: 'New Footer' });
        expect(getCellContent(cell).textContent).to.equal('New Footer');
      });
    });

    describe('arguments', () => {
      let rendererSpy;

      beforeEach(async () => {
        rendererSpy = sinon.spy();
        render(
          html`<vaadin-grid>
            <vaadin-grid-column ${columnFooterRenderer(rendererSpy)}></vaadin-grid-column>
          </vaadin-grid>`,
          container,
        );
        grid = container.querySelector('vaadin-grid');
      });

      it('should pass the column instance to the renderer', () => {
        const column = grid.querySelector('vaadin-grid-column');
        expect(rendererSpy.firstCall.args[0]).to.equal(column);
      });
    });
  });

  describe('multiple renderers', () => {
    beforeEach(async () => {
      grid = await renderGrid(container, {
        header: 'Header',
        footer: 'Footer',
        items: ['Item 1', 'Item 2'],
        rowDetails: 'Row Details',
      });
    });

    it('should only request one content update when triggering multiple renderers to update', async () => {
      const spy = sinon.spy(grid, 'requestContentUpdate');
      await renderGrid(container, {
        header: 'New Header',
        footer: 'New Footer',
        items: ['New Item 1', 'New Item 2'],
        rowDetails: 'New Row Details',
      });
      expect(spy.callCount).to.equal(1);
    });
  });
});
