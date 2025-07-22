import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import {
  esc,
  fixtureSync,
  focusout,
  nextRender,
  nextUpdate,
  oneEvent,
  outsideClick,
  tab,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
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
        <vaadin-popover></vaadin-popover>
        <button>Target</button>
      </div>
    `).children;
    popover.target = target;
    popover.renderer = (root) => {
      if (!root.firstChild) {
        root.appendChild(document.createElement('input'));
      }
    };
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
    it('should set role attribute on the host element to dialog', () => {
      expect(popover.getAttribute('role')).to.equal('dialog');
    });

    it('should change role attribute on the host element based on overlayRole', async () => {
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

        it(`should keep aria-haspopup attribute on the ${prop} when overlayRole is set to alertdialog`, async () => {
          popover.overlayRole = 'alertdialog';
          await nextUpdate(popover);
          expect(element.getAttribute('aria-haspopup')).to.equal('dialog');
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
      spy = sinon.spy(overlay.$.overlay, 'focus');
    });

    it('should not move focus to the overlay content when opened by default', async () => {
      target.click();
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(spy).to.not.be.called;
    });

    it('should move focus to the overlay content when opened if autofocus is true', async () => {
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
        overlay.$.overlay.focus();
        esc(overlay.$.overlay);
        await nextRender();

        expect(focusSpy).to.be.calledOnce;
      });

      it('should not re-open when restoring focus on Esc with trigger set to focus', async () => {
        overlay.$.overlay.focus();
        esc(overlay.$.overlay);
        await nextRender();

        expect(popover.opened).to.be.false;
      });

      it('should not re-open when restoring focus on outside click with trigger set to focus', async () => {
        overlay.$.overlay.focus();
        outsideClick();
        await nextRender();

        expect(popover.opened).to.be.false;
      });

      it('should re-open when re-focusing after closing on outside click with trigger set to focus', async () => {
        overlay.$.overlay.focus();
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
        overlay.$.overlay.focus();
        esc(overlay.$.overlay);
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
        overlay.$.overlay.focus();
        esc(overlay.$.overlay);
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
        overlay.$.overlay.focus();
        esc(overlay.$.overlay);
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
        overlay.$.overlay.focus();
        esc(overlay.$.overlay);
        await nextRender();

        expect(focusSpy).to.not.be.called;
      });

      it('should restore focus when hover occurs after opening on focus', async () => {
        mouseenter(target);

        const focusSpy = sinon.spy(target, 'focus');
        overlay.$.overlay.focus();
        esc(overlay.$.overlay);
        await nextRender();

        expect(focusSpy).to.be.calledOnce;
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

        it('should focus the overlay content part on target Tab', async () => {
          target.focus();

          const spy = sinon.spy(overlay.$.overlay, 'focus');
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

        it('should not focus the overlay part on the next element Tab', async () => {
          input.focus();

          await sendKeys({ press: 'Tab' });

          const activeElement = getDeepActiveElement();
          expect(activeElement).to.not.equal(overlay.$.overlay);
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

      it('should focus the overlay content part on focusable content Shift Tab', async () => {
        // Move focus to the overlay
        await sendKeys({ press: 'Tab' });

        // Move focus to the input inside the overlay
        await sendKeys({ press: 'Tab' });

        // Move focus back to the overlay part
        await sendKeys({ press: 'Shift+Tab' });

        const activeElement = getDeepActiveElement();
        expect(activeElement).to.equal(overlay.$.overlay);
      });
    });
  });
});
