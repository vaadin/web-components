import { expect } from '@esm-bundle/chai';
import {
  esc,
  fire,
  fixtureSync,
  focusin,
  focusout,
  nextRender,
  nextUpdate,
  outsideClick,
} from '@vaadin/testing-helpers';
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
    popover.renderer = (root) => {
      if (!root.firstChild) {
        root.appendChild(document.createElement('input'));
      }
    };
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
    beforeEach(async () => {
      popover.trigger = 'hover-or-click';
      await nextUpdate(popover);
    });

    it('should set restoreFocusOnClose to false', () => {
      expect(overlay.restoreFocusOnClose).to.be.false;
    });

    it('should open on target mouseenter', async () => {
      mouseenter(target);
      await nextRender();
      expect(overlay.opened).to.be.true;
    });

    it('should close on target mouseleave', async () => {
      mouseenter(target);
      await nextRender();

      mouseleave(target);
      await nextUpdate(popover);

      expect(overlay.opened).to.be.false;
    });

    it('should not close on mouseleave from target to overlay', async () => {
      mouseenter(target);
      await nextRender();

      mouseleave(target, overlay);
      await nextUpdate(popover);

      expect(overlay.opened).to.be.true;
    });

    it('should close on overlay mouseleave', async () => {
      mouseenter(target);
      await nextRender();

      mouseenter(overlay);
      mouseleave(overlay);
      await nextUpdate(popover);

      expect(overlay.opened).to.be.false;
    });

    it('should not close on mouseleave from overlay back to target', async () => {
      mouseenter(target);
      await nextRender();

      mouseleave(target, overlay);
      mouseleave(overlay, target);
      await nextUpdate(popover);

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

  describe('hover-or-focus', () => {
    beforeEach(async () => {
      popover.trigger = 'hover-or-focus';
      await nextUpdate(popover);
    });

    it('should set restoreFocusOnClose to false', () => {
      expect(overlay.restoreFocusOnClose).to.be.false;
    });

    it('should open on target mouseenter', async () => {
      mouseenter(target);
      await nextRender();
      expect(overlay.opened).to.be.true;
    });

    it('should open on target focusin', async () => {
      focusin(target);
      await nextRender();
      expect(overlay.opened).to.be.true;
    });

    it('should close on target focusout', async () => {
      focusin(target);
      await nextRender();

      focusout(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.false;
    });

    it('should not close on target focusout if target has hover', async () => {
      focusin(target);
      await nextRender();

      mouseenter(target);
      focusout(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should not close on target focusout if overlay has hover', async () => {
      focusin(target);
      await nextRender();

      mouseenter(overlay);
      focusout(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should not close on target focusout to the overlay', async () => {
      focusin(target);
      await nextRender();

      focusout(target, overlay);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should close on overlay focusout', async () => {
      focusin(target);
      await nextRender();

      focusout(target, overlay);
      focusout(overlay);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.false;
    });

    it('should not close on overlay focusout to the overlay content', async () => {
      focusin(target);
      await nextRender();

      focusout(overlay, overlay.firstElementChild);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should not close on target mouseleave if target has focus', async () => {
      mouseenter(target);
      await nextRender();

      focusin(target);
      mouseleave(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should not close on target mouseleave if overlay has focus', async () => {
      mouseenter(target);
      await nextRender();

      focusin(overlay);
      mouseleave(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should not close on overlay mouseleave if overlay has focus', async () => {
      mouseenter(target);
      await nextRender();

      focusin(overlay);
      mouseenter(overlay);
      mouseleave(overlay);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });
  });

  describe('manual', () => {
    beforeEach(async () => {
      popover.trigger = 'manual';
      await nextUpdate(popover);
    });

    it('should set restoreFocusOnClose to false', () => {
      expect(overlay.restoreFocusOnClose).to.be.false;
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
