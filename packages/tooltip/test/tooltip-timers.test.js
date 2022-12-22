import { expect } from '@esm-bundle/chai';
import {
  aTimeout,
  escKeyDown,
  fixtureSync,
  focusin,
  focusout,
  mousedown,
  nextRender,
  tabKeyDown,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import { Tooltip } from '../vaadin-tooltip.js';
import { mouseenter, mouseleave } from './helpers.js';

describe('timers', () => {
  // Used as a fallback delay
  const DEFAULT_DELAY = 500;

  before(() => {
    Tooltip.setDefaultFocusDelay(0);
    Tooltip.setDefaultHoverDelay(0);
    Tooltip.setDefaultHideDelay(0);
  });

  function createTooltip(target) {
    const tooltip = fixtureSync('<vaadin-tooltip></vaadin-tooltip>');
    tooltip.target = target;
    return tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
  }

  describe('hoverDelay', () => {
    let tooltip, target, overlay;

    beforeEach(async () => {
      tooltip = fixtureSync('<vaadin-tooltip text="tooltip" hover-delay="1"></vaadin-tooltip>');
      target = fixtureSync('<input>');
      tooltip.target = target;
      overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
      await nextRender();
    });

    afterEach(async () => {
      // Wait for cooldown timeout.
      await aTimeout(0);
    });

    it('should open the overlay after a delay on mouseenter', async () => {
      mouseenter(target);
      expect(overlay.opened).to.be.not.ok;

      await aTimeout(1);
      expect(overlay.opened).to.be.true;
    });

    it('should open the overlay immediately on keyboard focus', () => {
      tabKeyDown(document.body);
      target.focus();
      expect(overlay.opened).to.be.true;
    });
  });

  describe('focusDelay', () => {
    let tooltip, target, overlay;

    beforeEach(async () => {
      tooltip = fixtureSync('<vaadin-tooltip text="tooltip" focus-delay="1"></vaadin-tooltip>');
      target = fixtureSync('<input>');
      tooltip.target = target;
      overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
      await nextRender();
    });

    afterEach(async () => {
      // Wait for cooldown timeout.
      await aTimeout(0);
    });

    it('should open the overlay after a delay on keyboard focus', async () => {
      tabKeyDown(document.body);
      target.focus();
      expect(overlay.opened).to.be.not.ok;

      await aTimeout(1);
      expect(overlay.opened).to.be.true;
    });

    it('should open the overlay immediately on mouseenter', () => {
      mouseenter(target);
      expect(overlay.opened).to.be.true;
    });
  });

  describe('hideDelay', () => {
    let tooltip, target, overlay;

    beforeEach(async () => {
      tooltip = fixtureSync('<vaadin-tooltip text="tooltip" hide-delay="1"></vaadin-tooltip>');
      target = fixtureSync('<input>');
      tooltip.target = target;
      overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
      await nextRender();
    });

    afterEach(async () => {
      // Wait for cooldown timeout.
      await aTimeout(1);
    });

    it('should close the overlay after a hide delay on mouseleave', async () => {
      mouseenter(target);
      mouseleave(target);
      expect(overlay.opened).to.be.true;

      await aTimeout(1);
      expect(overlay.opened).to.be.false;
    });

    it('should close the overlay immediately on focusout', () => {
      tabKeyDown(document.body);
      target.focus();

      focusout(target);
      expect(overlay.opened).to.be.false;
    });

    it('should close the overlay immediately on mousedown', () => {
      tabKeyDown(document.body);
      target.focus();

      mousedown(target);
      expect(overlay.opened).to.be.false;
    });

    it('should close the overlay immediately on Esc keydown', () => {
      tabKeyDown(document.body);
      target.focus();

      escKeyDown(target);
      expect(overlay.opened).to.be.false;
    });
  });

  describe('setDefaultHoverDelay', () => {
    let target, overlay;

    beforeEach(() => {
      target = fixtureSync('<div>Target</div>');
    });

    afterEach(() => {
      Tooltip.setDefaultHoverDelay(0);
    });

    it('should change default delay for newly created tooltip', async () => {
      Tooltip.setDefaultHoverDelay(2);

      overlay = createTooltip(target);

      mouseenter(target);
      await aTimeout(2);

      expect(overlay.opened).to.be.true;
    });

    it('should change default hover delay for existing tooltip', async () => {
      overlay = createTooltip(target);

      Tooltip.setDefaultHoverDelay(2);

      mouseenter(target);
      await aTimeout(2);

      expect(overlay.opened).to.be.true;
    });

    describe('reset hover delay', () => {
      let clock;

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

      it('should reset hover delay when providing a negative number', () => {
        Tooltip.setDefaultHoverDelay(-1);

        overlay = createTooltip(target);

        mouseenter(target);
        clock.tick(DEFAULT_DELAY);

        expect(overlay.opened).to.be.true;
      });

      it('should reset hover delay when providing null instead of number', () => {
        Tooltip.setDefaultHoverDelay(null);

        overlay = createTooltip(target);

        mouseenter(target);
        clock.tick(DEFAULT_DELAY);

        expect(overlay.opened).to.be.true;
      });

      it('should reset hover delay when providing undefined instead of number', () => {
        Tooltip.setDefaultHoverDelay(undefined);

        overlay = createTooltip(target);

        mouseenter(target);
        clock.tick(DEFAULT_DELAY);

        expect(overlay.opened).to.be.true;
      });
    });
  });

  describe('setDefaultFocusDelay', () => {
    let target, overlay;

    beforeEach(() => {
      target = fixtureSync('<div>Target</div>');
    });

    afterEach(() => {
      Tooltip.setDefaultFocusDelay(0);
    });

    it('should change default delay for newly created tooltip', async () => {
      Tooltip.setDefaultFocusDelay(2);

      overlay = createTooltip(target);

      tabKeyDown(document.body);
      focusin(target);
      await aTimeout(2);

      expect(overlay.opened).to.be.true;
    });

    it('should change default focus delay for existing tooltip', async () => {
      overlay = createTooltip(target);

      Tooltip.setDefaultFocusDelay(2);

      tabKeyDown(document.body);
      focusin(target);
      await aTimeout(2);

      expect(overlay.opened).to.be.true;
    });

    describe('reset focus delay', () => {
      let clock;

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

      it('should reset focus delay when providing a negative number', () => {
        Tooltip.setDefaultFocusDelay(-1);

        overlay = createTooltip(target);

        tabKeyDown(document.body);
        focusin(target);
        clock.tick(DEFAULT_DELAY);

        expect(overlay.opened).to.be.true;
      });

      it('should reset focus delay when providing null instead of number', () => {
        Tooltip.setDefaultFocusDelay(null);

        overlay = createTooltip(target);

        tabKeyDown(document.body);
        focusin(target);
        clock.tick(DEFAULT_DELAY);

        expect(overlay.opened).to.be.true;
      });

      it('should reset focus delay when providing undefined instead of number', () => {
        Tooltip.setDefaultFocusDelay(undefined);

        overlay = createTooltip(target);

        tabKeyDown(document.body);
        focusin(target);
        clock.tick(DEFAULT_DELAY);

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
      Tooltip.setDefaultHideDelay(0);
    });

    it('should change default hide delay for newly created tooltip', async () => {
      Tooltip.setDefaultHideDelay(2);

      overlay = createTooltip(target);

      mouseenter(target);

      mouseleave(target);
      await aTimeout(2);

      expect(overlay.opened).to.be.false;
    });

    it('should change default hide delay for existing tooltip', async () => {
      overlay = createTooltip(target);

      Tooltip.setDefaultHideDelay(2);

      mouseenter(target);

      mouseleave(target);
      await aTimeout(2);

      expect(overlay.opened).to.be.false;
    });

    describe('reset hide delay', () => {
      let clock;

      beforeEach(() => {
        clock = sinon.useFakeTimers({
          shouldClearNativeTimers: true,
        });
      });

      afterEach(() => {
        clock.restore();
      });

      it('should reset hide delay when providing a negative number', () => {
        Tooltip.setDefaultHideDelay(-1);

        overlay = createTooltip(target);

        mouseenter(target);
        clock.tick(DEFAULT_DELAY);

        mouseleave(target);
        clock.tick(DEFAULT_DELAY);

        expect(overlay.opened).to.be.false;
      });

      it('should reset hide delay when providing null instead of number', () => {
        Tooltip.setDefaultHideDelay(null);

        overlay = createTooltip(target);

        mouseenter(target);
        clock.tick(DEFAULT_DELAY);

        mouseleave(target);
        clock.tick(DEFAULT_DELAY);

        expect(overlay.opened).to.be.false;
      });

      it('should reset hide delay when providing undefined instead of number', () => {
        Tooltip.setDefaultHideDelay(undefined);

        overlay = createTooltip(target);

        mouseenter(target);
        clock.tick(DEFAULT_DELAY);

        mouseleave(target);
        clock.tick(DEFAULT_DELAY);

        expect(overlay.opened).to.be.false;
      });
    });
  });

  describe('warmup and cooldown', () => {
    let wrapper, targets, tooltips, overlays;

    beforeEach(async () => {
      wrapper = fixtureSync(`
        <div>
          <vaadin-tooltip text="tooltip 1" hover-delay="2" focus-delay="2" hide-delay="2" for="input-1"></vaadin-tooltip>
          <vaadin-tooltip text="tooltip 2" hover-delay="2" focus-delay="2" hide-delay="2" for="input-2"></vaadin-tooltip>
          <input id="input-1">
          <input id="input-2">
        </div>
      `);
      tooltips = Array.from(wrapper.querySelectorAll('vaadin-tooltip'));
      targets = wrapper.querySelectorAll('input');
      overlays = tooltips.map((el) => el.shadowRoot.querySelector('vaadin-tooltip-overlay'));
      await nextRender();
    });

    afterEach(async () => {
      // Wait for cooldown timeout.
      await aTimeout(2);
    });

    it('should close first tooltip and open the second one without waiting for hover delay', async () => {
      mouseenter(targets[0]);
      await aTimeout(2);

      mouseleave(targets[0]);
      mouseenter(targets[1]);

      expect(overlays[0].opened).to.be.false;
      expect(overlays[1].opened).to.be.true;
    });

    it('should close first tooltip and open the second one without waiting for focus delay', async () => {
      tabKeyDown(document.body);
      focusin(targets[0]);
      await aTimeout(2);

      focusout(targets[0], targets[1]);
      focusin(targets[1], targets[0]);

      expect(overlays[0].opened).to.be.false;
      expect(overlays[1].opened).to.be.true;
    });

    it('should re-open first tooltip and close the second one without waiting for hover delay', async () => {
      mouseenter(targets[0]);
      await aTimeout(2);

      mouseleave(targets[0]);
      mouseenter(targets[1]);

      mouseleave(targets[1]);
      mouseenter(targets[0]);

      expect(overlays[0].opened).to.be.true;
      expect(overlays[1].opened).to.be.false;
    });

    it('should re-open first tooltip and close the second one without waiting for focus delay', async () => {
      tabKeyDown(document.body);
      focusin(targets[0]);
      await aTimeout(2);

      focusout(targets[0], targets[1]);
      focusin(targets[1], targets[0]);

      focusout(targets[1], targets[0]);
      focusin(targets[0], targets[1]);

      expect(overlays[0].opened).to.be.true;
      expect(overlays[1].opened).to.be.false;
    });

    it('should warm up again when closing the tooltip and re-opening it after the hover delay', async () => {
      mouseenter(targets[0]);
      await aTimeout(2);

      mouseleave(targets[0]);
      await aTimeout(2);

      mouseenter(targets[0]);
      expect(overlays[0].opened).to.be.false;

      await aTimeout(2);
      expect(overlays[0].opened).to.be.true;
    });

    it('should warm up again when closing the tooltip and re-opening it after the focus delay', async () => {
      tabKeyDown(document.body);
      focusin(targets[0]);
      await aTimeout(2);

      focusout(targets[0]);
      await aTimeout(2);

      focusin(targets[0]);
      expect(overlays[0].opened).to.be.false;

      await aTimeout(2);
      expect(overlays[0].opened).to.be.true;
    });

    it('should not open on mouseleave during the initial warm up hover delay', async () => {
      mouseenter(targets[0]);
      await aTimeout(1);

      mouseleave(targets[0]);
      await aTimeout(1);

      expect(overlays[0].opened).to.be.not.ok;
    });

    it('should not open on focusout during the initial warm up focus delay', async () => {
      tabKeyDown(document.body);
      focusin(targets[0]);
      await aTimeout(1);

      focusout(targets[0]);
      await aTimeout(1);

      expect(overlays[0].opened).to.be.not.ok;
    });

    it('should stop closing on subsequent mouseenter during the hide delay', async () => {
      mouseenter(targets[0]);
      await aTimeout(2);

      mouseleave(targets[0]);
      await aTimeout(1);

      mouseenter(targets[0]);
      await aTimeout(2);
      expect(overlays[0].opened).to.be.true;
    });

    it('should close immediately on Esc key during the hide delay', async () => {
      mouseenter(targets[0]);
      await aTimeout(2);

      mouseleave(targets[0]);
      await aTimeout(1);

      escKeyDown(document.body);
      expect(overlays[0].opened).to.be.false;
    });

    it('should keep warmed up state when closing immediately on Esc key', async () => {
      mouseenter(targets[0]);
      await aTimeout(2);

      escKeyDown(document.body);

      mouseleave(targets[0]);
      mouseenter(targets[1]);

      expect(overlays[1].opened).to.be.true;
    });

    it('should reset warmed up state after the hide delay when closed immediately', async () => {
      mouseenter(targets[0]);
      await aTimeout(2);

      escKeyDown(document.body);

      await aTimeout(2);
      mouseleave(targets[0]);
      mouseenter(targets[0]);

      expect(overlays[0].opened).to.be.false;
    });

    it('should not keep warmed up state on mouseenter to the manual tooltip target', async () => {
      tooltips[1].manual = true;

      mouseenter(targets[0]);
      await aTimeout(2);

      mouseleave(targets[0]);
      mouseenter(targets[1]);
      await aTimeout(2);

      expect(overlays[0].opened).to.be.false;

      mouseleave(targets[1]);
      mouseenter(targets[0]);
      expect(overlays[0].opened).to.be.false;

      await aTimeout(2);
      expect(overlays[0].opened).to.be.true;
    });

    it('should not keep warmed up state on focusout to the manual tooltip target', async () => {
      tooltips[1].manual = true;

      tabKeyDown(document.body);
      focusin(targets[0]);
      await aTimeout(2);

      focusout(targets[0], targets[1]);
      focusin(targets[1], targets[0]);
      await aTimeout(2);

      expect(overlays[0].opened).to.be.false;

      focusout(targets[1], targets[0]);
      focusin(targets[0], targets[1]);

      expect(overlays[0].opened).to.be.false;

      await aTimeout(2);
      expect(overlays[0].opened).to.be.true;
    });

    it('should not restart cooldown on mouseleave from the manual tooltip target', async () => {
      tooltips[1].manual = true;

      mouseenter(targets[0]);
      await aTimeout(2);

      mouseleave(targets[0]);
      mouseenter(targets[1]);
      await aTimeout(1);

      mouseleave(targets[1]);
      await aTimeout(1);

      mouseenter(targets[0]);
      expect(overlays[0].opened).to.be.false;
    });

    it('should not restart cooldown on focusout from the manual tooltip target', async () => {
      tooltips[1].manual = true;

      tabKeyDown(document.body);
      focusin(targets[0]);
      await aTimeout(2);

      focusout(targets[0], targets[1]);
      focusin(targets[1], targets[0]);
      await aTimeout(1);

      focusout(targets[1]);
      await aTimeout(1);

      focusin(targets[0]);
      expect(overlays[0].opened).to.be.false;
    });
  });
});
