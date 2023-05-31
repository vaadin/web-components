import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '../vaadin-grid.js';
import { fire, flushGrid, getBodyCellContent, infiniteDataProvider } from './helpers.js';

describe('hidden grid', () => {
  let grid;

  describe('initially hidden', () => {
    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-grid style="height: 200px; width: 200px;" hidden size="1">
          <vaadin-grid-column header="foo"></vaadin-grid-column>
        </vaadin-grid>
      `);
      grid.querySelector('vaadin-grid-column').renderer = (root, _, model) => {
        root.textContent = model.index;
      };
      grid.dataProvider = infiniteDataProvider;
      await nextRender();
      flushGrid(grid);
    });

    it('should be hidden', () => {
      expect(grid.offsetWidth).to.equal(0);
      expect(grid.offsetHeight).to.equal(0);
    });

    it('should have content on appear', async () => {
      grid.removeAttribute('hidden');
      await oneEvent(grid, 'animationend');
      await nextFrame();
      expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('0');
    });
  });

  describe('hiding the grid', () => {
    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid size="1000">
          <vaadin-grid-column header="foo"></vaadin-grid-column>
        </vaadin-grid>
      `);
      grid.querySelector('vaadin-grid-column').renderer = (root, _, model) => {
        root.textContent = model.index + 1;
      };
      grid.dataProvider = sinon.spy(infiniteDataProvider);
      flushGrid(grid);
      grid.dataProvider.resetHistory();
    });

    it('should keep scroll position when hiding while triggering a scroll event', () => {
      // Scroll grid
      grid.$.table.scrollTop = 300;
      flushGrid(grid);

      // Hide, simulate scroll event
      // This is a simplified reproduction of something triggering a scroll
      // event at the same time the grid is hidden.
      grid.setAttribute('hidden', '');
      fire('scroll', {}, { node: grid.$.table });

      // Should not refresh data when hidden
      expect(grid.dataProvider.called).to.be.false;

      // Show grid again, should retain scroll position
      grid.removeAttribute('hidden');
      expect(grid.$.table.scrollTop).to.equal(300);
    });
  });
});
