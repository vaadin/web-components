import { expect } from '@vaadin/chai-plugins';
import { aTimeout, click, fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './fixtures/mock-overlay.js';

describe('events', () => {
  describe('vaadin-overlay-open event', () => {
    let overlay, spy;

    beforeEach(() => {
      overlay = fixtureSync('<mock-overlay>overlay content</mock-overlay>');
      spy = sinon.spy();
      overlay.addEventListener('vaadin-overlay-open', spy);
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should fire when after a delay when setting opened property to true', async () => {
      overlay.opened = true;
      await nextFrame();
      await aTimeout(0);
      expect(spy).to.be.calledOnce;
    });

    it('should provide reference to the overlay in the event detail', async () => {
      overlay.opened = true;
      await nextFrame();
      await aTimeout(0);
      const event = spy.firstCall.args[0];
      expect(event.detail.overlay).to.equal(overlay);
    });

    it('should not fire when immediately setting opened property back to false', async () => {
      overlay.opened = true;
      overlay.opened = false;
      await nextFrame();
      await aTimeout(0);
      expect(spy).to.not.be.called;
    });

    it('should not fire when immediately disconnected after setting opened to true', async () => {
      overlay.opened = true;
      overlay.remove();

      await nextFrame();
      await aTimeout(0);

      expect(spy).to.not.be.called;
    });

    it('should not propagate through shadow roots', async () => {
      overlay.opened = true;
      await nextFrame();
      await aTimeout(0);

      expect(spy.firstCall.args[0].composed).to.be.false;
    });

    describe('global', () => {
      let globalSpy;

      beforeEach(() => {
        globalSpy = sinon.spy();
        document.addEventListener('vaadin-overlay-open', globalSpy);
      });

      afterEach(() => {
        document.removeEventListener('vaadin-overlay-open', globalSpy);
      });

      it('should fire a global event on the document body when opened', async () => {
        overlay.opened = true;
        await nextFrame();
        await aTimeout(0);
        expect(globalSpy).to.be.called;
        expect(globalSpy.firstCall.args);
      });

      it('should provide reference to the overlay in the global event detail', async () => {
        overlay.opened = true;
        await nextFrame();
        await aTimeout(0);
        const event = globalSpy.firstCall.args[0];
        expect(event.detail.overlay).to.equal(overlay);
      });
    });
  });

  describe('close events', () => {
    let parent, overlay;

    beforeEach(async () => {
      overlay = fixtureSync('<mock-overlay>overlay content</mock-overlay>');
      parent = overlay.parentElement;
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    afterEach(() => {
      overlay.opened = false;
    });

    describe('vaadin-overlay-close event', () => {
      const preventDefaultListener = (e) => {
        e.preventDefault();
      };

      it('should not propagate through shadow roots', () => {
        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-close', spy);

        click(parent);

        expect(spy.firstCall.args[0].composed).to.be.false;
      });

      it('should prevent closing the overlay if the event was prevented', async () => {
        overlay.addEventListener('vaadin-overlay-close', preventDefaultListener);
        click(parent);
        await aTimeout(1);

        expect(overlay.opened).to.be.true;
      });

      it('should provide reference to the overlay in the event detail', () => {
        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-close', spy);
        click(parent);
        const event = spy.firstCall.args[0];
        expect(event.detail.overlay).to.equal(overlay);
      });

      describe('global', () => {
        it('should prevent closing the overlay if the global event was prevented', async () => {
          document.addEventListener('vaadin-overlay-close', preventDefaultListener, { once: true });

          click(parent);
          await aTimeout(1);

          expect(overlay.opened).to.be.true;
        });

        it('should provide reference to the overlay in the global event detail', () => {
          const globalSpy = sinon.spy();
          document.addEventListener('vaadin-overlay-close', globalSpy, { once: true });
          click(parent);
          const event = globalSpy.firstCall.args[0];
          expect(event.detail.overlay).to.equal(overlay);
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
  });
});
