import { expect } from '@esm-bundle/chai';
import {
  click,
  enterKeyDown,
  escKeyDown,
  fixtureSync,
  mousedown,
  mouseup,
  nextRender,
  oneEvent,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-overlay.js';
import { createOverlay } from './helpers.js';

describe('interactions', () => {
  describe('Esc', () => {
    let overlay;

    beforeEach(async () => {
      overlay = createOverlay('overlay content');
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    afterEach(async () => {
      overlay.opened = false;
      await nextRender();
    });

    it('should close on Esc', () => {
      escKeyDown(document.body);

      expect(overlay.opened).to.be.false;
    });

    it('should fire the vaadin-overlay-escape-press event when Esc pressed', () => {
      const spy = sinon.spy();
      overlay.addEventListener('vaadin-overlay-escape-press', spy);

      escKeyDown(document.body);

      expect(spy.calledOnce).to.be.true;
    });

    it('should not fire the vaadin-overlay-escape-press event other key pressed', () => {
      const spy = sinon.spy();
      overlay.addEventListener('vaadin-overlay-escape-press', spy);

      enterKeyDown(document.body);

      expect(spy.called).to.be.false;
    });

    it('should not close on esc if vaadin-overlay-escape-press event was prevented', () => {
      overlay.addEventListener('vaadin-overlay-escape-press', (e) => e.preventDefault());

      escKeyDown(document.body);

      expect(overlay.opened).to.be.true;
    });
  });

  describe('click', () => {
    let parent, overlay, overlayPart, backdrop;

    beforeEach(async () => {
      parent = document.createElement('div');
      overlay = fixtureSync('<vaadin-overlay></vaadin-overlay>', parent);
      overlay.renderer = (root) => {
        root.textContent = 'overlay content';
      };
      await nextRender();
      overlayPart = overlay.$.overlay;
      backdrop = overlay.$.backdrop;
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    afterEach(async () => {
      overlay.opened = false;
      await nextRender();
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

      it('should close on backdrop click', () => {
        overlay.withBackdrop = true;

        click(backdrop);

        expect(overlay.opened).to.be.false;
      });
    });

    describe('vaadin-overlay-outside-click event', () => {
      it('should fire the vaadin-overlay-outside-click event on outside click', () => {
        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-outside-click', spy);

        click(parent);

        expect(spy.calledOnce).to.be.true;
      });

      it('should fire the vaadin-overlay-outside-click event on backdrop click', () => {
        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-outside-click', spy);

        overlay.withBackdrop = true;
        click(backdrop);

        expect(spy.calledOnce).to.be.true;
      });

      it('should not fire the vaadin-overlay-outside-click event on inside click', () => {
        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-outside-click', spy);

        click(overlayPart);

        expect(spy.called).to.be.false;
      });

      it('should not close on outside click if vaadin-overlay-outside-click event was prevented', () => {
        overlay.addEventListener('vaadin-overlay-outside-click', (e) => e.preventDefault());

        click(parent);

        expect(overlay.opened).to.be.true;
      });

      it('should not close on backdrop click if vaadin-overlay-outside-click event was prevented', () => {
        overlay.addEventListener('vaadin-overlay-outside-click', (e) => e.preventDefault());

        click(backdrop);

        expect(overlay.opened).to.be.true;
      });
    });

    describe('vaadin-overlay-close event', () => {
      it('should prevent closing the overlay when preventing vaadin-overlay-close', (done) => {
        overlay.addEventListener('vaadin-overlay-close', (e) => {
          e.preventDefault();

          setTimeout(() => {
            expect(overlay.opened).to.be.true;
            done();
          }, 1);
        });
        click(parent);
      });
    });

    describe('vaadin-overlay-closing event', () => {
      it('should dispatch vaadin-overlay-closing when the overlay is closing', async () => {
        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-closing', spy);

        click(parent);
        await nextRender();

        expect(spy.calledOnce).to.be.true;
      });

      it('should not dispatch vaadin-overlay-closing when preventing vaadin-overlay-close', async () => {
        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-closing', spy);
        overlay.addEventListener('vaadin-overlay-close', (e) => e.preventDefault());
        click(parent);
        await nextRender();
        expect(spy.called).to.be.false;
      });
    });

    describe('vaadin-overlay-closed event', () => {
      it('should dispatch vaadin-overlay-closed after the overlay has closed', async () => {
        const closingSpy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-closing', closingSpy);

        const closedSpy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-closed', closedSpy);

        click(parent);
        await nextRender();

        expect(closedSpy.calledOnce).to.be.true;
        expect(closedSpy.calledAfter(closingSpy)).to.be.true;
      });

      it('should not dispatch vaadin-overlay-closed when preventing vaadin-overlay-close', async () => {
        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-closed', spy);
        overlay.addEventListener('vaadin-overlay-close', (e) => e.preventDefault());

        click(parent);
        await nextRender();

        expect(spy.called).to.be.false;
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
});
