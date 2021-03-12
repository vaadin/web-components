import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { GridElement } from '../src/vaadin-grid.js';

customElements.define('vaadin-custom-grid', class CustomGrid extends GridElement {});

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

describe('grid-pro host', () => {
  let gridPro;

  beforeEach(() => {
    gridPro = fixtureSync(`
      <vaadin-grid-pro>
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid-pro>
    `);
  });

  it('should use grid pro as the host', () => {
    const column = gridPro.querySelector('vaadin-grid-column');
    gridPro.notifyResize = sinon.spy();
    column.hidden = true;
    expect(gridPro.notifyResize.called).to.be.true;
  });
});
