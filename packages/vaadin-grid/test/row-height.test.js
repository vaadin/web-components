import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextFrame, oneEvent } from '@open-wc/testing-helpers';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import { flushGrid, getRows, getRowCells, infiniteDataProvider, scrollToEnd } from './helpers.js';
import '../vaadin-grid.js';

registerStyles(
  'vaadin-grid',
  css`
    [part~='cell'] {
      border: none !important;
    }
  `
);

const fixtures = {
  defaultContent: `
    <vaadin-grid style="width: 200px; height: 200px;" size="10000" hidden>
      <vaadin-grid-column>
        <template>
          <div>foobar</div>
        </template>
        <template class="header">foo</template>
      </vaadin-grid-column>
    </vaadin-grid>
  `,
  twoColumns: `
    <vaadin-grid style="width: 200px; height: 200px;" size="10000" hidden>
      <vaadin-grid-column>
        <template class="header">foo</template>
        <template>foo</template>
      </vaadin-grid-column>
      <vaadin-grid-column>
        <template>foo</template>
      </vaadin-grid-column>
    </vaadin-grid>
  `,
  unevenContent: `
    <vaadin-grid style="width: 200px; height: 200px;" size="10000" hidden>
      <vaadin-grid-column>
        <template>
          <div style="line-height: 2em;">foobar</div>
        </template>
        <template class="header">foo</template>
      </vaadin-grid-column>
      <vaadin-grid-column>
        <template>
          <div style="line-height: 0.5em;">foobar</div>
        </template>
        <template class="header">foo</template>
      </vaadin-grid-column>
    </vaadin-grid>
  `
};

describe('rows', () => {
  let grid, header, rows, cells;

  async function init(fixtureName) {
    grid = fixtureSync(fixtures[fixtureName]);

    await nextFrame();

    grid.dataProvider = infiniteDataProvider;
    grid.hidden = false;
    flushGrid(grid);
    header = grid.$.header;

    await oneEvent(grid, 'animationend');
    flushGrid(grid);

    rows = getRows(grid.$.items);

    cells = getRowCells(rows[0]);
  }

  it('should have higher cells on each row', async () => {
    await init('twoColumns');
    cells[0].style.height = cells[0].clientHeight * 2 + 'px';
    await nextFrame();
    expect(cells[1].clientHeight).to.equal(cells[0].clientHeight);
  });

  it('should not be misaligned on resize (wheel)', async () => {
    await init('defaultContent');
    scrollToEnd(grid);

    // Simulate a wheel event that doesn't cause a scroll event
    const e = new CustomEvent('wheel', { bubbles: true });
    e.deltaY = -100;
    e.deltaX = 0;
    grid.$.table.dispatchEvent(e);

    // Simulate a (window) resize
    grid.style.width = '200px';
    grid._resizeHandler();

    expect(header.getBoundingClientRect().top).to.be.closeTo(grid.getBoundingClientRect().top, 1);
  });

  it('should not be misaligned on reattach', async () => {
    await init('defaultContent');
    scrollToEnd(grid);

    const parentNode = grid.parentNode;
    parentNode.removeChild(grid);
    parentNode.offsetHeight;
    parentNode.appendChild(grid);

    await aTimeout(0);
    expect(header.getBoundingClientRect().top).to.be.closeTo(grid.getBoundingClientRect().top, 1);
  });

  it('should update height when hiding columns', async () => {
    await init('unevenContent');
    grid.querySelectorAll('vaadin-grid-column')[0].hidden = true;
    // Flush row height and position calculations
    flushGrid(grid);
    expect(rows[0].getBoundingClientRect().bottom).to.eql(rows[1].getBoundingClientRect().top);
  });
});
