import { expect } from '@esm-bundle/chai';
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

    it('should close overlay on Escape press by default', async () => {
      target.click();
      await nextRender();

      esc(document.body);
      await nextRender();
      expect(overlay.opened).to.be.false;
    });

    it('should close overlay on when popover is detached', async () => {
      target.click();
      await nextRender();

      popover.remove();
      await nextRender();
      expect(overlay.opened).to.be.false;
    });
  });
});
