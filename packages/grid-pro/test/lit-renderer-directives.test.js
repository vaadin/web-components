import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-grid-pro.js';
import '../vaadin-grid-pro-edit-column.js';
import { html, render } from 'lit';
import { columnHeaderRenderer } from '@vaadin/grid/lit.js';
import { columnEditModeRenderer } from '../lit.js';
import { createItems, getCellContent, getContainerCell } from './helpers.js';

async function renderGrid(container, { header, items, editMode }) {
  render(
    html`<vaadin-grid-pro .items="${items}">
      <vaadin-grid-pro-edit-column
        path="name"
        ${header ? columnHeaderRenderer(() => html`${header}`, header) : null}
        ${editMode ? columnEditModeRenderer(() => html`<div>${editMode}</div>`, editMode) : null}
      ></vaadin-grid-pro-edit-column>
    </vaadin-grid-pro>`,
    container,
  );
  await nextFrame();
  return container.querySelector('vaadin-grid-pro');
}

describe('lit renderer directives', () => {
  let container, grid, column, items;

  beforeEach(() => {
    items = createItems();
    container = fixtureSync('<div></div>');
  });

  describe('columnEditModeRenderer', () => {
    describe('basic', () => {
      let cell;

      beforeEach(async () => {
        grid = await renderGrid(container, { items, editMode: 'Edit Mode Content' });
        cell = getContainerCell(grid.$.items, 0, 0);
        column = grid.querySelector('vaadin-grid-pro-edit-column');
      });

      it('should set `editModeRenderer` property when the directive is attached', () => {
        expect(column.editModeRenderer).to.exist;
      });

      it('should unset `editModeRenderer` property when the directive is detached', async () => {
        await renderGrid(container, { items });
        expect(column.editModeRenderer).not.to.exist;
      });

      it('should render the content with the renderer when switching to edit mode', () => {
        fire(getCellContent(cell), 'dblclick');
        expect(getCellContent(cell).textContent).to.equal('Edit Mode Content');
      });

      it('should re-render the content when the cell is in edit mode and a renderer dependency changes', async () => {
        fire(getCellContent(cell), 'dblclick');
        await renderGrid(container, { items, editMode: 'New Edit Mode Content' });
        expect(getCellContent(cell).textContent).to.equal('New Edit Mode Content');
      });
    });

    describe('arguments', () => {
      let rendererSpy;

      beforeEach(async () => {
        rendererSpy = sinon.spy(() => html`<input />`);
        render(
          html`<vaadin-grid-pro .items="${items}">
            <vaadin-grid-pro-edit-column
              path="name"
              ${columnEditModeRenderer(rendererSpy)}
            ></vaadin-grid-pro-edit-column>
          </vaadin-grid-pro>`,
          container,
        );
        await nextFrame();
        grid = container.querySelector('vaadin-grid-pro');
        column = grid.querySelector('vaadin-grid-pro-edit-column');

        const cell = getContainerCell(grid.$.items, 0, 0);
        fire(getCellContent(cell), 'dblclick');
      });

      it('should pass the item to the renderer', () => {
        expect(rendererSpy.firstCall.args[0]).to.equal(items[0]);
      });

      it('should pass the model to the renderer', () => {
        const cell = getContainerCell(grid.$.items, 0, 0);
        const model = grid.__getRowModel(cell.parentElement);
        expect(rendererSpy.firstCall.args[1]).to.deep.equal(model);
      });

      it('should pass the column instance to the renderer', () => {
        expect(rendererSpy.firstCall.args[2]).to.equal(column);
      });
    });
  });

  describe('multiple renderers', () => {
    beforeEach(async () => {
      grid = await renderGrid(container, {
        items,
        header: 'Header',
        editMode: 'Edit Mode Content',
      });
    });

    it('should only request one content update when triggering multiple renderers to update', async () => {
      const spy = sinon.spy(grid, 'requestContentUpdate');
      await renderGrid(container, {
        items,
        header: 'New Header',
        editMode: 'New Edit Mode Content',
      });
      expect(spy.callCount).to.equal(1);
    });
  });
});
