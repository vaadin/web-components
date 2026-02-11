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

  after(() => {
    Popover.setDefaultFocusDelay(null);
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

    it('should complete full Tab cycle through dialog with popover', async () => {
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

    it('should complete full Shift+Tab cycle through dialog with popover', async () => {
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

  describe('Tab navigation with focusable content between target and popover', () => {
    let popover2, popoverBtn, btn3, overlay2;

    beforeEach(async () => {
      // Create a second popover targeting btn3, with buttons between target and popover in DOM
      // DOM order: btn1, btn2, btn3(target), btn4, vaadin-popover2(contains <button>), btn5
      popover2 = document.createElement('vaadin-popover');
      popoverBtn = document.createElement('button');
      popoverBtn.textContent = 'Inside';
      popover2.appendChild(popoverBtn);
      popover2.trigger = [];

      const root = btn1.parentNode;

      // Insert popover2 before btn5 in the DOM
      root.insertBefore(popover2, btn5);

      popover2.target = dialog.querySelector('#btn3');
      btn3 = dialog.querySelector('#btn3');
      await nextUpdate(popover2);

      overlay2 = popover2.shadowRoot.querySelector('vaadin-popover-overlay');

      popover2.opened = true;
      await oneEvent(overlay2, 'vaadin-overlay-open');
    });

    afterEach(async () => {
      popover2.opened = false;
      await nextRender();
    });

    it('should complete full forward Tab cycle', async () => {
      btn3.focus();
      expect(getDeepActiveElement()).to.equal(btn3);

      // Tab to popover2
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(popover2);

      // Tab to inside button
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(popoverBtn);

      // Tab to btn4 (next after popover content)
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(btn4);

      // Tab to btn5
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(btn5);
    });

    it('should complete full backward Shift+Tab cycle', async () => {
      btn5.focus();
      expect(getDeepActiveElement()).to.equal(btn5);

      // Shift+Tab to btn4
      await sendKeys({ press: 'Shift+Tab' });
      expect(getDeepActiveElement()).to.equal(btn4);

      // Shift+Tab to popover inside button
      await sendKeys({ press: 'Shift+Tab' });
      expect(getDeepActiveElement()).to.equal(popoverBtn);

      // Shift+Tab to popover2
      await sendKeys({ press: 'Shift+Tab' });
      expect(getDeepActiveElement()).to.equal(popover2);

      // Shift+Tab to btn3 (target)
      await sendKeys({ press: 'Shift+Tab' });
      expect(getDeepActiveElement()).to.equal(btn3);
    });
  });

  describe('Tab navigation with popover before target in DOM', () => {
    let popover3, popoverBtn, btn2, btn3, btn6, overlay3;

    beforeEach(async () => {
      // Create a popover targeting btn5, placed before btn4 in the DOM
      // DOM order: btn1, btn2, btn3, vaadin-popover3(for btn5, contains <button>), btn4, btn5(target)
      // We also need btn6 after btn5
      popover3 = document.createElement('vaadin-popover');
      popoverBtn = document.createElement('button');
      popoverBtn.textContent = 'Inside';
      popover3.appendChild(popoverBtn);
      popover3.trigger = [];

      const root = btn1.parentNode;

      // Add btn6 after btn5
      btn6 = document.createElement('button');
      btn6.id = 'btn6';
      btn6.textContent = 'Button 6';
      root.appendChild(btn6);

      // Insert popover3 before btn4 in the DOM (between btn3 and btn4)
      btn2 = dialog.querySelector('#btn2');
      btn3 = dialog.querySelector('#btn3');
      root.insertBefore(popover3, btn4);

      popover3.target = btn5;
      await nextUpdate(popover3);

      overlay3 = popover3.shadowRoot.querySelector('vaadin-popover-overlay');

      popover3.opened = true;
      await oneEvent(overlay3, 'vaadin-overlay-open');
    });

    afterEach(async () => {
      popover3.opened = false;
      await nextRender();
    });

    it('should complete full forward Tab cycle', async () => {
      btn2.focus();
      expect(getDeepActiveElement()).to.equal(btn2);

      // Tab to btn3
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(btn3);

      // Tab to btn4 (skipping popover3)
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(btn4);

      // Tab to btn5 (target)
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(btn5);

      // Tab to popover3
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(popover3);

      // Tab to popover inside button
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(popoverBtn);

      // Tab to btn6
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(btn6);
    });

    it('should complete full backward Shift+Tab cycle', async () => {
      btn6.focus();
      expect(getDeepActiveElement()).to.equal(btn6);

      // Shift+Tab to popover inside button
      await sendKeys({ press: 'Shift+Tab' });
      expect(getDeepActiveElement()).to.equal(popoverBtn);

      // Shift+Tab to popover3
      await sendKeys({ press: 'Shift+Tab' });
      expect(getDeepActiveElement()).to.equal(popover3);

      // Shift+Tab to btn5 (target)
      await sendKeys({ press: 'Shift+Tab' });
      expect(getDeepActiveElement()).to.equal(btn5);

      // Shift+Tab to btn4
      await sendKeys({ press: 'Shift+Tab' });
      expect(getDeepActiveElement()).to.equal(btn4);

      // Shift+Tab to btn3 (skipping popover3)
      await sendKeys({ press: 'Shift+Tab' });
      expect(getDeepActiveElement()).to.equal(btn3);

      // Shift+Tab to btn2
      await sendKeys({ press: 'Shift+Tab' });
      expect(getDeepActiveElement()).to.equal(btn2);
    });
  });
});
