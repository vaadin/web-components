import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '@vaadin/dialog/src/vaadin-dialog.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { Popover } from '@vaadin/popover/src/vaadin-popover.js';

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
    button = dialog.querySelector('button');
    popover = dialog.querySelector('vaadin-popover');
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

      afterEach(async () => {
        await resetMouse();
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

      it(`should not close the dialog when closing ${type} popover on outside click`, async () => {
        // Use proper mouse click instead of the "outsideClick" helper because
        // clicking programmatically calls all click listeners synchronously,
        // and that would break this test by making it false-positive (so as
        // the dialog remains open, while the real user click would close it).
        await sendMouse({ type: 'click', position: [10, 10] });

        expect(overlay.opened).to.be.false;
        expect(dialog.opened).to.be.true;
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

describe('popover Tab navigation in dialog', () => {
  let dialog, popover, overlay, btn1, btn4, btn5, popoverTarget, popoverInput;

  before(() => {
    Popover.setDefaultFocusDelay(0);
  });

  beforeEach(async () => {
    dialog = fixtureSync('<vaadin-dialog opened></vaadin-dialog>');
    await nextRender();

    // Create popover element separately to ensure proper upgrade
    popover = document.createElement('vaadin-popover');
    popoverInput = document.createElement('input');
    popoverInput.id = 'popover-input';
    popover.appendChild(popoverInput);
    popover.trigger = [];

    dialog.renderer = (root) => {
      if (root.firstChild) {
        return;
      }
      root.innerHTML = `
        <button id="btn1">Button 1</button>
        <button id="btn2">Button 2</button>
        <button id="btn3">Button 3</button>
        <button id="btn4">Button 4</button>
        <button id="btn5">Button 5</button>
      `;
      root.appendChild(popover);
    };
    await nextUpdate(dialog);
    // Content is rendered into the dialog element itself, not the overlay
    btn1 = dialog.querySelector('#btn1');
    btn4 = dialog.querySelector('#btn4');
    btn5 = dialog.querySelector('#btn5');
    popover.target = btn4;
    await nextUpdate(popover);

    popoverTarget = btn4;
    overlay = popover.shadowRoot.querySelector('vaadin-popover-overlay');
  });

  afterEach(async () => {
    dialog.opened = false;
    await nextRender();
  });

  describe('Tab navigation', () => {
    beforeEach(async () => {
      popover.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    it('should move focus from target to popover on Tab', async () => {
      popoverTarget.focus();
      await sendKeys({ press: 'Tab' });

      const activeElement = getDeepActiveElement();
      expect(activeElement).to.equal(popover);
    });

    it('should move focus from popover to input on Tab', async () => {
      popover.focus();
      await sendKeys({ press: 'Tab' });

      const activeElement = getDeepActiveElement();
      expect(activeElement).to.equal(popoverInput);
    });

    it('should move focus from popover input to button 5 on Tab', async () => {
      popoverInput.focus();
      await sendKeys({ press: 'Tab' });

      const activeElement = getDeepActiveElement();
      expect(activeElement).to.equal(btn5);
    });

    it('should move focus from button 5 to popover input on Shift+Tab', async () => {
      btn5.focus();
      await sendKeys({ press: 'Shift+Tab' });

      const activeElement = getDeepActiveElement();
      expect(activeElement).to.equal(popoverInput);
    });

    it('should move focus from popover input to popover on Shift+Tab', async () => {
      popoverInput.focus();
      await sendKeys({ press: 'Shift+Tab' });

      const activeElement = getDeepActiveElement();
      expect(activeElement).to.equal(popover);
    });

    it('should move focus from popover to target on Shift+Tab', async () => {
      popover.focus();
      await sendKeys({ press: 'Shift+Tab' });

      const activeElement = getDeepActiveElement();
      expect(activeElement).to.equal(popoverTarget);
    });
  });

  describe('Tab navigation with no focusable content', () => {
    let popoverNoContent, overlayNoContent;

    beforeEach(async () => {
      // Create a popover with only text content (no focusable elements)
      popoverNoContent = document.createElement('vaadin-popover');
      const span = document.createElement('span');
      span.textContent = 'Tooltip-like content';
      popoverNoContent.appendChild(span);
      popoverNoContent.trigger = [];

      const root = btn1.parentNode;

      // Remove the original popover and use this one instead
      popover.opened = false;
      root.removeChild(popover);

      root.appendChild(popoverNoContent);
      popoverNoContent.target = btn4;
      await nextUpdate(popoverNoContent);

      popoverTarget = btn4;
      overlayNoContent = popoverNoContent.shadowRoot.querySelector('vaadin-popover-overlay');

      popoverNoContent.opened = true;
      await oneEvent(overlayNoContent, 'vaadin-overlay-open');
    });

    afterEach(async () => {
      popoverNoContent.opened = false;
      await nextRender();
    });

    it('should move focus from target to popover on Tab', async () => {
      popoverTarget.focus();
      await sendKeys({ press: 'Tab' });

      expect(getDeepActiveElement()).to.equal(popoverNoContent);
    });

    it('should move focus from popover to button 5 on Tab', async () => {
      popoverNoContent.focus();
      await sendKeys({ press: 'Tab' });

      expect(getDeepActiveElement()).to.equal(btn5);
    });

    it('should move focus from button 5 to popover on Shift+Tab', async () => {
      btn5.focus();
      await sendKeys({ press: 'Shift+Tab' });

      expect(getDeepActiveElement()).to.equal(popoverNoContent);
    });

    it('should move focus from popover to target on Shift+Tab', async () => {
      popoverNoContent.focus();
      await sendKeys({ press: 'Shift+Tab' });

      expect(getDeepActiveElement()).to.equal(popoverTarget);
    });
  });

  describe('Tab navigation with popover on last button', () => {
    beforeEach(async () => {
      popover.target = btn5;
      popoverTarget = btn5;
      await nextUpdate(popover);

      popover.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    describe('with popover before target in DOM', () => {
      beforeEach(() => {
        const root = btn1.parentNode;
        root.insertBefore(popover, root.children[2]); // Before btn3
      });

      it('should not move Tab focus to button 3 when popover is between btn2 and btn3', async () => {
        popover.focus();
        await sendKeys({ press: 'Tab' });
        expect(getDeepActiveElement()).to.not.equal(dialog.querySelector('#btn3'));
      });

      it('should wrap Shift+Tab to popover content when popover is before target in DOM', async () => {
        // From dialog element (first focusable), Shift+Tab should wrap to
        // popover's last content, not btn5 (which is last in DOM order)
        btn1.focus();
        await sendKeys({ press: 'Shift+Tab' });
        // Now on dialog element
        await sendKeys({ press: 'Shift+Tab' });
        // Should reach popover input (last logical element)
        expect(getDeepActiveElement()).to.equal(popoverInput);
      });
    });

    it('should not let Tab from popover input escape the dialog', async () => {
      popoverInput.focus();
      await sendKeys({ press: 'Tab' });

      // Focus should stay within the dialog, not escape to outside elements
      const activeElement = getDeepActiveElement();
      expect(activeElement === dialog || dialog.contains(activeElement)).to.be.true;
    });

    it('should wrap Tab focus back to button 1 within dialog', async () => {
      popoverInput.focus();
      // First Tab wraps within dialog (to dialog element due to FocusTrapController)
      await sendKeys({ press: 'Tab' });
      // Second Tab reaches button 1
      await sendKeys({ press: 'Tab' });

      expect(getDeepActiveElement()).to.equal(btn1);
    });

    it('should not let Shift+Tab from button 1 escape the dialog', async () => {
      btn1.focus();
      await sendKeys({ press: 'Shift+Tab' });

      // Focus should stay within the dialog
      const activeElement = getDeepActiveElement();
      expect(activeElement === dialog || dialog.contains(activeElement)).to.be.true;
    });

    it('should wrap Shift+Tab focus back to popover input within dialog', async () => {
      btn1.focus();
      // First Shift+Tab wraps within dialog (to dialog element due to FocusTrapController)
      await sendKeys({ press: 'Shift+Tab' });
      // Second Shift+Tab reaches popover input
      await sendKeys({ press: 'Shift+Tab' });

      expect(getDeepActiveElement()).to.equal(popoverInput);
    });
  });

  ['after target', 'before target'].forEach((position) => {
    describe(`Tab navigation with popover ${position} in DOM`, () => {
      beforeEach(async () => {
        if (position === 'before target') {
          const root = btn1.parentNode;
          root.insertBefore(popover, btn1);
        }
        popover.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
      });

      it('should Tab through dialog in correct order regardless of popover DOM position', async () => {
        btn1.focus();
        expect(getDeepActiveElement()).to.equal(btn1);

        // Tab through buttons 1-4
        await sendKeys({ press: 'Tab' });
        await sendKeys({ press: 'Tab' });
        await sendKeys({ press: 'Tab' });
        expect(getDeepActiveElement()).to.equal(popoverTarget);

        // Tab to popover
        await sendKeys({ press: 'Tab' });
        expect(getDeepActiveElement()).to.equal(popover);

        // Tab to popover input
        await sendKeys({ press: 'Tab' });
        expect(getDeepActiveElement()).to.equal(popoverInput);

        // Tab to button 5
        await sendKeys({ press: 'Tab' });
        expect(getDeepActiveElement()).to.equal(btn5);
      });

      it('should Shift+Tab through dialog in correct order regardless of popover DOM position', async () => {
        btn5.focus();
        expect(getDeepActiveElement()).to.equal(btn5);

        // Shift+Tab to popover input
        await sendKeys({ press: 'Shift+Tab' });
        expect(getDeepActiveElement()).to.equal(popoverInput);

        // Shift+Tab to popover
        await sendKeys({ press: 'Shift+Tab' });
        expect(getDeepActiveElement()).to.equal(popover);

        // Shift+Tab to button 4 (target)
        await sendKeys({ press: 'Shift+Tab' });
        expect(getDeepActiveElement()).to.equal(popoverTarget);
      });
    });
  });
});
