import { expect } from '@vaadin/chai-plugins';
import { click, escKeyDown, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { createOverlay } from './helpers.js';

describe('multiple overlays', () => {
  describe('modal', () => {
    let parent, overlay1, overlay2, overlay3;

    beforeEach(async () => {
      parent = fixtureSync('<div></div>');
      overlay1 = createOverlay('overlay 1');
      overlay2 = createOverlay('overlay 2');
      overlay3 = createOverlay('overlay 3');
      parent.append(overlay1, overlay2, overlay3);
      await nextRender();
    });

    afterEach(() => {
      overlay1.opened = false;
      overlay2.opened = false;
      overlay3.opened = false;
    });

    describe('last flag', () => {
      it('should be the last when only one overlay is opened', () => {
        overlay1.opened = true;
        expect(overlay1._last).to.be.true;
      });

      it('should not be the last when another overlay is opened after this', () => {
        overlay1.opened = true;

        overlay2.opened = true;

        expect(overlay1._last).not.to.be.true;
        expect(overlay2._last).to.be.true;
      });

      it('should become last when the last overlay is closed', () => {
        overlay1.opened = true;

        overlay2.opened = true;

        overlay2.opened = false;

        expect(overlay1._last).to.be.true;
      });
    });

    describe('vaadin-overlay-escape-press', () => {
      let spy;

      beforeEach(() => {
        spy = sinon.spy();
        overlay1.addEventListener('vaadin-overlay-escape-press', spy);
      });

      it('should fire the vaadin-overlay-escape-press if it is the only overlay opened', () => {
        overlay1.opened = true;
        escKeyDown(document.body);
        expect(spy.called).to.be.true;
      });

      it('should not fire the vaadin-overlay-escape-press if there is a recent overlay opened', () => {
        overlay1.opened = true;

        overlay2.opened = true;

        escKeyDown(document.body);
        expect(spy.called).to.be.false;
      });
    });

    describe('vaadin-overlay-outside-click', () => {
      let spy;

      beforeEach(() => {
        spy = sinon.spy();
        overlay1.addEventListener('vaadin-overlay-outside-click', spy);
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

    describe('pointer-events', () => {
      it('should restore pointer-events correctly when overlays are not closed in order', () => {
        overlay1.opened = true;

        overlay2.opened = true;
        expect(document.body.style.pointerEvents).to.eql('none');

        overlay1.opened = false;

        overlay2.opened = false;
        expect(document.body.style.pointerEvents).to.eql('');
      });

      it('should disable pointer-events in first overlay when second opens', () => {
        const overlay1Part = overlay1.shadowRoot.querySelector('[part="overlay"]');
        overlay1.opened = true;

        overlay2.opened = true;

        expect(getComputedStyle(overlay1Part).pointerEvents).to.equal('none');
      });

      it('should restore pointer-events in first overlay when second closes', () => {
        const overlay1Part = overlay1.shadowRoot.querySelector('[part="overlay"]');
        overlay1.opened = true;

        overlay2.opened = true;

        overlay2.opened = false;
        expect(getComputedStyle(overlay1Part).pointerEvents).to.equal('auto');
      });

      it('should restore pointer-events in second overlay when third closes', () => {
        const overlay1Part = overlay1.shadowRoot.querySelector('[part="overlay"]');
        const overlay2Part = overlay2.shadowRoot.querySelector('[part="overlay"]');
        overlay1.opened = true;

        overlay2.opened = true;

        overlay3.opened = true;

        overlay3.opened = false;

        expect(getComputedStyle(overlay2Part).pointerEvents).to.equal('auto');
        expect(getComputedStyle(overlay1Part).pointerEvents).to.equal('none');
      });

      it('should clear pointer events after closing overlays', () => {
        const overlay1Part = overlay1.shadowRoot.querySelector('[part="overlay"]');
        // Step 1: Opening overlay 1 so it's physically moved under the body
        overlay1.opened = true;
        // Step 2: As overlay2 is modal, it will set overlay 1's pointer events to none
        overlay2.opened = true;
        // Step 3: Closing overlay 1 so it's physically moved back from under the body
        overlay1.opened = false;
        // Step 4: Closing overlay 2 restores pointer-events of an overlay it
        // finds under the body node, but overlay 1 is no longer there.
        overlay2.opened = false;
        // The fix: Clear pointer-events whenever an overlay is closed
        // (in this case overlay 1 at step 3)
        expect(getComputedStyle(overlay1Part).pointerEvents).to.equal('auto');
      });
    });
  });

  describe('modeless', () => {
    let parent, modeless1, modeless2;

    const getFrontmostOverlayFromScreenCenter = () => {
      let elementFromPoint = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
      while (elementFromPoint && elementFromPoint.localName !== 'vaadin-overlay') {
        elementFromPoint = elementFromPoint.host || elementFromPoint.parentNode;
      }
      return elementFromPoint;
    };

    beforeEach(async () => {
      parent = fixtureSync(`
        <div id="parent">
          <vaadin-overlay modeless></vaadin-overlay>
          <vaadin-overlay modeless></vaadin-overlay>
        </div>
      `);
      modeless1 = parent.children[0];
      modeless1.renderer = (root) => {
        if (!root.firstChild) {
          root.textContent = 'overlay 1';
          const input = document.createElement('input');
          root.appendChild(input);
        }
      };
      modeless2 = parent.children[1];
      modeless2.renderer = (root) => {
        if (!root.firstChild) {
          root.textContent = 'overlay 2';
          const input = document.createElement('input');
          root.appendChild(input);
        }
      };
      await nextRender();
    });

    afterEach(() => {
      modeless1.opened = false;
      modeless2.opened = false;
    });

    it('should bring the overlay to front with bringToFront', () => {
      modeless1.opened = true;
      modeless2.opened = true;
      modeless1.bringToFront();

      expect(modeless1._last).to.be.true;
      // Check that the overlay is also visually the frontmost
      const frontmost = getFrontmostOverlayFromScreenCenter();
      expect(frontmost).to.equal(modeless1);
    });

    it('should not lose scroll position when brought to front', () => {
      modeless1.opened = true;
      modeless1.$.content.style.height = '200px';

      const overlay = modeless1.$.overlay;
      overlay.style.height = '100px';
      overlay.scrollTop = 100;

      modeless2.opened = true;
      modeless1.bringToFront();
      expect(overlay.scrollTop).to.equal(100);
    });

    it('should grow the z-index by 1', () => {
      modeless1.opened = true;
      modeless2.opened = true;
      modeless1.bringToFront();

      const zIndex1 = parseFloat(getComputedStyle(modeless1).zIndex);
      const zIndex2 = parseFloat(getComputedStyle(modeless2).zIndex);
      expect(zIndex1).to.equal(zIndex2 + 1);
    });

    it('should bring the newly opened overlay to front', () => {
      modeless1.opened = true;
      modeless2.opened = true;
      modeless1.bringToFront();

      modeless2.opened = false;
      modeless2.opened = true;

      const frontmost = getFrontmostOverlayFromScreenCenter();
      expect(frontmost).to.equal(modeless2);
    });

    it('should reset z-indexes', () => {
      modeless1.opened = true;
      modeless2.opened = true;

      const zIndex1 = parseFloat(getComputedStyle(modeless1).zIndex);
      expect(parseFloat(modeless2.style.zIndex)).to.equal(zIndex1 + 1);

      modeless1.opened = false;
      modeless2.opened = false;

      modeless2.opened = true;
      expect(modeless2.style.zIndex).to.be.empty;
    });

    it('should not fire the vaadin-overlay-escape-press if the overlay does not contain focus', () => {
      const spy = sinon.spy();
      modeless1.addEventListener('vaadin-overlay-escape-press', spy);

      modeless1.opened = true;

      escKeyDown(document.body);
      expect(spy.called).to.be.false;
    });

    it('should not fire the vaadin-overlay-escape-press if the overlay contains focus', () => {
      const spy = sinon.spy();
      modeless1.addEventListener('vaadin-overlay-escape-press', spy);

      modeless1.opened = true;

      const input = modeless1.querySelector('input');
      input.focus();

      escKeyDown(input);
      expect(spy.called).to.be.true;
    });

    it('should fire the vaadin-overlay-escape-press if the overlay is the frontmost one', () => {
      const spy = sinon.spy();
      modeless1.addEventListener('vaadin-overlay-escape-press', spy);

      modeless1.opened = true;

      modeless2.opened = true;
      modeless1.bringToFront();

      const input = modeless1.querySelector('input');
      input.focus();

      escKeyDown(input);
      expect(spy.called).to.be.true;
    });

    it('should not fire the vaadin-overlay-escape-press if the overlay is not the frontmost', () => {
      const spy = sinon.spy();
      modeless1.addEventListener('vaadin-overlay-escape-press', spy);

      modeless1.opened = true;
      modeless2.opened = true;

      const input = modeless2.querySelector('input');
      input.focus();

      escKeyDown(input);
      expect(spy.called).to.be.false;
    });
  });
});
