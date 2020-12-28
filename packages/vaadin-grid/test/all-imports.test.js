import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import { flushGrid, infiniteDataProvider } from './helpers.js';
import '../all-imports.js';

describe('all imports', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid size="200">
        <vaadin-grid-column path="value" header="col0"></vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
  });

  it('should have default theme', () => {
    expect(getComputedStyle(grid).borderTopWidth).to.equal('1px');
  });
});
