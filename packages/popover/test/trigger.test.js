import { expect } from '@vaadin/chai-plugins';
import { esc, fixtureSync, focusin, focusout, nextRender, nextUpdate, outsideClick } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '../vaadin-popover.js';
import { mouseenter, mouseleave } from './helpers.js';

describe('trigger', () => {
  let popover, target, overlay;

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
      popover.trigger = ['click'];
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

  describe('hover', () => {
    beforeEach(async () => {
      popover.trigger = ['hover'];
      await nextUpdate(popover);
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
  });

  describe('focus', () => {
    beforeEach(async () => {
      popover.trigger = ['focus'];
      await nextUpdate(popover);
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

    it('should not close on overlay focusout back to the target', async () => {
      focusin(target);
      await nextRender();

      focusout(target, overlay);
      focusout(overlay, target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should open on target focusin followed by click when modal', async () => {
      popover.modal = true;
      await nextUpdate(popover);

      target.focus();
      // Wait for open focus trap
      await nextRender();

      // Emulate click without focus change
      target.click();
      await nextRender();
      expect(overlay.opened).to.be.true;
    });
  });

  describe('hover and focus', () => {
    beforeEach(async () => {
      popover.trigger = ['hover', 'focus'];
      await nextUpdate(popover);
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

    it('should not close on target focusout if target has hover', async () => {
      focusin(target);
      await nextRender();

      mouseenter(target);
      focusout(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should close on target focusout if target has lost hover', async () => {
      focusin(target);
      await nextRender();

      mouseenter(target);
      mouseleave(target);
      focusout(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.false;
    });

    it('should not close on target focusout if overlay has hover', async () => {
      focusin(target);
      await nextRender();

      mouseenter(overlay);
      focusout(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should close on target focusout if overlay has lost hover', async () => {
      focusin(target);
      await nextRender();

      mouseenter(overlay);
      mouseleave(overlay);
      focusout(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.false;
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

  describe('focus and click', () => {
    beforeEach(async () => {
      popover.trigger = ['click', 'focus'];
      await nextUpdate(popover);
    });

    it('should not immediately close on target click when opened on focusin', async () => {
      target.focus();
      target.click();
      await nextRender();
      expect(overlay.opened).to.be.true;
    });

    it('should close on target click after a delay when opened on focusin', async () => {
      target.focus();
      target.click();
      await nextRender();

      target.click();
      await nextRender();
      expect(overlay.opened).to.be.false;
    });
  });

  describe('manual', () => {
    [null, undefined, []].forEach((value) => {
      const trigger = Array.isArray(value) ? 'empty array' : value;

      describe(`trigger set to ${trigger}`, () => {
        beforeEach(async () => {
          popover.trigger = value;
          await nextUpdate(popover);
        });

        it(`should not open on target click with trigger set to ${trigger}`, async () => {
          target.click();
          await nextRender();
          expect(overlay.opened).to.be.false;
        });

        it(`should not open on target mouseenter with trigger set to ${trigger}`, async () => {
          mouseenter(target);
          await nextRender();
          expect(overlay.opened).to.be.false;
        });

        it(`should not open on target focusin with trigger set to ${trigger}`, async () => {
          focusin(target);
          await nextRender();
          expect(overlay.opened).to.be.false;
        });

        it(`should open on setting opened to true with trigger set to ${trigger}`, async () => {
          popover.opened = true;
          await nextRender();
          expect(overlay.opened).to.be.true;
        });

        it(`should not close on target mouseleave with trigger set to ${trigger}`, async () => {
          popover.opened = true;
          await nextRender();

          mouseenter(target);
          mouseleave(target);
          await nextRender();
          expect(overlay.opened).to.be.true;
        });

        it(`should not close on target focusout with trigger set to ${trigger}`, async () => {
          popover.opened = true;
          await nextRender();

          focusin(target);
          focusout(target);
          await nextRender();
          expect(overlay.opened).to.be.true;
        });

        it(`should not close on global Escape press with trigger set to ${trigger}`, async () => {
          popover.opened = true;
          await nextRender();

          esc(document.body);
          await nextUpdate(popover);
          expect(overlay.opened).to.be.true;
        });

        it(`should not close on target Escape press with trigger set to ${trigger}`, async () => {
          popover.opened = true;
          await nextRender();

          esc(target);
          await nextUpdate(popover);
          expect(overlay.opened).to.be.true;
        });

        it(`should not close on global Escape press when modal with trigger set to ${trigger}`, async () => {
          popover.modal = true;
          popover.opened = true;
          await nextRender();

          esc(document.body);
          await nextUpdate(popover);
          expect(overlay.opened).to.be.true;
        });

        it(`should not close on outside click when not modal with trigger set to ${trigger}`, async () => {
          popover.opened = true;
          await nextRender();

          outsideClick();
          await nextUpdate(popover);
          expect(overlay.opened).to.be.true;
        });

        it(`should not close on outside click when modal with trigger set to ${trigger}`, async () => {
          popover.modal = true;
          popover.opened = true;
          await nextRender();

          outsideClick();
          await nextUpdate(popover);
          expect(overlay.opened).to.be.true;
        });

        it(`should close when setting opened to false with trigger set to ${trigger}`, async () => {
          popover.opened = true;
          await nextRender();

          popover.opened = false;
          await nextUpdate(popover);
          expect(overlay.opened).to.be.false;
        });
      });
    });
  });
});
