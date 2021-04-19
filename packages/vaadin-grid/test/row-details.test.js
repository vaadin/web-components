import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, nextFrame } from '@open-wc/testing-helpers';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import {
  buildDataSet,
  click,
  flushGrid,
  getBodyCellContent,
  getCellContent,
  getRowCells,
  getRows,
  infiniteDataProvider,
  scrollToEnd
} from './helpers.js';
import '../vaadin-grid.js';

class GridDetailsWrapper extends PolymerElement {
  static get template() {
    return html`
      <vaadin-grid id="grid" style="width: 50px; height: 400px">
        <template class="row-details"><span>[[index]]</span>-details</template>
        <vaadin-grid-column>
          <template>[[index]]</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `;
  }
}

customElements.define('grid-details-wrapper', GridDetailsWrapper);

class SlottedDetails extends PolymerElement {
  static get template() {
    return html`
      <vaadin-grid id="grid" style="width: 50px; height: 400px">
        <slot></slot>
        <vaadin-grid-column>
          <template>[[index]]</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `;
  }
}

customElements.define('slotted-details', SlottedDetails);

describe('row details', () => {
  let grid;
  let bodyRows;

  function openRowDetails(index) {
    grid.openItemDetails(grid._cache.items[index]);
  }

  function closeRowDetails(index) {
    grid.closeItemDetails(grid._cache.items[index]);
  }

  it('should not increase row update count', () => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 50px; height: 400px" size="100">
        <template class="row-details"><span>[[index]]</span>-details</template>
        <vaadin-grid-column>
          <template>[[index]]</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);
    const spy = sinon.spy(grid, '_updateRow');
    grid.size = 1;
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
    expect(spy.callCount).to.be.below(6);
  });

  describe('simple', () => {
    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-grid style="width: 50px; height: 400px" size="100">
          <template class="row-details"><span>[[index]]</span>-details</template>
          <vaadin-grid-column>
            <template>[[index]]</template>
          </vaadin-grid-column>
        </vaadin-grid>
      `);
      grid.dataProvider = infiniteDataProvider;
      flushGrid(grid);
      bodyRows = getRows(grid.$.items);
      await nextFrame();
    });

    it('should not activate on click', () => {
      openRowDetails(0);
      const detailsCellContent = getBodyCellContent(grid, 0, 1);
      click(detailsCellContent);
      expect(grid.activeItem).not.to.be.ok;
    });

    it('should not deactivate on click', () => {
      openRowDetails(0);
      click(getBodyCellContent(grid, 0, 0));
      const detailsCellContent = getBodyCellContent(grid, 0, 1);
      click(detailsCellContent);
      expect(grid.activeItem).to.be.ok;
    });

    it('should open details row', () => {
      const cells = getRowCells(bodyRows[1]);
      expect(cells[1].hidden).to.be.true;
      openRowDetails(1);
      expect(cells[1].hidden).to.be.false;
    });

    it('should close details row', () => {
      openRowDetails(1);
      closeRowDetails(1);
      expect(getRowCells(bodyRows[1])[1].hidden).to.be.true;
    });

    it('should not update metrics or item positioning', () => {
      const metricsSpy = sinon.spy(grid, '_updateMetrics');
      const positionSpy = sinon.spy(grid, '_positionItems');
      grid.openItemDetails({ nonExistentItem: true });
      expect(metricsSpy.called).to.be.false;
      expect(positionSpy.called).to.be.false;
    });

    it('should close details row visually', () => {
      openRowDetails(1);
      closeRowDetails(1);
      expect(bodyRows[1].getBoundingClientRect().bottom).to.be.closeTo(bodyRows[2].getBoundingClientRect().top, 1);
    });

    it('should stamp the details template', () => {
      openRowDetails(1);
      const cells = getRowCells(bodyRows[1]);
      expect(getCellContent(cells[1]).textContent.trim()).to.equal('1-details');
    });

    it('should not stamp the details template eagerly', () => {
      const cells = getRowCells(bodyRows[1]);
      expect(getCellContent(cells[1]).textContent.trim()).to.be.empty;
    });

    const assertDetailsBounds = () => {
      const cells = getRowCells(bodyRows[1]);
      const bounds = cells[1].getBoundingClientRect();
      expect(bounds.top).to.be.closeTo(cells[0].getBoundingClientRect().bottom, 1);
      expect(bounds.left).to.equal(cells[0].getBoundingClientRect().left);
      expect(bounds.right).to.equal(grid.$.items.getBoundingClientRect().right);
      expect(bounds.bottom).to.be.closeTo(bodyRows[2].getBoundingClientRect().top, 1);
      expect(bounds.height).to.be.above(10);
    };

    it('should have correct bounds', () => {
      openRowDetails(1);
      assertDetailsBounds();
    });

    it('should have correct bounds when modified after opening', async () => {
      openRowDetails(1);
      const cells = getRowCells(bodyRows[1]);
      cells[1].style.padding = '10px';
      await nextFrame();
      assertDetailsBounds();
    });

    it('should hide the details cell', () => {
      openRowDetails(1);
      const row = bodyRows[1];
      scrollToEnd(grid);
      expect(getRowCells(row)[1].hidden).to.be.true;
    });

    it('should add details to fixed cells cache', () => {
      openRowDetails(1);

      flushGrid(grid);
      bodyRows = getRows(grid.$.items);

      expect(grid._frozenCells).to.contain(getRowCells(bodyRows[1])[1]);
    });

    it('should open details for equaling item', () => {
      const cells = getRowCells(bodyRows[0]);
      grid.itemIdPath = 'value';
      grid.openItemDetails({ value: 'foo0' });
      expect(cells[1].hidden).to.be.false;
    });

    it('should close details for equaling item', () => {
      const cells = getRowCells(bodyRows[0]);
      grid.itemIdPath = 'value';
      grid.openItemDetails(bodyRows[0]._item);
      expect(cells[1].hidden).to.be.false;
      grid.closeItemDetails({ value: 'foo0' });
      expect(cells[1].hidden).to.be.true;
    });
  });

  describe('inside a parent scope', () => {
    let container;

    beforeEach(() => {
      container = fixtureSync('<grid-details-wrapper></grid-details-wrapper>');
      grid = container.$.grid;
      grid.items = ['foo', 'bar', 'baz'];
      flushGrid(grid);
      bodyRows = getRows(grid.$.items);
    });

    it('should have the correct index on details template', () => {
      // open details for item 0
      grid.openItemDetails('foo');

      // open details for item 1
      grid.openItemDetails('bar');

      const firstRowCells = getRowCells(bodyRows[0]);
      const secondRowCells = getRowCells(bodyRows[1]);
      expect(getCellContent(firstRowCells[1]).textContent.trim()).to.equal('0-details');
      expect(getCellContent(secondRowCells[1]).textContent.trim()).to.equal('1-details');
    });
  });

  describe('slotted template', () => {
    let container;

    beforeEach(() => {
      container = fixtureSync(`
        <slotted-details>
          <template class="row-details"><span>[[index]]</span>-details</template>
        </slotted-details>
      `);
      grid = container.$.grid;
      grid.items = ['foo', 'bar', 'baz'];
      flushGrid(grid);
      bodyRows = getRows(grid.$.items);
    });

    it('should support slotted details templates', () => {
      grid.openItemDetails('foo');
      expect(getBodyCellContent(grid, 0, 1).textContent.trim()).to.equal('0-details');
    });

    it('should change the details template', () => {
      grid.openItemDetails('foo');

      const newTemplate = document.createElement('template');
      newTemplate.classList.add('row-details');
      newTemplate.innerHTML = '[[item]]-bar';

      container.innerHTML = '';
      container.appendChild(newTemplate);
      flushGrid(grid);
      expect(getBodyCellContent(grid, 0, 1).textContent.trim()).to.equal('foo-bar');
    });
  });

  describe('repeat', () => {
    const items = [];
    for (let i = 0; i < 50; i++) {
      items.push({ details: [1, 2, 3, 4] });
    }

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid style="width: 200px; height: 400px" size="100">
          <template class="row-details">
            <div>
              <template is="dom-repeat" items="[[item.details]]">
                <div>foo</div>
              </template>
            </div>
          </template>
          <vaadin-grid-column>
            <template>[[index]]</template>
          </vaadin-grid-column>
        </vaadin-grid>
      `);
    });

    it('should have correct height', () => {
      grid.openItemDetails(items[0]);

      grid.dataProvider = (params, callback) => callback(items);
      flushGrid(grid);

      const row = getRows(grid.$.items)[0];
      expect(row.offsetHeight).to.be.above(70);
    });
  });

  describe('details opened attribute', () => {
    let dataset = [];
    const dataProvider = (params, callback) => callback(dataset);

    const countRowsMarkedAsDetailsOpened = (grid) => {
      return grid.$.items.querySelectorAll('tr[details-opened]').length;
    };

    beforeEach(async () => {
      dataset = buildDataSet(10);
      grid = fixtureSync(`
        <vaadin-grid style="width: 50px; height: 400px" size="100">
          <template class="row-details"><span>[[index]]</span>-details</template>
          <vaadin-grid-column>
            <template>[[index]]</template>
          </vaadin-grid-column>
        </vaadin-grid>
      `);
      grid.dataProvider = dataProvider;
      flushGrid(grid);
      bodyRows = getRows(grid.$.items);
      await nextFrame();
    });

    it('should update when opening/closing imperatively', () => {
      openRowDetails(1);
      expect(bodyRows[1].hasAttribute('details-opened')).to.be.true;
      expect(countRowsMarkedAsDetailsOpened(grid)).to.equal(1);
      closeRowDetails(1);
      expect(bodyRows[1].hasAttribute('details-opened')).to.be.false;
      expect(countRowsMarkedAsDetailsOpened(grid)).to.equal(0);
    });

    it('should be removed when item is removed', () => {
      openRowDetails(0);
      dataset.shift(); // remove opened item
      grid.clearCache();

      expect(bodyRows[0].hasAttribute('details-opened')).to.be.false;
      expect(countRowsMarkedAsDetailsOpened(grid)).to.equal(0);
    });

    it('should be removed when items are replaced', () => {
      openRowDetails(0);
      dataset = buildDataSet(10); // replace data
      grid.clearCache();

      expect(bodyRows[0].hasAttribute('details-opened')).to.be.false;
      expect(countRowsMarkedAsDetailsOpened(grid)).to.equal(0);
    });

    it('should be removed on all rows when items are replaced', () => {
      // Open all rows
      dataset.forEach((_, i) => {
        openRowDetails(i);
      });
      expect(countRowsMarkedAsDetailsOpened(grid)).to.equal(dataset.length);

      dataset = buildDataSet(10); // replace data
      grid.clearCache();

      expect(countRowsMarkedAsDetailsOpened(grid)).to.equal(0);
    });
  });
});
