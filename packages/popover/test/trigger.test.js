import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import {
  esc,
  fixtureSync,
  focusin,
  focusout,
  mousedown,
  nextRender,
  nextUpdate,
  oneEvent,
  outsideClick,
} from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import { Popover } from '../src/vaadin-popover.js';
import { mouseenter, mouseleave } from './helpers.js';

describe('trigger', () => {
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

        const div = document.createElement('div');
        div.textContent = 'Some text content';
        root.appendChild(div);
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
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(overlay.opened).to.be.true;
    });

    it('should close on target click', async () => {
      target.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      target.click();
      await nextRender();
      expect(overlay.opened).to.be.false;
    });

    it('should not open on target click when detached', async () => {
      popover.remove();
      target.click();
      await nextRender();
      expect(overlay.opened).to.be.false;
    });

    it('should open on target click when re-attached', async () => {
      popover.remove();
      await nextRender();
      target.parentNode.appendChild(popover);

      target.click();
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(overlay.opened).to.be.true;
    });

    it('should not open on target mouseenter', async () => {
      mouseenter(target);
      await nextRender();
      expect(overlay.opened).to.be.false;
    });

    it('should not close on target mouseleave', async () => {
      target.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

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
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(overlay.opened).to.be.true;
    });

    it('should close on target mouseleave', async () => {
      mouseenter(target);
      await oneEvent(overlay, 'vaadin-overlay-open');

      mouseleave(target);
      await nextUpdate(popover);

      expect(overlay.opened).to.be.false;
    });

    it('should not close on mouseleave from target to popover content', async () => {
      mouseenter(target);
      await oneEvent(overlay, 'vaadin-overlay-open');

      mouseleave(target, popover.firstElementChild);
      await nextUpdate(popover);

      expect(overlay.opened).to.be.true;
    });

    it('should close on overlay mouseleave', async () => {
      mouseenter(target);
      await oneEvent(overlay, 'vaadin-overlay-open');

      mouseenter(overlay);
      mouseleave(overlay);
      await nextUpdate(popover);

      expect(overlay.opened).to.be.false;
    });

    it('should not close on mouseleave from popover content back to target', async () => {
      mouseenter(target);
      await oneEvent(overlay, 'vaadin-overlay-open');

      mouseleave(target, popover.firstElementChild);
      mouseleave(popover.firstElementChild, target);
      await nextUpdate(popover);

      expect(overlay.opened).to.be.true;
    });

    it('should not open on target mouseenter when detached', async () => {
      popover.remove();
      mouseenter(target);
      await nextRender();
      expect(overlay.opened).to.be.false;
    });

    it('should open on target mouseenter when re-attached', async () => {
      popover.remove();
      await nextRender();
      target.parentNode.appendChild(popover);

      mouseenter(target);
      await oneEvent(overlay, 'vaadin-overlay-open');
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
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(overlay.opened).to.be.true;
    });

    it('should close on target focusout', async () => {
      focusin(target);
      await oneEvent(overlay, 'vaadin-overlay-open');

      focusout(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.false;
    });

    it('should not open on target focusout after focusin', async () => {
      focusin(target);
      focusout(target);
      await nextRender();
      expect(overlay.opened).to.be.false;
    });

    it('should not close on target focusout to the popover content', async () => {
      focusin(target);
      await oneEvent(overlay, 'vaadin-overlay-open');

      focusout(target, popover.firstElementChild);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should close on overlay focusout', async () => {
      focusin(target);
      await oneEvent(overlay, 'vaadin-overlay-open');

      focusout(target, overlay);
      focusout(overlay);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.false;
    });

    it('should not close on overlay focusout to the popover content content', async () => {
      focusin(target);
      await oneEvent(overlay, 'vaadin-overlay-open');

      focusout(overlay, popover.firstElementChild);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should not close on popover content focusout back to the target', async () => {
      focusin(target);
      await oneEvent(overlay, 'vaadin-overlay-open');

      focusout(target, popover.firstElementChild);
      focusout(popover.firstElementChild, target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should not open on target focusin when detached', async () => {
      popover.remove();
      focusin(target);
      await nextRender();
      expect(overlay.opened).to.be.false;
    });

    it('should open on target focusin when re-attached', async () => {
      popover.remove();
      await nextRender();
      target.parentNode.appendChild(popover);

      focusin(target);
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(overlay.opened).to.be.true;
    });

    describe('overlay mousedown', () => {
      let input;

      beforeEach(async () => {
        input = document.createElement('input');
        target.parentNode.appendChild(input);

        target.focus();
        await oneEvent(overlay, 'vaadin-overlay-open');
      });

      afterEach(async () => {
        input.remove();
        await resetMouse();
      });

      it('should not close on overlay mousedown when target has focus', async () => {
        await sendMouseToElement({ type: 'click', element: popover.querySelector('div') });
        await nextUpdate();

        expect(overlay.opened).to.be.true;
      });

      it('should not close on overlay mousedown when overlay has focus', async () => {
        popover.querySelector('input').focus();

        await sendMouseToElement({ type: 'click', element: popover.querySelector('div') });
        await nextUpdate();

        expect(overlay.opened).to.be.true;
      });
    });
  });

  describe('hover and focus', () => {
    beforeEach(async () => {
      popover.trigger = ['hover', 'focus'];
      await nextUpdate(popover);
    });

    it('should open on target mouseenter', async () => {
      mouseenter(target);
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(overlay.opened).to.be.true;
    });

    it('should open on target focusin', async () => {
      focusin(target);
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(overlay.opened).to.be.true;
    });

    it('should not close on target focusout if target has hover', async () => {
      focusin(target);
      await oneEvent(overlay, 'vaadin-overlay-open');

      mouseenter(target);
      focusout(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should close on target focusout if target has lost hover', async () => {
      focusin(target);
      await oneEvent(overlay, 'vaadin-overlay-open');

      mouseenter(target);
      mouseleave(target);
      focusout(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.false;
    });

    it('should not close on target focusout if overlay has hover', async () => {
      focusin(target);
      await oneEvent(overlay, 'vaadin-overlay-open');

      mouseenter(overlay);
      focusout(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should close on target focusout if overlay has lost hover', async () => {
      focusin(target);
      await oneEvent(overlay, 'vaadin-overlay-open');

      mouseenter(overlay);
      mouseleave(overlay);
      focusout(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.false;
    });

    it('should not close on target mouseleave if target has focus', async () => {
      mouseenter(target);
      await oneEvent(overlay, 'vaadin-overlay-open');

      focusin(target);
      mouseleave(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should not close on target mouseleave if overlay has focus', async () => {
      mouseenter(target);
      await oneEvent(overlay, 'vaadin-overlay-open');

      focusin(overlay);
      mouseleave(target);
      await nextUpdate(popover);
      expect(overlay.opened).to.be.true;
    });

    it('should not close on overlay mouseleave if overlay has focus', async () => {
      mouseenter(target);
      await oneEvent(overlay, 'vaadin-overlay-open');

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
      mousedown(target);
      target.focus();
      target.click();
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(overlay.opened).to.be.true;
    });

    it('should close on target click after a delay when opened on focusin', async () => {
      mousedown(target);
      target.focus();
      target.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

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
          await oneEvent(overlay, 'vaadin-overlay-open');
          expect(overlay.opened).to.be.true;
        });

        it(`should not close on target mouseleave with trigger set to ${trigger}`, async () => {
          popover.opened = true;
          await oneEvent(overlay, 'vaadin-overlay-open');

          mouseenter(target);
          mouseleave(target);
          await nextRender();
          expect(overlay.opened).to.be.true;
        });

        it(`should not close on target focusout with trigger set to ${trigger}`, async () => {
          popover.opened = true;
          await oneEvent(overlay, 'vaadin-overlay-open');

          focusin(target);
          focusout(target);
          await nextRender();
          expect(overlay.opened).to.be.true;
        });

        it(`should close on global Escape press with trigger set to ${trigger}`, async () => {
          popover.opened = true;
          await oneEvent(overlay, 'vaadin-overlay-open');

          esc(document.body);
          await nextUpdate(popover);
          expect(overlay.opened).to.be.false;
        });

        it(`should close on target Escape press with trigger set to ${trigger}`, async () => {
          popover.opened = true;
          await oneEvent(overlay, 'vaadin-overlay-open');

          esc(target);
          await nextUpdate(popover);
          expect(overlay.opened).to.be.false;
        });

        it(`should close on global Escape press when modal with trigger set to ${trigger}`, async () => {
          popover.modal = true;
          popover.opened = true;
          await oneEvent(overlay, 'vaadin-overlay-open');

          esc(document.body);
          await nextUpdate(popover);
          expect(overlay.opened).to.be.false;
        });

        it(`should close on outside click when not modal with trigger set to ${trigger}`, async () => {
          popover.opened = true;
          await oneEvent(overlay, 'vaadin-overlay-open');

          outsideClick();
          await nextUpdate(popover);
          expect(overlay.opened).to.be.false;
        });

        it(`should close on outside click when modal with trigger set to ${trigger}`, async () => {
          popover.modal = true;
          popover.opened = true;
          await oneEvent(overlay, 'vaadin-overlay-open');

          outsideClick();
          await nextUpdate(popover);
          expect(overlay.opened).to.be.false;
        });

        it(`should close when setting opened to false with trigger set to ${trigger}`, async () => {
          popover.opened = true;
          await oneEvent(overlay, 'vaadin-overlay-open');

          popover.opened = false;
          await nextUpdate(popover);
          expect(overlay.opened).to.be.false;
        });
      });
    });
  });
});
