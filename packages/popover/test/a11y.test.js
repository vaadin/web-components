import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, focusout, nextRender, nextUpdate, oneEvent, outsideClick, tab } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '@vaadin/dialog';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { Popover } from '../src/vaadin-popover.js';
import { mouseenter, mouseleave } from './helpers.js';

describe('a11y', () => {
  let popover, target, overlay;

  before(() => {
    Popover.setDefaultFocusDelay(0);
    Popover.setDefaultHoverDelay(0);
    Popover.setDefaultHideDelay(0);
  });

  beforeEach(async () => {
    [popover, target] = fixtureSync(`
      <div>
        <vaadin-popover>
          <input />
        </vaadin-popover>
        <button>Target</button>
      </div>
    `).children;
    popover.target = target;
    await nextRender();
    overlay = popover.shadowRoot.querySelector('vaadin-popover-overlay');
  });

  describe('id', () => {
    beforeEach(() => {
      popover = document.createElement('vaadin-popover');
    });

    afterEach(() => {
      popover.remove();
    });

    it('should set generated ID on the host by default', async () => {
      const ID_REGEX = /^vaadin-popover-\d+$/u;
      document.body.appendChild(popover);
      await nextRender();
      expect(popover.id).to.match(ID_REGEX);
    });

    it('should not override custom ID set on the popover', async () => {
      popover.id = 'custom-id';
      document.body.appendChild(popover);
      await nextRender();
      expect(popover.id).to.equal('custom-id');
    });
  });

  describe('ARIA attributes', () => {
    it('should set role attribute to dialog', () => {
      expect(popover.getAttribute('role')).to.equal('dialog');
    });

    it('should allow setting role declaratively', () => {
      popover = fixtureSync('<vaadin-popover role="menu"></vaadin-popover>');
      expect(popover.role).to.equal('menu');
      expect(popover.getAttribute('role')).to.equal('menu');
    });

    it('should change role attribute when setting role', async () => {
      popover.role = 'alertdialog';
      await nextUpdate(popover);
      expect(popover.getAttribute('role')).to.equal('alertdialog');
    });

    it('should change role attribute based on overlayRole', async () => {
      popover.overlayRole = 'alertdialog';
      await nextUpdate(popover);
      expect(popover.getAttribute('role')).to.equal('alertdialog');
    });

    ['target', 'ariaTarget'].forEach((prop) => {
      describe(prop, () => {
        let element;

        beforeEach(async () => {
          if (prop === 'ariaTarget') {
            target = fixtureSync('<div><input></div>');
            popover.target = target;
            element = target.firstElementChild;
            target.ariaTarget = element;
            await nextUpdate(popover);
          } else {
            element = target;
          }
        });

        it(`should set aria-haspopup attribute on the ${prop}`, () => {
          expect(element.getAttribute('aria-haspopup')).to.equal('dialog');
        });

        it(`should keep aria-haspopup attribute on the ${prop} when role is set to alertdialog`, async () => {
          popover.role = 'alertdialog';
          await nextUpdate(popover);
          expect(element.getAttribute('aria-haspopup')).to.equal('dialog');
        });

        it(`should keep aria-haspopup attribute on the ${prop} when overlayRole is set to alertdialog`, async () => {
          popover.overlayRole = 'alertdialog';
          await nextUpdate(popover);
          expect(element.getAttribute('aria-haspopup')).to.equal('dialog');
        });

        it(`should update aria-haspopup attribute on the ${prop} when role is set to different value`, async () => {
          popover.role = 'menu';
          await nextUpdate(popover);
          expect(element.getAttribute('aria-haspopup')).to.equal('true');
        });

        it(`should update aria-haspopup attribute on the ${prop} when overlayRole is set to different value`, async () => {
          popover.overlayRole = 'menu';
          await nextUpdate(popover);
          expect(element.getAttribute('aria-haspopup')).to.equal('true');
        });

        it(`should set aria-expanded attribute on the ${prop} when closed`, () => {
          expect(element.getAttribute('aria-expanded')).to.equal('false');
        });

        it(`should set aria-expanded attribute on the ${prop} when opened`, async () => {
          popover.opened = true;
          await oneEvent(overlay, 'vaadin-overlay-open');
          expect(element.getAttribute('aria-expanded')).to.equal('true');
        });

        it(`should set aria-controls attribute on the ${prop} when opened`, async () => {
          popover.opened = true;
          await oneEvent(overlay, 'vaadin-overlay-open');
          expect(element.getAttribute('aria-controls')).to.equal(popover.id);
        });

        it(`should remove aria-controls attribute from the ${prop} when closed`, async () => {
          popover.opened = true;
          await oneEvent(overlay, 'vaadin-overlay-open');

          popover.opened = false;
          await nextUpdate(popover);
          expect(element.hasAttribute('aria-controls')).to.be.false;
        });

        it(`should remove aria-haspopup attribute from ${prop} when target is cleared`, async () => {
          popover.target = null;
          await nextUpdate(popover);
          expect(element.hasAttribute('aria-haspopup')).to.be.false;
        });

        it(`should remove aria-controls attribute from ${prop} when target is cleared`, async () => {
          popover.opened = true;
          await oneEvent(overlay, 'vaadin-overlay-open');

          popover.target = null;
          await nextUpdate(popover);
          expect(element.hasAttribute('aria-controls')).to.be.false;
        });

        it(`should remove aria-expanded attribute from ${prop} when target is cleared`, async () => {
          popover.target = null;
          await nextUpdate(popover);
          expect(element.hasAttribute('aria-expanded')).to.be.false;
        });
      });
    });
  });

  describe('accessible name', () => {
    it('should not set aria-label on the host element by default', () => {
      expect(popover.hasAttribute('aria-label')).to.be.false;
    });

    it('should set aria-label on the host element when accessibleName is set', async () => {
      popover.accessibleName = 'Label text';
      await nextUpdate(popover);
      expect(popover.getAttribute('aria-label')).to.equal('Label text');
    });

    it('should remove aria-label from the host element when accessibleName is removed', async () => {
      popover.accessibleName = 'Label text';
      await nextUpdate(popover);

      popover.accessibleName = null;
      await nextUpdate(popover);
      expect(popover.hasAttribute('aria-label')).to.be.false;
    });

    it('should not set aria-labelledby on the host element by default', () => {
      expect(popover.hasAttribute('aria-labelledby')).to.be.false;
    });

    it('should set aria-labelledby the host element when accessibleNameRef is set', async () => {
      popover.accessibleNameRef = 'custom-label';
      await nextUpdate(popover);
      expect(popover.getAttribute('aria-labelledby')).to.equal('custom-label');
    });

    it('should remove aria-labelledby from the host element when accessibleNameRef is removed', async () => {
      popover.accessibleNameRef = 'custom-label';
      await nextUpdate(popover);

      popover.accessibleNameRef = null;
      await nextUpdate(popover);
      expect(popover.hasAttribute('aria-labelledby')).to.be.false;
    });
  });

  describe('autofocus', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy(popover, 'focus');
    });

    it('should not focus the popover when opened by default', async () => {
      target.click();
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(spy).to.not.be.called;
    });

    it('should focus the popover when opened if autofocus is true', async () => {
      popover.autofocus = true;
      target.click();
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(spy).to.be.calledOnce;
    });
  });

  describe('focus restoration', () => {
    describe('focus trigger', () => {
      beforeEach(async () => {
        popover.trigger = ['focus'];
        await nextUpdate(popover);

        target.focus();
        await oneEvent(overlay, 'vaadin-overlay-open');
      });

      it('should restore focus on Esc with trigger set to focus', async () => {
        const focusSpy = sinon.spy(target, 'focus');
        popover.focus();
        await sendKeys({ press: 'Escape' });
        await nextRender();

        expect(focusSpy).to.be.calledOnce;
      });

      it('should not re-open when restoring focus on Esc with trigger set to focus', async () => {
        popover.focus();
        await sendKeys({ press: 'Escape' });
        await nextRender();

        expect(popover.opened).to.be.false;
      });

      it('should not re-open when restoring focus on outside click with trigger set to focus', async () => {
        popover.focus();
        outsideClick();
        await nextRender();

        expect(popover.opened).to.be.false;
      });

      it('should re-open when re-focusing after closing on outside click with trigger set to focus', async () => {
        popover.focus();
        outsideClick();
        await nextRender();

        target.blur();
        target.focus();
        await nextRender();

        expect(popover.opened).to.be.true;
      });
    });

    describe('click trigger', () => {
      beforeEach(async () => {
        popover.trigger = ['click'];
        await nextUpdate(popover);

        target.click();
        await oneEvent(overlay, 'vaadin-overlay-open');
      });

      it('should restore focus on Esc with trigger set to click', async () => {
        const focusSpy = sinon.spy(target, 'focus');
        popover.focus();
        await sendKeys({ press: 'Escape' });
        await nextRender();

        expect(focusSpy).to.be.calledOnce;
      });

      it('should restore focus on outside click with trigger set to click', async () => {
        const focusSpy = sinon.spy(target, 'focus');
        outsideClick();
        await nextRender();

        expect(focusSpy).to.be.calledOnce;
      });

      it('should restore focus on close after Tab to overlay with trigger set to click', async () => {
        const focusSpy = sinon.spy(target, 'focus');
        tab(target);
        focusout(target, overlay);
        popover.focus();
        await sendKeys({ press: 'Escape' });
        await nextRender();

        expect(focusSpy).to.be.calledOnce;
      });
    });

    describe('hover trigger', () => {
      beforeEach(async () => {
        popover.trigger = ['hover'];
        await nextUpdate(popover);
      });

      it('should not restore focus on Esc with trigger set to hover', async () => {
        mouseenter(target);
        await oneEvent(overlay, 'vaadin-overlay-open');

        const focusSpy = sinon.spy(target, 'focus');
        popover.focus();
        await sendKeys({ press: 'Escape' });
        await nextRender();

        expect(focusSpy).to.not.be.called;
      });

      it('should set pointer-events: auto on the target when opened if modal', async () => {
        popover.modal = true;
        await nextUpdate(popover);

        mouseenter(target);
        await oneEvent(overlay, 'vaadin-overlay-open');

        expect(target.style.pointerEvents).to.equal('auto');
      });

      it('should remove pointer-events on the target when closed if modal', async () => {
        popover.modal = true;
        await nextUpdate(popover);

        mouseenter(target);
        await oneEvent(overlay, 'vaadin-overlay-open');

        mouseleave(target);
        await nextRender();

        expect(target.style.pointerEvents).to.equal('');
      });
    });

    describe('hover and focus trigger', () => {
      beforeEach(async () => {
        popover.trigger = ['hover', 'focus'];
        await nextUpdate(popover);

        target.focus();
        await oneEvent(overlay, 'vaadin-overlay-open');
      });

      it('should not restore focus when re-opening on hover after being restored', async () => {
        outsideClick();
        await nextRender();

        // Re-open overlay
        mouseenter(target);
        await nextRender();

        const focusSpy = sinon.spy(target, 'focus');
        popover.focus();
        await sendKeys({ press: 'Escape' });
        await nextRender();

        expect(focusSpy).to.not.be.called;
      });

      it('should restore focus when hover occurs after opening on focus', async () => {
        mouseenter(target);

        const focusSpy = sinon.spy(target, 'focus');
        popover.focus();
        await sendKeys({ press: 'Escape' });
        await nextRender();

        expect(focusSpy).to.be.calledOnce;
      });
    });

    describe('scroll behavior', () => {
      it('should not scroll the page when focusing the popover', async () => {
        // Create a tall element to make the page scrollable
        const spacer = fixtureSync(`
          <div style="height: 200vh"></div>
        `);
        document.body.insertBefore(spacer, document.body.firstChild);

        // Scroll to the top
        window.scrollTo(0, 0);

        // Open the popover
        popover.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');

        // Focus the popover programmatically
        popover.focus();

        // The page should not have scrolled
        expect(window.scrollY).to.equal(0);
      });
    });
  });

  describe('Tab order', () => {
    ['default', 'focusElement'].forEach((suite) => {
      describe(suite, () => {
        let input;

        beforeEach(async () => {
          input = document.createElement('input');
          target.parentElement.appendChild(input);

          popover.trigger = [];
          popover.opened = true;

          if (suite === 'focusElement') {
            const wrapper = document.createElement('div');
            target.parentElement.insertBefore(wrapper, target);
            wrapper.focusElement = target;
            wrapper.appendChild(target);

            popover.target = wrapper;
          }
          await oneEvent(overlay, 'vaadin-overlay-open');
        });

        it('should focus the popover on target Tab', async () => {
          target.focus();

          const spy = sinon.spy(popover, 'focus');
          await sendKeys({ press: 'Tab' });

          expect(spy).to.be.calledOnce;
        });

        it('should focus the target on overlay content part Shift Tab', async () => {
          target.focus();

          // Move focus to the overlay
          await sendKeys({ press: 'Tab' });

          const spy = sinon.spy(target, 'focus');

          // Move focus back to the target
          await sendKeys({ press: 'Shift+Tab' });

          expect(spy).to.be.calledOnce;
        });

        it('should focus the next element after target on last overlay child Tab', async () => {
          target.focus();

          // Move focus to the overlay
          await sendKeys({ press: 'Tab' });

          // Move focus to the input inside the overlay
          await sendKeys({ press: 'Tab' });

          const spy = sinon.spy(input, 'focus');

          // Move focus to the input after the overlay
          await sendKeys({ press: 'Tab' });

          expect(spy).to.be.calledOnce;
        });

        it('should focus the last overlay child on the next element Shift Tab', async () => {
          input.focus();

          const focusable = popover.querySelector('input');
          const spy = sinon.spy(focusable, 'focus');

          await sendKeys({ press: 'Shift+Tab' });

          expect(spy).to.be.calledOnce;
        });

        it('should not focus the popover on the next element Tab', async () => {
          // Add another input after the test input that focus can move to
          // Otherwise playwright sometimes wraps focus back to the popover instead of the body
          const anotherInput = document.createElement('input');
          input.after(anotherInput);

          input.focus();

          await sendKeys({ press: 'Tab' });

          expect(document.activeElement).to.equal(anotherInput);
        });

        it('should focus previous element on target Shift Tab while opened', async () => {
          target.parentElement.insertBefore(input, target);

          // Make popover open on focus
          popover.opened = false;
          popover.trigger = ['focus'];
          await nextUpdate(popover);

          target.focus();
          await oneEvent(overlay, 'vaadin-overlay-open');

          // Move focus back from the target
          await sendKeys({ press: 'Shift+Tab' });
          await nextRender();

          const activeElement = getDeepActiveElement();
          expect(activeElement).to.equal(input);
        });
      });
    });

    describe('focus', () => {
      let input;

      beforeEach(async () => {
        // Place popover after target
        target.parentElement.insertBefore(target, popover);

        input = document.createElement('input');
        target.parentElement.appendChild(input);

        popover.trigger = ['focus'];
        target.focus();

        await oneEvent(overlay, 'vaadin-overlay-open');
      });

      it('should focus the next element after target on last overlay child Tab', async () => {
        // Move focus to the overlay
        await sendKeys({ press: 'Tab' });

        // Move focus to the input inside the overlay
        await sendKeys({ press: 'Tab' });

        // Move focus to the input after the overlay
        await sendKeys({ press: 'Tab' });

        const activeElement = getDeepActiveElement();
        expect(activeElement).to.equal(input);
      });

      it('should focus the popover on focusable content Shift Tab', async () => {
        // Move focus to the overlay
        await sendKeys({ press: 'Tab' });

        // Move focus to the input inside the overlay
        await sendKeys({ press: 'Tab' });

        // Move focus back to the popover
        await sendKeys({ press: 'Shift+Tab' });

        const activeElement = getDeepActiveElement();
        expect(activeElement).to.equal(popover);
      });
    });
  });

  describe('inside dialog', () => {
    let dialog, btn1, btn4, btn5, popoverTarget, popoverInput;

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

      it('should move focus from popover inside button to btn4 on Tab', async () => {
        popoverBtn.focus();
        await sendKeys({ press: 'Tab' });

        expect(getDeepActiveElement()).to.equal(btn4);
      });

      it('should move focus from btn4 to btn5 on Tab skipping popover content', async () => {
        btn4.focus();
        await sendKeys({ press: 'Tab' });

        expect(getDeepActiveElement()).to.equal(btn5);
      });

      it('should move focus from btn5 to btn4 on Shift+Tab skipping popover content', async () => {
        btn5.focus();
        await sendKeys({ press: 'Shift+Tab' });

        expect(getDeepActiveElement()).to.equal(btn4);
      });

      it('should move focus from btn4 to popover inside button on Shift+Tab', async () => {
        btn4.focus();
        await sendKeys({ press: 'Shift+Tab' });

        expect(getDeepActiveElement()).to.equal(popoverBtn);
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

      it('should skip popover when tabbing from btn3 to btn4', async () => {
        btn3.focus();
        await sendKeys({ press: 'Tab' });

        expect(getDeepActiveElement()).to.equal(btn4);
      });

      it('should move focus from btn5 (target) to popover on Tab', async () => {
        btn5.focus();
        await sendKeys({ press: 'Tab' });

        expect(getDeepActiveElement()).to.equal(popover3);
      });

      it('should move focus from popover content to btn6 on Tab', async () => {
        popoverBtn.focus();
        await sendKeys({ press: 'Tab' });

        expect(getDeepActiveElement()).to.equal(btn6);
      });

      it('should move focus from btn6 to popover content on Shift+Tab', async () => {
        btn6.focus();
        await sendKeys({ press: 'Shift+Tab' });

        expect(getDeepActiveElement()).to.equal(popoverBtn);
      });

      it('should skip popover when Shift+Tab from btn4 to btn3', async () => {
        btn4.focus();
        await sendKeys({ press: 'Shift+Tab' });

        expect(getDeepActiveElement()).to.equal(btn3);
      });

      it('should move focus from popover to btn5 (target) on Shift+Tab', async () => {
        popover3.focus();
        await sendKeys({ press: 'Shift+Tab' });

        expect(getDeepActiveElement()).to.equal(btn5);
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

    describe('Tab navigation with popover before target, no focusable content', () => {
      let popoverNoContent2, btn3, btn6, overlayNoContent2;

      beforeEach(async () => {
        // Create a popover with no focusable content targeting btn5, placed before btn4
        // DOM order: btn1, btn3, vaadin-popover(for btn5), btn4, btn5(target)
        popoverNoContent2 = document.createElement('vaadin-popover');
        const span = document.createElement('span');
        span.textContent = 'Tooltip-like content';
        popoverNoContent2.appendChild(span);
        popoverNoContent2.trigger = [];

        const root = btn1.parentNode;

        // Add btn6 after btn5
        btn6 = document.createElement('button');
        btn6.id = 'btn6';
        btn6.textContent = 'Button 6';
        root.appendChild(btn6);

        // Insert popover before btn4 in the DOM
        btn3 = dialog.querySelector('#btn3');
        root.insertBefore(popoverNoContent2, btn4);

        popoverNoContent2.target = btn5;
        await nextUpdate(popoverNoContent2);

        overlayNoContent2 = popoverNoContent2.shadowRoot.querySelector('vaadin-popover-overlay');

        popoverNoContent2.opened = true;
        await oneEvent(overlayNoContent2, 'vaadin-overlay-open');
      });

      afterEach(async () => {
        popoverNoContent2.opened = false;
        await nextRender();
      });

      it('should skip popover when tabbing from btn3 to btn4', async () => {
        btn3.focus();
        await sendKeys({ press: 'Tab' });

        expect(getDeepActiveElement()).to.equal(btn4);
      });

      it('should move focus from btn5 (target) to popover on Tab', async () => {
        btn5.focus();
        await sendKeys({ press: 'Tab' });

        expect(getDeepActiveElement()).to.equal(popoverNoContent2);
      });

      it('should move focus from popover to btn6 on Tab', async () => {
        popoverNoContent2.focus();
        await sendKeys({ press: 'Tab' });

        expect(getDeepActiveElement()).to.equal(btn6);
      });

      it('should move focus from btn6 to popover on Shift+Tab', async () => {
        btn6.focus();
        await sendKeys({ press: 'Shift+Tab' });

        expect(getDeepActiveElement()).to.equal(popoverNoContent2);
      });

      it('should skip popover when Shift+Tab from btn4 to btn3', async () => {
        btn4.focus();
        await sendKeys({ press: 'Shift+Tab' });

        expect(getDeepActiveElement()).to.equal(btn3);
      });

      it('should move focus from popover to btn5 (target) on Shift+Tab', async () => {
        popoverNoContent2.focus();
        await sendKeys({ press: 'Shift+Tab' });

        expect(getDeepActiveElement()).to.equal(btn5);
      });
    });
  });
});
