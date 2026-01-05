import { expect } from '@vaadin/chai-plugins';
import { aTimeout, esc, fixtureSync, focusout, nextRender, nextUpdate, outsideClick } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import { Popover } from '../src/vaadin-popover.js';
import { mouseenter, mouseleave } from './helpers.js';

describe('timers', () => {
  let popover, target, overlay, clock;

  // Used as a fallback delay
  const DEFAULT_DELAY = 500;

  async function createPopover(target, focus) {
    const element = fixtureSync('<vaadin-popover></vaadin-popover>');
    element.target = target;
    element.trigger = focus ? ['focus'] : ['hover'];

    // We use fake timers in reset tests, so native timers won't work.
    // Trigger a timeout to ensure LitElement popover initial render.
    if (clock) {
      await clock.tickAsync(1);
    } else {
      await nextUpdate(element);
    }

    return element.shadowRoot.querySelector('vaadin-popover-overlay');
  }

  before(() => {
    Popover.setDefaultFocusDelay(0);
    Popover.setDefaultHoverDelay(0);
    Popover.setDefaultHideDelay(0);
  });

  beforeEach(async () => {
    popover = fixtureSync('<vaadin-popover>Content</vaadin-popover>');
    target = fixtureSync('<button>Target</button>');
    popover.target = target;
    await nextRender();
    overlay = popover.shadowRoot.querySelector('vaadin-popover-overlay');
  });

  describe('hoverDelay', () => {
    beforeEach(async () => {
      popover.trigger = ['hover', 'focus'];
      popover.hoverDelay = 5;
      await nextUpdate(popover);
    });

    afterEach(() => {
      Popover.setDefaultHoverDelay(0);
    });

    it('should open the overlay after a delay on mouseenter', async () => {
      mouseenter(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.false;

      await aTimeout(5);
      expect(overlay.opened).to.be.true;
    });

    it('should open the overlay immediately on focus', async () => {
      target.focus();
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should use the hover delay set to 0 and not the global delay', async () => {
      Popover.setDefaultHoverDelay(50);
      popover.hoverDelay = 0;

      mouseenter(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should open the overlay immediately on click', async () => {
      popover.trigger = ['click'];
      await nextUpdate(popover);

      target.click();
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should open the overlay immediately on click during hover delay', async () => {
      popover.trigger = ['hover', 'click'];
      await nextUpdate(popover);

      mouseenter(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.false;

      target.click();
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should not open the overlay after mouseleave during hover delay', async () => {
      mouseenter(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.false;

      mouseleave(target);

      await aTimeout(5);
      expect(overlay.opened).to.be.false;
    });
  });

  describe('focusDelay', () => {
    beforeEach(async () => {
      popover.trigger = ['hover', 'focus'];
      popover.focusDelay = 5;
      await nextUpdate(popover);
    });

    afterEach(() => {
      Popover.setDefaultFocusDelay(0);
    });

    it('should open the overlay after a delay on focus', async () => {
      target.focus();
      await nextUpdate(popover);
      expect(overlay.opened).to.be.false;

      await aTimeout(5);
      expect(overlay.opened).to.be.true;
    });

    it('should open the overlay immediately on mouseenter', async () => {
      mouseenter(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should use the focus delay set to 0 and not the global delay', async () => {
      Popover.setDefaultFocusDelay(50);
      popover.focusDelay = 0;

      target.focus();
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should open the overlay immediately on click', async () => {
      popover.trigger = ['click'];
      await nextUpdate(popover);

      target.click();
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should open the overlay immediately on click during focus delay', async () => {
      popover.trigger = ['hover', 'click'];
      await nextUpdate(popover);

      target.focus();
      await nextUpdate(popover);
      expect(overlay.opened).to.be.false;

      target.click();
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });
  });

  describe('hideDelay', () => {
    beforeEach(async () => {
      popover.trigger = ['hover', 'focus'];
      popover.hideDelay = 5;
      await nextUpdate(popover);
    });

    afterEach(() => {
      Popover.setDefaultHideDelay(0);
    });

    it('should close the overlay after a hide delay on mouseleave', async () => {
      mouseenter(target);
      await nextUpdate(popover);

      mouseleave(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;

      await aTimeout(5);
      expect(overlay.opened).to.be.false;
    });

    it('should close the overlay immediately on focusout', async () => {
      target.focus();
      await nextUpdate(popover);

      focusout(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.false;
    });

    it('should use the hide delay set to 0 and not the global delay', async () => {
      Popover.setDefaultHideDelay(50);
      popover.hideDelay = 0;

      mouseenter(target);
      await nextUpdate(popover);

      mouseleave(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.false;
    });

    it('should close the overlay immediately on Esc keydown', async () => {
      target.focus();
      await nextUpdate(popover);

      esc(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.false;
    });

    it('should not close on overlay mouseenter during hide delay', async () => {
      mouseenter(target);
      await nextUpdate(popover);

      mouseleave(target, document.body);
      mouseenter(overlay);

      await aTimeout(5);
      expect(overlay.opened).to.be.true;
    });

    it('should close the overlay immediately on outside click', async () => {
      target.focus();
      await nextUpdate(popover);

      outsideClick();
      await nextUpdate(popover);
      expect(overlay.opened).to.be.false;
    });

    it('should close the overlay immediately on click', async () => {
      popover.trigger = ['click'];
      await nextUpdate(popover);

      target.click();
      await nextUpdate(popover);

      target.click();
      await nextUpdate(popover);
      expect(overlay.opened).to.be.false;
    });

    it('should close the overlay immediately on click during hide delay', async () => {
      popover.trigger = ['hover', 'click'];
      await nextUpdate(popover);

      mouseenter(target);
      await nextUpdate(popover);

      mouseleave(target);

      target.click();
      await nextUpdate(popover);
      expect(overlay.opened).to.be.false;
    });

    it('should close the overlay immediately on subsequent mouseleave during hover delay', async () => {
      popover.hoverDelay = 5;

      mouseenter(target);
      mouseleave(target);
      await nextUpdate(popover);

      mouseenter(target);
      mouseleave(target);
      await nextUpdate(popover);

      expect(overlay.opened).to.be.false;
    });
  });

  describe('setDefaultHoverDelay', () => {
    let target, overlay;

    beforeEach(() => {
      target = fixtureSync('<div>Target</div>');
    });

    afterEach(() => {
      Popover.setDefaultHoverDelay(0);
    });

    it('should change default delay for newly created popover', async () => {
      Popover.setDefaultHoverDelay(2);

      overlay = await createPopover(target);

      mouseenter(target);
      await aTimeout(2);

      expect(overlay.opened).to.be.true;
    });

    it('should change default hover delay for existing popover', async () => {
      overlay = await createPopover(target);

      Popover.setDefaultHoverDelay(2);

      mouseenter(target);
      await aTimeout(2);

      expect(overlay.opened).to.be.true;
    });

    describe('reset hover delay', () => {
      beforeEach(() => {
        clock = sinon.useFakeTimers({
          shouldClearNativeTimers: true,
        });
      });

      afterEach(() => {
        // Hide tooltip
        mouseleave(target);
        clock.tick(DEFAULT_DELAY);

        // Reset timers
        clock.restore();
      });

      it('should reset hover delay when providing a negative number', async () => {
        Popover.setDefaultHoverDelay(-1);

        overlay = await createPopover(target);

        mouseenter(target);
        await clock.tickAsync(DEFAULT_DELAY);

        expect(overlay.opened).to.be.true;
      });

      it('should reset hover delay when providing null instead of number', async () => {
        Popover.setDefaultHoverDelay(null);

        overlay = await createPopover(target);

        mouseenter(target);
        await clock.tickAsync(DEFAULT_DELAY);

        expect(overlay.opened).to.be.true;
      });

      it('should reset hover delay when providing undefined instead of number', async () => {
        Popover.setDefaultHoverDelay(undefined);

        overlay = await createPopover(target);

        mouseenter(target);
        await clock.tickAsync(DEFAULT_DELAY);

        expect(overlay.opened).to.be.true;
      });
    });
  });

  describe('setDefaultFocusDelay', () => {
    let target, overlay;

    beforeEach(() => {
      target = fixtureSync('<div tabindex="0">Target</div>');
    });

    afterEach(() => {
      Popover.setDefaultFocusDelay(0);
    });

    it('should change default delay for newly created popover', async () => {
      Popover.setDefaultFocusDelay(2);

      overlay = await createPopover(target, true);

      target.focus();
      await aTimeout(2);

      expect(overlay.opened).to.be.true;
    });

    it('should change default focus delay for existing popover', async () => {
      overlay = await createPopover(target, true);

      Popover.setDefaultFocusDelay(2);

      target.focus();
      await aTimeout(2);

      expect(overlay.opened).to.be.true;
    });

    describe('reset focus delay', () => {
      beforeEach(() => {
        clock = sinon.useFakeTimers({
          shouldClearNativeTimers: true,
        });
      });

      afterEach(() => {
        // Hide tooltip
        focusout(target);
        clock.tick(DEFAULT_DELAY);

        // Reset timers
        clock.restore();
      });

      it('should reset focus delay when providing a negative number', async () => {
        Popover.setDefaultFocusDelay(-1);

        overlay = await createPopover(target, true);

        target.focus();
        await clock.tickAsync(DEFAULT_DELAY);

        expect(overlay.opened).to.be.true;
      });

      it('should reset focus delay when providing null instead of number', async () => {
        Popover.setDefaultFocusDelay(null);

        overlay = await createPopover(target, true);

        target.focus();
        await clock.tickAsync(DEFAULT_DELAY);

        expect(overlay.opened).to.be.true;
      });

      it('should reset focus delay when providing undefined instead of number', async () => {
        Popover.setDefaultFocusDelay(undefined);

        overlay = await createPopover(target, true);

        target.focus();
        await clock.tickAsync(DEFAULT_DELAY);

        expect(overlay.opened).to.be.true;
      });
    });
  });

  describe('setDefaultHideDelay', () => {
    let target, overlay;

    beforeEach(() => {
      target = fixtureSync('<div>Target</div>');
    });

    afterEach(() => {
      Popover.setDefaultHideDelay(0);
    });

    it('should change default hide delay for newly created popover', async () => {
      Popover.setDefaultHideDelay(2);

      overlay = await createPopover(target);

      mouseenter(target);
      await nextUpdate(overlay);
      expect(overlay.opened).to.be.true;

      mouseleave(target);
      await aTimeout(2);

      expect(overlay.opened).to.be.false;
    });

    it('should change default hide delay for existing popover', async () => {
      overlay = await createPopover(target);

      Popover.setDefaultHideDelay(2);

      mouseenter(target);
      await nextUpdate(overlay);
      expect(overlay.opened).to.be.true;

      mouseleave(target);
      await aTimeout(2);

      expect(overlay.opened).to.be.false;
    });

    describe('reset hide delay', () => {
      beforeEach(() => {
        clock = sinon.useFakeTimers({
          shouldClearNativeTimers: true,
        });
      });

      afterEach(() => {
        clock.restore();
      });

      it('should reset hide delay when providing a negative number', async () => {
        Popover.setDefaultHideDelay(-1);

        overlay = await createPopover(target);

        mouseenter(target);
        await clock.tickAsync(DEFAULT_DELAY);

        mouseleave(target);
        await clock.tickAsync(DEFAULT_DELAY);

        expect(overlay.opened).to.be.false;
      });

      it('should reset hide delay when providing null instead of number', async () => {
        Popover.setDefaultHideDelay(null);

        overlay = await createPopover(target);

        mouseenter(target);
        await clock.tickAsync(DEFAULT_DELAY);

        mouseleave(target);
        await clock.tickAsync(DEFAULT_DELAY);

        expect(overlay.opened).to.be.false;
      });

      it('should reset hide delay when providing undefined instead of number', async () => {
        Popover.setDefaultHideDelay(undefined);

        overlay = await createPopover(target);

        mouseenter(target);
        await clock.tickAsync(DEFAULT_DELAY);

        mouseleave(target);
        await clock.tickAsync(DEFAULT_DELAY);

        expect(overlay.opened).to.be.false;
      });
    });
  });
});
