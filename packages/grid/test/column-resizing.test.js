import { expect } from '@esm-bundle/chai';
import { fixtureSync, listenOnce, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '../vaadin-grid.js';
import '../vaadin-grid-column-group.js';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import {
  dragAndDropOver,
  fire,
  flushGrid,
  getHeaderCellContent,
  getRowCells,
  getRows,
  infiniteDataProvider
} from './helpers.js';

function getElementFromPoint(context, x, y) {
  return context.shadowRoot.elementFromPoint(x, y);
}

describe('column resizing', () => {
  let grid, headerCells, handle;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid size="1" style="width: 300px; height: 400px" column-reordering-allowed>
        <vaadin-grid-column resizable>
          <template class="header">0</template>
          <template>0</template>
        </vaadin-grid-column>
        <vaadin-grid-column>
          <template class="header">1</template>
          <template>1</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
    await nextFrame();
    headerCells = getRowCells(getRows(grid.$.header)[0]);
    handle = headerCells[0].querySelector('[part~="resize-handle"]');
    await nextRender();
  });

  it('should be resizable', () => {
    expect(headerCells[0].querySelector('[part~="resize-handle"]')).to.be.ok;
  });

  it('should not be resizable', () => {
    expect(headerCells[1].querySelector('[part~="resize-handle"]')).to.be.not.ok;
  });

  it('should extend scroll width', () => {
    grid._columnTree[0][1].resizable = true;
    expect(grid.$.table.scrollWidth).to.equal(grid.$.table.offsetWidth);
  });

  it('should display resize handle as top-most element', () => {
    const rect = headerCells[1].getBoundingClientRect();
    const x = rect.left + handle.offsetWidth / 4;
    const y = rect.top + rect.height / 2;
    expect(getElementFromPoint(grid, x, y)).to.equal(handle);
  });

  ['rtl', 'ltr'].forEach((direction) => {
    it(`should resize on track in ${direction}`, async () => {
      grid.setAttribute('dir', direction);
      const options = { node: handle };
      const rect = headerCells[0].getBoundingClientRect();

      fire('track', { state: 'start' }, options);
      fire('track', { state: 'track', x: rect.left + (direction === 'rtl' ? -200 : 200), y: 0 }, options);

      await nextFrame();
      expect(headerCells[0].clientWidth).to.equal(direction === 'rtl' ? 349 : 200);
    });

    it(`should resize on frozen to end cell track in ${direction}`, () => {
      grid.setAttribute('dir', direction);
      const column = grid._columnTree[0][1];
      column.resizable = true;
      column.frozenToEnd = true;
      handle = headerCells[1].querySelector('[part~="resize-handle"]');

      const options = { node: handle };
      const rect = headerCells[1].getBoundingClientRect();

      fire('track', { state: 'start' }, options);

      // Increase column width by 50px
      const x = direction === 'rtl' ? rect.right + 50 : rect.left - 50;
      fire('track', { state: 'track', x, y: 0 }, options);

      expect(headerCells[1].clientWidth).to.equal(198);
    });

    it(`should scroll when handle moves below frozen to end cell in ${direction}`, async () => {
      grid.setAttribute('dir', direction);

      const column = grid._columnTree[0][1];
      column.frozenToEnd = true;
      grid.style.border = '0px';
      grid.style.width = '190px';
      await nextRender();
      expect(grid.$.table.scrollLeft).to.equal(0);

      const options = { node: handle };
      const rect = headerCells[0].getBoundingClientRect();

      fire('track', { state: 'start' }, options);

      // Increase column width by 10px
      const x = direction === 'rtl' ? rect.left - 10 : rect.right + 10;
      fire('track', { state: 'track', x, y: 0 }, options);

      expect(grid.$.table.scrollLeft).to.equal(direction === 'rtl' ? -10 : 10);
    });
  });

  it('should set min width based on cell content padding', () => {
    const options = { node: handle };
    const rect = headerCells[0].getBoundingClientRect();

    const contentStyle = getComputedStyle(headerCells[0]._content);
    const padding = parseInt(contentStyle.paddingLeft) + parseInt(contentStyle.paddingRight);

    fire('track', { state: 'start' }, options);
    fire('track', { state: 'track', x: rect.left - 100, y: 0 }, options);

    expect(headerCells[0].clientWidth).to.be.greaterThan(padding);
  });

  it('should not listen to track event on scroller', () => {
    const scroller = grid.$.scroller;
    fire('track', { state: 'start' }, { node: scroller });
    expect(scroller.getAttribute('column-resizing')).to.be.null;
  });

  it('should be behind the frozen columns', (done) => {
    grid.style.width = '100px';
    grid._columnTree[0][0].frozen = true;
    grid._columnTree[0][0].resizable = false;
    grid._columnTree[0][1].resizable = true;
    const table = grid.$.table;

    listenOnce(table, 'scroll', () => {
      const secondCell = getRowCells(getRows(grid.$.header)[0])[1];
      const rect = secondCell.getBoundingClientRect();
      const x = rect.right - 10;
      const y = rect.top + rect.height / 2;
      expect(getElementFromPoint(grid, x, y)).not.to.equal(secondCell.querySelector('[part~="resize-handle"]'));
      done();
    });

    table.scrollLeft += 100;
  });

  it('should not be selectable while resizing', () => {
    fire('track', { state: 'start' }, { node: handle });
    expect(window.getComputedStyle(grid.$.scroller).userSelect).not.to.equal('text');
  });

  it('should remove resizing attribute on end', () => {
    fire('track', { state: 'start' }, { node: handle });
    fire('track', { state: 'end' }, { node: handle });
    expect(grid.$.scroller.hasAttribute('resizing')).to.be.false;
  });

  it('should not fix width for succeeding columns', () => {
    grid._columnTree[0][1].width = '50%';
    grid._columnTree[0][1].flexGrow = 1;
    fire('track', { state: 'start' }, { node: handle });
    expect(grid._columnTree[0][1].width).to.equal('50%');
    expect(grid._columnTree[0][1].flexGrow).to.equal(1);
  });

  it('should fix width for preceding columns', async () => {
    grid._columnTree[0][1].resizable = true;

    grid._columnTree[0][0].width = '50%';
    grid._columnTree[0][0].flexGrow = 1;
    await nextFrame();
    fire('track', { state: 'start' }, { node: headerCells[1].querySelector('[part~="resize-handle"]') });

    await nextFrame();
    expect(grid._columnTree[0][0].width.indexOf('px')).not.to.equal(-1);
    expect(grid._columnTree[0][0].flexGrow).to.equal(0);
  });

  it('should fix width for preceding columns after column reordering', () => {
    dragAndDropOver(getHeaderCellContent(grid, 0, 0), getHeaderCellContent(grid, 0, 1));
    grid._columnTree[0][1].width = '50%';
    grid._columnTree[0][1].flexGrow = 1;
    fire('track', { state: 'start' }, { node: handle });
    expect(grid._columnTree[0][1].width).to.contain('px');
    expect(grid._columnTree[0][1].flexGrow).to.equal(0);
  });

  it('should notify resize on column resize', () => {
    const spy = sinon.spy(grid, '_resizeHandler');
    const options = { node: handle };
    const rect = headerCells[0].getBoundingClientRect();

    fire('track', { state: 'start' }, options);
    fire('track', { state: 'track', x: rect.left + 200, y: 0 }, options);

    expect(spy.called).to.be.true;
  });

  it('should fire column-resize event on column resize', (done) => {
    listenOnce(grid, 'column-resize', (event) => {
      expect(event.detail.resizedColumn).to.equal(grid._getColumns()[0]);
      done();
    });

    const options = { node: handle };
    const rect = headerCells[0].getBoundingClientRect();

    fire('track', { state: 'start' }, options);
    fire('track', { state: 'track', x: rect.left + 200, y: 0 }, options);
    fire('track', { state: 'end' }, options);
  });

  it('should prevent default mousedown action on resize handle', () => {
    const event = new CustomEvent('mousedown', { bubbles: true, cancelable: true, composed: true });
    handle.dispatchEvent(event);
    expect(event.defaultPrevented).to.be.true;
  });

  it('should allow default mousedown action on cells', () => {
    const event = new CustomEvent('mousedown', { bubbles: true, cancelable: true, composed: true });
    headerCells[0].dispatchEvent(event);
    expect(event.defaultPrevented).to.be.false;
  });
});

describe('column group resizing', () => {
  let grid;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid size="1" style="width: 300px; height: 400px">
        <vaadin-grid-column-group resizable>
          <template class="header">0</template>
          <vaadin-grid-column flex-grow="0">
            <template class="header">0</template>
            <template>0</template>
          </vaadin-grid-column>
          <vaadin-grid-column flex-grow="0">
            <template class="header">1</template>
            <template>1</template>
          </vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
    await nextFrame();
  });

  it('should cascade resizable property to child columns', async () => {
    expect(grid._columnTree[1][0].resizable).to.be.true;
    grid._columnTree[0][0].resizable = false;
    await nextFrame();
    expect(grid._columnTree[1][0].resizable).to.be.false;
  });

  it('should inherit resizable value from parent group', async () => {
    const newColumn = document.createElement('vaadin-grid-column');
    grid._columnTree[0][0].appendChild(newColumn);
    flush();
    grid._columnTree[0][0]._observer.flush();

    await nextFrame();
    expect(newColumn.resizable).to.be.true;
  });

  it('should have resizable false by default on column', () => {
    const newColumn = document.createElement('vaadin-grid-column');

    expect(newColumn.resizable).to.be.false;
  });

  it('should not have resizable by default on column group', () => {
    const newColumn = document.createElement('vaadin-grid-column-group');

    expect(newColumn.resizable).to.be.undefined;
  });

  ['rtl', 'ltr'].forEach((direction) => {
    describe(`child columns resizing in ${direction}`, () => {
      beforeEach(() => {
        grid.setAttribute('dir', direction);
      });

      it('should resize the child column', async () => {
        const headerRows = getRows(grid.$.header);
        const handle = getRowCells(headerRows[0])[0].querySelector('[part~="resize-handle"]');

        const cell = getRowCells(headerRows[1])[1];
        const rect = cell.getBoundingClientRect();
        const options = { node: handle };
        fire('track', { state: 'start' }, options);
        fire('track', { state: 'track', x: rect.right + (direction === 'rtl' ? -100 : 100), y: 0 }, options);
        await nextFrame();

        expect(cell.clientWidth).to.equal(direction === 'rtl' ? 100 : 200);
      });

      it('should resize the last non-hidden child column', async () => {
        grid._columnTree[1][1].hidden = true;
        await nextFrame();
        const headerRows = getRows(grid.$.header);
        const handle = getRowCells(headerRows[0])[0].querySelector('[part~="resize-handle"]');

        const cell = getRowCells(headerRows[1])[0];
        const rect = cell.getBoundingClientRect();
        const options = { node: handle };
        fire('track', { state: 'start' }, options);
        fire('track', { state: 'track', x: rect.right + (direction === 'rtl' ? -100 : 100), y: 0 }, options);

        await nextFrame();
        expect(cell.clientWidth).to.equal(direction === 'rtl' ? 100 : 200);
      });
    });
  });
});

describe('group inside group', () => {
  let grid;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid size="1" style="width: 300px; height: 400px">
        <vaadin-grid-column-group resizable>
          <template class="header">0</template>
          <vaadin-grid-column-group resizable>
            <template class="header">1</template>
            <vaadin-grid-column resizable>
              <template class="header">2</template>
              <template>2</template>
            </vaadin-grid-column>
          </vaadin-grid-column-group>
        </vaadin-grid-column-group>
        <vaadin-grid-column-group>
          <template class="header">3</template>
          <vaadin-grid-column-group>
            <template class="header">4</template>
            <vaadin-grid-column>
              <template class="header">5</template>
              <template>5</template>
            </vaadin-grid-column>
          </vaadin-grid-column-group>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
    await nextFrame();
  });

  it('should resize the child groups child column', async () => {
    const headerRows = getRows(grid.$.header);
    const handle = getRowCells(headerRows[0])[0].querySelector('[part~="resize-handle"]');

    const cell = getRowCells(headerRows[1])[1];
    const rect = cell.getBoundingClientRect();
    const options = { node: handle };
    fire('track', { state: 'start' }, options);
    fire('track', { state: 'track', x: rect.right + 100, y: 0 }, options);

    await nextFrame();
    expect(cell.clientWidth).to.equal(100);
  });
});
