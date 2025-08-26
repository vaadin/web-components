import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { esc, fixtureSync, nextRender, nextUpdate, oneEvent, outsideClick } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-popover.js';

describe('popover', () => {
  let popover, overlay;

  beforeEach(async () => {
    popover = fixtureSync('<vaadin-popover></vaadin-popover>');
    await nextRender();
    overlay = popover.shadowRoot.querySelector('vaadin-popover-overlay');
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = popover.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('host element', () => {
    it('should use display: none when not opened', () => {
      expect(getComputedStyle(popover).display).to.equal('none');
    });

    ['opened', 'opening', 'closing'].forEach((state) => {
      it(`should use display: block when ${state} attribute is set`, () => {
        popover.setAttribute(state, '');
        expect(getComputedStyle(popover).display).to.equal('block');
      });
    });

    it('should reflect opened property to attribute', async () => {
      popover.opened = true;
      await nextUpdate(popover);
      expect(popover.hasAttribute('opened')).to.be.true;

      popover.opened = false;
      await nextUpdate(popover);
      expect(popover.hasAttribute('opened')).to.be.false;
    });
  });

  describe('renderer', () => {
    let renderer;

    beforeEach(async () => {
      renderer = sinon.stub();
      popover.renderer = renderer;
      await nextUpdate(popover);
    });

    it('should propagate renderer property to overlay', () => {
      expect(overlay.renderer).to.eql(renderer);
    });

    it('should call renderer when requesting content update', () => {
      popover.requestContentUpdate();
      expect(overlay.renderer).to.be.calledOnce;
    });

    it('should not request overlay content update when renderer is unset', async () => {
      popover.renderer = null;
      await nextUpdate(popover);

      const spy = sinon.spy(overlay, 'requestContentUpdate');
      popover.requestContentUpdate();
      expect(spy).to.not.be.called;
    });

    it('should not throw when requesting content update before adding to DOM', () => {
      const element = document.createElement('vaadin-popover');
      expect(() => element.requestContentUpdate()).not.to.throw(Error);
    });
  });

  describe('target', () => {
    let target;

    beforeEach(() => {
      target = fixtureSync('<button>Target</button>');
    });

    it('should set target as overlay positionTarget', async () => {
      popover.target = target;
      await nextUpdate(popover);
      expect(overlay.positionTarget).to.eql(target);
    });

    it('should set target as overlay restoreFocusNode', async () => {
      popover.target = target;
      await nextUpdate(popover);
      expect(overlay.restoreFocusNode).to.eql(target);
    });

    it('should restore focus when target is set on already opened popover', async () => {
      // Focus target before opening
      target.focus();

      // Open popover
      popover.renderer = (root) => {
        if (!root.firstChild) {
          const input = document.createElement('input');
          root.appendChild(input);
        }
      };
      popover.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      // Set target
      popover.target = target;
      await nextUpdate(popover);

      popover.querySelector('input').focus();

      // Close popover
      popover.opened = false;
      await nextRender();

      expect(document.activeElement).to.equal(target);
    });

    it('should not restore focus when target is cleared on already opened popover', async () => {
      // Focus target before opening
      target.focus();

      // Open popover
      popover.renderer = (root) => {
        if (!root.firstChild) {
          const input = document.createElement('input');
          root.appendChild(input);
        }
      };
      popover.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      // Set target
      popover.target = target;
      await nextUpdate(popover);

      popover.querySelector('input').focus();

      // Clear target
      popover.target = null;
      await nextUpdate(popover);

      // Close popover
      popover.opened = false;
      await nextRender();

      expect(document.activeElement).to.not.equal(target);
    });

    it('should not throw when target is removed', async () => {
      popover.modal = true;

      // Clear target
      popover.target = null;
      await nextUpdate(popover);

      popover.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      // No error should be thrown
      popover.opened = false;
      await oneEvent(popover, 'closed');
    });
  });

  describe('for', () => {
    let target;

    beforeEach(() => {
      target = fixtureSync('<button>Target</button>');
    });

    describe('element found', () => {
      it('should use for attribute to link target using ID', async () => {
        target.setAttribute('id', 'foo');
        popover.for = 'foo';
        await nextUpdate(popover);
        expect(popover.target).to.eql(target);
      });
    });

    describe('element not found', () => {
      beforeEach(() => {
        sinon.stub(console, 'warn');
      });

      afterEach(() => {
        console.warn.restore();
      });

      it('should warn when element with given ID is not found', async () => {
        popover.for = 'bar';
        await nextUpdate(popover);
        expect(console.warn.called).to.be.true;
      });

      it('should keep the target when providing incorrect for', async () => {
        popover.target = target;
        popover.for = 'bar';
        await nextUpdate(popover);
        expect(popover.target).to.eql(target);
      });
    });
  });

  describe('overlay properties', () => {
    it('should set modeless on the overlay by default', () => {
      expect(overlay.modeless).to.be.true;
    });

    it('should set modeless on the overlay to false when modal is true', async () => {
      popover.modal = true;
      await nextUpdate(popover);
      expect(overlay.modeless).to.be.false;
    });

    it('should not set focusTrap on the overlay by default', () => {
      expect(overlay.modeless).to.be.true;
    });

    it('should set focusTrap on the overlay to true when modal is true', async () => {
      popover.modal = true;
      await nextUpdate(popover);
      expect(overlay.focusTrap).to.be.true;
    });

    it('should propagate withBackdrop property to the overlay', async () => {
      popover.withBackdrop = true;
      await nextUpdate(popover);
      expect(overlay.withBackdrop).to.be.true;

      popover.withBackdrop = false;
      await nextUpdate(popover);
      expect(overlay.withBackdrop).to.be.false;
    });
  });

  describe('interactions', () => {
    let target;

    beforeEach(async () => {
      target = fixtureSync('<button>Target</button>');
      popover.target = target;
      await nextUpdate(popover);
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('should open overlay on target click by default', async () => {
      target.click();
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(overlay.opened).to.be.true;
    });

    it('should close overlay on subsequent target click', async () => {
      target.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      // Use browser command here to test for possible side effects between the outside click listener and the
      // target opened toggle behavior. Using browser commands for opening the popover doesn't work consistently as
      // the opened event might fire before the click promise resolves.
      await sendMouseToElement({ type: 'click', element: target });
      await nextRender();
      expect(overlay.opened).to.be.false;
    });

    it('should close overlay on outside click by default', async () => {
      target.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      outsideClick();
      await nextRender();
      expect(overlay.opened).to.be.false;
    });

    it('should close overlay on outside click when modal is true', async () => {
      popover.modal = true;
      await nextUpdate(popover);

      target.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      outsideClick();
      await nextRender();
      expect(overlay.opened).to.be.false;
      expect(popover.opened).to.be.false;
    });

    it('should not close on outside click if noCloseOnOutsideClick is true', async () => {
      popover.noCloseOnOutsideClick = true;
      await nextUpdate(popover);

      target.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      outsideClick();
      await nextRender();
      expect(overlay.opened).to.be.true;
    });

    it('should not close on outside click if overlay close event is prevented', async () => {
      target.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      document.addEventListener('vaadin-overlay-close', (e) => e.preventDefault(), { once: true });

      outsideClick();
      await nextRender();
      expect(overlay.opened).to.be.true;
    });

    it('should not close on outside click if overlay close event is prevented when modal', async () => {
      popover.modal = true;
      await nextUpdate(popover);

      target.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      document.addEventListener('vaadin-overlay-close', (e) => e.preventDefault(), { once: true });

      outsideClick();
      await nextRender();
      expect(overlay.opened).to.be.true;
    });

    it('should close overlay when popover is detached', async () => {
      target.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      popover.remove();
      await nextRender();
      expect(overlay.opened).to.be.false;
    });

    it('should not close overlay when popover is moved in DOM', async () => {
      target.click();
      await oneEvent(overlay, 'vaadin-overlay-open');

      const parent = popover.parentElement;
      popover.remove();
      parent.appendChild(popover);
      await nextRender();
      expect(overlay.opened).to.be.true;
    });

    describe('Escape press', () => {
      beforeEach(async () => {
        target.click();
        await oneEvent(overlay, 'vaadin-overlay-open');
      });

      it('should close overlay on global Escape press by default', async () => {
        esc(document.body);
        await nextRender();
        expect(overlay.opened).to.be.false;
      });

      it('should not close on global Escape press if noCloseOnEsc is true', async () => {
        popover.noCloseOnEsc = true;
        await nextUpdate(popover);

        esc(document.body);
        await nextRender();
        expect(overlay.opened).to.be.true;
      });

      it('should close overlay on global Escape press when modal is true', async () => {
        popover.modal = true;
        await nextUpdate(popover);

        esc(document.body);
        await nextRender();
        expect(overlay.opened).to.be.false;
        expect(popover.opened).to.be.false;
      });

      it('should not close on global Escape press if noCloseOnEsc is true when modal', async () => {
        popover.modal = true;
        popover.noCloseOnEsc = true;
        await nextUpdate(popover);

        esc(document.body);
        await nextRender();
        expect(overlay.opened).to.be.true;
      });

      it('should not close on global Escape press if overlay close event was prevented', async () => {
        document.addEventListener('vaadin-overlay-close', (e) => e.preventDefault(), { once: true });

        esc(document.body);
        await nextRender();
        expect(overlay.opened).to.be.true;
      });

      it('should not close on global Escape press if overlay close event was prevented when modal', async () => {
        popover.modal = true;
        await nextUpdate(popover);

        document.addEventListener('vaadin-overlay-close', (e) => e.preventDefault(), { once: true });

        esc(document.body);
        await nextRender();
        expect(overlay.opened).to.be.true;
      });
    });

    describe('nested popovers', () => {
      let secondPopover, secondTarget;

      function nestedRenderer(root) {
        root.innerHTML = `
          <button id="second-target">Second target</button>
          <vaadin-popover for="second-target"></vaadin-popover>
        `;
        [secondTarget, secondPopover] = root.children;
      }

      beforeEach(async () => {
        popover.renderer = nestedRenderer;

        // Open the first popover
        target.click();
        await oneEvent(overlay, 'vaadin-overlay-open');

        // Open the second popover
        secondTarget.click();
        await oneEvent(secondPopover._overlayElement, 'vaadin-overlay-open');

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

    describe('backdrop', () => {
      beforeEach(async () => {
        popover.withBackdrop = true;
        await nextUpdate(popover);

        target.click();
        await oneEvent(overlay, 'vaadin-overlay-open');
      });

      it('should set pointer-events on backdrop to none when non modal', () => {
        expect(getComputedStyle(overlay.$.backdrop).pointerEvents).to.equal('none');
      });

      it('should set pointer-events on backdrop to auto when modal', async () => {
        popover.modal = true;
        await nextUpdate(popover);
        expect(getComputedStyle(overlay.$.backdrop).pointerEvents).to.equal('auto');
      });
    });
  });

  describe('detach and re-attach', () => {
    let target;

    beforeEach(() => {
      target = fixtureSync('<button>Target</button>');
    });

    it('should not open on target click when detached', async () => {
      popover.target = target;
      await nextUpdate(popover);

      popover.remove();
      target.click();

      expect(popover.opened).to.be.false;
    });

    it('should open on target click when re-attached', async () => {
      popover.target = target;
      await nextUpdate(popover);

      popover.remove();

      target.parentNode.appendChild(popover);
      await nextUpdate(popover);

      target.click();

      expect(popover.opened).to.be.true;
    });

    it('should not open on target click when target set while detached', async () => {
      popover.remove();

      popover.target = target;
      await nextUpdate(popover);

      target.click();

      expect(popover.opened).to.be.false;
    });

    it('should open when target set while detached after re-attached', async () => {
      popover.remove();

      popover.target = target;
      await nextUpdate(popover);

      target.parentNode.appendChild(popover);
      await nextUpdate(popover);

      target.click();

      expect(popover.opened).to.be.true;
    });

    it('should not open on target click when target is cleared', async () => {
      popover.target = target;
      await nextUpdate(popover);

      popover.target = null;
      await nextUpdate(popover);

      target.click();

      expect(popover.opened).to.be.false;
    });
  });

  describe('dimensions', () => {
    describe('default', () => {
      beforeEach(async () => {
        popover.opened = true;
        await oneEvent(overlay, 'vaadin-overlay-open');
      });

      it('should update width after opening the popover', async () => {
        popover.width = '300px';
        await nextRender();
        expect(getComputedStyle(overlay.$.overlay).width).to.equal('300px');
      });

      it('should update height after opening the popover', async () => {
        popover.height = '500px';
        await nextRender();
        expect(getComputedStyle(overlay.$.overlay).height).to.equal('500px');
      });

      it('should reset style after setting width to null', async () => {
        const originalWidth = getComputedStyle(overlay.$.overlay).width;

        popover.width = '500px';
        await nextRender();
        expect(getComputedStyle(overlay.$.overlay).width).to.equal('500px');

        popover.width = null;
        await nextRender();
        expect(getComputedStyle(overlay.$.overlay).width).to.equal(originalWidth);
      });

      it('should reset style after setting height to null', async () => {
        const originalHeight = getComputedStyle(overlay.$.overlay).height;

        popover.height = '500px';
        await nextRender();
        expect(getComputedStyle(overlay.$.overlay).height).to.equal('500px');

        popover.height = null;
        await nextRender();
        expect(getComputedStyle(overlay.$.overlay).height).to.equal(originalHeight);
      });
    });

    describe('set before attach', () => {
      beforeEach(() => {
        popover = document.createElement('vaadin-popover');
      });

      afterEach(() => {
        popover.remove();
      });

      it('should apply overlay width when set before attach', async () => {
        popover.width = '300px';
        document.body.appendChild(popover);
        await nextRender();

        popover.opened = true;
        await oneEvent(popover.$.overlay, 'vaadin-overlay-open');

        expect(getComputedStyle(popover.$.overlay.$.overlay).width).to.equal('300px');
      });

      it('should apply overlay height when set before attach', async () => {
        popover.height = '300px';
        document.body.appendChild(popover);
        await nextRender();

        popover.opened = true;
        await oneEvent(popover.$.overlay, 'vaadin-overlay-open');

        expect(getComputedStyle(popover.$.overlay.$.overlay).height).to.equal('300px');
      });
    });
  });

  describe('content overflow', () => {
    let overlayHeight;

    beforeEach(async () => {
      popover.renderer = (root) => {
        root.textContent = new Array(2000).fill('foo').join(' ');
      };
      popover.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      overlayHeight = overlay.getBoundingClientRect().height;
    });

    it('should limit overlay height if content overflows the viewport', () => {
      expect(overlay.$.overlay.getBoundingClientRect().height).to.equal(overlayHeight);
    });

    it('should limit content height if content overflows the viewport', () => {
      const border = parseInt(getComputedStyle(overlay.$.overlay).borderTopWidth);
      expect(overlay.$.content.getBoundingClientRect().height).to.equal(overlayHeight - border * 2);
    });
  });

  describe('closed event', () => {
    beforeEach(async () => {
      popover.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    it('should dispatch closed event when closed', async () => {
      const closedSpy = sinon.spy();
      popover.addEventListener('closed', closedSpy);
      popover.opened = false;
      await nextRender();
      expect(closedSpy).to.be.calledOnce;
    });

    it('should dispatch closed event after overlay is closed', async () => {
      const closedPromise = new Promise((resolve) => {
        const closedListener = () => {
          expect(overlay.parentElement).to.be.not.ok;
          resolve();
        };
        popover.addEventListener('closed', closedListener, { once: true });
      });
      popover.opened = false;
      await nextRender();
      await closedPromise;
    });
  });

  describe('exportparts', () => {
    it('should export all overlay parts for styling', () => {
      const parts = [...overlay.shadowRoot.querySelectorAll('[part]')].map((el) => el.getAttribute('part'));
      const exportParts = overlay.getAttribute('exportparts').split(', ');

      parts.forEach((part) => {
        expect(exportParts).to.include(part);
      });
    });
  });
});
