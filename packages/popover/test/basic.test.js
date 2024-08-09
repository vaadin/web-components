import { expect } from '@vaadin/chai-plugins';
import { esc, fixtureSync, nextRender, nextUpdate, outsideClick } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-popover.js';

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

    it('should open overlay on target click by default', async () => {
      target.click();
      await nextRender();
      expect(overlay.opened).to.be.true;
    });

    it('should close overlay on subsequent target click', async () => {
      target.click();
      await nextRender();

      target.click();
      await nextRender();
      expect(overlay.opened).to.be.false;
    });

    it('should close overlay on outside click by default', async () => {
      target.click();
      await nextRender();

      outsideClick();
      await nextRender();
      expect(overlay.opened).to.be.false;
    });

    it('should close overlay on outside click when modal is true', async () => {
      popover.modal = true;
      await nextUpdate(popover);

      target.click();
      await nextRender();

      outsideClick();
      await nextRender();
      expect(overlay.opened).to.be.false;
    });

    it('should not close on outside click if noCloseOnOutsideClick is true', async () => {
      popover.noCloseOnOutsideClick = true;
      await nextUpdate(popover);

      target.click();
      await nextRender();

      outsideClick();
      await nextRender();
      expect(overlay.opened).to.be.true;
    });

    it('should close overlay when popover is detached', async () => {
      target.click();
      await nextRender();

      popover.remove();
      await nextRender();
      expect(overlay.opened).to.be.false;
    });

    it('should remove document click listener when popover is detached', async () => {
      const spy = sinon.spy(document.documentElement, 'removeEventListener');
      popover.remove();
      await nextRender();
      expect(spy).to.be.called;
      expect(spy.firstCall.args[0]).to.equal('click');
    });

    describe('Escape press', () => {
      beforeEach(async () => {
        target.click();
        await nextRender();
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
      });

      it('should not close on global Escape press if noCloseOnEsc is true when moodal', async () => {
        popover.modal = true;
        popover.noCloseOnEsc = true;
        await nextUpdate(popover);

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

    describe('backdrop', () => {
      beforeEach(async () => {
        popover.withBackdrop = true;
        await nextUpdate(popover);

        target.click();
        await nextRender();
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

  describe('dimensions', () => {
    function getStyleValue(element) {
      return element
        .getAttribute('style')
        .split(':')
        .map((str) => str.trim().replace(';', ''));
    }

    beforeEach(async () => {
      popover.opened = true;
      await nextRender();
    });

    it('should update width after opening the popover', async () => {
      popover.contentWidth = '300px';
      await nextUpdate(popover);
      expect(getComputedStyle(overlay.$.content).width).to.be.equal('300px');
    });

    it('should update height after opening the popover', async () => {
      popover.contentHeight = '500px';
      await nextUpdate(popover);
      expect(getComputedStyle(overlay.$.content).height).to.equal('500px');
    });

    it('should reset style after setting width to null', async () => {
      const prop = '--_vaadin-popover-content-width';

      popover.contentWidth = '500px';
      await nextUpdate(popover);
      expect(getStyleValue(overlay)).to.eql([prop, '500px']);

      popover.contentWidth = null;
      await nextUpdate(popover);
      expect(overlay.getAttribute('style')).to.be.not.ok;
    });

    it('should reset style after setting height to null', async () => {
      const prop = '--_vaadin-popover-content-height';

      popover.contentHeight = '500px';
      await nextUpdate(popover);
      expect(getStyleValue(overlay)).to.eql([prop, '500px']);

      popover.contentHeight = null;
      await nextUpdate(popover);
      expect(overlay.getAttribute('style')).to.be.not.ok;
    });
  });

  describe('closed event', () => {
    beforeEach(async () => {
      popover.opened = true;
      await nextRender();
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
});
