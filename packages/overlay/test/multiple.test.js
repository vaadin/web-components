import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-overlay.js';
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
      parent = fixtureSync('<div></div>');
      modeless1 = createOverlay('overlay 1');
      modeless2 = createOverlay('overlay 2');
      modeless1.modeless = true;
      modeless2.modeless = true;
      parent.append(modeless1, modeless2);
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

    it('should bring the newly opened overlay to front', () => {
      modeless1.opened = true;
      modeless2.opened = true;
      modeless1.bringToFront();

      modeless2.opened = false;
      modeless2.opened = true;

      const frontmost = getFrontmostOverlayFromScreenCenter();
      expect(frontmost).to.equal(modeless2);
    });

    it('should bring the overlay to front even if a nested overlay is open above it', () => {
      modeless1.opened = true;
      modeless2.opened = true;

      // Mimic nested overlays case
      modeless1.appendChild(modeless2);

      modeless1.bringToFront();

      // Stacking is decoupled from nesting: the overlay is brought to the front
      // even over its own nested overlay.
      expect(modeless1._last).to.be.true;
      const frontmost = getFrontmostOverlayFromScreenCenter();
      expect(frontmost).to.equal(modeless1);
    });

    it('should not call showPopover on bringToFront for the last open overlay', () => {
      modeless2.opened = true;
      modeless2.opened = true;

      const showSpy2 = sinon.spy(modeless2, 'showPopover');

      modeless2.bringToFront();

      expect(showSpy2).to.be.not.called;

      expect(modeless2._last).to.be.true;
    });
  });
});
