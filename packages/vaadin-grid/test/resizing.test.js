import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextFrame, oneEvent } from '@open-wc/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import {
  flushGrid,
  getContainerCellContent,
  getHeaderCellContent,
  getRows,
  getRowCells,
  infiniteDataProvider,
  scrollToEnd
} from './helpers.js';
import '../vaadin-grid.js';
import '../vaadin-grid-column-group.js';

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

  it('should align rows correctly', () => {
    const rows = getRows(grid.$.items);
    expect(rows[0].getBoundingClientRect().bottom).to.be.closeTo(rows[1].getBoundingClientRect().top, 1);
  });

  it('should update header height', async () => {
    const bottom = grid.$.header.getBoundingClientRect().bottom;

    getHeaderCellContent(grid, 0, 0).style.fontSize = '100px';
    grid.notifyResize();

    const newBottom = grid.$.header.getBoundingClientRect().bottom;
    expect(newBottom).to.be.above(bottom);
    await nextFrame();

    const firstBodyRowRect = getRows(grid.$.items)[0].getBoundingClientRect();
    expect(firstBodyRowRect.top).to.be.closeTo(newBottom, 1);
  });

  it('should update footer height', () => {
    getContainerCellContent(grid.$.footer, 0, 0).style.fontSize = '100px';
    grid.notifyResize();
    scrollToEnd(grid);

    const bodyRows = getRows(grid.$.items);
    expect(bodyRows[bodyRows.length - 1].getBoundingClientRect().bottom).to.be.closeTo(
      grid.$.footer.getBoundingClientRect().top,
      1
    );
  });

  it('should update details row height', () => {
    grid.openItemDetails(grid._cache.items[0]);
    const bodyRows = getRows(grid.$.items);
    const cells = getRowCells(bodyRows[0]);
    const detailsCell = cells.pop();
    const height = detailsCell.getBoundingClientRect().height;

    grid.style.fontSize = '100px';
    grid.notifyResize();
    flushGrid(grid);

    expect(detailsCell.getBoundingClientRect().height).to.be.above(height);
    expect(detailsCell.getBoundingClientRect().bottom).to.be.closeTo(bodyRows[1].getBoundingClientRect().top, 2);
  });

  it('should align height with number of rows', async () => {
    grid.style.height = '';
    grid.heightByRows = true;
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
    grid.heightByRows = true;
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
      grid.heightByRows = true;
    });

    it('should have the default height inside a column flexbox', () => {
      grid.heightByRows = false;
      expect(grid.getBoundingClientRect().height).to.equal(400);
    });

    it('should auto-grow inside a fixed height column flexbox', () => {
      component.style.height = '500px';
      expect(grid.getBoundingClientRect().height).to.equal(129);
    });

    it('should auto-grow inside a fixed height row flexbox', () => {
      component.style.flexDirection = 'row';
      component.style.height = '500px';
      expect(grid.getBoundingClientRect().height).to.equal(129);
    });

    it('should not shrink horizontally inside a row flexbox', () => {
      component.style.flexDirection = 'row';
      expect(grid.getBoundingClientRect().width).to.be.above(780);
    });
  });
});

describe('height by rows', () => {
  let grid;

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
    const rows = 100;
    grid.items = grid.items = Array(...new Array(rows)).map(() => {});
    flushGrid(grid);

    grid.heightByRows = true;
    flushGrid(grid);

    expect(grid.$.items.children.length).to.equal(rows);
  });
});
