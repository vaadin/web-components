import { expect } from '@vaadin/chai-plugins';
import { click, fixtureSync, mousedown, mouseup, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './fixtures/mock-overlay.js';

describe('outside click', () => {
  describe('single overlay', () => {
    let parent, overlay, overlayPart, backdrop;

    beforeEach(async () => {
      overlay = fixtureSync('<mock-overlay>overlay content</mock-overlay>');
      parent = overlay.parentElement;
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      overlayPart = overlay.$.overlay;
      backdrop = overlay.$.backdrop;
    });

    afterEach(() => {
      overlay.opened = false;
    });

    describe('close on click', () => {
      it('should not close on inside click', () => {
        click(overlayPart);

        expect(overlay.opened).to.be.true;
      });

      it('should close on outside click', () => {
        click(parent);

        expect(overlay.opened).to.be.false;
      });

      it('should not close on outside click when modeless', () => {
        overlay.modeless = true;
        click(parent);

        expect(overlay.opened).to.be.true;
      });

      it('should close on backdrop click', () => {
        overlay.withBackdrop = true;

        click(backdrop);

        expect(overlay.opened).to.be.false;
      });
    });

    describe('vaadin-overlay-outside-click event', () => {
      it('should fire the event on outside click', () => {
        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-outside-click', spy);

        click(parent);

        expect(spy.calledOnce).to.be.true;
      });

      it('should fire the event on backdrop click', () => {
        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-outside-click', spy);

        overlay.withBackdrop = true;
        click(backdrop);

        expect(spy.calledOnce).to.be.true;
      });

      it('should not fire the event on inside click', () => {
        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-outside-click', spy);

        click(overlayPart);

        expect(spy.called).to.be.false;
      });

      it('should not close on outside click if the event was prevented', () => {
        overlay.addEventListener('vaadin-overlay-outside-click', (e) => e.preventDefault());

        click(parent);

        expect(overlay.opened).to.be.true;
      });

      it('should not close on backdrop click if the event was prevented', () => {
        overlay.addEventListener('vaadin-overlay-outside-click', (e) => e.preventDefault());

        click(backdrop);

        expect(overlay.opened).to.be.true;
      });

      it('should not fire the event on outside click when modeless set to true', () => {
        overlay.modeless = true;

        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-outside-click', spy);

        click(parent);

        expect(spy).to.be.not.called;
      });

      it('should not fire the event on outside click when modeless set back to false', () => {
        overlay.modeless = true;

        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-outside-click', spy);

        overlay.modeless = false;

        click(parent);

        expect(spy.calledOnce).to.be.true;
      });
    });

    describe('moving mouse pointer during click', () => {
      it('should close if both mousedown and mouseup outside', () => {
        mousedown(parent);
        mouseup(parent);
        click(parent);

        expect(overlay.opened).to.be.false;
      });

      it('should not close if mousedown outside and mouseup inside', () => {
        mousedown(parent);
        mouseup(overlayPart);
        click(overlayPart);

        expect(overlay.opened).to.be.true;
      });

      it('should not close if mousedown inside and mouseup outside', () => {
        mousedown(overlayPart);
        mouseup(parent);
        click(parent);

        expect(overlay.opened).to.be.true;
      });

      it('should not close if both mousedown mouseup inside', () => {
        mousedown(overlayPart);
        mouseup(overlayPart);
        click(overlayPart);

        expect(overlay.opened).to.be.true;
      });
    });

    describe('mouseup after contextmenu event opening', () => {
      // On some platforms, contextmenu event is dispatched right on
      // mousedown, before mouseup. If the contextmenu event opens
      // the overlay, then one contextmenu-related mouseup event also occurs.

      it('should close on outside click after mouseup inside', () => {
        // Assume the overlay was opened on contextmenu event
        mouseup(overlayPart);

        mousedown(parent);
        mouseup(parent);
        click(parent);

        expect(overlay.opened).to.be.false;
      });

      it('should close on outside click after mouseup outside', () => {
        // Assume the overlay was opened on contextmenu event,
        // but this time the cursor was moved outside before mouseup
        mouseup(parent);

        mousedown(parent);
        mouseup(parent);
        click(parent);

        expect(overlay.opened).to.be.false;
      });

      it('should not close on inside click after mouseup inside', () => {
        mouseup(overlayPart);

        mousedown(overlayPart);
        mouseup(overlayPart);
        click(overlayPart);

        expect(overlay.opened).to.be.true;
      });

      it('should not close on outside click after mouseup outside', () => {
        mouseup(parent);

        mousedown(overlayPart);
        mouseup(overlayPart);
        click(overlayPart);

        expect(overlay.opened).to.be.true;
      });
    });
  });

  describe('multiple modal overlays', () => {
    let parent, overlay1, overlay2, overlay3, spy;

    beforeEach(async () => {
      parent = fixtureSync(`
        <div>
          <mock-overlay>overlay1</mock-overlay>
          <mock-overlay>overlay2</mock-overlay>
          <mock-overlay>overlay3</mock-overlay>
        </div>
      `);
      [overlay1, overlay2, overlay3] = parent.children;
      await nextRender();

      spy = sinon.spy();
      overlay1.addEventListener('vaadin-overlay-outside-click', spy);
    });

    afterEach(() => {
      overlay1.opened = false;
      overlay2.opened = false;
      overlay3.opened = false;
    });

    it('should fire the vaadin-overlay-outside-click if it is the only overlay opened', () => {
      overlay1.opened = true;
      click(parent);
      expect(spy.calledOnce).to.be.true;
    });

    it('should not fire the vaadin-overlay-outside-click if there is a recent overlay opened', () => {
      overlay1.opened = true;

      overlay2.opened = true;

      click(parent);
      expect(spy.called).to.be.false;
    });
  });
});
