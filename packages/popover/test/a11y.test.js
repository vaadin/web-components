import { expect } from '@esm-bundle/chai';
import { esc, fixtureSync, focusout, nextRender, nextUpdate, outsideClick, tab } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-popover.js';
import { mouseenter, mouseleave } from './helpers.js';

describe('a11y', () => {
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

      it('should not restore focus on Tab with trigger set to focus', async () => {
        const focusSpy = sinon.spy(target, 'focus');
        overlay.$.overlay.focus();
        tab(target);
        focusout(target);
        await nextRender();

        expect(focusSpy).to.not.be.called;
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
    });

    describe('hover trigger', () => {
      it('should not restore focus on Esc with trigger set to hover', async () => {
        popover.trigger = ['hover'];
        await nextUpdate(popover);

        mouseenter(target);
        await nextRender();

        const focusSpy = sinon.spy(target, 'focus');
        overlay.$.overlay.focus();
        esc(overlay.$.overlay);
        await nextRender();

        expect(focusSpy).to.not.be.called;
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
});
