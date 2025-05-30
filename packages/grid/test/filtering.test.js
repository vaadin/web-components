import { expect } from '@vaadin/chai-plugins';
import { fire, fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './grid-test-styles.js';
import '../all-imports.js';
import { html, LitElement } from 'lit';
import { flushGrid, getBodyCellContent, getHeaderCellContent, getVisibleItems, scrollToEnd } from './helpers.js';

class FilterWrapper extends LitElement {
  static get properties() {
    return {
      _filterValue: {
        type: String,
      },
    };
  }

  constructor() {
    super();
    this._filterValue = '';
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <vaadin-grid-filter
        path="foo"
        .value="${this._filterValue}"
        @value-changed="${this._onValueChanged}"
      ></vaadin-grid-filter>
    `;
  }

  _onValueChanged(e) {
    this._filterValue = e.detail.value;
  }
}

customElements.define('filter-wrapper', FilterWrapper);

function flushFilters(grid) {
  Array.from(grid.querySelectorAll('vaadin-grid-filter')).forEach(
    (filter) => filter._debouncerFilterChanged && filter._debouncerFilterChanged.flush(),
  );
}

describe('filter', () => {
  let filter;
  let filterWrapper;
  let clock;

  beforeEach(async () => {
    filterWrapper = fixtureSync('<filter-wrapper></filter-wrapper>');
    await nextRender();
    filter = filterWrapper.shadowRoot.querySelector('vaadin-grid-filter');
    clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
  });

  afterEach(() => {
    clock.restore();
  });

  it('should fire `filter-changed` on value change', async () => {
    const spy = sinon.spy();
    filter.addEventListener('filter-changed', spy);
    filter.value = 'foo';
    await clock.tickAsync(200);
    expect(spy.calledOnce).to.be.true;
  });

  it('should fire `filter-changed` on field input event', async () => {
    const spy = sinon.spy();
    const input = filter.querySelector('input');
    filter.addEventListener('filter-changed', spy);
    input.value = 'foo';
    fire(input, 'input');
    await clock.tickAsync(200);
    expect(spy.calledOnce).to.be.true;
  });

  it('should fire `filter-changed` on field input event with empty string', async () => {
    const spy = sinon.spy();
    const input = filter.querySelector('input');
    filter.addEventListener('filter-changed', spy);
    input.value = 'foo';
    fire(input, 'input');
    await clock.tickAsync(200);
    spy.resetHistory();
    input.value = '';
    fire(input, 'input');
    await clock.tickAsync(200);
    expect(spy.calledOnce).to.be.true;
  });

  it('should fire `filter-changed` on path change', async () => {
    filter.value = 'foo';
    await clock.tickAsync(200);

    const spy = sinon.spy();
    filter.addEventListener('filter-changed', spy);

    filter.path = 'bar';
    await clock.tickAsync(200);

    expect(spy.calledOnce).to.be.true;
  });

  it('should update filter value on input event', async () => {
    const input = filter.querySelector('input');
    input.value = 'foo';
    fire(input, 'input');

    await clock.tickAsync(200);
    expect(filter.value).to.equal('foo');
  });

  it('should focus the input when calling focus()', () => {
    const input = filter.querySelector('input');
    const spy = sinon.spy(input, 'focus');
    filter.focus();
    expect(spy.calledOnce).to.be.true;
  });
});

function gridFiltersFixture() {
  const grid = fixtureSync(`
    <vaadin-grid>
      <vaadin-grid-column path="first"></vaadin-grid-column>
      <vaadin-grid-column path="last"></vaadin-grid-column>
      <vaadin-grid-filter-column></vaadin-grid-filter-column>
    </vaadin-grid>
  `);

  const columns = grid.querySelectorAll('vaadin-grid-column');
  columns[0].headerRenderer = (root) => {
    if (!root.firstChild) {
      root.innerHTML = `
        <vaadin-grid-filter path="first" value="bar"></vaadin-grid-filter>
        <vaadin-grid-sorter path="first"></vaadin-grid-sorter>
      `;
    }
  };
  columns[1].headerRenderer = (root) => {
    if (!root.firstChild) {
      root.innerHTML = '<vaadin-grid-filter path="last" value="qux"></vaadin-grid-filter>';
    }
  };

  return grid;
}

describe('filtering', () => {
  let grid, filter;

  beforeEach(async () => {
    grid = gridFiltersFixture();
    await nextFrame();
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
    grid._filters.forEach((filter) => {
      const field = filter.querySelector('vaadin-text-field');
      expect(field.clientHeight).to.be.greaterThan(0);
    });
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

  it('should clear cache and fetch data when filters change', async () => {
    grid.items = ['foo', 'bar'];
    const spy = sinon.spy(grid, 'clearCache');
    grid._filters[0].value = '';
    await oneEvent(grid._filters[0], 'filter-changed');
    expect(spy.calledOnce).to.be.true;
  });

  it('should display all filtered items', async () => {
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

    grid._filters[0].value = '99';
    flushFilters(grid);

    grid.allRowsVisible = true;
    flushGrid(grid);
    await nextFrame();
    expect(grid.$.items.querySelectorAll('tr:not([hidden])')).to.have.length(19);
  });

  it('should not overflow filter text field', () => {
    flushFilters(grid);
    grid.style.width = '200px';
    const filterWidth = grid._filters[0].parentElement.offsetWidth;
    const textFieldWidth = grid._filters[0].querySelector('vaadin-text-field').offsetWidth;
    expect(filterWidth).to.be.at.least(textFieldWidth);
  });

  describe('filter-column', () => {
    let filterColumn, filterCellContent, filter, filterTextField;

    beforeEach(() => {
      filterColumn = grid.querySelector('vaadin-grid-filter-column');
      filterCellContent = getHeaderCellContent(grid, 0, 2);

      filter = filterCellContent.querySelector('vaadin-grid-filter');
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

    it('should apply the input fields value to the filter', async () => {
      filterTextField.inputElement.value = 'foo';
      fire(filterTextField.inputElement, 'input');
      await nextFrame();
      expect(filter.value).to.equal('foo');
    });

    it('should ignore a custom header renderer', () => {
      filterColumn.headerRenderer = (root) => {
        root.innerHTML = 'header';
      };

      expect(filterCellContent.firstElementChild).to.equal(filter);
    });
  });
});

describe('array data provider', () => {
  let grid, filterFirst, filterSecond;

  beforeEach(async () => {
    grid = gridFiltersFixture();
    await nextFrame();
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
        last: 'bar',
      },
      {
        first: 'foo',
        last: 'baz',
      },
      {
        first: 'bar',
        last: 'bar',
      },
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

  it('should invoke data provider only once when removing a column with filter', () => {
    const spy = sinon.spy(grid.dataProvider);
    grid._arrayDataProvider = spy;
    grid.dataProvider = spy;
    spy.resetHistory();

    grid.removeChild(grid.firstElementChild);
    flushGrid(grid);

    expect(spy).to.be.calledOnce;
  });

  it('should not filter items before grid is re-attached', async () => {
    filterFirst.value = 'bar';
    flushFilters(grid);

    const parentNode = grid.parentNode;
    parentNode.removeChild(grid);
    grid.removeChild(grid.firstElementChild);
    flushGrid(grid);

    expect(Object.keys(grid._dataProviderController.rootCache.items).length).to.equal(1);

    parentNode.appendChild(grid);
    await nextFrame();

    expect(Object.keys(grid._dataProviderController.rootCache.items).length).to.equal(3);
  });

  it('should sort filtered items', async () => {
    grid._filters[1].value = 'r';
    await nextFrame();
    grid.querySelector('vaadin-grid-sorter').direction = 'asc';
    flushGrid(grid);
    expect(grid.size).to.equal(2);
    expect(getBodyCellContent(grid, 0, 0).innerText).to.equal('bar');
    expect(getBodyCellContent(grid, 1, 0).innerText).to.equal('foo');
  });
});

describe('lazy init', () => {
  it('should not filter if there is no data yet', () => {
    const grid = gridFiltersFixture();
    grid.size = 100;
    grid.dataProvider = () => {
      // Don't provide any data
    };
    expect(flushFilters.bind(window, grid)).to.not.throw(Error);
  });
});
