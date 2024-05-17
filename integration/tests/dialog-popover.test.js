import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import './not-animated-styles.js';
import '@vaadin/dialog';
import '@vaadin/popover';

describe('popover in dialog', () => {
  let dialog, popover, button, overlay;

  beforeEach(async () => {
    dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
    dialog.renderer = (root) => {
      if (!root.firstChild) {
        const button = document.createElement('button');
        button.textContent = 'Open popover';
        root.append(button);

        const popover = document.createElement('vaadin-popover');
        popover.renderer = (root2) => {
          if (!root2.firstChild) {
            const button2 = document.createElement('button');
            button2.textContent = 'Inside popover';
            root2.append(button2);
          }
        };

        popover.target = button;
        root.append(popover);
      }
    };
    dialog.opened = true;
    await nextRender();
    button = dialog.$.overlay.querySelector('button');
    popover = dialog.$.overlay.querySelector('vaadin-popover');
    overlay = popover._overlayElement;
  });

  afterEach(async () => {
    dialog.opened = false;
    await nextFrame();
  });

  ['modal', 'modeless'].forEach((type) => {
    describe(`${type} popover`, () => {
      beforeEach(async () => {
        if (type === 'modal') {
          popover.modal = true;
          await nextUpdate(popover);
        }

        button.focus();
        button.click();
        await nextRender();
      });

      it(`should not close the dialog when closing ${type} popover on Escape`, async () => {
        await sendKeys({ press: 'Escape' });

        expect(overlay.opened).to.be.false;
        expect(dialog.opened).to.be.true;
      });

      it(`should close the dialog on subsequent Escape after the ${type} popover is closed`, async () => {
        await sendKeys({ press: 'Escape' });

        await sendKeys({ press: 'Escape' });

        expect(dialog.opened).to.be.false;
      });
    });
  });
});
