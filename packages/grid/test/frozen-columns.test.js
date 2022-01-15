import { expect } from '@esm-bundle/chai';
import { fixtureSync, listenOnce, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '../vaadin-grid.js';
import {
  flushGrid,
  getRowCells,
  getRows,
  infiniteDataProvider,
  isWithinParentConstraints,
  onceResized
} from './helpers.js';

// Returns true if the element's computed transform style matches with the
// computed transform style of a div element with the given transform applied
const transformsEqual = (element, transform) => {
  const div = document.createElement('div');
  div.style.transform = transform;
  const computedTransform = getComputedStyle(element).transform;
  document.body.appendChild(div);
  const computedTransformDiv = getComputedStyle(div).transform;
  div.remove();
  return computedTransform === computedTransformDiv;
};

['ltr', 'rtl'].forEach((direction) => {
  describe(`frozen columns ${direction}`, () => {
    let grid;
    let columns;
    const isRTL = direction === 'rtl';

    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-grid style="width: 200px; height: 400px;" size="10">
          <vaadin-grid-column frozen>
            <template>foo</template>
            <template class="header">foo</template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template>bar</template>
            <template class="header">bar</template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template>baz</template>
            <template class="header">baz</template>
          </vaadin-grid-column>
        </vaadin-grid>
      `);
      grid.dataProvider = infiniteDataProvider;
      columns = grid.querySelectorAll('vaadin-grid-column');
      document.documentElement.setAttribute('dir', direction);

      flushGrid(grid);
      await nextRender(grid);
    });

    after(() => document.documentElement.removeAttribute('dir'));

    it('should have last frozen only when there are frozen columns', () => {
      expect(columns[0]._lastFrozen).to.be.true;

      columns[0].frozen = false;
      await nextFrame();

      expect(columns[0]._lastFrozen).to.be.false;
    });

    ['header', 'body'].forEach((container) => {
      describe(container, () => {
        const defaultCellWidth = 100;
        let containerElement;
        let containerRows;
        let scrollbarWidth;
        let borderWidth;
        let translateValue;

        beforeEach(() => {
          containerElement = grid.shadowRoot.querySelector(container === 'header' ? 'thead' : 'tbody');
          containerRows = getRows(containerElement);
          scrollbarWidth = grid.$.table.offsetWidth - grid.$.table.clientWidth;
          borderWidth = parseInt(getComputedStyle(grid).getPropertyValue('--_lumo-grid-border-width'));
          translateValue = isRTL ? -(defaultCellWidth + 2 * borderWidth) : defaultCellWidth;
        });

        it('should have a frozen cell in a row', () => {
          const cells = getRowCells(containerRows[0]);
          expect(cells[0].hasAttribute('frozen')).to.be.true;
          expect(cells[1].hasAttribute('frozen')).not.to.be.true;
          expect(cells[2].hasAttribute('frozen')).not.to.be.true;
        });

        it('should have the correct last-frozen cell in a row', async () => {
          grid._columnTree[0][1].frozen = true;
          await nextFrame();
          containerRows = getRows(containerElement);
          const cells = getRowCells(containerRows[0]);
          expect(cells[0].hasAttribute('last-frozen')).not.to.be.true;
          expect(cells[1].hasAttribute('last-frozen')).to.be.true;
          expect(cells[2].hasAttribute('last-frozen')).not.to.be.true;
        });

        it('should not move while content scrolls horizontally', (done) => {
          const cells = getRowCells(containerRows[0]);
          grid.style.borderWidth = '0px';

          listenOnce(grid.$.table, 'scroll', () => {
            expect(isWithinParentConstraints(cells[0], grid.$.table)).to.equal(true);
            expect(isWithinParentConstraints(cells[2], grid.$.table)).to.equal(true);
            done();
          });

          grid.__setNormalizedScrollLeft(grid.$.table, isRTL ? scrollbarWidth : defaultCellWidth);
        });

        it('should update transforms when frozen columns decrease', (done) => {
          let cells = getRowCells(containerRows[0]);

          listenOnce(grid.$.table, 'scroll', () => {
            expect(transformsEqual(cells[0], 'translate(' + translateValue + 'px, 0px)')).to.be.true;

            grid._columnTree[0][0].frozen = false;
            flushGrid(grid);
            cells = getRowCells(getRows(containerElement)[0]);
            grid._debouncerCacheElements.flush();

            expect(transformsEqual(cells[0], '')).to.be.true;
            done();
          });
          grid.__setNormalizedScrollLeft(grid.$.table, isRTL ? scrollbarWidth : defaultCellWidth);
        });

        it('should update transforms when frozen columns increase', (done) => {
          let cells = getRowCells(containerRows[0]);

          listenOnce(grid.$.table, 'scroll', () => {
            expect(transformsEqual(cells[1], '')).to.be.true;

            grid._columnTree[0][1].frozen = true;
            flushGrid(grid);
            cells = getRowCells(getRows(containerElement)[0]);
            grid._debouncerCacheElements.flush();

            expect(transformsEqual(cells[1], 'translate(' + translateValue + 'px, 0px)')).to.be.true;
            done();
          });
          grid.__setNormalizedScrollLeft(grid.$.table, isRTL ? scrollbarWidth : defaultCellWidth);
        });

        it('should have the correct last-frozen cell in a row with hidden columns', async () => {
          grid._columnTree[0][1].frozen = grid._columnTree[0][2].frozen = true;
          await nextFrame();

          containerRows = getRows(containerElement);
          const cells = getRowCells(containerRows[0]);

          expect(cells[0].hasAttribute('last-frozen')).not.to.be.true;
          expect(cells[1].hasAttribute('last-frozen')).not.to.be.true;
          expect(cells[2].hasAttribute('last-frozen')).to.be.true;

          grid._columnTree[0][2].hidden = true;
          await nextFrame();

          expect(cells[0].hasAttribute('last-frozen')).not.to.be.true;
          expect(cells[1].hasAttribute('last-frozen')).to.be.true;
          expect(cells[2].hasAttribute('last-frozen')).not.to.be.true;
        });
      });
    });
  });

  describe(`columns frozen to end ${direction}`, () => {
    let grid;
    let columns;
    const isRTL = direction === 'rtl';

    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-grid style="width: 200px; height: 400px;" size="10">
          <vaadin-grid-column>
            <template>foo</template>
            <template class="header">foo</template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template>bar</template>
            <template class="header">bar</template>
          </vaadin-grid-column>
          <vaadin-grid-column frozen-to-end>
            <template>baz</template>
            <template class="header">baz</template>
          </vaadin-grid-column>
        </vaadin-grid>
      `);
      grid.dataProvider = infiniteDataProvider;
      columns = grid.querySelectorAll('vaadin-grid-column');
      document.documentElement.setAttribute('dir', direction);

      flushGrid(grid);
      await nextRender(grid);
    });

    it('should have first frozen to end only when there are frozen columns', () => {
      expect(columns[2]._firstFrozenToEnd).to.be.true;

      columns[2].frozenToEnd = false;

      expect(columns[2]._firstFrozenToEnd).to.be.false;
    });

    it('should not set frozen-to-end on sizer cells', () => {
      const sizerCell = grid.$.sizer.lastElementChild;
      expect(sizerCell.hasAttribute('frozen-to-end')).to.be.false;
      expect(sizerCell.hasAttribute('first-frozen-to-end')).to.be.false;
    });

    it('should not transform frozen-to-end sizer cells', () => {
      const sizerCell = grid.$.sizer.lastElementChild;
      expect(getComputedStyle(sizerCell).transform).to.equal('none');
    });

    ['header', 'body'].forEach((container) => {
      describe(container, () => {
        const defaultCellWidth = 100;
        let containerElement;
        let containerRows;
        let scrollbarWidth;
        let borderWidth;
        let translateValue;

        beforeEach(() => {
          containerElement = grid.shadowRoot.querySelector(container === 'header' ? 'thead' : 'tbody');
          containerRows = getRows(containerElement);
          scrollbarWidth = grid.$.table.offsetWidth - grid.$.table.clientWidth;
          borderWidth = parseInt(getComputedStyle(grid).getPropertyValue('--_lumo-grid-border-width'));
          const offset = defaultCellWidth + scrollbarWidth + 2 * borderWidth;
          translateValue = isRTL ? offset : -offset;
        });

        it('should have a frozen-to-end cell in a row', () => {
          const cells = getRowCells(containerRows[0]);
          expect(cells[0].hasAttribute('frozen-to-end')).not.to.be.true;
          expect(cells[1].hasAttribute('frozen-to-end')).not.to.be.true;
          expect(cells[2].hasAttribute('frozen-to-end')).to.be.true;
        });

        it('should have the correct first-frozen-to-end cell in a row', () => {
          grid._columnTree[0][1].frozenToEnd = true;
          containerRows = getRows(containerElement);
          const cells = getRowCells(containerRows[0]);
          expect(cells[0].hasAttribute('first-frozen-to-end')).not.to.be.true;
          expect(cells[1].hasAttribute('first-frozen-to-end')).to.be.true;
          expect(cells[2].hasAttribute('first-frozen-to-end')).not.to.be.true;
        });

        it('should update transforms when frozen columns decrease', () => {
          const cells = getRowCells(getRows(containerElement)[0]);
          expect(transformsEqual(cells[2], 'translate(' + translateValue + 'px, 0px)')).to.be.true;

          grid._columnTree[0][2].frozenToEnd = false;
          grid._debouncerCacheElements.flush();

          expect(transformsEqual(cells[2], '')).to.be.true;
        });

        it('should update transforms when frozen columns increase', () => {
          const cells = getRowCells(getRows(containerElement)[0]);
          expect(transformsEqual(cells[1], '')).to.be.true;

          grid._columnTree[0][1].frozenToEnd = true;
          grid._debouncerCacheElements.flush();

          expect(transformsEqual(cells[1], 'translate(' + translateValue + 'px, 0px)')).to.be.true;
        });

        it('should re-position cells on grid element resize', async () => {
          const cells = getRowCells(getRows(containerElement)[0]);
          const x = cells[2].getBoundingClientRect().x;

          grid.style.width = '300px';
          await onceResized(grid);

          expect(cells[2].getBoundingClientRect().x).to.equal(isRTL ? x - 100 : x + 100);
        });

        it('should have the correct first-frozen-to-end cell in a row with hidden columns', () => {
          grid._columnTree[0][0].frozenToEnd = grid._columnTree[0][1].frozenToEnd = true;

          containerRows = getRows(containerElement);
          const cells = getRowCells(containerRows[0]);

          expect(cells[0].hasAttribute('first-frozen-to-end')).to.be.true;
          expect(cells[1].hasAttribute('first-frozen-to-end')).not.to.be.true;
          expect(cells[2].hasAttribute('first-frozen-to-end')).not.to.be.true;

          grid._columnTree[0][0].hidden = true;

          expect(cells[0].hasAttribute('first-frozen-to-end')).not.to.be.true;
          expect(cells[1].hasAttribute('first-frozen-to-end')).to.be.true;
          expect(cells[2].hasAttribute('first-frozen-to-end')).not.to.be.true;
        });
      });
    });
  });
});
