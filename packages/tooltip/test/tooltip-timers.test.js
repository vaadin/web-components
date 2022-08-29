import { expect } from '@esm-bundle/chai';
import { aTimeout, escKeyDown, fixtureSync, focusout, mousedown, tabKeyDown } from '@vaadin/testing-helpers';
import { Tooltip } from '../vaadin-tooltip.js';
import { mouseenter, mouseleave } from './helpers.js';

describe('timers', () => {
  describe('delay', () => {
    let tooltip, target, overlay;

    beforeEach(() => {
      tooltip = fixtureSync('<vaadin-tooltip text="tooltip" delay="1"></vaadin-tooltip>');
      target = fixtureSync('<input>');
      tooltip.target = target;
      overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
    });

    afterEach(async () => {
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

  describe('hideDelay', () => {
    let tooltip, target, overlay;

    beforeEach(() => {
      tooltip = fixtureSync('<vaadin-tooltip text="tooltip" hide-delay="1"></vaadin-tooltip>');
      target = fixtureSync('<input>');
      tooltip.target = target;
      overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
    });

    afterEach(async () => {
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

  describe('setDefaultDelay', () => {
    let tooltip, target;

    beforeEach(() => {
      target = fixtureSync('<div>Target</div>');
    });

    afterEach(() => {
      Tooltip.setDefaultDelay(0);
    });

    it('should change default delay for newly created tooltip', async () => {
      Tooltip.setDefaultDelay(2);

      tooltip = fixtureSync('<vaadin-tooltip></vaadin-tooltip>');
      tooltip.target = target;
      const overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');

      mouseenter(target);
      await aTimeout(2);

      expect(overlay.opened).to.be.true;
    });

    it('should change default delay for existing tooltip', async () => {
      tooltip = fixtureSync('<vaadin-tooltip></vaadin-tooltip>');
      tooltip.target = target;
      const overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');

      Tooltip.setDefaultDelay(2);

      mouseenter(target);
      await aTimeout(2);

      expect(overlay.opened).to.be.true;
    });

    it('should reset delay when providing a negative number', () => {
      Tooltip.setDefaultDelay(10);
      Tooltip.setDefaultDelay(-1);

      tooltip = fixtureSync('<vaadin-tooltip></vaadin-tooltip>');
      tooltip.target = target;
      const overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');

      mouseenter(target);

      expect(overlay.opened).to.be.true;
    });

    it('should reset delay when providing null instead of number', () => {
      Tooltip.setDefaultDelay(10);
      Tooltip.setDefaultDelay(null);

      const tooltip = fixtureSync('<vaadin-tooltip></vaadin-tooltip>');
      tooltip.target = target;
      const overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');

      mouseenter(target);

      expect(overlay.opened).to.be.true;
    });

    it('should reset delay when providing undefined instead of number', () => {
      Tooltip.setDefaultDelay(10);
      Tooltip.setDefaultDelay(undefined);

      const tooltip = fixtureSync('<vaadin-tooltip></vaadin-tooltip>');
      tooltip.target = target;
      const overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');

      mouseenter(target);

      expect(overlay.opened).to.be.true;
    });
  });

  describe('setDefaultHideDelay', () => {
    let tooltip, target;

    beforeEach(() => {
      target = fixtureSync('<div>Target</div>');
    });

    afterEach(() => {
      Tooltip.setDefaultHideDelay(0);
    });

    it('should change default hide delay for newly created tooltip', async () => {
      Tooltip.setDefaultHideDelay(2);

      tooltip = fixtureSync('<vaadin-tooltip></vaadin-tooltip>');
      tooltip.target = target;
      const overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');

      mouseenter(target);

      mouseleave(target);
      await aTimeout(2);

      expect(overlay.opened).to.be.false;
    });

    it('should change default hide delay for existing tooltip', async () => {
      tooltip = fixtureSync('<vaadin-tooltip></vaadin-tooltip>');
      tooltip.target = target;
      const overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');

      Tooltip.setDefaultHideDelay(2);

      mouseenter(target);

      mouseleave(target);
      await aTimeout(2);

      expect(overlay.opened).to.be.false;
    });

    it('should reset hide delay when providing a negative number', () => {
      Tooltip.setDefaultHideDelay(10);
      Tooltip.setDefaultHideDelay(-1);

      tooltip = fixtureSync('<vaadin-tooltip></vaadin-tooltip>');
      tooltip.target = target;
      const overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');

      mouseenter(target);

      mouseleave(target);
      expect(overlay.opened).to.be.false;
    });

    it('should reset hide delay when providing null instead of number', () => {
      Tooltip.setDefaultHideDelay(10);
      Tooltip.setDefaultHideDelay(null);

      tooltip = fixtureSync('<vaadin-tooltip></vaadin-tooltip>');
      tooltip.target = target;
      const overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');

      mouseenter(target);

      mouseleave(target);
      expect(overlay.opened).to.be.false;
    });

    it('should reset hide delay when providing undefined instead of number', () => {
      Tooltip.setDefaultHideDelay(10);
      Tooltip.setDefaultHideDelay(undefined);

      tooltip = fixtureSync('<vaadin-tooltip></vaadin-tooltip>');
      tooltip.target = target;
      const overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');

      mouseenter(target);

      mouseleave(target);
      expect(overlay.opened).to.be.false;
    });
  });

  describe('warmup and cooldown', () => {
    let wrapper, targets, tooltips, overlays;

    beforeEach(() => {
      wrapper = fixtureSync(`
        <div>
          <vaadin-tooltip text="tooltip 1" delay="2" hide-delay="2" for="input-1"></vaadin-tooltip>
          <vaadin-tooltip text="tooltip 2" delay="2" hide-delay="2" for="input-2"></vaadin-tooltip>
          <input id="input-1">
          <input id="input-2">
        </div>
      `);
      tooltips = Array.from(wrapper.querySelectorAll('vaadin-tooltip'));
      targets = wrapper.querySelectorAll('input');
      overlays = tooltips.map((el) => el.shadowRoot.querySelector('vaadin-tooltip-overlay'));
    });

    afterEach(async () => {
      await aTimeout(2);
    });

    it('should close first tooltip and open the second one without waiting for delay', async () => {
      mouseenter(targets[0]);
      await aTimeout(2);

      mouseleave(targets[0]);
      mouseenter(targets[1]);

      expect(overlays[0].opened).to.be.false;
      expect(overlays[1].opened).to.be.true;
    });

    it('should re-open first tooltip and close the second one without waiting for delay', async () => {
      mouseenter(targets[0]);
      await aTimeout(2);

      mouseleave(targets[0]);
      mouseenter(targets[1]);

      mouseleave(targets[1]);
      mouseenter(targets[0]);

      expect(overlays[0].opened).to.be.true;
      expect(overlays[1].opened).to.be.false;
    });

    it('should warm up again when closing the tooltip and re-opening it after the delay', async () => {
      mouseenter(targets[0]);
      await aTimeout(2);

      mouseleave(targets[0]);
      await aTimeout(2);

      mouseenter(targets[0]);
      expect(overlays[0].opened).to.be.false;

      await aTimeout(2);
      expect(overlays[0].opened).to.be.true;
    });

    it('should not open on mouseleave during the initial warm up delay', async () => {
      mouseenter(targets[0]);
      await aTimeout(1);

      mouseleave(targets[0]);
      await aTimeout(1);

      expect(overlays[0].opened).to.be.false;
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
  });
});
