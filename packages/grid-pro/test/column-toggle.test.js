import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '../src/vaadin-grid-pro.js';
import '../src/vaadin-grid-pro-edit-column.js';
import { flushGrid } from './helpers.js';

function getMenuItems(menu) {
  return [...menu.querySelectorAll(':scope > [slot="overlay"] [role="menu"] > *')];
}

describe('grid-pro column toggle', () => {
  let grid, menu, columns;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid-pro>
        <vaadin-grid-pro-edit-column path="name" header="Name" hideable></vaadin-grid-pro-edit-column>
        <vaadin-grid-pro-edit-column path="age" header="Age" hideable></vaadin-grid-pro-edit-column>
      </vaadin-grid-pro>
    `);
    grid.items = [{ name: 'John', age: 30 }];
    flushGrid(grid);
    columns = [...grid.querySelectorAll('vaadin-grid-pro-edit-column')];
    await nextRender();
    menu = grid.shadowRoot.querySelector('#columnToggle');
  });

  it('should inherit the hideable property on edit columns', () => {
    expect(columns[0].hideable).to.be.true;
  });

  it('should list the grid-pro edit columns', () => {
    expect(grid._columnToggleItems.map((item) => item.text)).to.eql(['Name', 'Age']);
  });

  it('should hide a grid-pro edit column when its item is toggled', async () => {
    const button = grid.shadowRoot.querySelector('[part="column-toggle-button"]');
    button.click();
    await oneEvent(menu._overlayElement, 'vaadin-overlay-open');
    await nextRender();

    getMenuItems(menu)[0].click();
    await nextFrame();
    expect(columns[0].hidden).to.be.true;
  });

  it('should exclude a non-hideable edit column', async () => {
    columns[1].hideable = false;
    await nextFrame();
    expect(grid._columnToggleItems.map((item) => item.text)).to.eql(['Name']);
  });
});
