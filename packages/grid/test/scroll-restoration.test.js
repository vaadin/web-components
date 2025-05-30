import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, isFirefox } from '@vaadin/testing-helpers';
import './grid-test-styles.js';
import '../src/vaadin-grid.js';
import { fire, flushGrid, infiniteDataProvider } from './helpers.js';

if (isFirefox) {
  // This suite tests a fix for an issue in Firefox where switching visibility
  // of two grids causes the scroll position of the first grid to be reset to 0,
  // and the scroll position of the second grid is synchronized from the first
  // grid.
  // See https://github.com/vaadin/web-components/issues/5796
  describe('scroll restoration in Firefox', () => {
    let grid1, grid2;

    beforeEach(() => {
      const fixture = fixtureSync(`
      <div>
        <vaadin-grid style="height: 200px; width: 200px;" size="100">
          <vaadin-grid-column header="foo"></vaadin-grid-column>
        </vaadin-grid>
        <vaadin-grid style="height: 200px; width: 200px;" hidden size="100">
          <vaadin-grid-column header="bar"></vaadin-grid-column>
        </vaadin-grid>
      </div>
    `);
      const grids = fixture.querySelectorAll('vaadin-grid');
      grids.forEach((grid) => {
        grid.querySelector('vaadin-grid-column').renderer = (root, _, model) => {
          root.textContent = model.index;
        };
        grid.dataProvider = infiniteDataProvider;
        flushGrid(grid);
      });
      grid1 = grids[0];
      grid2 = grids[1];
    });

    function toggleVisibility() {
      grid1.hidden = !grid1.hidden;
      grid2.hidden = !grid2.hidden;
    }

    it('should restore scroll position when showing grids', async () => {
      // Scroll grid
      grid1.$.table.scrollTop = 300;
      fire('scroll', {}, { node: grid1.$.table });
      flushGrid(grid1);
      await aTimeout(50);

      // Hide first grid, show second grid
      toggleVisibility();
      await aTimeout(50);

      // Hide second grid, show first grid again
      toggleVisibility();
      await aTimeout(50);

      // Scroll position for first grid should still be 300
      expect(grid1.$.table.scrollTop).to.equal(300);

      // Show second grid again
      toggleVisibility();
      await aTimeout(50);

      // Scroll position for first grid should still be 0
      expect(grid2.$.table.scrollTop).to.equal(0);
    });
  });
}
