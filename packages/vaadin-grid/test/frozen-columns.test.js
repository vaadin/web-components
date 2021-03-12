import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import {
  flushGrid,
  getRows,
  getRowCells,
  infiniteDataProvider,
  isVisible,
  isWithinParentConstraints,
  listenOnce,
  wheel
} from './helpers.js';
import '../vaadin-grid.js';

['ltr', 'rtl'].forEach((direction) => {
  describe(`frozen columns ${direction}`, () => {
    let grid;
    let columns;
    const isRTL = direction === 'rtl';

    beforeEach(() => {
      grid = grid = fixtureSync(`
        <vaadin-grid style="width: 200px; height: 400px;" size="10">
          <vaadin-grid-column frozen>
            <template>foo</template>
            <template class="header">foo</template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template>foo</template>
            <template class="header">foo</template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template>foo</template>
            <template class="header">foo</template>
          </vaadin-grid-column>
        </vaadin-grid>
      `);
      grid.dataProvider = infiniteDataProvider;
      columns = grid.querySelectorAll('vaadin-grid-column');
      document.documentElement.setAttribute('dir', direction);

      flushGrid(grid);
    });

    after(() => document.documentElement.removeAttribute('dir'));

    !isRTL &&
      it('should not throw on scrolling when dir changed to rtl after frozen columns set', () => {
        columns[0].frozen = true;
        grid._debouncerCacheElements.flush();
        grid.setAttribute('dir', 'rtl');
        // Emulate scrolling with the wheel
        expect(() => wheel(grid, 1, 1)).not.to.throw(Error);
      });

    it('should have last frozen only when there are frozen columns', () => {
      expect(columns[0]._lastFrozen).to.be.true;

      columns[0].frozen = false;

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

        it('should have the correct last-frozen cell in a row', () => {
          grid._columnTree[0][1].frozen = true;
          containerRows = getRows(containerElement);
          const cells = getRowCells(containerRows[0]);
          expect(cells[0].hasAttribute('last-frozen')).not.to.be.true;
          expect(cells[1].hasAttribute('last-frozen')).to.be.true;
          expect(cells[2].hasAttribute('last-frozen')).not.to.be.true;
        });

        it('should not move while content scrolls horizontally', (done) => {
          const cells = getRowCells(containerRows[0]);

          listenOnce(grid.$.table, 'scroll', () => {
            if (isRTL) {
              expect(isWithinParentConstraints(cells[0], grid.$.table)).to.equal(true);
              expect(isWithinParentConstraints(cells[2], grid.$.table)).to.equal(true);
            } else {
              expect(isVisible(cells[0])).to.equal(true);
              expect(isVisible(cells[2])).to.equal(true);
            }
            done();
          });

          grid.__setNormalizedScrollLeft(grid.$.table, isRTL ? scrollbarWidth : defaultCellWidth);
        });

        // Test passes locally but fails in Travis
        const isChrome = !!/Chrome/.test(navigator.userAgent);
        (isChrome ? it.skip : it)('should update transforms when frozen columns decrease', (done) => {
          let cells = getRowCells(containerRows[0]);

          listenOnce(grid.$.table, 'scroll', () => {
            const expected = ['translate(' + translateValue + 'px, 0px)', 'translate(' + translateValue + 'px)'];
            expect(expected).to.include(cells[0].style.transform);

            grid._columnTree[0][0].frozen = false;
            cells = getRowCells(getRows(containerElement)[0]);
            grid._debouncerCacheElements.flush();

            expect(cells[0].style.transform).to.be.empty;
            done();
          });
          grid.__setNormalizedScrollLeft(grid.$.table, isRTL ? scrollbarWidth : defaultCellWidth);
        });

        (isChrome ? it.skip : it)('should update transforms when frozen columns increase', (done) => {
          let cells = getRowCells(containerRows[0]);

          listenOnce(grid.$.table, 'scroll', () => {
            expect(cells[1].style.transform).to.eql('');

            grid._columnTree[0][1].frozen = true;
            cells = getRowCells(getRows(containerElement)[0]);
            grid._debouncerCacheElements.flush();

            const expected = ['translate(' + translateValue + 'px, 0px)', 'translate(' + translateValue + 'px)'];
            expect(expected).to.include(cells[1].style.transform);
            done();
          });
          grid.__setNormalizedScrollLeft(grid.$.table, isRTL ? scrollbarWidth : defaultCellWidth);
        });

        it('should have the correct last-frozen cell in a row with hidden columns', () => {
          grid._columnTree[0][1].frozen = grid._columnTree[0][2].frozen = true;

          containerRows = getRows(containerElement);
          const cells = getRowCells(containerRows[0]);

          expect(cells[0].hasAttribute('last-frozen')).not.to.be.true;
          expect(cells[1].hasAttribute('last-frozen')).not.to.be.true;
          expect(cells[2].hasAttribute('last-frozen')).to.be.true;

          grid._columnTree[0][2].hidden = true;

          expect(cells[0].hasAttribute('last-frozen')).not.to.be.true;
          expect(cells[1].hasAttribute('last-frozen')).to.be.true;
          expect(cells[2].hasAttribute('last-frozen')).not.to.be.true;
        });
      });
    });
  });
});
