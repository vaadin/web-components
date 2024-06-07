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

describe('dialog in popover', () => {
  let popover, target, button, dialog;

  beforeEach(async () => {
    [target, popover] = fixtureSync(`
      <div>
        <button id="target">Open popover</button>
        <vaadin-popover for="target"></vaadin-popover>
      </div>
    `).children;

    popover.renderer = (root) => {
      root.innerHTML = `
        <button>Open dialog</button>
        <vaadin-dialog></vaadin-dialog>
      `;
      [button, dialog] = root.children;

      button.addEventListener('click', () => {
        dialog.opened = true;
      });

      dialog.renderer = (dialogRoot) => {
        dialogRoot.textContent = 'Dialog content';
      };
    };

    await nextRender();
    target.click();
    await nextRender();
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

      it(`should not close the ${type} popover when closing a child dialog on Escape`, async () => {
        await sendKeys({ press: 'Escape' });

        expect(dialog.opened).to.be.false;
        expect(popover.opened).to.be.true;
      });

      it(`should close the ${type} popover on subsequent Escape after the child dialog is closed`, async () => {
        await sendKeys({ press: 'Escape' });

        await sendKeys({ press: 'Escape' });

        expect(popover.opened).to.be.false;
      });
    });
  });
});
