import { expect } from '@esm-bundle/chai';
import { escKeyDown, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { IronOverlayBehavior } from '@polymer/iron-overlay-behavior/iron-overlay-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { Overlay } from '../src/vaadin-overlay.js';

Polymer({
  is: 'iron-overlay',
  behaviors: [IronOverlayBehavior],
});

describe('overlay legacy', () => {
  describe('inside the iron-overlay', () => {
    let overlay, parent, spy;

    beforeEach(async () => {
      parent = fixtureSync(`
        <iron-overlay id="parent">
          <vaadin-overlay>
            <template>
              overlay-content
            </template>
          </vaadin-overlay>
        </iron-overlay>
      `);
      overlay = parent.querySelector('vaadin-overlay');
      overlay._observer.flush();
      parent.open();
      await nextRender(parent);
      overlay.opened = true;
      await nextRender(overlay);
      spy = sinon.spy();
      document.addEventListener('iron-overlay-canceled', spy);
    });

    afterEach(() => {
      overlay.opened = false;
      document.removeEventListener('iron-overlay-canceled', spy);
    });

    it('should prevent `iron-overlay-canceled` on Esc keydown when opened', async () => {
      escKeyDown(document);
      expect(parent.canceled).to.be.false;
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].defaultPrevented).to.be.true;

      spy.resetHistory();
      overlay.opened = false;
      await nextRender(overlay);

      escKeyDown(document);
      expect(parent.canceled).to.be.true;
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].defaultPrevented).to.be.false;
    });

    it('should prevent `iron-overlay-canceled` on subsequent Esc if still opened', () => {
      overlay.addEventListener('vaadin-overlay-escape-press', (e) => e.preventDefault());

      escKeyDown(document);
      expect(parent.canceled).to.be.false;
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].defaultPrevented).to.be.true;

      spy.resetHistory();
      escKeyDown(document);
      expect(parent.canceled).to.be.false;
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].defaultPrevented).to.be.true;
    });
  });

  describe('iOS event listeners', () => {
    it('should have a click listener', () => {
      // Having at least one mouse event listener is needed for iOS
      // to enable mouse events dispatching.
      sinon.spy(Overlay.prototype, 'addEventListener');

      const overlay = document.createElement('vaadin-overlay');
      document.body.appendChild(overlay);

      expect(Overlay.prototype.addEventListener.calledWith('click')).to.be.true;

      document.body.removeChild(overlay);
      Overlay.prototype.addEventListener.restore();
    });

    it('should have a click listener on the backdrop', () => {
      // When backdrop is visible, it should also dispatch clicks,
      // so another iOS workaround listener is needed for the backdrop.
      sinon.spy(HTMLElement.prototype, 'addEventListener');

      const overlay = document.createElement('vaadin-overlay');
      document.body.appendChild(overlay);

      const backdropCall = HTMLElement.prototype.addEventListener
        .getCalls()
        .find((call) => call.calledOn(overlay.$.backdrop));
      expect(backdropCall).to.not.be.undefined;
      expect(backdropCall.calledWith('click')).to.be.true;

      document.body.removeChild(overlay);
      HTMLElement.prototype.addEventListener.restore();
    });
  });
});
