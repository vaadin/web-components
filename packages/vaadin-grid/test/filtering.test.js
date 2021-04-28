import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import {
  flushGrid,
  getBodyCellContent,
  getHeaderCellContent,
  listenOnce,
  scrollToEnd,
  getVisibleItems
} from './helpers.js';
import '../vaadin-grid.js';
import '../vaadin-grid-filter.js';
import '../vaadin-grid-filter-column.js';
import '../vaadin-grid-sorter.js';

class FilterWrapper extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <vaadin-grid-filter path="foo" value="[[_filterValue]]" id="filter">
        <input slot="filter" value="{{_filterValue::input}}" />
      </vaadin-grid-filter>
    `;
  }
}

customElements.define('filter-wrapper', FilterWrapper);

function flushFilters(grid) {
  Array.from(grid.querySelectorAll('vaadin-grid-filter')).forEach(
    (filter) => filter._debouncerFilterChanged && filter._debouncerFilterChanged.flush()
  );
}

describe('filter', () => {
  let filter;
  let filterWrapper;

  beforeEach(() => {
    filterWrapper = fixtureSync('<filter-wrapper></filter-wrapper>');
    filter = filterWrapper.$.filter;
  });

  it('should fire `filter-changed` on value change', (done) => {
    listenOnce(filter, 'filter-changed', () => done());
    filter.value = 'foo';
  });

  it('should fire `filter-changed` on path change', (done) => {
    filter.value = 'foo';
    filter._debouncerFilterChanged.flush();

    listenOnce(filter, 'filter-changed', () => done());
    filter.path = 'bar';
  });

  it('should update value', (done) => {
    listenOnce(filter, 'filter-changed', () => {
      expect(filter.value).to.equal('foo');
      done();
    });

    const input = filter.children[0];
    input.value = 'foo';
    input.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
  });
});

describe('filtering', () => {
  let grid, filter;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column>
          <template class="header">
            <vaadin-grid-filter path="first" value="bar">
            </vaadin-grid-filter>
            <vaadin-grid-sorter path="first"></vaadin-grid-sorter>
          </template>
          <template>[[item.first]]</template>
        </vaadin-grid-column>
        <vaadin-grid-column>
          <template class="header">
            <vaadin-grid-filter path="last" value="qux">
            </vaadin-grid-filter>
          </template>
          <template>[[item.last]]</template>
        </vaadin-grid-column>
        <vaadin-grid-filter-column></vaadin-grid-filter-column>
      </vaadin-grid>
    `);
    flushGrid(grid);
    flushFilters(grid);
    if (grid._observer.flush) {
      grid._observer.flush();
    }
    filter = grid._filters[0];
  });

  it('should have filters', () => {
    expect(grid._filters.length).to.eql(2);
    expect(grid._filters[0].path).to.eql('first');
    expect(grid._filters[1].path).to.eql('last');
  });

  it('should have default inputs', () => {
    grid._filters.forEach((filter) => expect(filter.$.filter.clientHeight).to.be.greaterThan(0));
  });

  it('should not keep references to filters when column is removed', () => {
    grid.removeChild(grid.firstElementChild);
    flushGrid(grid);
    expect(grid._filters).to.not.contain(filter);
  });

  it('should keep references to filters for columns that are not removed', () => {
    expect(grid._filters.length).to.eql(2);
    expect(grid._filters[1].path).to.eql('last');
    grid.removeChild(grid.firstElementChild.nextElementSibling);
    flushGrid(grid);
    expect(grid._filters.length).to.eql(1);
    expect(grid._filters[0].path).to.eql('first');
  });

  it('should pass filters to dataProvider', (done) => {
    grid.size = 10;

    grid.dataProvider = (params) => {
      expect(params.filters[0]).to.eql({ path: 'first', value: 'bar' });
      expect(params.filters[1]).to.eql({ path: 'last', value: 'qux' });

      if (!done._called) {
        done._called = true;
        done();
      }
    };
  });

  it('should clear cache and fetch data when filters change', (done) => {
    grid.items = ['foo', 'bar'];
    sinon.stub(grid, 'clearCache').callsFake(done);
    grid._filters[0].value = '';
  });

  it('should filter display all filtered items', (done) => {
    flushFilters(grid);
    grid._filters[0].value = '';
    grid._filters[1].value = '';
    flushFilters(grid);
    const items = [];
    for (let i = 0; i < 1000; i++) {
      items.push({ first: i, last: i });
    }
    grid.items = items;
    scrollToEnd(grid);

    setTimeout(() => {
      grid._filters[0].value = '99';
      flushFilters(grid);
      requestAnimationFrame(() => {
        expect(grid.$.items.querySelectorAll('tr:not([hidden])')).to.have.length(19);
        done();
      });
    }, 200);
  });

  it('should not overflow filter text field', () => {
    flushFilters(grid);
    grid.style.width = '200px';
    const filterWidth = grid._filters[0].parentElement.offsetWidth;
    const textFieldWidth = grid._filters[0].shadowRoot.querySelector('vaadin-text-field').offsetWidth;
    expect(filterWidth).to.be.greaterThan(textFieldWidth);
  });

  describe('filter-column', () => {
    let filterColumn, filter, filterTextField;

    beforeEach(() => {
      filterColumn = grid.querySelector('vaadin-grid-filter-column');
      const content = getHeaderCellContent(grid, 0, 2);
      filter = content.querySelector('vaadin-grid-filter');
      filterTextField = filter.firstElementChild;
    });

    it('should propagate path property to the internal vaadin-grid-filter', () => {
      filterColumn.path = 'last';
      expect(filter.path).to.equal('last');
    });

    it('should use header property to determine the filter text-fields label', () => {
      filterColumn.header = 'Last column';
      expect(filterTextField.label).to.equal('Last column');
    });

    it('should generate the label based on path property, if header is not defined', () => {
      filterColumn.path = 'last';
      expect(filterTextField.label).to.equal('Last');
    });

    it('should apply the input fields value to the filter', () => {
      filterTextField.value = 'foo';
      expect(filter.value).to.equal('foo');
    });
  });
});

describe('array data provider', () => {
  let grid, filterFirst, filterSecond;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column>
          <template class="header">
            <vaadin-grid-filter path="first" value="bar">
            </vaadin-grid-filter>
            <vaadin-grid-sorter path="first"></vaadin-grid-sorter>
          </template>
          <template>[[item.first]]</template>
        </vaadin-grid-column>
        <vaadin-grid-column>
          <template class="header">
            <vaadin-grid-filter path="last" value="qux">
            </vaadin-grid-filter>
          </template>
          <template>[[item.last]]</template>
        </vaadin-grid-column>
        <vaadin-grid-filter-column></vaadin-grid-filter-column>
      </vaadin-grid>
    `);
    flushGrid(grid);

    flushFilters(grid);
    filterFirst = grid._filters[0];
    filterSecond = grid._filters[1];

    filterFirst.value = '';
    filterSecond.value = '';
    flushFilters(grid);
    grid.items = [
      {
        first: 'foo',
        last: 'bar'
      },
      {
        first: 'foo',
        last: 'baz'
      },
      {
        first: 'bar',
        last: 'bar'
      }
    ];

    flushGrid(grid);
  });

  it('should not throw when receiving null filter', () => {
    grid.items = ['foo', 'bar'];
    grid._filters[0].value = null;
    expect(flushFilters.bind(window, grid)).to.not.throw(Error);
  });

  it('should filter automatically', () => {
    expect(getBodyCellContent(grid, 0, 0).innerText).to.equal('foo');
    expect(getBodyCellContent(grid, 1, 0).innerText).to.equal('foo');
    expect(getBodyCellContent(grid, 2, 0).innerText).to.equal('bar');
    grid._filters[0].value = 'r';
    flushFilters(grid);
    expect(getBodyCellContent(grid, 0, 0).innerText).to.equal('bar');
  });

  it('should update filtering when column is removed', () => {
    filterFirst.value = 'bar';
    flushFilters(grid);

    grid.removeChild(grid.firstElementChild);
    flushGrid(grid);

    expect(getVisibleItems(grid).length).to.equal(3);
  });

  it('should not filter items before grid is re-attached', () => {
    filterFirst.value = 'bar';
    flushFilters(grid);

    const parentNode = grid.parentNode;
    parentNode.removeChild(grid);
    grid.removeChild(grid.firstElementChild);
    flushGrid(grid);

    expect(Object.keys(grid._cache.items).length).to.equal(1);

    parentNode.appendChild(grid);

    expect(Object.keys(grid._cache.items).length).to.equal(3);
  });

  it('should sort filtered items', () => {
    grid._filters[1].value = 'r';
    grid.querySelector('vaadin-grid-sorter').direction = 'asc';
    expect(grid.size).to.equal(2);
    expect(getBodyCellContent(grid, 0, 0).innerText).to.equal('bar');
    expect(getBodyCellContent(grid, 1, 0).innerText).to.equal('foo');
  });
});

describe('lazy init', () => {
  it('should not filter if there is no data yet', () => {
    const grid = fixtureSync(`
    <vaadin-grid>
      <vaadin-grid-column>
        <template class="header">
          <vaadin-grid-filter path="first" value="bar">
          </vaadin-grid-filter>
          <vaadin-grid-sorter path="first"></vaadin-grid-sorter>
        </template>
        <template>[[item.first]]</template>
      </vaadin-grid-column>
      <vaadin-grid-column>
        <template class="header">
          <vaadin-grid-filter path="last" value="qux">
          </vaadin-grid-filter>
        </template>
        <template>[[item.last]]</template>
      </vaadin-grid-column>
      <vaadin-grid-filter-column></vaadin-grid-filter-column>
    </vaadin-grid>
  `);
    grid.size = 100;
    grid.dataProvider = () => {
      // Don't provide any data
    };
    flush();
    expect(flushFilters.bind(window, grid)).to.not.throw(Error);
  });
});
