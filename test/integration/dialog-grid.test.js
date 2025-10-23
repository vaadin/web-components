import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '@vaadin/grid';
import '@vaadin/dialog';

describe('grid in dialog', () => {
  let dialog;

  beforeEach(async () => {
    dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
    dialog.renderer = (root) => {
      root.innerHTML = '<vaadin-grid><vaadin-grid-column></vaadin-grid-column></vaadin-grid>';
      const grid = root.firstElementChild;
      grid.items = ['one', 'two'];
      const column = grid.firstElementChild;
      column.renderer = (root, _, model) => {
        if (root.firstElementChild) {
          return;
        }
        root.innerHTML = `<button>Button ${model.item}</button>`;
      };
    };
    dialog.opened = true;
    await oneEvent(dialog.$.overlay, 'vaadin-overlay-open');
  });

  afterEach(async () => {
    dialog.opened = false;
    await nextFrame();
  });

  describe('interaction', () => {
    it('should not close on Esc if focus is on interactive element', async () => {
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Enter' });
      await sendKeys({ press: 'Escape' });
      expect(dialog.opened).to.be.true;
    });

    it('should close on Esc if focus is back to grid cell', async () => {
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Enter' });
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Escape' });
      expect(dialog.opened).to.be.false;
    });
  });
});
