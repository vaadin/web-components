import { expect } from '@vaadin/chai-plugins';
import {
  aTimeout,
  esc,
  fire,
  fixtureSync,
  focusout,
  nextRender,
  nextUpdate,
  outsideClick,
} from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '../src/vaadin-popover.js';

describe('timers', () => {
  let popover, target, overlay;

  function mouseenter(target) {
    fire(target, 'mouseenter');
  }

  function mouseleave(target, relatedTarget) {
    const eventProps = relatedTarget ? { relatedTarget } : {};
    fire(target, 'mouseleave', undefined, eventProps);
  }

  beforeEach(async () => {
    popover = fixtureSync('<vaadin-popover></vaadin-popover>');
    popover.renderer = (root) => {
      root.textContent = 'Content';
    };
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
  });

  describe('focusDelay', () => {
    beforeEach(async () => {
      popover.trigger = ['hover', 'focus'];
      popover.focusDelay = 5;
      await nextUpdate(popover);
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
  });
});
