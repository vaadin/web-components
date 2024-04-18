import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/combo-box';
import '@vaadin/grid';
import { html, render } from 'lit';
import { flushGrid, getBodyCellContent } from '@vaadin/grid/test/helpers.js';

describe('combo-box in grid', () => {
  let grid, column;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.items = [{ value: '1' }, { value: '2' }];
    column = grid.querySelector('vaadin-grid-column');
    column.renderer = (root, _, model) => {
      if (!root.firstChild) {
        const comboBox = document.createElement('vaadin-combo-box');
        comboBox.items = [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
        ];
        root.appendChild(comboBox);
        comboBox.label = 'Select an option';
        comboBox.value = model.item.value;
      }
    };
    flushGrid(grid);
    await nextRender(grid);
  });

  it('should not activate item on combo-box toggle button click', () => {
    const spy = sinon.spy();
    grid.addEventListener('active-item-changed', spy);

    const combo = getBodyCellContent(grid, 0, 0).firstElementChild;
    const toggle = combo.shadowRoot.querySelector('[part="toggle-button"]');
    toggle.click();

    expect(spy.called).to.be.false;
  });

  it('should not activate item on combo-box label element click', () => {
    const spy = sinon.spy();
    grid.addEventListener('active-item-changed', spy);

    const combo = getBodyCellContent(grid, 0, 0).firstElementChild;
    const label = combo.querySelector('[slot="label"]');
    label.click();

    expect(spy.called).to.be.false;
  });

  // Test case for https://github.com/vaadin/web-components/issues/7162
  it('should render child item content correctly with lit', async () => {
    const testComboBoxName = 'test-combo-box';

    // Create a custom version of vaadin-combo-box-scroller which initializes the virtualizer in ready phase.
    // After https://github.com/vaadin/web-components/pull/7277, the issue can't be reproduced
    // with a regular combo-box.
    class TestComboBoxScroller extends customElements.get('vaadin-combo-box-scroller') {
      ready() {
        super.ready();
        this.__initVirtualizer();
      }
    }
    customElements.define(`${testComboBoxName}-scroller`, TestComboBoxScroller);

    class TestComboBox extends customElements.get('vaadin-combo-box') {
      get _tagNamePrefix() {
        return testComboBoxName;
      }
    }
    customElements.define(testComboBoxName, TestComboBox);

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
        itemContent = document.createElement(testComboBoxName);
      }

      render(html`<div>${itemContent}</div>`, root);
    };

    const wrapper = fixtureSync(`<div></div>`);
    render(
      html`
        <vaadin-grid .dataProvider=${dataProvider} .expandedItems=${expandedItems}>
          <vaadin-grid-tree-column width="80px" flex-grow="0"></vaadin-grid-tree-column>
          <vaadin-grid-column .renderer=${renderer}></vaadin-grid-column>
        </vaadin-grid>
      `,
      wrapper,
    );

    await nextFrame();

    const grid = wrapper.querySelector('vaadin-grid');
    grid.expandedItems = [rootItem];
    await nextFrame();

    const content = getBodyCellContent(grid, 3, 1);
    expect(content.textContent).to.equal('item_2');
    expect(content.querySelector(testComboBoxName)).not.to.be.ok;
  });
});
