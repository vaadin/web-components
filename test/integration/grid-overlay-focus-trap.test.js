import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import '@vaadin/button/src/vaadin-button.js';
import '@vaadin/grid/src/vaadin-grid.js';
import '@vaadin/overlay/src/vaadin-overlay.js';
import { flushGrid } from '@vaadin/grid/test/helpers.js';

describe('overlay focus-trap', () => {
  let overlay, grid, button;

  function getFirstHeaderCell() {
    return grid.$.header.children[0].children[0];
  }

  beforeEach(async () => {
    overlay = fixtureSync(`<vaadin-overlay focus-trap></vaadin-overlay>`);
    overlay.renderer = (root) => {
      if (root.firstChild) {
        return;
      }

      root.innerHTML = `
        <vaadin-grid style="width: 200px">
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid>
        <vaadin-button>Button</vaadin-button>
      `;

      grid = root.firstElementChild;
      grid.items = [{ name: 'foo' }, { name: 'bar' }];
      flushGrid(grid);

      button = root.lastElementChild;
    };
    overlay.opened = true;
    await oneEvent(overlay, 'vaadin-overlay-open');
  });

  it('should correctly move focus on Tab when inside overlay', async () => {
    const headerCell = getFirstHeaderCell();
    headerCell.focus();

    // Move focus to grid body
    await sendKeys({ press: 'Tab' });

    // Move focus to the button
    await sendKeys({ press: 'Tab' });

    expect(document.activeElement).to.equal(button);
  });
});
