import { expect } from '@esm-bundle/chai';
import { enter, fixtureSync, nextFrame, tab } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-grid-pro.js';
import '../vaadin-grid-pro-edit-column.js';
import { html, render } from 'lit';
import { until } from 'lit/directives/until.js';
import { flushGrid, getCellEditor } from './helpers.js';

describe('lit', () => {
  describe('edit column', () => {
    describe('edit mode renderer', () => {
      let grid, column, cell;

      function getCell(container, { row, col }) {
        return container.children[row].querySelectorAll('[part~="cell"]')[col];
      }

      beforeEach(() => {
        grid = fixtureSync(`
          <vaadin-grid-pro>
            <vaadin-grid-pro-edit-column path="name"></vaadin-grid-pro-edit-column>
          </vaadin-grid-pro>
        `);
        grid.items = [{ name: 'Item' }];

        column = grid.firstElementChild;
        column.renderer = (root) => {
          render(html`Item`, root);
        };
        column.editModeRenderer = (root) => {
          render(html`<input /> Edit Item`, root);
        };

        flushGrid(grid);

        cell = getCell(grid.$.items, { row: 0, col: 0 });
      });

      it('should render the content', () => {
        expect(cell._content.textContent).to.equal('Item');
      });

      describe('edit mode', () => {
        beforeEach(() => {
          enter(cell._content);
        });

        it('should enter the edit mode', () => {
          expect(cell._content.textContent.trim()).to.equal('Edit Item');
        });

        it('should exit the edit mode', () => {
          enter(cell._content);

          expect(cell._content.textContent).to.equal('Item');
        });
      });

      describe('asynchronous renderer', () => {
        beforeEach(() => {
          // Add another edit column with an asynchronous Lit renderer
          const newColumn = document.createElement('vaadin-grid-pro-edit-column');
          newColumn.path = 'name';

          newColumn.renderer = (root, _, model) => {
            const lazyNode = new Promise((resolve) => {
              const node = document.createElement('div');
              node.innerText = model.item.name;
              resolve(node);
            });

            render(until(lazyNode), root);
          };

          grid.appendChild(newColumn);

          flushGrid(grid);
        });

        it('should not throw on edited cell change', async () => {
          sinon.stub(console, 'error');

          // Enter edit mode
          enter(cell._content);
          await nextFrame();

          // Tab to the new column cell
          tab(getCellEditor(cell));
          await nextFrame();
          await nextFrame();

          // Expect no errors
          expect(console.error.called).to.be.false;
          console.error.restore();
        });
      });
    });
  });
});
