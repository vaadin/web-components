import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@vaadin/testing-helpers';
import { _PositionMixin } from '../src/vaadin-overlay-position-mixin.js';
import { OverlayElement } from '../src/vaadin-overlay.js';
import '../vaadin-overlay.js';

class PositionedOverlay extends _PositionMixin(OverlayElement) {
  static get is() {
    return 'vaadin-positioned-overlay';
  }
}

customElements.define(PositionedOverlay.is, PositionedOverlay);

describe('position target', () => {
  const TOP = 'top';
  const BOTTOM = 'bottom';
  const START = 'start';
  const END = 'end';
  const LEFT = 'left';
  const RIGHT = 'right';

  let target, overlay, overlayContent;
  let margin;

  // top or left coordinates for position target
  let targetPositionToFlipOverlay, targetPositionForCentering;

  function updatePosition() {
    overlay._updatePosition();
  }

  function expectEdgesAligned(overlayEdge, targetEdge) {
    expect(overlayContent.getBoundingClientRect()[overlayEdge]).to.be.closeTo(
      target.getBoundingClientRect()[targetEdge],
      1
    );
  }

  function setRTL() {
    overlay.setAttribute('dir', 'rtl');
  }

  beforeEach(() => {
    const parent = fixtureSync(`
      <div id="parent">
        <div id="target" style="position: fixed; top: 100px; left: 100px; width: 20px; height: 20px; border: 1px solid">
          target
        </div>
        <vaadin-positioned-overlay id="overlay">
          <template>
            <div id="overlay-child" style="width: 50px; height: 50px;"></div>
          </template>
        </vaadin-positioned-overlay>
      </div>
    `);
    target = parent.querySelector('#target');
    overlay = parent.querySelector('#overlay');
    overlayContent = overlay.$.overlay;
    overlay.positionTarget = target;
    overlay.opened = true;
  });

  afterEach(() => {
    overlay.opened = false;
  });

  it('should update position when setting position target', () => {
    overlay.positionTarget = undefined;
    target.style.top = '5px';
    target.style.left = '10px';
    overlay.positionTarget = target;
    expectEdgesAligned(TOP, TOP);
    expectEdgesAligned(LEFT, LEFT);
  });

  it('should update position on open', () => {
    overlay.opened = false;
    target.style.top = '5px';
    target.style.left = '10px';
    overlay.opened = true;
    expectEdgesAligned(TOP, TOP);
    expectEdgesAligned(LEFT, LEFT);
  });

  ['scroll', 'resize'].forEach((event) => {
    it(`should update position on ${event}`, () => {
      target.style.top = '5px';
      target.style.left = '10px';
      window.dispatchEvent(new Event(event));
      expectEdgesAligned(TOP, TOP);
      expectEdgesAligned(LEFT, LEFT);
    });
  });

  it('should remove listeners on close', () => {
    const spy = sinon.spy(window, 'removeEventListener');
    overlay.opened = false;
    expect(spy.calledWith('scroll')).to.be.true;
    expect(spy.calledWith('resize')).to.be.true;
  });

  describe('vertical align top', () => {
    beforeEach(() => {
      overlay.verticalAlign = TOP;
      margin = parseInt(getComputedStyle(overlay).bottom, 10);
      targetPositionToFlipOverlay = document.documentElement.clientHeight - overlayContent.clientHeight - margin;
      targetPositionForCentering = document.documentElement.clientHeight / 2 - target.clientHeight / 2;
    });

    it('should align top edges', () => {
      expectEdgesAligned(TOP, TOP);
    });

    it('should flip to align bottom when out of space', () => {
      target.style.top = targetPositionToFlipOverlay + 3 + 'px';
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);
    });

    it('should flip when out of space and squeezed smaller than current available space', () => {
      target.style.top = targetPositionToFlipOverlay + 3 + 'px';

      // Move overlay a bit further, which causes it to squeeze smaller than its current available space.
      // This may happen in certain window resize scenarios.
      overlay.style.top = targetPositionToFlipOverlay + 6 + 'px';
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);
    });

    it('should flip back to default when it fits again', () => {
      target.style.top = targetPositionToFlipOverlay + 3 + 'px';
      updatePosition();
      target.style.top = targetPositionToFlipOverlay - 3 + 'px';
      updatePosition();
      expectEdgesAligned(TOP, TOP);
    });

    it('should choose the bigger side when it fits neither', () => {
      overlayContent.style.height = document.documentElement.clientHeight + 'px';

      target.style.top = targetPositionForCentering - 3 + 'px';
      updatePosition();
      expectEdgesAligned(TOP, TOP);

      target.style.top = targetPositionForCentering + 3 + 'px';
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);
    });

    describe('no overlap', () => {
      beforeEach(() => {
        overlay.noVerticalOverlap = true;
        targetPositionToFlipOverlay =
          document.documentElement.clientHeight - overlayContent.clientHeight - margin - target.clientHeight;
      });

      it('should align below the target', () => {
        expectEdgesAligned(TOP, BOTTOM);
      });

      it('should flip to align bottom when out of space', () => {
        target.style.top = targetPositionToFlipOverlay + 3 + 'px';
        updatePosition();
        expectEdgesAligned(BOTTOM, TOP);
      });

      it('should flip back to default when it fits again', () => {
        target.style.top = targetPositionToFlipOverlay + 3 + 'px';
        updatePosition();
        target.style.top = targetPositionToFlipOverlay - 3 + 'px';
        updatePosition();
        expectEdgesAligned(TOP, BOTTOM);
      });

      it('should choose the bigger side when fits neither', () => {
        overlayContent.style.height = document.documentElement.clientHeight + 'px';

        target.style.top = targetPositionForCentering - 3 + 'px';
        updatePosition();
        expectEdgesAligned(TOP, BOTTOM);

        target.style.top = targetPositionForCentering + 3 + 'px';
        updatePosition();
        expectEdgesAligned(BOTTOM, TOP);
      });
    });
  });

  describe('vertical align bottom', () => {
    beforeEach(() => {
      overlay.verticalAlign = BOTTOM;
      margin = parseInt(getComputedStyle(overlay).top, 10);
      targetPositionToFlipOverlay = margin + overlayContent.clientHeight - target.clientHeight;
      targetPositionForCentering = document.documentElement.clientHeight / 2 - target.clientHeight / 2;
    });

    it('should align bottom edges', () => {
      expectEdgesAligned(BOTTOM, BOTTOM);
    });

    it('should flip to align top when out of space', () => {
      target.style.top = targetPositionToFlipOverlay - 3 + 'px';
      updatePosition();
      expectEdgesAligned(TOP, TOP);
    });

    it('should flip when out of space and squeezed smaller than current available space', () => {
      target.style.top = targetPositionToFlipOverlay - 3 + 'px';

      // Move overlay a bit further, which causes it to squeeze smaller than its current available space.
      // This may happen in certain window resize scenarios.
      overlay.style.bottom =
        document.documentElement.clientHeight - targetPositionToFlipOverlay - target.clientHeight + 6 + 'px';
      updatePosition();
      expectEdgesAligned(TOP, TOP);
    });

    it('should flip back to default when it fits again', () => {
      target.style.top = targetPositionToFlipOverlay - 3 + 'px';
      updatePosition();
      target.style.top = targetPositionToFlipOverlay + 3 + 'px';
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);
    });

    it('should choose the bigger side when it fits neither', () => {
      overlayContent.style.height = document.documentElement.clientHeight + 'px';

      target.style.top = targetPositionForCentering + 3 + 'px';
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);

      target.style.top = targetPositionForCentering - 3 + 'px';
      updatePosition();
      expectEdgesAligned(TOP, TOP);
    });

    describe('no overlap', () => {
      beforeEach(() => {
        overlay.noVerticalOverlap = true;
        targetPositionToFlipOverlay = margin + overlayContent.clientHeight;
      });

      it('should align above the target', () => {
        expectEdgesAligned(BOTTOM, TOP);
      });

      it('should flip to align bottom when out of space', () => {
        target.style.top = targetPositionToFlipOverlay - 3 + 'px';
        updatePosition();
        expectEdgesAligned(TOP, BOTTOM);
      });

      it('should flip back to default when it fits again', () => {
        target.style.top = targetPositionToFlipOverlay - 3 + 'px';
        updatePosition();
        target.style.top = targetPositionToFlipOverlay + 3 + 'px';
        updatePosition();
        expectEdgesAligned(BOTTOM, TOP);
      });

      it('should choose the bigger side when fits neither', () => {
        overlayContent.style.height = document.documentElement.clientHeight + 'px';

        target.style.top = targetPositionForCentering + 3 + 'px';
        updatePosition();
        expectEdgesAligned(BOTTOM, TOP);

        target.style.top = targetPositionForCentering - 3 + 'px';
        updatePosition();
        expectEdgesAligned(TOP, BOTTOM);
      });
    });
  });

  describe('horizontal align start', () => {
    beforeEach(() => {
      overlay.horizontalAlign = START;
      margin = parseInt(getComputedStyle(overlay).right, 10);
      targetPositionToFlipOverlay = document.documentElement.clientWidth - overlayContent.clientWidth - margin;
      targetPositionForCentering = document.documentElement.clientWidth / 2 - target.clientWidth / 2;
    });

    it('should align left edges', () => {
      expectEdgesAligned(LEFT, LEFT);
    });

    it('should align right edges with right-to-left', () => {
      overlay.setAttribute('dir', 'rtl');
      updatePosition();
      expectEdgesAligned(RIGHT, RIGHT);
    });

    it('should flip to align end when out of space', () => {
      target.style.left = targetPositionToFlipOverlay + 3 + 'px';
      updatePosition();
      expectEdgesAligned(RIGHT, RIGHT);
    });

    it('should flip when out of space and squeezed smaller than current available space', () => {
      target.style.left = targetPositionToFlipOverlay + 3 + 'px';

      // Move overlay a bit further, which causes it to squeeze smaller than its current available space.
      // This may happen in certain window resize scenarios.
      overlay.style.left = targetPositionToFlipOverlay + 6 + 'px';
      updatePosition();
      expectEdgesAligned(RIGHT, RIGHT);
    });

    it('should flip back to default when it fits again', () => {
      target.style.left = targetPositionToFlipOverlay + 3 + 'px';
      updatePosition();
      target.style.left = targetPositionToFlipOverlay - 3 + 'px';
      updatePosition();
      expectEdgesAligned(LEFT, LEFT);
    });

    it('should choose the bigger side when it fits neither', () => {
      overlayContent.style.width = document.documentElement.clientWidth + 'px';

      target.style.left = targetPositionForCentering - 3 + 'px';
      updatePosition();
      expectEdgesAligned(LEFT, LEFT);

      target.style.left = targetPositionForCentering + 3 + 'px';
      updatePosition();
      expectEdgesAligned(RIGHT, RIGHT);
    });

    describe('no overlap', () => {
      beforeEach(() => {
        overlay.noHorizontalOverlap = true;
        targetPositionToFlipOverlay =
          document.documentElement.clientWidth - overlayContent.clientWidth - margin - target.clientWidth;
      });

      it('should align on the right side of the target', () => {
        expectEdgesAligned(LEFT, RIGHT);
      });

      it('should flip to align end when out of space', () => {
        target.style.left = targetPositionToFlipOverlay + 3 + 'px';
        updatePosition();
        expectEdgesAligned(RIGHT, LEFT);
      });

      it('should flip back to default when it fits again', () => {
        target.style.left = targetPositionToFlipOverlay + 3 + 'px';
        updatePosition();
        target.style.left = targetPositionToFlipOverlay - 3 + 'px';
        updatePosition();
        expectEdgesAligned(LEFT, RIGHT);
      });

      it('should choose the bigger side when fits neither', () => {
        overlayContent.style.width = document.documentElement.clientWidth + 'px';

        target.style.left = targetPositionForCentering - 3 + 'px';
        updatePosition();
        expectEdgesAligned(LEFT, RIGHT);

        target.style.left = targetPositionForCentering + 3 + 'px';
        updatePosition();
        expectEdgesAligned(RIGHT, LEFT);
      });
    });
  });

  describe('horizontal align end', () => {
    beforeEach(() => {
      overlay.horizontalAlign = END;
      margin = parseInt(getComputedStyle(overlay).left, 10);
      targetPositionToFlipOverlay = margin + overlayContent.clientWidth - target.clientWidth;
      targetPositionForCentering = document.documentElement.clientWidth / 2 - target.clientWidth / 2;
    });

    it('should align right edges', () => {
      expectEdgesAligned(RIGHT, RIGHT);
    });

    it('should align left edges with right-to-left', () => {
      setRTL();
      updatePosition();
      expectEdgesAligned(LEFT, LEFT);
    });

    it('should flip to align start when out of space', () => {
      target.style.left = targetPositionToFlipOverlay - 3 + 'px';
      updatePosition();
      expectEdgesAligned(LEFT, LEFT);
    });

    it('should flip when out of space and squeezed smaller than current available space', () => {
      target.style.left = targetPositionToFlipOverlay - 3 + 'px';

      // Move overlay a bit further, which causes it to squeeze smaller than its current available space.
      // This may happen in certain window resize scenarios.
      overlay.style.right =
        document.documentElement.clientWidth - targetPositionToFlipOverlay - target.clientWidth + 6 + 'px';
      updatePosition();
      expectEdgesAligned(LEFT, LEFT);
    });

    it('should flip back to default when it fits again', () => {
      target.style.left = targetPositionToFlipOverlay - 3 + 'px';
      updatePosition();
      target.style.left = targetPositionToFlipOverlay + 3 + 'px';
      updatePosition();
      expectEdgesAligned(RIGHT, RIGHT);
    });

    it('should choose the bigger side when it fits neither', () => {
      overlayContent.style.width = document.documentElement.clientWidth + 'px';

      target.style.left = targetPositionForCentering + 3 + 'px';
      updatePosition();
      expectEdgesAligned(RIGHT, RIGHT);

      target.style.left = targetPositionForCentering - 3 + 'px';
      updatePosition();
      expectEdgesAligned(LEFT, LEFT);
    });

    describe('no overlap', () => {
      beforeEach(() => {
        overlay.noHorizontalOverlap = true;
        targetPositionToFlipOverlay = margin + overlayContent.clientWidth;
      });

      it('should align on the left side of the target', () => {
        expectEdgesAligned(RIGHT, LEFT);
      });

      it('should flip to align start when out of space', () => {
        target.style.left = targetPositionToFlipOverlay - 3 + 'px';
        updatePosition();
        expectEdgesAligned(LEFT, RIGHT);
      });

      it('should flip back to default when it fits again', () => {
        target.style.left = targetPositionToFlipOverlay - 3 + 'px';
        updatePosition();
        target.style.left = targetPositionToFlipOverlay + 3 + 'px';
        updatePosition();
        expectEdgesAligned(RIGHT, LEFT);
      });

      it('should choose the bigger side when fits neither', () => {
        overlayContent.style.width = document.documentElement.clientWidth + 'px';

        target.style.left = targetPositionForCentering + 3 + 'px';
        updatePosition();
        expectEdgesAligned(RIGHT, LEFT);

        target.style.left = targetPositionForCentering - 3 + 'px';
        updatePosition();
        expectEdgesAligned(LEFT, RIGHT);
      });
    });
  });
});
