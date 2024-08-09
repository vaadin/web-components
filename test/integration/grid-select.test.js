import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/grid';
import '@vaadin/select';
import { flushGrid, getBodyCellContent } from '@vaadin/grid/test/helpers.js';

describe('select in grid', () => {
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
        const select = document.createElement('vaadin-select');
        select.items = [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
        ];
        root.appendChild(select);
        select.label = 'Select an option';
        select.value = model.item.value;
      }
    };
    flushGrid(grid);
    await nextRender(grid);
  });

  it('should not activate item on select toggle button click', () => {
    const spy = sinon.spy();
    grid.addEventListener('active-item-changed', spy);

    const select = getBodyCellContent(grid, 0, 0).firstElementChild;
    const toggle = select.shadowRoot.querySelector('[part="toggle-button"]');
    toggle.click();

    expect(spy.called).to.be.false;
  });

  it('should not activate item on select label element click', () => {
    const spy = sinon.spy();
    grid.addEventListener('active-item-changed', spy);

    const select = getBodyCellContent(grid, 0, 0).firstElementChild;
    const label = select.querySelector('[slot="label"]');
    label.click();

    expect(spy.called).to.be.false;
  });
});
