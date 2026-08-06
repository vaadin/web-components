import { expect } from '@vaadin/chai-plugins';
import { aTimeout, click, fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-overlay.js';

describe('interactions', () => {
  describe('click', () => {
    let parent, overlay;

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
