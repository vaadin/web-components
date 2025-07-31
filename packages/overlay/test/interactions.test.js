import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import {
  aTimeout,
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
import '../src/vaadin-overlay.js';
import { createOverlay } from './helpers.js';

describe('interactions', () => {
  describe('Esc', () => {
    let overlay;

    beforeEach(async () => {
      overlay = createOverlay('overlay content');
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should close on Esc', () => {
      escKeyDown(document.body);

      expect(overlay.opened).to.be.false;
    });

    it('should fire the vaadin-overlay-escape-press event on Esc', () => {
      const spy = sinon.spy();
      overlay.addEventListener('vaadin-overlay-escape-press', spy);

      escKeyDown(document.body);

      expect(spy.calledOnce).to.be.true;
    });

    it('should not fire the vaadin-overlay-escape-press event on other key press', () => {
      const spy = sinon.spy();
      overlay.addEventListener('vaadin-overlay-escape-press', spy);

      enterKeyDown(document.body);

      expect(spy.called).to.be.false;
    });

    it('should not close on Esc if the event was prevented', () => {
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
        if (!root.firstChild) {
          const div = document.createElement('div');
          div.textContent = 'overlay content';
          root.appendChild(div);
        }
      };
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
    });

    describe('vaadin-overlay-close event', () => {
      const preventDefaultListener = (e) => {
        e.preventDefault();
      };

      it('should not propagate through the DOM', () => {
        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-close', spy);

        click(parent);

        expect(spy.firstCall.args[0].bubbles).to.be.false;
        expect(spy.firstCall.args[0].composed).to.be.false;
      });

      it('should prevent closing the overlay if the event was prevented', async () => {
        overlay.addEventListener('vaadin-overlay-close', preventDefaultListener);
        click(parent);
        await aTimeout(1);

        expect(overlay.opened).to.be.true;
      });

      describe('global', () => {
        beforeEach(() => {
          document.body.addEventListener('vaadin-overlay-close', preventDefaultListener);
        });

        afterEach(() => {
          document.body.removeEventListener('vaadin-overlay-close', preventDefaultListener);
        });

        it('should prevent closing the overlay if the global event was prevented', async () => {
          click(parent);
          await aTimeout(1);

          expect(overlay.opened).to.be.true;
        });
      });
    });

    describe('vaadin-overlay-closing event', () => {
      it('should fire the event when the overlay is closing', async () => {
        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-closing', spy);

        click(parent);
        await nextRender();

        expect(spy.calledOnce).to.be.true;
      });

      it('should not fire the event when preventing vaadin-overlay-close', async () => {
        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-closing', spy);
        overlay.addEventListener('vaadin-overlay-close', (e) => e.preventDefault());
        click(parent);
        await nextRender();
        expect(spy.called).to.be.false;
      });
    });

    describe('vaadin-overlay-closed event', () => {
      it('should fire the event after the overlay has closed', async () => {
        const closingSpy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-closing', closingSpy);

        const closedSpy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-closed', closedSpy);

        click(parent);
        await nextRender();

        expect(closedSpy.calledOnce).to.be.true;
        expect(closedSpy.calledAfter(closingSpy)).to.be.true;
      });

      it('should not fire the event when preventing vaadin-overlay-close', async () => {
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

    describe('mousedown on content', () => {
      afterEach(async () => {
        await resetMouse();
      });

      it('should focus overlay part on clicking the content element', async () => {
        await sendMouseToElement({ type: 'click', element: overlay.querySelector('div') });
        await nextRender();

        expect(document.activeElement).to.be.equal(overlay);
      });

      it('should not focus overlay part if tabindex attribute removed', async () => {
        overlay.$.overlay.removeAttribute('tabindex');

        await sendMouseToElement({ type: 'click', element: overlay.querySelector('div') });
        await nextRender();

        expect(document.activeElement).to.be.equal(document.body);
      });
    });
  });
});
