import { expect } from '@vaadin/chai-plugins';
import { esc, fixtureSync, nextRender, nextUpdate, outsideClick } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import { Popover } from '../src/vaadin-popover.js';
import { mouseenter, mouseleave } from './helpers.js';

describe('nested popover', () => {
  let popover, target, nestedPopover, nestedTarget;

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
        <button id="nested-target">Nested target</button>
        <vaadin-popover for="nested-target"></vaadin-popover>
      `;
      [nestedTarget, nestedPopover] = root.children;
      nestedPopover.renderer = (root2) => {
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

      // Open the nested popover
      nestedTarget.click();
      await nextRender();

      // Expect both popovers to be opened
      expect(popover.opened).to.be.true;
      expect(nestedPopover.opened).to.be.true;
    });

    it('should close the topmost overlay on global Escape press', async () => {
      esc(document.body);
      await nextRender();

      // Expect only the nested popover to be closed
      expect(popover.opened).to.be.true;
      expect(nestedPopover.opened).to.be.false;

      esc(document.body);
      await nextRender();

      // Expect both popovers to be closed
      expect(popover.opened).to.be.false;
      expect(nestedPopover.opened).to.be.false;
    });

    it('should close the topmost overlay on outside click', async () => {
      outsideClick();
      await nextRender();

      // Expect only the nested popover to be closed
      expect(popover.opened).to.be.true;
      expect(nestedPopover.opened).to.be.false;

      outsideClick();
      await nextRender();

      // Expect both popovers to be closed
      expect(popover.opened).to.be.false;
      expect(nestedPopover.opened).to.be.false;
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

      nestedPopover.modal = true;
      await nextUpdate(nestedPopover);

      // Open programmatically so focus stays on target
      nestedPopover.opened = true;
      await nextRender();

      expect(popover.opened).to.be.true;
    });

    it('should not close when focus moves from the overlay to the nested popover', async () => {
      target.focus();
      await nextRender();

      nestedPopover.modal = true;
      await nextUpdate(nestedPopover);

      nestedTarget.focus();
      nestedTarget.click();
      await nextRender();

      expect(popover.opened).to.be.true;
    });

    it('should not close on focusout caused by nested popover outside click', async () => {
      target.focus();
      await nextRender();

      nestedTarget.focus();
      nestedTarget.click();
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

    it('should not close when mouse leaves the target to nested popover', async () => {
      mouseenter(target);
      await nextRender();

      mouseleave(target, nestedTarget);
      nestedTarget.click();
      await nextRender();

      mouseleave(nestedTarget, target);

      mouseenter(target);
      mouseleave(target);
      await nextUpdate(popover);

      expect(popover.opened).to.be.true;
    });

    it('should not close when mouse leaves the overlay to nested popover', async () => {
      mouseenter(target);
      await nextRender();

      mouseleave(target, nestedTarget);
      nestedTarget.click();
      await nextRender();

      mouseleave(nestedTarget);
      await nextUpdate(popover);

      expect(popover.opened).to.be.true;
    });
  });
});

describe('not nested popover', () => {
  let popover, popoverContent, target, secondPopover, secondPopoverContent, secondTarget;

  beforeEach(async () => {
    popover = fixtureSync('<vaadin-popover></vaadin-popover>');
    target = fixtureSync('<button>Target</button>');
    popover.target = target;
    popover.renderer = (root) => {
      root.innerHTML = '<button>Popover content</button>';
      popoverContent = root.firstElementChild;
    };

    secondPopover = fixtureSync('<vaadin-popover></vaadin-popover>');
    secondTarget = fixtureSync('<button>Second Target</button>');
    secondPopover.target = secondTarget;
    secondPopover.trigger = [];
    secondPopover.renderer = (root) => {
      root.innerHTML = '<button>Second Popover content</button>';
      secondPopoverContent = root.firstElementChild;
    };
    await nextRender();
  });

  describe('hover', () => {
    beforeEach(() => {
      popover.trigger = ['hover'];
    });

    it('should close the popover when mouse leaves target to non-nested popover', async () => {
      mouseenter(target);
      await nextRender();

      // open second popover
      secondPopover.opened = true;
      await nextRender();

      mouseleave(target, secondPopoverContent);
      await nextUpdate(popover);

      expect(popover.opened).to.be.false;
    });

    it('should close when mouse leaves the overlay to non-nested popover', async () => {
      mouseenter(target);
      await nextRender();

      mouseenter(popoverContent);
      await nextRender();
      expect(popover.opened).to.be.true;

      // open second popover
      secondPopover.opened = true;
      await nextRender();

      mouseleave(popoverContent, secondPopoverContent);
      await nextUpdate(popover);

      expect(popover.opened).to.be.false;
    });
  });
});
