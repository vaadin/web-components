import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import { flushGrid, infiniteDataProvider } from './helpers.js';
import '../theme/material/vaadin-grid.js';

describe('resizing material grid', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid size="10">
        <vaadin-grid-column header="Name"></vaadin-grid-column>
        <vaadin-grid-column header="Surname"></vaadin-grid-column>
        <vaadin-grid-column header="Effort" resizable></vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
  });

  it('should not overflow with last resizable column', () => {
    expect(grid.$.table.scrollWidth).to.be.equal(grid.$.table.clientWidth);
  });
});
