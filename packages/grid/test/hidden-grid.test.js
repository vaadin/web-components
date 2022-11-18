import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import '../vaadin-grid.js';
import { flushGrid, getBodyCellContent, infiniteDataProvider } from './helpers.js';

describe('hidden grid', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid style="height: 200px; width: 200px;" hidden size="1">
        <vaadin-grid-column header="foo"></vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.querySelector('vaadin-grid-column').renderer = (root, _, model) => {
      root.textContent = model.index;
    };
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
  });

  it('should be hidden', () => {
    expect(grid.offsetWidth).to.equal(0);
    expect(grid.offsetHeight).to.equal(0);
  });

  it('should have content on appear', async () => {
    grid.removeAttribute('hidden');
    await oneEvent(grid, 'animationend');
    await nextFrame();
    expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('0');
  });
});
