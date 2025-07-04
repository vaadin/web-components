import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import './grid-test-styles.js';
import '../src/vaadin-grid.js';
import { css } from 'lit';
import {
  flushGrid,
  getCellContent,
  getLastVisibleItem,
  getPhysicalAverage,
  getPhysicalItems,
  infiniteDataProvider,
} from './helpers.js';

const styles = css`
  :host {
    font-size: 16px;
    line-height: 1.5;
    border: 0 !important;
  }

  :host(.small) [part~='cell'] {
    line-height: 10px;
    padding: 0 !important;
    min-height: 0 !important;
  }

  ::slotted(vaadin-grid-cell-content) {
    padding: 0 !important;
  }
`;

describe('dynamic physical count', () => {
  let scroller, grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 200px; height: 200px;" size="200">
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid>
    `);

    // Inject the test styles
    const style = document.createElement('style');
    style.textContent = styles.cssText;
    grid.shadowRoot.appendChild(style);

    grid.querySelector('vaadin-grid-column').renderer = (root, _, model) => {
      root.textContent = model.index;
    };
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
    scroller = grid.$.scroller;
    flushGrid(grid);
  });

  it('increase pool size', () => {
    const lastItem = getLastVisibleItem(grid);
    const expectedFinalItem = Math.ceil(grid.offsetHeight / getPhysicalAverage(grid)) - 1;

    expect(scroller.offsetHeight).to.equal(grid.offsetHeight);
    expect(getCellContent(lastItem).textContent).to.equal(String(expectedFinalItem));
  });

  it('increase pool size after resizing the scroller', () => {
    grid.classList.add('small');
    grid.style.display = 'none';

    const initialPhysicalSize = getPhysicalItems(grid).length;

    grid.style.display = '';
    flushGrid(grid);

    expect(getPhysicalItems(grid).length).to.be.above(initialPhysicalSize);
  });

  it('pool should not increase if the scroller has no size', () => {
    const initialPhysicalSize = getPhysicalItems(grid).length;

    grid.style.display = 'none';
    grid.style.height = '1000px';

    grid.classList.add('small');
    flushGrid(grid);

    expect(getPhysicalItems(grid).length).to.equal(initialPhysicalSize);
  });

  it('should minimize physical count', () => {
    expect(getPhysicalItems(grid).length).to.be.below(26);
    grid.style.height = '1000px';
    flushGrid(grid);

    expect(getPhysicalItems(grid).length).to.be.above(26);
    expect(getPhysicalItems(grid).length).to.be.below(70);
  });
});
