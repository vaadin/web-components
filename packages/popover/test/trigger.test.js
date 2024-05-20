import { expect } from '@esm-bundle/chai';
import { aTimeout, esc, fire, fixtureSync, nextRender, nextUpdate, outsideClick } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '../vaadin-popover.js';

describe('trigger', () => {
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
    target = fixtureSync('<button>Target</button>');
    popover.target = target;
    await nextRender();
    overlay = popover.shadowRoot.querySelector('vaadin-popover-overlay');
  });

  describe('click', () => {
    beforeEach(() => {
      popover.trigger = 'click';
    });

    it('should open on target click', async () => {
      target.click();
      await nextRender();
      expect(overlay.opened).to.be.true;
    });

    it('should close on target click', async () => {
      target.click();
      await nextRender();

      target.click();
      await nextRender();
      expect(overlay.opened).to.be.false;
    });

    it('should not open on target mouseenter', async () => {
      mouseenter(target);
      await nextRender();
      expect(overlay.opened).to.be.false;
    });

    it('should not close on target mouseleave', async () => {
      target.click();
      await nextRender();

      mouseenter(target);
      mouseleave(target);
      await nextRender();
      expect(overlay.opened).to.be.true;
    });
  });

  describe('hover-or-click', () => {
    beforeEach(() => {
      popover.trigger = 'hover-or-click';
    });

    it('should open on target mouseenter', async () => {
      mouseenter(target);
      await nextRender();
      expect(overlay.opened).to.be.true;
    });

    it('should close on target mouseleave after a timeout', async () => {
      mouseenter(target);
      await nextRender();

      mouseleave(target);
      await aTimeout(50);

      expect(overlay.opened).to.be.false;
    });

    it('should not close on mouseleave from target to overlay', async () => {
      mouseenter(target);
      await nextRender();

      mouseleave(target, overlay);
      await aTimeout(50);

      expect(overlay.opened).to.be.true;
    });

    it('should not close on target mouseleave followed by overlay mouseenter', async () => {
      mouseenter(target);
      await nextRender();

      mouseleave(target);
      mouseenter(overlay);
      await aTimeout(50);

      expect(overlay.opened).to.be.true;
    });

    it('should close on overlay mouseleave after a timeout', async () => {
      mouseenter(target);
      await nextRender();

      mouseenter(overlay);
      mouseleave(overlay);
      await aTimeout(50);

      expect(overlay.opened).to.be.false;
    });

    it('should not close on mouseleave from overlay back to target', async () => {
      mouseenter(target);
      await nextRender();

      mouseleave(target, overlay);
      mouseleave(overlay, target);
      await aTimeout(50);

      expect(overlay.opened).to.be.true;
    });

    it('should not close on overlay mouseleave followed by target mouseenter', async () => {
      mouseenter(target);
      await nextRender();

      mouseenter(overlay);
      mouseleave(overlay);
      mouseenter(target);
      await aTimeout(50);

      expect(overlay.opened).to.be.true;
    });

    it('should open on target click', async () => {
      target.click();
      await nextRender();
      expect(overlay.opened).to.be.true;
    });

    it('should close on target click', async () => {
      mouseenter(target);
      await nextRender();

      target.click();
      await nextRender();

      expect(overlay.opened).to.be.false;
    });
  });

  describe('manual', () => {
    beforeEach(() => {
      popover.trigger = 'manual';
    });

    it('should not open on target click', async () => {
      target.click();
      await nextRender();
      expect(overlay.opened).to.be.false;
    });

    it('should not open on target mouseenter', async () => {
      mouseenter(target);
      await nextRender();
      expect(overlay.opened).to.be.false;
    });

    it('should open on setting opened to true', async () => {
      popover.opened = true;
      await nextRender();
      expect(overlay.opened).to.be.true;
    });

    it('should not close on global Escape press', async () => {
      popover.opened = true;
      await nextRender();

      esc(document.body);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should not close on target Escape press', async () => {
      popover.opened = true;
      await nextRender();

      esc(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should not close on global Escape press when modal', async () => {
      popover.modal = true;
      popover.opened = true;
      await nextRender();

      esc(document.body);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should not close on outside click when not modal', async () => {
      popover.opened = true;
      await nextRender();

      outsideClick();
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should not close on outside click when modal', async () => {
      popover.modal = true;
      popover.opened = true;
      await nextRender();

      outsideClick();
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should close when setting opened to false', async () => {
      popover.opened = true;
      await nextRender();

      popover.opened = false;
      await nextUpdate(popover);
      expect(overlay.opened).to.be.false;
    });
  });
});
