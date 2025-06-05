import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import './grid-test-styles.js';
import '../all-imports.js';
import { html, render } from 'lit';
import { flush } from '@vaadin/component-base/src/debounce.js';
import { getBodyCellContent, getPhysicalItems } from './helpers.js';

describe('lit', () => {
  it('should render items after dynamically adding more columns', async () => {
    const wrapper = fixtureSync(`<div></div>`);

    function renderGrid(columnPaths, items) {
      render(
        html`
          <vaadin-grid .items=${items}>
            ${columnPaths.map((columnPath) => {
              return html`<vaadin-grid-column path=${columnPath}></vaadin-grid-column>`;
            })}
          </vaadin-grid>
        `,
        wrapper,
      );
    }

    // First render with just one column and 0 items
    renderGrid(['first'], []);

    await aTimeout(0);
    // Then render with more than one column and more than 0 items
    renderGrid(['first', 'second'], [{ first: 'foo', second: 'bar' }]);

    await aTimeout(0);
    const grid = wrapper.firstElementChild;
    expect(getPhysicalItems(grid).length).to.equal(1);
  });

  it('should not throw when dynamically removing sort columns after sorting', async () => {
    const wrapper = fixtureSync(`<div></div>`);

    function renderGrid(columnPaths, items) {
      render(
        html`
          <vaadin-grid .items=${items}>
            ${columnPaths.map((columnPath) => {
              return html`<vaadin-grid-sort-column path="${columnPath}"></vaadin-grid-sort-column>`;
            })}
          </vaadin-grid>
        `,
        wrapper,
      );
    }

    // First render with two columns
    renderGrid(['c1', 'c2'], [{ c1: '1-1', c2: '1-2' }]);

    await aTimeout(0);

    document.querySelector('vaadin-grid-sorter').click();

    // Then render a grid with one column
    renderGrid(['c1'], [{ c1: '1-1', c2: '1-2' }]);
  });

  // Test case for https://github.com/vaadin/web-components/issues/7162
  it('should render child item content correctly', async () => {
    const testComponentName = 'flushing-test-component';

    // Define a web component that flushes global debouncers on connect
    class TestComponent extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML = '<slot></slot>';
      }

      /** @protected */
      connectedCallback() {
        this.innerHTML = 'Foobar';
        flush();
      }
    }
    customElements.define(testComponentName, TestComponent);

    // Build items
    const rootItem = { id: 'item', children: [] };
    for (let i = 0; i < 3; i++) {
      const item = { id: `item_${i}`, children: [] };
      rootItem.children.push(item);
      for (let j = 0; j < 1; j++) {
        const childItem = { id: `item_${i}_${j}` };
        item.children.push(childItem);
      }
    }

    const expandedItems = [rootItem, rootItem.children[1]];

    const dataProvider = (params, callback) => {
      const items = params.parentItem?.children || [rootItem];
      callback(items, items.length);
    };

    const renderer = (root, _column, { item }) => {
      let itemContent;

      if (item.children) {
        itemContent = html`${item.id}`;
      } else {
        itemContent = document.createElement(testComponentName);
      }

      render(html`<div>${itemContent}</div>`, root);
    };

    const grid = render(
      html`
        <vaadin-grid .dataProvider=${dataProvider} .expandedItems=${expandedItems}>
          <vaadin-grid-tree-column width="80px" flex-grow="0"></vaadin-grid-tree-column>
          <vaadin-grid-column .renderer=${renderer}></vaadin-grid-column>
        </vaadin-grid>
      `,
      fixtureSync(`<div></div>`),
    ).parentNode.firstElementChild;
    await nextFrame();

    grid.expandedItems = [rootItem];
    await nextFrame();

    const content = getBodyCellContent(grid, 3, 1);
    expect(content.textContent).to.equal('item_2');
    expect(content.querySelector(testComponentName)).not.to.be.ok;
  });
});
