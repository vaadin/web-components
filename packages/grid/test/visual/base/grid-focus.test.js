import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-grid.js';
import '../../../src/vaadin-grid-column-group.js';
import { flushGrid } from '../../helpers.js';
import { users } from '../users.js';

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

describe('grid focus', () => {
  let element;

  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-grid style="width: 500px; height: 300px;">
        <vaadin-grid-column-group>
          <vaadin-grid-column data-name="First" width="200px"></vaadin-grid-column>
          <vaadin-grid-column data-name="Last" width="200px"></vaadin-grid-column>
        </vaadin-grid-column-group>
        <vaadin-grid-column data-name="City" width="200px"></vaadin-grid-column>
      </vaadin-grid>
      <style>
        vaadin-grid {
          --vaadin-grid-row-border-width: 4px;
          --vaadin-grid-column-border-width: 4px;
        }
      </style>
    `);
    element.items = users.slice(0, 10);

    [...element.querySelectorAll('vaadin-grid-column, vaadin-grid-column-group')].forEach((column) => {
      column.headerRenderer = (root) => {
        root.textContent = capitalize(column.dataset.name ?? 'Header');
      };
      column.renderer = (root, column, { item }) => {
        root.textContent = {
          First: item.name.first,
          Last: item.name.last,
          City: item.location.city,
        }[column.dataset.name];
      };
      column.footerRenderer = (root) => {
        root.textContent = capitalize(column.dataset.name ?? 'Footer');
      };
    });

    element.rowDetailsRenderer = (root) => {
      root.textContent = 'Details';
    };

    flushGrid(element);
    await nextRender();
  });

  describe('first header row', () => {
    beforeEach(async () => {
      // Focus first header row
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'ArrowLeft' });
    });

    it('default', async () => {
      await visualDiff(element, 'first-header-row');
    });

    it('first cell', async () => {
      await sendKeys({ press: 'ArrowRight' });
      await visualDiff(element, 'first-header-row-first-cell');
    });

    it('last cell', async () => {
      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'End' });
      await visualDiff(element, 'first-header-row-last-cell');
    });
  });

  describe('last header row', () => {
    beforeEach(async () => {
      // Focus last header row
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'ArrowLeft' });
      await sendKeys({ press: 'ArrowDown' });
    });

    it('default', async () => {
      await visualDiff(element, 'last-header-row');
    });

    it('first cell', async () => {
      await sendKeys({ press: 'ArrowRight' });
      await visualDiff(element, 'last-header-row-first-cell');
    });

    it('last cell', async () => {
      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'End' });
      await visualDiff(element, 'last-header-row-last-cell');
    });
  });

  describe('first body row', () => {
    beforeEach(async () => {
      // Focus first body row
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'ArrowLeft' });
    });

    it('default', async () => {
      await visualDiff(element, 'first-body-row');
    });

    it('first cell', async () => {
      await sendKeys({ press: 'ArrowRight' });
      await visualDiff(element, 'first-body-row-first-cell');
    });

    it('last cell', async () => {
      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'End' });
      await visualDiff(element, 'first-body-row-last-cell');
    });

    it('details opened', async () => {
      element.openItemDetails(element.items[0]);
      await nextRender();
      await visualDiff(element, 'first-body-row-details-opened');
    });

    it('details opened cell', async () => {
      element.openItemDetails(element.items[0]);
      await nextRender();
      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'ArrowDown' });
      await visualDiff(element, 'first-body-row-details-opened-cell');
    });
  });

  describe('last body row', () => {
    beforeEach(async () => {
      // Focus last body row
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'ArrowLeft' });
      await sendKeys({ press: 'End' });
      await nextRender();
    });

    it('default', async () => {
      await visualDiff(element, 'last-body-row');
    });

    it('first cell', async () => {
      await sendKeys({ press: 'ArrowRight' });
      await visualDiff(element, 'last-body-row-first-cell');
    });

    it('last cell', async () => {
      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'End' });
      await visualDiff(element, 'last-body-row-last-cell');
    });

    it('details opened', async () => {
      element.openItemDetails(element.items.at(-1));
      await nextRender();
      await sendKeys({ press: 'ArrowDown' }); // ensure details row is visible
      await visualDiff(element, 'last-body-row-details-opened');
    });

    it('details opened cell', async () => {
      element.openItemDetails(element.items.at(-1));
      await nextRender();
      await sendKeys({ press: 'ArrowRight' });
      await sendKeys({ press: 'ArrowDown' });
      await visualDiff(element, 'last-body-row-details-opened-cell');
    });
  });

  describe('without header', () => {
    beforeEach(async () => {
      [...element.querySelectorAll('vaadin-grid-column, vaadin-grid-column-group')].forEach((column) => {
        column.headerRenderer = null;
      });
      await nextRender();
    });

    it('first body row', async () => {
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'ArrowLeft' });
      await visualDiff(element, 'without-header-first-body-row');
    });

    it('first body row cell', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(element, 'without-header-first-body-row-cell');
    });
  });

  describe('without footer', () => {
    beforeEach(async () => {
      [...element.querySelectorAll('vaadin-grid-column, vaadin-grid-column-group')].forEach((column) => {
        column.footerRenderer = null;
      });
      await nextRender();
    });

    it('last body row', async () => {
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'ArrowLeft' });
      await sendKeys({ press: 'End' });
      await visualDiff(element, 'without-footer-last-body-row');
    });

    it('last body row cell', async () => {
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'ArrowLeft' });
      await sendKeys({ press: 'End' });
      await sendKeys({ press: 'ArrowRight' });
      await visualDiff(element, 'without-footer-last-body-row-cell');
    });
  });

  describe('scrolling', () => {
    beforeEach(async () => {
      // Focus first body row
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'ArrowLeft' });
    });

    it('overflow top', async () => {
      // Scroll to end
      await sendKeys({ press: 'End' });
      // Scroll a few pages up to get first visible row focused
      await sendKeys({ press: 'PageUp' });
      await sendKeys({ press: 'PageUp' });
      await visualDiff(element, 'overflow-top');
    });

    it('overflow bottom', async () => {
      // Scroll a few pages down to get last visible row focused
      await sendKeys({ press: 'PageDown' });
      await sendKeys({ press: 'PageDown' });
      await visualDiff(element, 'overflow-bottom');
    });

    it('overflow left', () => {
      element.$.table.scrollLeft = element.$.table.scrollWidth;
      return visualDiff(element, 'overflow-left');
    });
  });
});
