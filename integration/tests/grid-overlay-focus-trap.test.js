import { expect } from '@esm-bundle/chai';
import { fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '@vaadin/button';
import '@vaadin/grid';
import '@vaadin/vaadin-overlay';
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
