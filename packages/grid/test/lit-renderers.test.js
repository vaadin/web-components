import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { render, html } from 'lit';
import '../vaadin-grid.js';
import '../vaadin-grid-column.js';
import { flushGrid } from './helpers.js';

describe('lit renderers', () => {
  let grid, column;

  function getCell(container, { row, col }) {
    return container.children[row].querySelectorAll('[part~="cell"]')[col];
  }

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.items = ['item1'];
    column = grid.firstElementChild;

    flushGrid(grid);
  });

  describe('header renderer', () => {
    let cell;

    beforeEach(() => {
      column.headerRenderer = (root) => {
        render(html`Header`, root);
      };

      cell = getCell(grid.$.header, { row: 0, col: 0 });
    });

    it('should render the content', () => {
      expect(cell._content.textContent).to.equal('Header');
    });

    it('should render new content after assigning a new renderer', () => {
      column.headerRenderer = (root) => {
        render(html`New Header`, root);
      };

      expect(cell._content.textContent).to.equal('New Header');
    });
  });

  describe('footer renderer', () => {
    let cell;

    beforeEach(() => {
      column.footerRenderer = (root) => {
        render(html`Footer`, root);
      };

      cell = getCell(grid.$.footer, { row: 0, col: 0 });
    });

    it('should render the content', () => {
      expect(cell._content.textContent).to.equal('Footer');
    });

    it('should render new content after assigning a new renderer', () => {
      column.footerRenderer = (root) => {
        render(html`New Footer`, root);
      };

      expect(cell._content.textContent).to.equal('New Footer');
    });
  });

  describe('body renderer', () => {
    let cell;

    beforeEach(() => {
      column.renderer = (root) => {
        render(html`Item`, root);
      };

      cell = getCell(grid.$.items, { row: 0, col: 0 });
    });

    it('should render the content', () => {
      expect(cell._content.textContent).to.equal('Item');
    });

    it('should render new content after assigning a new renderer', () => {
      column.renderer = (root) => {
        render(html`New Item`, root);
      };

      expect(cell._content.textContent).to.equal('New Item');
    });
  });

  describe('row details renderer', () => {
    let cell;

    beforeEach(() => {
      grid.rowDetailsRenderer = (root) => {
        render(html`Row Details`, root);
      };

      grid.openItemDetails(grid.items[0]);

      cell = getCell(grid.$.items, { row: 0, col: 1 /* column count + 1 = the row details cell */ });
    });

    it('should render the content', () => {
      expect(cell._content.textContent).to.equal('Row Details');
    });

    it('should render new content after assigning a new renderer', () => {
      grid.rowDetailsRenderer = (root) => {
        render(html`New Row Details`, root);
      };

      expect(cell._content.textContent).to.equal('New Row Details');
    });
  });
});
