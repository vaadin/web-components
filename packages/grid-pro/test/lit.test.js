import { expect } from '@esm-bundle/chai';
import { enter, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../vaadin-grid-pro.js';
import '../vaadin-grid-pro-edit-column.js';
import { html, render } from 'lit';
import { flushGrid } from './helpers.js';

describe('lit', () => {
  describe('edit column', () => {
    describe('edit mode renderer', () => {
      let grid, column, cell;

      function getCell(container, { row, col }) {
        return container.children[row].querySelectorAll('[part~="cell"]')[col];
      }

      beforeEach(async () => {
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

        await nextFrame();

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
    });
  });
});
