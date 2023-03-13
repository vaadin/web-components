import { expect } from '@esm-bundle/chai';
import { fixtureSync, listenOnce, nextRender } from '@vaadin/testing-helpers';
import { resetMouse, sendMouse } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../vaadin-grid.js';
import { isElementFocused } from '@vaadin/a11y-base/src/focus-utils.js';
import { setNormalizedScrollLeft } from '@vaadin/component-base/src/dir-utils.js';
import {
  flushGrid,
  getRowCells,
  getRows,
  infiniteDataProvider,
  isWithinParentConstraints,
  onceResized,
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

const frozenGridFixture = (frozen, frozenToEnd) => {
  const grid = fixtureSync(`
    <vaadin-grid style="width: 200px; height: 400px;" size="10">
      <vaadin-grid-column ${frozen ? 'frozen ' : ''} header="foo"></vaadin-grid-column>
      <vaadin-grid-column header="bar"></vaadin-grid-column>
      <vaadin-grid-column ${frozenToEnd ? 'frozen-to-end' : ''} header="baz"></vaadin-grid-column>
    </vaadin-grid>
  `);

  const values = ['foo', 'bar', 'baz'];
  const columns = grid.querySelectorAll('vaadin-grid-column');
  columns.forEach((col, idx) => {
    col.renderer = (root) => {
      root.textContent = values[idx];
    };
  });

  sinon.spy(grid, '_updateFrozenColumn');

  grid.dataProvider = infiniteDataProvider;
  return [grid, columns];
};

['ltr', 'rtl'].forEach((direction) => {
  describe(`frozen columns ${direction}`, () => {
    let grid;
    let columns;
    const isRTL = direction === 'rtl';

    beforeEach(async () => {
      [grid, columns] = frozenGridFixture(true, false);
      document.documentElement.setAttribute('dir', direction);

      flushGrid(grid);
      await nextRender(grid);
    });

    after(() => document.documentElement.removeAttribute('dir'));

    it('should have last frozen only when there are frozen columns', () => {
      expect(columns[0]._lastFrozen).to.be.true;

      columns[0].frozen = false;
      flushGrid(grid);

      expect(columns[0]._lastFrozen).to.be.false;
    });

    it('should update frozen columns once on init', () => {
      expect(grid._updateFrozenColumn.callCount).to.equal(1);
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
          flushGrid(grid);
          expect(cells[0].hasAttribute('frozen')).to.be.true;
          expect(cells[1].hasAttribute('frozen')).not.to.be.true;
          expect(cells[2].hasAttribute('frozen')).not.to.be.true;
        });

        it('should have the correct last-frozen cell in a row', () => {
          grid._columnTree[0][1].frozen = true;
          containerRows = getRows(containerElement);
          const cells = getRowCells(containerRows[0]);
          flushGrid(grid);
          expect(cells[0].hasAttribute('last-frozen')).not.to.be.true;
          expect(cells[1].hasAttribute('last-frozen')).to.be.true;
          expect(cells[2].hasAttribute('last-frozen')).not.to.be.true;
        });

        it('should add last-frozen to cell part attribute', () => {
          grid._columnTree[0][1].frozen = true;
          containerRows = getRows(containerElement);
          const cells = getRowCells(containerRows[0]);
          flushGrid(grid);
          expect(cells[0].getAttribute('part')).to.not.contain('last-frozen-cell');
          expect(cells[1].getAttribute('part')).to.contain('last-frozen-cell');
          expect(cells[2].getAttribute('part')).to.not.contain('last-frozen-cell');
        });

        it('should not move while content scrolls horizontally', (done) => {
          const cells = getRowCells(containerRows[0]);
          grid.style.borderWidth = '0px';

          listenOnce(grid.$.table, 'scroll', () => {
            expect(isWithinParentConstraints(cells[0], grid.$.table)).to.equal(true);
            expect(isWithinParentConstraints(cells[2], grid.$.table)).to.equal(true);
            done();
          });

          setNormalizedScrollLeft(grid.$.table, direction, isRTL ? scrollbarWidth : defaultCellWidth);
        });

        it('should update transforms when frozen columns decrease', (done) => {
          let cells = getRowCells(containerRows[0]);

          listenOnce(grid.$.table, 'scroll', () => {
            expect(transformsEqual(cells[0], `translate(${translateValue}px, 0px)`)).to.be.true;

            grid._columnTree[0][0].frozen = false;
            cells = getRowCells(getRows(containerElement)[0]);
            grid._debouncerCacheElements.flush();

            expect(transformsEqual(cells[0], '')).to.be.true;
            done();
          });
          setNormalizedScrollLeft(grid.$.table, direction, isRTL ? scrollbarWidth : defaultCellWidth);
        });

        it('should update transforms when frozen columns increase', (done) => {
          let cells = getRowCells(containerRows[0]);

          listenOnce(grid.$.table, 'scroll', () => {
            expect(transformsEqual(cells[1], '')).to.be.true;

            grid._columnTree[0][1].frozen = true;
            cells = getRowCells(getRows(containerElement)[0]);
            grid._debouncerCacheElements.flush();

            expect(transformsEqual(cells[1], `translate(${translateValue}px, 0px)`)).to.be.true;
            done();
          });
          setNormalizedScrollLeft(grid.$.table, direction, isRTL ? scrollbarWidth : defaultCellWidth);
        });

        it('should have the correct last-frozen cell in a row with hidden columns', () => {
          grid._columnTree[0][1].frozen = grid._columnTree[0][2].frozen = true;

          containerRows = getRows(containerElement);
          const cells = getRowCells(containerRows[0]);

          flushGrid(grid);
          expect(cells[0].hasAttribute('last-frozen')).not.to.be.true;
          expect(cells[1].hasAttribute('last-frozen')).not.to.be.true;
          expect(cells[2].hasAttribute('last-frozen')).to.be.true;

          grid._columnTree[0][2].hidden = true;

          flushGrid(grid);
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
      [grid, columns] = frozenGridFixture(false, true);
      document.documentElement.setAttribute('dir', direction);

      flushGrid(grid);
      await nextRender(grid);
    });

    it('should have first frozen to end only when there are frozen columns', () => {
      expect(columns[2]._firstFrozenToEnd).to.be.true;

      columns[2].frozenToEnd = false;
      flushGrid(grid);

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

        afterEach(async () => {
          await resetMouse();
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
          flushGrid(grid);
          expect(cells[0].hasAttribute('first-frozen-to-end')).not.to.be.true;
          expect(cells[1].hasAttribute('first-frozen-to-end')).to.be.true;
          expect(cells[2].hasAttribute('first-frozen-to-end')).not.to.be.true;
        });

        it('should add first-frozen-to-end to cell part attribute', () => {
          grid._columnTree[0][1].frozenToEnd = true;
          containerRows = getRows(containerElement);
          const cells = getRowCells(containerRows[0]);
          flushGrid(grid);
          expect(cells[0].getAttribute('part')).to.not.contain('first-frozen-to-end-cell');
          expect(cells[1].getAttribute('part')).to.contain('first-frozen-to-end-cell');
          expect(cells[2].getAttribute('part')).to.not.contain('first-frozen-to-end-cell');
        });

        it('should update transforms when frozen columns decrease', () => {
          const cells = getRowCells(getRows(containerElement)[0]);
          expect(transformsEqual(cells[2], `translate(${translateValue}px, 0px)`)).to.be.true;

          grid._columnTree[0][2].frozenToEnd = false;
          grid._debouncerCacheElements.flush();

          expect(transformsEqual(cells[2], '')).to.be.true;
        });

        it('should update transforms when frozen columns increase', () => {
          const cells = getRowCells(getRows(containerElement)[0]);
          expect(transformsEqual(cells[1], '')).to.be.true;

          grid._columnTree[0][1].frozenToEnd = true;
          grid._debouncerCacheElements.flush();

          expect(transformsEqual(cells[1], `translate(${translateValue}px, 0px)`)).to.be.true;
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

          flushGrid(grid);

          expect(cells[0].hasAttribute('first-frozen-to-end')).to.be.true;
          expect(cells[1].hasAttribute('first-frozen-to-end')).not.to.be.true;
          expect(cells[2].hasAttribute('first-frozen-to-end')).not.to.be.true;

          grid._columnTree[0][0].hidden = true;

          flushGrid(grid);
          expect(cells[0].hasAttribute('first-frozen-to-end')).not.to.be.true;
          expect(cells[1].hasAttribute('first-frozen-to-end')).to.be.true;
          expect(cells[2].hasAttribute('first-frozen-to-end')).not.to.be.true;
        });

        it('should stay frozen to end when resize results in total width less than the grid', async () => {
          const frozenToEndColumnIndex = isRTL ? 0 : 2;
          grid._columnTree[0][frozenToEndColumnIndex].flexGrow = 0;

          grid.style.width = '400px';
          await onceResized(grid);

          const initBoundingClientRect = getRowCells(containerRows[0])[2].getBoundingClientRect();

          for (let i = 0; i < 2; i++) {
            if (frozenToEndColumnIndex === i) {
              continue;
            }
            grid._columnTree[0][i].width = '10px';
            grid._columnTree[0][i].flexGrow = 0;
          }

          const finalBoundingClientRect = getRowCells(containerRows[0])[2].getBoundingClientRect();
          expect(finalBoundingClientRect.x).to.equal(initBoundingClientRect.x);
        });

        it('should select grid on click to empty space between the frozen to end column and the previous column', async () => {
          const frozenToEndColumnIndex = isRTL ? 0 : 2;
          grid._columnTree[0][frozenToEndColumnIndex].flexGrow = 0;

          grid.style.width = '400px';
          await onceResized(grid);

          for (let i = 0; i < 2; i++) {
            if (frozenToEndColumnIndex === i) {
              continue;
            }
            grid._columnTree[0][i].width = '10px';
            grid._columnTree[0][i].flexGrow = 0;
          }

          const boundingClientRect = getRowCells(containerRows[0])[2].getBoundingClientRect();
          let xCoordinate;
          if (isRTL) {
            xCoordinate = boundingClientRect.x + boundingClientRect.width + 10;
          } else {
            xCoordinate = boundingClientRect.x - 10;
          }
          const yCoordinate = boundingClientRect.y + Math.floor(boundingClientRect.height / 2);

          expect(isElementFocused(grid)).to.be.false;
          await sendMouse({ type: 'click', position: [xCoordinate, yCoordinate] });
          expect(isElementFocused(grid)).to.be.true;
        });
      });
    });
  });
});
