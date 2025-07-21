import { expect } from '@vaadin/chai-plugins';
import { esc, fixtureSync, nextRender, nextUpdate, outsideClick } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import { Popover } from '../src/vaadin-popover.js';
import { mouseenter, mouseleave } from './helpers.js';

describe('nested popover', () => {
  let popover, target, secondPopover, secondTarget;

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
      if (root.firstChild) {
        return;
      }
      root.innerHTML = `
        <button id="second-target">Second target</button>
        <vaadin-popover for="second-target"></vaadin-popover>
      `;
      [secondTarget, secondPopover] = root.children;
      secondPopover.renderer = (root2) => {
        root2.textContent = 'Nested';
      };
    };
    await nextRender();
  });

  describe('closing', () => {
    beforeEach(async () => {
      // Open the first popover
      target.click();
      await nextRender();

      // Open the second popover
      secondTarget.click();
      await nextRender();

      // Expect both popovers to be opened
      expect(popover.opened).to.be.true;
      expect(secondPopover.opened).to.be.true;
    });

    it('should close the topmost overlay on global Escape press', async () => {
      esc(document.body);
      await nextRender();

      // Expect only the second popover to be closed
      expect(popover.opened).to.be.true;
      expect(secondPopover.opened).to.be.false;

      esc(document.body);
      await nextRender();

      // Expect both popovers to be closed
      expect(popover.opened).to.be.false;
      expect(secondPopover.opened).to.be.false;
    });

    it('should close the topmost overlay on outside click', async () => {
      outsideClick();
      await nextRender();

      // Expect only the second popover to be closed
      expect(popover.opened).to.be.true;
      expect(secondPopover.opened).to.be.false;

      outsideClick();
      await nextRender();

      // Expect both popovers to be closed
      expect(popover.opened).to.be.false;
      expect(secondPopover.opened).to.be.false;
    });
  });

  describe('focus', () => {
    beforeEach(async () => {
      popover.trigger = ['focus'];
      await nextUpdate(popover);
    });

    it('should not close when focus moves from the target to the nested popover', async () => {
      target.focus();
      await nextRender();

      secondPopover.modal = true;
      await nextUpdate(secondPopover);

      // Open programmatically so focus stays on target
      secondPopover.opened = true;
      await nextRender();

      expect(popover.opened).to.be.true;
    });

    it('should not close when focus moves from the overlay to the nested popover', async () => {
      target.focus();
      await nextRender();

      secondPopover.modal = true;
      await nextUpdate(secondPopover);

      secondTarget.focus();
      secondTarget.click();
      await nextRender();

      expect(popover.opened).to.be.true;
    });

    it('should not close on focusout caused by nested popover outside click', async () => {
      target.focus();
      await nextRender();

      secondTarget.focus();
      secondTarget.click();
      await nextRender();

      outsideClick();
      await nextUpdate(popover);

      expect(popover.opened).to.be.true;
    });
  });

  describe('hover', () => {
    beforeEach(async () => {
      popover.trigger = ['hover'];
      await nextUpdate(popover);
    });

    it('should not close when mouse leaves the target if popover is not the last one', async () => {
      mouseenter(target);
      await nextRender();

      mouseleave(target, secondTarget);
      secondTarget.click();
      await nextRender();

      mouseleave(secondTarget, target);

      mouseenter(target);
      mouseleave(target);
      await nextUpdate(popover);

      expect(popover.opened).to.be.true;
    });

    it('should not close when mouse leaves the overlay if popover is not the last one', async () => {
      mouseenter(target);
      await nextRender();

      mouseleave(target, secondTarget);
      secondTarget.click();
      await nextRender();

      mouseleave(secondTarget);
      await nextUpdate(popover);

      expect(popover.opened).to.be.true;
    });
  });
});
