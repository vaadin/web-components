import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { Grid } from '../src/vaadin-grid.js';

customElements.define('vaadin-custom-grid', class CustomGrid extends Grid {});

describe('extended grid', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-custom-grid items='[{"foo": "bar"}]'>
        <vaadin-grid-column path="foo" header="Foo"></vaadin-grid-column>
      </vaadin-custom-grid>
    `);
  });

  it('child column should be able to find host grid', () => {
    expect(grid.querySelector('vaadin-grid-column')._grid).to.be.equal(grid);
  });
});
