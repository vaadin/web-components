import { expect } from '@vaadin/chai-plugins';
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
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import './not-animated-styles.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { Popover } from '../vaadin-popover.js';
import { mouseenter, mouseleave } from './helpers.js';

describe('a11y', () => {
  let popover, target, overlay;

  before(() => {
    Popover.setDefaultFocusDelay(0);
    Popover.setDefaultHoverDelay(0);
    Popover.setDefaultHideDelay(0);
  });

  beforeEach(async () => {
    popover = fixtureSync('<vaadin-popover></vaadin-popover>');
    target = fixtureSync('<button>Target</button>');
    popover.target = target;
    popover.renderer = (root) => {
      if (!root.firstChild) {
        root.appendChild(document.createElement('input'));
      }
    };
    await nextRender();
    overlay = popover.shadowRoot.querySelector('vaadin-popover-overlay');
  });

  describe('ARIA attributes', () => {
    it('should set role attribute on the overlay to dialog', () => {
      expect(overlay.getAttribute('role')).to.equal('dialog');
    });

    it('should change role attribute on the overlay based on overlayRole', async () => {
      popover.overlayRole = 'alertdialog';
      await nextUpdate(popover);
      expect(overlay.getAttribute('role')).to.equal('alertdialog');
    });

    it('should set aria-haspopup attribute on the target', () => {
      expect(target.getAttribute('aria-haspopup')).to.equal('dialog');
    });

    it('should keep aria-haspopup attribute when overlayRole is set to alertdialog', async () => {
      popover.overlayRole = 'alertdialog';
      await nextUpdate(popover);
      expect(target.getAttribute('aria-haspopup')).to.equal('dialog');
    });

    it('should update aria-haspopup attribute when overlayRole is set to different value', async () => {
      popover.overlayRole = 'menu';
      await nextUpdate(popover);
      expect(target.getAttribute('aria-haspopup')).to.equal('true');
    });

    it('should remove aria-haspopup attribute when target is cleared', async () => {
      popover.target = null;
      await nextUpdate(popover);
      expect(target.hasAttribute('aria-haspopup')).to.be.false;
    });

    it('should remove aria-controls attribute when target is cleared', async () => {
      popover.target = null;
      await nextUpdate(popover);
      expect(target.hasAttribute('aria-haspopup')).to.be.false;
    });

    it('should set aria-expanded attribute on the target when closed', () => {
      expect(target.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should set aria-expanded attribute on the target when opened', async () => {
      popover.opened = true;
      await nextRender();
      expect(target.getAttribute('aria-expanded')).to.equal('true');
    });

    it('should set aria-controls attribute on the target when opened', async () => {
      popover.opened = true;
      await nextRender();
      expect(target.getAttribute('aria-controls')).to.equal(overlay.id);
    });

    it('should remove aria-controls attribute from the target when closed', async () => {
      popover.opened = true;
      await nextRender();

      popover.opened = false;
      await nextUpdate(popover);
      expect(target.hasAttribute('aria-controls')).to.be.false;
    });
  });

  describe('accessible name', () => {
    it('should not set aria-label on the overlay by default', () => {
      expect(overlay.hasAttribute('aria-label')).to.be.false;
    });

    it('should set aria-label on the overlay when accessibleName is set', async () => {
      popover.accessibleName = 'Label text';
      await nextUpdate(popover);
      expect(overlay.getAttribute('aria-label')).to.equal('Label text');
    });

    it('should remove aria-label on the overlay when accessibleName is removed', async () => {
      popover.accessibleName = 'Label text';
      await nextUpdate(popover);

      popover.accessibleName = null;
      await nextUpdate(popover);
      expect(overlay.hasAttribute('aria-label')).to.be.false;
    });

    it('should not set aria-labelledby on the overlay by default', () => {
      expect(overlay.hasAttribute('aria-labelledby')).to.be.false;
    });

    it('should set aria-labelledby on the overlay when accessibleName is set', async () => {
      popover.accessibleNameRef = 'custom-label';
      await nextUpdate(popover);
      expect(overlay.getAttribute('aria-labelledby')).to.equal('custom-label');
    });

    it('should remove aria-label on the overlay when accessibleName is removed', async () => {
      popover.accessibleNameRef = 'custom-label';
      await nextUpdate(popover);

      popover.accessibleNameRef = null;
      await nextUpdate(popover);
      expect(overlay.hasAttribute('aria-labelledby')).to.be.false;
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
        await nextRender();
      });

      it('should restore focus on Esc with trigger set to focus', async () => {
        const focusSpy = sinon.spy(target, 'focus');
        overlay.$.overlay.focus();
        esc(overlay.$.overlay);
        await nextRender();

        expect(focusSpy).to.be.calledOnce;
      });

      it('should restore focus on close after Tab to overlay with trigger set to focus', async () => {
        const focusSpy = sinon.spy(target, 'focus');
        tab(target);
        focusout(target, overlay);
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
        await nextRender();
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
        await nextRender();

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
        await nextRender();

        expect(target.style.pointerEvents).to.equal('auto');
      });

      it('should remove pointer-events on the target when closed if modal', async () => {
        popover.modal = true;
        await nextUpdate(popover);

        mouseenter(target);
        await nextRender();

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
        await nextRender();
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
    let input;

    beforeEach(async () => {
      input = document.createElement('input');
      target.parentElement.appendChild(input);

      popover.trigger = [];
      popover.opened = true;
      await nextRender();
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
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });

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

      const focusable = overlay.querySelector('input');
      const spy = sinon.spy(focusable, 'focus');

      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });

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
      await nextRender();

      // Move focus back from the target
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
      await nextRender();

      const activeElement = getDeepActiveElement();
      expect(activeElement).to.equal(input);
    });
  });
});
