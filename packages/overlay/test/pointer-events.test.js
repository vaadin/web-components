import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '../src/vaadin-overlay.js';
import { createOverlay } from './helpers.js';

describe('pointer-events', () => {
  describe('single overlay', () => {
    let overlay;

    beforeEach(async () => {
      overlay = createOverlay('overlay content');
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should not prevent clicking elements outside overlay when modeless (non-modal)', () => {
      overlay.modeless = true;
      expect(document.body.style.pointerEvents).to.eql('');
    });

    it('should prevent clicking elements outside overlay when modal', () => {
      expect(document.body.style.pointerEvents).to.eql('none');
    });

    it('should not prevent clicking document elements after modal is closed', () => {
      overlay.opened = false;
      expect(document.body.style.pointerEvents).to.eql('');
    });

    it('should allow pointer events on the overlayPart while skipping on the host', () => {
      expect(getComputedStyle(overlay.$.overlay).pointerEvents).to.equal('auto');
      expect(getComputedStyle(overlay).pointerEvents).to.equal('none');
    });
  });

  describe('multiple modal overlays', () => {
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

    it('should restore pointer-events correctly when overlays are not closed in order', () => {
      overlay1.opened = true;

      overlay2.opened = true;
      expect(document.body.style.pointerEvents).to.eql('none');

      overlay1.opened = false;

      overlay2.opened = false;
      expect(document.body.style.pointerEvents).to.eql('');
    });

    it('should disable pointer-events in first overlay when second opens', () => {
      overlay1.opened = true;

      overlay2.opened = true;

      expect(getComputedStyle(overlay1.$.overlay).pointerEvents).to.equal('none');
    });

    it('should restore pointer-events in first overlay when second closes', () => {
      overlay1.opened = true;

      overlay2.opened = true;

      overlay2.opened = false;
      expect(getComputedStyle(overlay1.$.overlay).pointerEvents).to.equal('auto');
    });

    it('should restore pointer-events in second overlay when third closes', () => {
      overlay1.opened = true;

      overlay2.opened = true;

      overlay3.opened = true;

      overlay3.opened = false;

      expect(getComputedStyle(overlay2.$.overlay).pointerEvents).to.equal('auto');
      expect(getComputedStyle(overlay1.$.overlay).pointerEvents).to.equal('none');
    });

    it('should clear pointer events after closing overlays', () => {
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
      expect(getComputedStyle(overlay1.$.overlay).pointerEvents).to.equal('auto');
    });

    it('should disable pointer events on slotted content of the covered overlay', () => {
      const button = document.createElement('button');
      button.setAttribute('style', 'pointer-events: auto');
      overlay1.appendChild(button);

      overlay1.opened = true;

      overlay2.opened = true;

      expect(getComputedStyle(button).pointerEvents).to.equal('none');
    });

    it('should restore pointer events on slotted content when the top overlay closes', () => {
      const button = document.createElement('button');
      button.setAttribute('style', 'pointer-events: auto');
      overlay1.appendChild(button);

      overlay1.opened = true;

      overlay2.opened = true;

      overlay2.opened = false;
      expect(getComputedStyle(button).pointerEvents).to.equal('auto');
    });
  });
});
