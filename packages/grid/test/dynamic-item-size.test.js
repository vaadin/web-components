import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-grid.js';
import { css } from 'lit';
import { flushGrid, getFirstVisibleItem, infiniteDataProvider } from './helpers.js';

const styles = css`
  [part~='cell']:not([part~='details-cell']) ::slotted(vaadin-grid-cell-content) {
    padding: 0 !important;
  }

  [part~='cell'] {
    padding: 1px;
    line-height: 18px;
  }

  :host(.high) [part~='cell'] {
    line-height: 100px;
  }
`;

describe('dynamic item size', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 200px; height: 200px;" size="1000">
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
  });

  it('update size using item index', () => {
    const firstItem = getFirstVisibleItem(grid);
    expect(firstItem.offsetHeight).to.be.below(100);

    grid.classList.add('high');
    flushGrid(grid);
    expect(firstItem.offsetHeight).not.to.be.below(100);
  });
});
