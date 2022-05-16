import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '../vaadin-grid.js';
import '../vaadin-grid-column-group.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import {
  flushGrid,
  getContainerCellContent,
  getHeaderCellContent,
  getPhysicalItems,
  getRowCells,
  getRows,
  infiniteDataProvider,
  nextResize,
  scrollToEnd,
} from './helpers.js';

class TestComponent extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>

      <vaadin-grid id="grid" style="width: 200px; height: 400px;" size="10" hidden>
        <template class="row-details"> [[index]] </template>
        <vaadin-grid-column>
          <template class="header">header</template>
          <template>[[index]]</template>
          <template class="footer">footer</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `;
  }
}

customElements.define('test-component', TestComponent);

describe('resizing', () => {
  let component, grid;

  beforeEach(async () => {
    component = fixtureSync('<test-component></test-component>');
    grid = component.$.grid;
    grid.dataProvider = infiniteDataProvider;
    await nextFrame();
    grid.hidden = false;
    await oneEvent(grid, 'animationend');
    flushGrid(grid);
  });

  it('should warn when calling deprecated notifyResize()', () => {
    const stub = sinon.stub(console, 'warn');
    grid.notifyResize();
    stub.restore();

    expect(stub.calledOnce).to.be.true;
    expect(stub.args[0][0]).to.include('WARNING: Since Vaadin 22, notifyResize() is deprecated.');
  });

  it('should align rows correctly', () => {
    const rows = getRows(grid.$.items);
    expect(rows[0].getBoundingClientRect().bottom).to.be.closeTo(rows[1].getBoundingClientRect().top, 1);
  });

  it('should update header height', async () => {
    const bottom = grid.$.header.getBoundingClientRect().bottom;

    getHeaderCellContent(grid, 0, 0).style.fontSize = '100px';

    const newBottom = grid.$.header.getBoundingClientRect().bottom;
    expect(newBottom).to.be.above(bottom);
    await nextFrame();

    const firstBodyRowRect = getRows(grid.$.items)[0].getBoundingClientRect();
    expect(firstBodyRowRect.top).to.be.closeTo(newBottom, 1);
  });

  it('should update footer height', async () => {
    getContainerCellContent(grid.$.footer, 0, 0).style.fontSize = '100px';
    await nextResize(grid.$.footer);

    scrollToEnd(grid);

    const bodyRows = getRows(grid.$.items);
    expect(bodyRows[bodyRows.length - 1].getBoundingClientRect().bottom).to.be.closeTo(
      grid.$.footer.getBoundingClientRect().top,
      1,
    );
  });

  it('should update details row height', () => {
    grid.openItemDetails(grid._cache.items[0]);
    const bodyRows = getRows(grid.$.items);
    const cells = getRowCells(bodyRows[0]);
    const detailsCell = cells.pop();
    const height = detailsCell.getBoundingClientRect().height;

    grid.style.fontSize = '100px';
    flushGrid(grid);

    expect(detailsCell.getBoundingClientRect().height).to.be.above(height);
    expect(detailsCell.getBoundingClientRect().bottom).to.be.closeTo(bodyRows[1].getBoundingClientRect().top, 2);
  });

  it('should align height with number of rows', async () => {
    grid.style.height = '';
    grid.allRowsVisible = true;
    await nextFrame();
    const headerHeight = grid.$.header.clientHeight;
    const bodyHeight = grid.$.items.clientHeight;
    const footerHeight = grid.$.footer.clientHeight;
    expect(grid.clientHeight).to.equal(headerHeight + bodyHeight + footerHeight);
  });

  // NOTE: This issue only manifests with scrollbars that affect the layout
  // (On mac: Show scroll bars: Always) and Chrome / Safari browser
  it('should have correct layout after column width change', async () => {
    grid.style.height = '';
    grid.allRowsVisible = true;
    grid.querySelector('vaadin-grid-column').width = '300px';
    // Before next render
    await nextFrame();
    // After next render
    await aTimeout(0);
    expect(grid.$.scroller.getBoundingClientRect().bottom).to.equal(grid.$.table.getBoundingClientRect().bottom);
  });

  describe('flexbox parent', () => {
    beforeEach(() => {
      grid.style.height = grid.style.width = '';
      grid.size = 1;
      component.style.display = 'flex';
      component.style.flexDirection = 'column';
      grid.allRowsVisible = true;
    });

    it('should have the default height inside a column flexbox', () => {
      grid.allRowsVisible = false;
      expect(grid.getBoundingClientRect().height).to.equal(400);
    });

    it('should auto-grow inside a fixed height column flexbox', async () => {
      component.style.height = '500px';
      await nextResize(grid);
      expect(grid.getBoundingClientRect().height).to.equal(129);
    });

    it('should auto-grow inside a fixed height row flexbox', async () => {
      component.style.flexDirection = 'row';
      component.style.height = '500px';
      await nextResize(grid);
      expect(grid.getBoundingClientRect().height).to.equal(129);
    });

    it('should not shrink horizontally inside a row flexbox', () => {
      component.style.flexDirection = 'row';
      expect(grid.getBoundingClientRect().width).to.be.above(780);
    });
  });
});

describe('all rows visible', () => {
  let grid;

  describe('template', () => {
    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-column>
            <template>[[index]]</template>
          </vaadin-grid-column>
        </vaadin-grid>
      `);
    });

    it('should align height with number of rows after first render', () => {
      grid.items = new Array(100).fill().map((_, idx) => ({ value: idx }));
      flushGrid(grid);

      grid.allRowsVisible = true;
      flushGrid(grid);

      expect(grid.$.items.children.length).to.equal(100);
    });
  });

  describe('path', () => {
    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-column path="value"></vaadin-grid-column>
        </vaadin-grid>
      `);
      grid.firstElementChild.header = null;
      grid.allRowsVisible = true;
      grid.items = [{ value: 1 }];
      flushGrid(grid);
    });

    it('should have body rows if header is not visible', () => {
      expect(getPhysicalItems(grid).length).to.be.above(0);
    });

    it('should have body rows after items reset and repopulated', () => {
      grid.items = [];
      flushGrid(grid);
      grid.items = [{ value: 1 }];
      flushGrid(grid);
      expect(getPhysicalItems(grid).length).to.be.above(0);
    });
  });
});
