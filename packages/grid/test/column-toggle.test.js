import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './grid-test-styles.js';
import '../all-imports.js';
import { flushGrid } from './helpers.js';

function getMenuItems(menu) {
  return [...menu.querySelectorAll(':scope > [slot="overlay"] [role="menu"] > *')];
}

describe('column toggle', () => {
  let grid, menu, columns;

  function getToggleButton() {
    return grid.shadowRoot.querySelector('[part="column-toggle-button"]');
  }

  async function open() {
    getToggleButton().click();
    await oneEvent(menu._overlayElement, 'vaadin-overlay-open');
    await nextRender();
  }

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column path="first" header="First name" hideable></vaadin-grid-column>
        <vaadin-grid-column path="last" header="Last name" hideable></vaadin-grid-column>
        <vaadin-grid-column path="email" header="Email" hideable></vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.items = [{ first: 'John', last: 'Doe', email: 'john@example.com' }];
    flushGrid(grid);
    columns = [...grid.querySelectorAll('vaadin-grid-column')];
    await nextRender();
    menu = grid.shadowRoot.querySelector('#columnToggle');
  });

  it('should render a toggle icon button with an accessible name', () => {
    const button = getToggleButton();
    expect(button).to.be.ok;
    expect(button.getAttribute('aria-haspopup')).to.equal('true');
    // The icon button gets its accessible name from aria-label.
    expect(button.getAttribute('aria-label')).to.not.be.empty;
    expect(grid.shadowRoot.querySelector('[part="column-toggle-icon"]')).to.be.ok;
  });

  describe('automatic visibility', () => {
    it('should be shown when the grid has hideable columns', () => {
      expect(menu.hasAttribute('hidden')).to.be.false;
    });

    it('should not be shown when no column is hideable', async () => {
      // Columns are not hideable by default (opt-in), so a plain grid must
      // not get the toggle button.
      const plain = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-column path="first" header="First name"></vaadin-grid-column>
        </vaadin-grid>
      `);
      flushGrid(plain);
      await nextRender();
      expect(plain.shadowRoot.querySelector('#columnToggle').hasAttribute('hidden')).to.be.true;
    });

    it('should hide itself when there are no hideable columns left', async () => {
      // Set as properties (the Flow setHideable API does the same) — the
      // toggle must react without any other interaction.
      columns.forEach((column) => {
        column.hideable = false;
      });
      await nextFrame();
      expect(menu.hasAttribute('hidden')).to.be.true;
    });

    it('should show itself again when a hideable column appears', async () => {
      columns.forEach((column) => {
        column.hideable = false;
      });
      await nextFrame();
      expect(menu.hasAttribute('hidden')).to.be.true;

      const column = document.createElement('vaadin-grid-column');
      column.header = 'Phone';
      column.hideable = true;
      grid.appendChild(column);
      flushGrid(grid);
      await nextFrame();
      expect(menu.hasAttribute('hidden')).to.be.false;
    });

    it('should show itself when hideable is set on a hidden column', async () => {
      columns.forEach((column) => {
        column.hideable = false;
      });
      columns[0].hidden = true;
      await nextFrame();
      expect(menu.hasAttribute('hidden')).to.be.true;

      // A hidden column must count (and be listed) so it can be shown again.
      columns[0].hideable = true;
      await nextFrame();
      expect(menu.hasAttribute('hidden')).to.be.false;
      expect(grid._columnToggleItems.map((item) => item._column)).to.eql([columns[0]]);
      expect(grid._columnToggleItems[0].checked).to.be.false;
    });
  });

  it('should list exactly the hideable leaf columns', () => {
    expect(grid._columnToggleItems.map((item) => item._column)).to.eql(columns);
  });

  it('should not list a column that is not hideable', async () => {
    const column = document.createElement('vaadin-grid-column');
    column.header = 'Phone';
    grid.appendChild(column);
    flushGrid(grid);
    await nextFrame();
    expect(grid._columnToggleItems.map((item) => item._column)).to.eql(columns);
  });

  it('should label items by the column header', () => {
    expect(grid._columnToggleItems.map((item) => item.text)).to.eql(['First name', 'Last name', 'Email']);
  });

  it('should render one menu item per hideable column', async () => {
    await open();
    expect(getMenuItems(menu)).to.have.lengthOf(3);
  });

  it('should reflect the current visibility as the item checked state', async () => {
    columns[1].hidden = true;
    // The items are rebuilt when the menu opens, so the checked states are
    // fresh even for visibility changes made while the menu was closed.
    await open();
    expect(grid._columnToggleItems.map((item) => item.checked)).to.eql([true, false, true]);
  });

  it('should hide a column when its item is toggled off', async () => {
    await open();
    getMenuItems(menu)[0].click();
    await nextFrame();
    expect(columns[0].hidden).to.be.true;
  });

  it('should show a hidden column when its item is toggled on', async () => {
    columns[0].hidden = true;
    await open();
    getMenuItems(menu)[0].click();
    await nextFrame();
    expect(columns[0].hidden).to.be.false;
  });

  it('should update the rendered checkbox state immediately while the menu stays open', async () => {
    await open();
    expect(getMenuItems(menu)[0].hasAttribute('menu-item-checked')).to.be.true;

    getMenuItems(menu)[0].click();
    await nextFrame();

    // The item elements are re-rendered, so re-query them.
    const item = getMenuItems(menu)[0];
    expect(item.hasAttribute('menu-item-checked')).to.be.false;
    expect(item.getAttribute('aria-checked')).to.equal('false');
    expect(columns[0].hidden).to.be.true;
  });

  it('should keep the menu open across multiple toggles', async () => {
    await open();
    getMenuItems(menu)[0].click();
    await nextFrame();
    expect(menu.opened).to.be.true;
    getMenuItems(menu)[1].click();
    await nextFrame();
    expect(menu.opened).to.be.true;
  });

  it('should fire column-visibility-changed on the grid with the column and new state', async () => {
    const spy = sinon.spy();
    grid.addEventListener('column-visibility-changed', spy);
    await open();
    getMenuItems(menu)[2].click();
    await nextFrame();
    expect(spy.calledOnce).to.be.true;
    const { column, hidden } = spy.firstCall.args[0].detail;
    expect(column).to.equal(columns[2]);
    expect(hidden).to.be.true;
  });

  describe('hideable', () => {
    it('should not be hideable by default', () => {
      const column = document.createElement('vaadin-grid-column');
      expect(column.hideable).to.be.false;
    });

    it('should exclude non-hideable columns from the menu', async () => {
      columns[1].hideable = false;
      await nextFrame();
      expect(grid._columnToggleItems.map((item) => item._column)).to.eql([columns[0], columns[2]]);
    });

    it('should keep a non-hideable column at its current visibility', async () => {
      columns[1].hidden = true;
      columns[1].hideable = false;
      await nextFrame();
      expect(columns[1].hidden).to.be.true;
    });

    it('should fire hideable-changed when the property changes', () => {
      const spy = sinon.spy();
      columns[0].addEventListener('hideable-changed', spy);
      columns[0].hideable = false;
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail.value).to.be.false;
    });

    it('should reflect hideable to the attribute', () => {
      columns[0].hideable = false;
      expect(columns[0].hasAttribute('hideable')).to.be.false;
      columns[0].hideable = true;
      expect(columns[0].hasAttribute('hideable')).to.be.true;
    });

    it('should include the menu item again when hideable is set back as a property', async () => {
      columns[1].hideable = false;
      await nextFrame();
      expect(grid._columnToggleItems).to.have.lengthOf(2);
      columns[1].hideable = true;
      await nextFrame();
      expect(grid._columnToggleItems).to.have.lengthOf(3);
    });
  });

  describe('label fallbacks', () => {
    it('should use the rendered header text when there is no plain-text header', async () => {
      // Removing the `header` string leaves the grid to render a header from
      // the column's path; the toggle should use that rendered text (this is
      // also how Flow columns, which use a header renderer, are labeled).
      columns[0].header = null;
      await open();
      expect(grid._columnToggleItems[0].text).to.equal('First');
    });

    it('should fall back to a generic label when there is no header or path', async () => {
      const bare = document.createElement('vaadin-grid-column');
      bare.hideable = true;
      grid.appendChild(bare);
      flushGrid(grid);
      await nextFrame();
      const item = grid._columnToggleItems.find((i) => i._column === bare);
      expect(item).to.be.ok;
      expect(item.text).to.equal(`Column ${grid._columnToggleItems.indexOf(item) + 1}`);
    });
  });

  describe('live updates', () => {
    it('should update the menu when a column is added', async () => {
      const column = document.createElement('vaadin-grid-column');
      column.header = 'Phone';
      column.hideable = true;
      grid.appendChild(column);
      flushGrid(grid);
      await nextFrame();
      expect(grid._columnToggleItems.map((item) => item.text)).to.include('Phone');
    });

    it('should update the menu when a column is removed', async () => {
      grid.removeChild(columns[2]);
      flushGrid(grid);
      await nextFrame();
      expect(grid._columnToggleItems.map((item) => item.text)).to.eql(['First name', 'Last name']);
    });

    it('should update the label when a header changes', async () => {
      columns[0].setAttribute('header', 'Given name');
      // The labels are refreshed when the menu opens.
      await open();
      expect(grid._columnToggleItems[0].text).to.equal('Given name');
    });

    it('should keep reacting to hideable changes after the grid is detached and reattached', async () => {
      const parent = grid.parentElement;
      grid.remove();
      parent.appendChild(grid);
      await nextFrame();

      // The per-column hideable-changed listeners are torn down on disconnect
      // and must be re-established on reconnect.
      columns[0].hideable = false;
      await nextFrame();
      expect(grid._columnToggleItems.map((item) => item._column)).to.eql([columns[1], columns[2]]);
    });
  });

  describe('accessibility', () => {
    it('should announce items as checkboxes with their state', async () => {
      columns[0].hidden = true;
      await open();
      await nextFrame();
      const items = getMenuItems(menu);
      expect(items[0].getAttribute('role')).to.equal('menuitemcheckbox');
      expect(items[0].getAttribute('aria-checked')).to.equal('false');
      expect(items[1].getAttribute('aria-checked')).to.equal('true');
    });

    it('should reflect aria-expanded on the toggle button', async () => {
      const button = getToggleButton();
      expect(button.getAttribute('aria-expanded')).to.equal('false');
      await open();
      expect(button.getAttribute('aria-expanded')).to.equal('true');
    });
  });

  describe('excluded columns', () => {
    let treeGrid;

    beforeEach(async () => {
      treeGrid = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-selection-column hideable></vaadin-grid-selection-column>
          <vaadin-grid-column-group header="Name">
            <vaadin-grid-column path="first" header="First" hideable></vaadin-grid-column>
            <vaadin-grid-column path="last" header="Last" hideable></vaadin-grid-column>
          </vaadin-grid-column-group>
          <vaadin-grid-column path="email" header="Email" hideable></vaadin-grid-column>
        </vaadin-grid>
      `);
      treeGrid.items = [{ first: 'John', last: 'Doe', email: 'john@example.com' }];
      flushGrid(treeGrid);
      await nextRender();
    });

    it('should exclude the selection column and column groups', () => {
      expect(treeGrid._columnToggleItems.map((item) => item.text)).to.eql(['First', 'Last', 'Email']);
    });
  });
});
