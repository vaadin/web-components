import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import './position-mixin-styles.js';
import './position-mixin-element.js';

describe('position mixin', () => {
  const TOP = 'top';
  const BOTTOM = 'bottom';
  const START = 'start';
  const END = 'end';
  const LEFT = 'left';
  const RIGHT = 'right';

  let parent, target, overlay, overlayContent;
  let margin;

  // Top or left coordinates for position target
  let targetPositionToFlipOverlay, targetPositionForCentering;

  function updatePosition() {
    overlay._updatePosition();
  }

  function expectEdgesAligned(overlayEdge, targetEdge) {
    expect(overlayContent.getBoundingClientRect()[overlayEdge]).to.be.closeTo(
      target.getBoundingClientRect()[targetEdge],
      1,
    );
  }

  beforeEach(async () => {
    parent = fixtureSync(`
      <div id="parent">
        <div id="target" style="position: fixed; top: 100px; left: 100px; width: 20px; height: 20px; border: 1px solid">
          target
        </div>
        <vaadin-positioned-overlay id="overlay"></vaadin-positioned-overlay>
      </div>
    `);
    target = parent.querySelector('#target');
    overlay = parent.querySelector('#overlay');
    overlay.owner = parent;
    overlay.renderer = (root) => {
      if (!root.firstChild) {
        const div = document.createElement('div');
        div.id = 'overlay-child';
        div.style.width = '50px';
        div.style.height = '50px';
        root.appendChild(div);
      }
    };
    await nextRender();
    overlayContent = overlay.$.overlay;
    overlay.positionTarget = target;
    overlay.opened = true;
    await oneEvent(overlay, 'vaadin-overlay-open');
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

  it('should not lose scroll position on overlay position update', () => {
    // Move the target to the center of the viewport
    target.style.top = '50vh';
    // Increase the height of the child to make the overlay scrollable
    overlay.querySelector('#overlay-child').style.height = '100vh';

    // Scroll the overlay
    overlay.$.overlay.scrollTop = 100;

    updatePosition();

    // Expect the overlay to be scrolled to the same position
    expect(overlay.$.overlay.scrollTop).to.equal(100);
  });

  it('should close overlay if element is hidden', async () => {
    target.style.display = 'none';
    await nextRender();
    expect(overlay.opened).to.be.false;
  });

  it('should close overlay if parent element is hidden', async () => {
    target.parentElement.style.display = 'none';
    await nextRender();
    expect(overlay.opened).to.be.false;
  });

  it('should reset styles when positionTarget is reset', async () => {
    overlay.positionTarget = null;
    await nextRender();

    expect(overlay.style.top).to.equal('');
    expect(overlay.style.bottom).to.equal('');
    expect(overlay.style.left).to.equal('');
    expect(overlay.style.right).to.equal('');
    expect(overlay.style.alignItems).to.equal('');
    expect(overlay.style.justifyContent).to.equal('');
  });

  it('should reset styles when positionTarget is set', async () => {
    overlay.positionTarget = null;
    overlay.opened = false;
    await nextRender();

    overlay.opened = true;
    await oneEvent(overlay, 'vaadin-overlay-open');

    // Mimic context-menu logic that modifies styles
    overlay.style.top = '100px';
    overlay.style.bottom = '100px';
    overlay.style.left = '100px';
    overlay.style.right = '100px';

    overlay.opened = false;
    overlay.positionTarget = target;
    await nextRender();

    expect(overlay.style.top).to.equal('');
    expect(overlay.style.bottom).to.equal('');
    expect(overlay.style.left).to.equal('');
    expect(overlay.style.right).to.equal('');
  });

  describe('vertical align top', () => {
    beforeEach(() => {
      overlay.verticalAlign = TOP;
      margin = parseInt(getComputedStyle(overlay).bottom, 10);
      targetPositionToFlipOverlay = document.documentElement.clientHeight - overlayContent.offsetHeight - margin;
      targetPositionForCentering = document.documentElement.clientHeight / 2 - target.clientHeight / 2;
    });

    it('should align top edges', () => {
      expectEdgesAligned(TOP, TOP);
    });

    it('should set top-aligned attribute', () => {
      expect(overlay.hasAttribute('top-aligned')).to.be.true;
      expect(overlay.hasAttribute('bottom-aligned')).to.be.false;
      expect(parent.hasAttribute('top-aligned')).to.be.true;
      expect(parent.hasAttribute('bottom-aligned')).to.be.false;
    });

    it('should remove top-aligned attribute when positionTarget is reset', async () => {
      overlay.positionTarget = null;
      await nextRender();
      expect(overlay.hasAttribute('top-aligned')).to.be.false;
      expect(parent.hasAttribute('top-aligned')).to.be.false;
    });

    it('should align top edges when overlay part is animated', async () => {
      overlay.classList.add('animated');
      await oneEvent(overlay.$.overlay, 'animationend');
      expectEdgesAligned(TOP, TOP);
    });

    it('should flip to align bottom when out of space', () => {
      target.style.top = `${targetPositionToFlipOverlay + 3}px`;
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);
    });

    it('should set bottom-aligned attribute when out of space', () => {
      target.style.top = `${targetPositionToFlipOverlay + 3}px`;
      updatePosition();
      expect(overlay.hasAttribute('top-aligned')).to.be.false;
      expect(overlay.hasAttribute('bottom-aligned')).to.be.true;
      expect(parent.hasAttribute('top-aligned')).to.be.false;
      expect(parent.hasAttribute('bottom-aligned')).to.be.true;
    });

    it('should bottom top-aligned attribute when positionTarget is reset', async () => {
      target.style.top = `${targetPositionToFlipOverlay + 3}px`;
      updatePosition();

      overlay.positionTarget = null;
      await nextRender();
      expect(overlay.hasAttribute('bottom-aligned')).to.be.false;
      expect(parent.hasAttribute('bottom-aligned')).to.be.false;
    });

    it('should flip when out of space and squeezed smaller than current available space', () => {
      target.style.top = `${targetPositionToFlipOverlay + 3}px`;

      // Move overlay a bit further, which causes it to squeeze smaller than its current available space.
      // This may happen in certain window resize scenarios.
      overlay.style.top = `${targetPositionToFlipOverlay + 6}px`;
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);
    });

    it('should flip back to default when it fits again', () => {
      target.style.top = `${targetPositionToFlipOverlay + 3}px`;
      updatePosition();
      target.style.top = `${targetPositionToFlipOverlay - 3}px`;
      updatePosition();
      expectEdgesAligned(TOP, TOP);
    });

    it('should flip when out of required vertical space', () => {
      overlay.requiredVerticalSpace = 200;
      target.style.top = `${targetPositionToFlipOverlay - 100}px`;
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);
    });

    it('should flip back when enough required vertical space', () => {
      overlay.requiredVerticalSpace = 200;
      target.style.top = `${targetPositionToFlipOverlay - 100}px`;
      updatePosition();
      target.style.top = `${targetPositionToFlipOverlay - 200}px`;
      updatePosition();
      expectEdgesAligned(TOP, TOP);
    });

    it('should choose the bigger side when it fits neither', () => {
      overlayContent.style.height = `${document.documentElement.clientHeight}px`;

      target.style.top = `${targetPositionForCentering - 3}px`;
      updatePosition();
      expectEdgesAligned(TOP, TOP);
      expect(overlay.hasAttribute('top-aligned')).to.be.true;
      expect(parent.hasAttribute('top-aligned')).to.be.true;

      target.style.top = `${targetPositionForCentering + 3}px`;
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);
      expect(overlay.hasAttribute('bottom-aligned')).to.be.true;
      expect(parent.hasAttribute('bottom-aligned')).to.be.true;
    });

    describe('no overlap', () => {
      beforeEach(() => {
        overlay.noVerticalOverlap = true;
        targetPositionToFlipOverlay =
          document.documentElement.clientHeight - overlayContent.offsetHeight - margin - target.clientHeight;
      });

      it('should align below the target', () => {
        expectEdgesAligned(TOP, BOTTOM);
      });

      it('should flip to align bottom when out of space', () => {
        target.style.top = `${targetPositionToFlipOverlay + 3}px`;
        updatePosition();
        expectEdgesAligned(BOTTOM, TOP);
      });

      it('should flip back to default when it fits again', () => {
        target.style.top = `${targetPositionToFlipOverlay + 3}px`;
        updatePosition();
        target.style.top = `${targetPositionToFlipOverlay - 3}px`;
        updatePosition();
        expectEdgesAligned(TOP, BOTTOM);
      });

      it('should choose the bigger side when fits neither', () => {
        overlayContent.style.height = `${document.documentElement.clientHeight}px`;

        target.style.top = `${targetPositionForCentering - 3}px`;
        updatePosition();
        expectEdgesAligned(TOP, BOTTOM);

        target.style.top = `${targetPositionForCentering + 3}px`;
        updatePosition();
        expectEdgesAligned(BOTTOM, TOP);
      });
    });
  });

  describe('vertical align bottom', () => {
    beforeEach(() => {
      overlay.verticalAlign = BOTTOM;
      margin = parseInt(getComputedStyle(overlay).top, 10);
      targetPositionToFlipOverlay = margin + overlayContent.offsetHeight - target.clientHeight;
      targetPositionForCentering = document.documentElement.clientHeight / 2 - target.clientHeight / 2;
    });

    it('should align bottom edges', () => {
      expectEdgesAligned(BOTTOM, BOTTOM);
    });

    it('should flip to align top when out of space', () => {
      target.style.top = `${targetPositionToFlipOverlay - 3}px`;
      updatePosition();
      expectEdgesAligned(TOP, TOP);
    });

    it('should flip when out of space and squeezed smaller than current available space', () => {
      target.style.top = `${targetPositionToFlipOverlay - 3}px`;

      // Move overlay a bit further, which causes it to squeeze smaller than its current available space.
      // This may happen in certain window resize scenarios.
      overlay.style.bottom = `${
        document.documentElement.clientHeight - targetPositionToFlipOverlay - target.clientHeight + 6
      }px`;
      updatePosition();
      expectEdgesAligned(TOP, TOP);
    });

    it('should flip back to default when it fits again', () => {
      target.style.top = `${targetPositionToFlipOverlay - 3}px`;
      updatePosition();
      target.style.top = `${targetPositionToFlipOverlay + 3}px`;
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);
    });

    it('should flip when out of required vertical space', () => {
      overlay.requiredVerticalSpace = 200;
      target.style.top = `${targetPositionToFlipOverlay + 100}px`;
      updatePosition();
      expectEdgesAligned(TOP, TOP);
    });

    it('should flip back when enough required vertical space', () => {
      overlay.requiredVerticalSpace = 200;
      target.style.top = `${targetPositionToFlipOverlay + 100}px`;
      updatePosition();
      target.style.top = `${targetPositionToFlipOverlay + 200}px`;
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);
    });

    it('should choose the bigger side when it fits neither', () => {
      overlayContent.style.height = `${document.documentElement.clientHeight}px`;

      target.style.top = `${targetPositionForCentering + 3}px`;
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);

      target.style.top = `${targetPositionForCentering - 3}px`;
      updatePosition();
      expectEdgesAligned(TOP, TOP);
    });

    describe('no overlap', () => {
      beforeEach(() => {
        overlay.noVerticalOverlap = true;
        targetPositionToFlipOverlay = margin + overlayContent.offsetHeight;
      });

      it('should align above the target', () => {
        expectEdgesAligned(BOTTOM, TOP);
      });

      it('should flip to align bottom when out of space', () => {
        target.style.top = `${targetPositionToFlipOverlay - 3}px`;
        updatePosition();
        expectEdgesAligned(TOP, BOTTOM);
      });

      it('should flip back to default when it fits again', () => {
        target.style.top = `${targetPositionToFlipOverlay - 3}px`;
        updatePosition();
        target.style.top = `${targetPositionToFlipOverlay + 3}px`;
        updatePosition();
        expectEdgesAligned(BOTTOM, TOP);
      });

      it('should choose the bigger side when fits neither', () => {
        overlayContent.style.height = `${document.documentElement.clientHeight}px`;

        target.style.top = `${targetPositionForCentering + 3}px`;
        updatePosition();
        expectEdgesAligned(BOTTOM, TOP);

        target.style.top = `${targetPositionForCentering - 3}px`;
        updatePosition();
        expectEdgesAligned(TOP, BOTTOM);
      });
    });

    describe('window resize', () => {
      let width, height;

      beforeEach(() => {
        overlay.noVerticalOverlap = true;
        width = window.innerWidth;
        height = window.innerHeight;
      });

      afterEach(async () => {
        await setViewport({ width, height });
      });

      it('should adjust vertically on decreasing viewport height', async () => {
        await setViewport({ width, height: height / 2 });

        updatePosition();

        expectEdgesAligned(BOTTOM, TOP);
      });
    });
  });

  describe('visual viewport', () => {
    // Mimics the iOS on-screen keyboard: the layout viewport keeps reporting the full
    // window height, while the visual viewport shrinks to the area above the keyboard.
    const KEYBOARD_HEIGHT = 200;
    let visibleHeight;

    beforeEach(() => {
      visibleHeight = document.documentElement.clientHeight - KEYBOARD_HEIGHT;
      Object.defineProperty(window.visualViewport, 'height', {
        configurable: true,
        get: () => visibleHeight,
      });

      margin = parseInt(getComputedStyle(overlay).bottom, 10);
      targetPositionToFlipOverlay = visibleHeight - overlayContent.offsetHeight - margin;
    });

    afterEach(() => {
      delete window.visualViewport.height;
      delete window.visualViewport.offsetTop;
      delete window.visualViewport.scale;
    });

    // The browser also shrinks the visual viewport when the page is pinch-zoomed,
    // which only pans the rest of the page away instead of hiding it.
    function pinchZoom() {
      Object.defineProperty(window.visualViewport, 'scale', {
        configurable: true,
        get: () => 2,
      });
    }

    it('should flip to align bottom when out of space in the visual viewport', () => {
      target.style.top = `${targetPositionToFlipOverlay + 3}px`;
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);
    });

    it('should flip to align bottom when out of required vertical space', () => {
      overlay.requiredVerticalSpace = 200;
      target.style.top = `${targetPositionToFlipOverlay - 100}px`;
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);
    });

    it('should keep the alignment when the visual viewport grows again', () => {
      target.style.top = `${targetPositionToFlipOverlay + 3}px`;
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);

      visibleHeight = document.documentElement.clientHeight;
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);
    });

    it('should keep the alignment on further updates after the visual viewport grows', () => {
      target.style.top = `${targetPositionToFlipOverlay + 3}px`;
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);

      visibleHeight = document.documentElement.clientHeight;
      updatePosition();

      // Scrolling the overlay causes further updates, which must not change the side
      updatePosition();
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);
    });

    it('should flip back to default when the target moves after the viewport grows', () => {
      target.style.top = `${targetPositionToFlipOverlay + 3}px`;
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);

      visibleHeight = document.documentElement.clientHeight;
      updatePosition();

      // Moving the target is not a change of the visible area, so the side is decided again
      target.style.top = `${targetPositionToFlipOverlay}px`;
      updatePosition();
      expectEdgesAligned(TOP, TOP);
    });

    it('should not flip when there is enough space in the visual viewport', () => {
      target.style.top = `${targetPositionToFlipOverlay - 3}px`;
      updatePosition();
      expectEdgesAligned(TOP, TOP);
    });

    it('should not flip based on the visual viewport when pinch-zoomed', () => {
      pinchZoom();
      target.style.top = `${targetPositionToFlipOverlay + 3}px`;
      updatePosition();
      expectEdgesAligned(TOP, TOP);
    });

    describe('limit to visual viewport', () => {
      beforeEach(() => {
        // Content taller than the whole viewport, so that it has to shrink
        overlay.querySelector('#overlay-child').style.height = `${document.documentElement.clientHeight}px`;
        target.style.top = '0px';
      });

      it('should not extend the overlay below the visible viewport', () => {
        overlay.limitToVisualViewport = true;
        updatePosition();
        expect(overlayContent.getBoundingClientRect().bottom).to.be.at.most(visibleHeight - margin + 1);
      });

      it('should extend the overlay below the visible viewport when not constrained', () => {
        updatePosition();
        expect(overlayContent.getBoundingClientRect().bottom).to.be.above(visibleHeight - margin + 1);
      });

      it('should update position when setting limitToVisualViewport', () => {
        overlay.limitToVisualViewport = true;
        expect(overlayContent.getBoundingClientRect().bottom).to.be.at.most(visibleHeight - margin + 1);
      });

      it('should release the constraint when unsetting limitToVisualViewport', () => {
        overlay.limitToVisualViewport = true;
        overlay.limitToVisualViewport = false;
        expect(overlayContent.getBoundingClientRect().bottom).to.be.above(visibleHeight - margin + 1);
      });

      it('should not constrain the bottom when the visual viewport is only shifted', () => {
        // The bottom of the layout viewport is visible, only the top is out of view,
        // so there is nothing to constrain at the bottom side.
        Object.defineProperty(window.visualViewport, 'offsetTop', {
          configurable: true,
          get: () => KEYBOARD_HEIGHT,
        });

        overlay.limitToVisualViewport = true;
        updatePosition();
        expect(overlayContent.getBoundingClientRect().bottom).to.be.above(visibleHeight - margin + 1);
      });

      it('should not constrain the overlay when pinch-zoomed', () => {
        pinchZoom();
        overlay.limitToVisualViewport = true;
        updatePosition();
        expect(overlayContent.getBoundingClientRect().bottom).to.be.above(visibleHeight - margin + 1);
      });

      it('should release the constraint when the visual viewport grows again', () => {
        overlay.limitToVisualViewport = true;
        updatePosition();
        expect(overlayContent.getBoundingClientRect().bottom).to.be.at.most(visibleHeight - margin + 1);

        visibleHeight = document.documentElement.clientHeight;
        updatePosition();
        expect(overlayContent.getBoundingClientRect().bottom).to.be.closeTo(visibleHeight - margin, 1);
      });

      describe('flipped to the other side', () => {
        beforeEach(() => {
          // The page is shifted up, so that the top of the layout viewport is out of view
          Object.defineProperty(window.visualViewport, 'offsetTop', {
            configurable: true,
            get: () => KEYBOARD_HEIGHT,
          });

          // Move the target down, so that the overlay flips and grows upwards
          target.style.top = `${visibleHeight - 30}px`;
        });

        it('should not extend the overlay above the visible viewport', () => {
          overlay.limitToVisualViewport = true;
          updatePosition();
          expect(overlay.hasAttribute('bottom-aligned')).to.be.true;
          expect(overlayContent.getBoundingClientRect().top).to.be.at.least(KEYBOARD_HEIGHT + margin - 1);
        });

        it('should extend the overlay above the visible viewport when not constrained', () => {
          updatePosition();
          expect(overlay.hasAttribute('bottom-aligned')).to.be.true;
          expect(overlayContent.getBoundingClientRect().top).to.be.below(KEYBOARD_HEIGHT + margin - 1);
        });
      });
    });

    it('should not add the visual viewport offset to the available space', () => {
      // The on-screen keyboard also shifts the page up, which is already reflected
      // by the client rectangles, so the offset must not be added to the height.
      Object.defineProperty(window.visualViewport, 'offsetTop', {
        configurable: true,
        get: () => KEYBOARD_HEIGHT,
      });

      target.style.top = `${targetPositionToFlipOverlay + 3}px`;
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);
    });
  });

  describe('horizontal align start', () => {
    beforeEach(() => {
      overlay.horizontalAlign = START;
      margin = parseInt(getComputedStyle(overlay).right, 10);
      targetPositionToFlipOverlay = document.documentElement.clientWidth - overlayContent.offsetWidth - margin;
      targetPositionForCentering = document.documentElement.clientWidth / 2 - target.clientWidth / 2;
    });

    afterEach(() => {
      document.dir = 'ltr';
    });

    it('should align left edges', () => {
      expectEdgesAligned(LEFT, LEFT);
    });

    it('should set start-aligned attribute', () => {
      expect(overlay.hasAttribute('start-aligned')).to.be.true;
      expect(overlay.hasAttribute('end-aligned')).to.be.false;
      expect(parent.hasAttribute('start-aligned')).to.be.true;
      expect(parent.hasAttribute('end-aligned')).to.be.false;
    });

    it('should remove start-aligned attribute when positionTarget is reset', async () => {
      overlay.positionTarget = null;
      await nextRender();
      expect(overlay.hasAttribute('start-aligned')).to.be.false;
      expect(parent.hasAttribute('start-aligned')).to.be.false;
    });

    it('should align right edges with right-to-left', async () => {
      document.dir = 'rtl';
      await nextRender();
      updatePosition();
      expectEdgesAligned(RIGHT, RIGHT);
    });

    it('should flip to align end when out of space', () => {
      target.style.left = `${targetPositionToFlipOverlay + 3}px`;
      updatePosition();
      expectEdgesAligned(RIGHT, RIGHT);
    });

    it('should set end-aligned attribute when out of space', () => {
      target.style.left = `${targetPositionToFlipOverlay + 3}px`;
      updatePosition();

      expect(overlay.hasAttribute('start-aligned')).to.be.false;
      expect(overlay.hasAttribute('end-aligned')).to.be.true;
      expect(parent.hasAttribute('start-aligned')).to.be.false;
      expect(parent.hasAttribute('end-aligned')).to.be.true;
    });

    it('should remove end-aligned attribute when positionTarget is reset', async () => {
      target.style.left = `${targetPositionToFlipOverlay + 3}px`;
      updatePosition();

      overlay.positionTarget = null;
      await nextRender();
      expect(overlay.hasAttribute('end-aligned')).to.be.false;
      expect(parent.hasAttribute('end-aligned')).to.be.false;
    });

    it('should flip when out of space and squeezed smaller than current available space', () => {
      target.style.left = `${targetPositionToFlipOverlay + 3}px`;

      // Move overlay a bit further, which causes it to squeeze smaller than its current available space.
      // This may happen in certain window resize scenarios.
      overlay.style.left = `${targetPositionToFlipOverlay + 6}px`;
      updatePosition();
      expectEdgesAligned(RIGHT, RIGHT);
    });

    it('should flip back to default when it fits again', () => {
      target.style.left = `${targetPositionToFlipOverlay + 3}px`;
      updatePosition();
      target.style.left = `${targetPositionToFlipOverlay - 3}px`;
      updatePosition();
      expectEdgesAligned(LEFT, LEFT);
    });

    it('should choose the bigger side when it fits neither', () => {
      overlayContent.style.width = `${document.documentElement.clientWidth}px`;

      target.style.left = `${targetPositionForCentering - 3}px`;
      updatePosition();
      expectEdgesAligned(LEFT, LEFT);
      expect(overlay.hasAttribute('start-aligned')).to.be.true;
      expect(parent.hasAttribute('start-aligned')).to.be.true;

      target.style.left = `${targetPositionForCentering + 3}px`;
      updatePosition();
      expectEdgesAligned(RIGHT, RIGHT);
      expect(overlay.hasAttribute('end-aligned')).to.be.true;
      expect(parent.hasAttribute('end-aligned')).to.be.true;
    });

    it('should re-evaluate alignment when positionTarget changes after content shrinks', () => {
      // Make the content wide enough to force a flip at a target position
      // where the narrow content would still fit.
      overlayContent.style.width = '200px';
      const wideFlipThreshold = document.documentElement.clientWidth - 200 - margin;
      target.style.left = `${wideFlipThreshold + 3}px`;
      updatePosition();
      expect(overlay.hasAttribute('end-aligned')).to.be.true;

      // Shrink the content so the same target position fits without a flip.
      overlayContent.style.width = '50px';

      // Switch to a fresh target at the same position. The cached content
      // size from the previous target must not carry over.
      const newTarget = target.cloneNode(true);
      target.parentElement.appendChild(newTarget);
      overlay.positionTarget = newTarget;

      expect(overlay.hasAttribute('start-aligned')).to.be.true;
      expect(overlay.hasAttribute('end-aligned')).to.be.false;
    });

    describe('no overlap', () => {
      beforeEach(() => {
        overlay.noHorizontalOverlap = true;
        targetPositionToFlipOverlay =
          document.documentElement.clientWidth - overlayContent.offsetWidth - margin - target.clientWidth;
      });

      it('should align on the right side of the target', () => {
        expectEdgesAligned(LEFT, RIGHT);
      });

      it('should flip to align end when out of space', () => {
        target.style.left = `${targetPositionToFlipOverlay + 3}px`;
        updatePosition();
        expectEdgesAligned(RIGHT, LEFT);
      });

      it('should flip back to default when it fits again', () => {
        target.style.left = `${targetPositionToFlipOverlay + 3}px`;
        updatePosition();
        target.style.left = `${targetPositionToFlipOverlay - 3}px`;
        updatePosition();
        expectEdgesAligned(LEFT, RIGHT);
      });

      it('should choose the bigger side when fits neither', () => {
        overlayContent.style.width = `${document.documentElement.clientWidth}px`;

        target.style.left = `${targetPositionForCentering - 3}px`;
        updatePosition();
        expectEdgesAligned(LEFT, RIGHT);

        target.style.left = `${targetPositionForCentering + 3}px`;
        updatePosition();
        expectEdgesAligned(RIGHT, LEFT);
      });
    });
  });

  describe('horizontal align end', () => {
    beforeEach(() => {
      overlay.horizontalAlign = END;
      margin = parseInt(getComputedStyle(overlay).left, 10);
      targetPositionToFlipOverlay = margin + overlayContent.offsetWidth - target.clientWidth;
      targetPositionForCentering = document.documentElement.clientWidth / 2 - target.clientWidth / 2;
    });

    afterEach(() => {
      document.dir = 'ltr';
    });

    it('should align right edges', () => {
      expectEdgesAligned(RIGHT, RIGHT);
    });

    it('should set end-aligned attribute', () => {
      expect(overlay.hasAttribute('end-aligned')).to.be.true;
      expect(overlay.hasAttribute('start-aligned')).to.be.false;
      expect(parent.hasAttribute('end-aligned')).to.be.true;
      expect(parent.hasAttribute('start-aligned')).to.be.false;
    });

    it('should align left edges with right-to-left', async () => {
      document.dir = 'rtl';
      await nextRender();
      updatePosition();
      expectEdgesAligned(LEFT, LEFT);
    });

    it('should flip to align start when out of space', () => {
      target.style.left = `${targetPositionToFlipOverlay - 3}px`;
      updatePosition();
      expectEdgesAligned(LEFT, LEFT);
    });

    it('should flip when out of space and squeezed smaller than current available space', () => {
      target.style.left = `${targetPositionToFlipOverlay - 3}px`;

      // Move overlay a bit further, which causes it to squeeze smaller than its current available space.
      // This may happen in certain window resize scenarios.
      overlay.style.right = `${
        document.documentElement.clientWidth - targetPositionToFlipOverlay - target.clientWidth + 6
      }px`;
      updatePosition();
      expectEdgesAligned(LEFT, LEFT);
    });

    it('should flip back to default when it fits again', () => {
      target.style.left = `${targetPositionToFlipOverlay - 3}px`;
      updatePosition();
      target.style.left = `${targetPositionToFlipOverlay + 3}px`;
      updatePosition();
      expectEdgesAligned(RIGHT, RIGHT);
    });

    it('should choose the bigger side when it fits neither', () => {
      overlayContent.style.width = `${document.documentElement.clientWidth}px`;

      target.style.left = `${targetPositionForCentering + 3}px`;
      updatePosition();
      expectEdgesAligned(RIGHT, RIGHT);

      target.style.left = `${targetPositionForCentering - 3}px`;
      updatePosition();
      expectEdgesAligned(LEFT, LEFT);
    });

    describe('no overlap', () => {
      beforeEach(() => {
        overlay.noHorizontalOverlap = true;
        targetPositionToFlipOverlay = margin + overlayContent.offsetWidth;
      });

      it('should align on the left side of the target', () => {
        expectEdgesAligned(RIGHT, LEFT);
      });

      it('should flip to align start when out of space', () => {
        target.style.left = `${targetPositionToFlipOverlay - 3}px`;
        updatePosition();
        expectEdgesAligned(LEFT, RIGHT);
      });

      it('should flip back to default when it fits again', () => {
        target.style.left = `${targetPositionToFlipOverlay - 3}px`;
        updatePosition();
        target.style.left = `${targetPositionToFlipOverlay + 3}px`;
        updatePosition();
        expectEdgesAligned(RIGHT, LEFT);
      });

      it('should choose the bigger side when fits neither', () => {
        overlayContent.style.width = `${document.documentElement.clientWidth}px`;

        target.style.left = `${targetPositionForCentering + 3}px`;
        updatePosition();
        expectEdgesAligned(RIGHT, LEFT);

        target.style.left = `${targetPositionForCentering - 3}px`;
        updatePosition();
        expectEdgesAligned(LEFT, RIGHT);
      });
    });

    describe('window resize', () => {
      let width, height;

      beforeEach(() => {
        overlay.noHorizontalOverlap = true;
        width = window.innerWidth;
        height = window.innerHeight;
      });

      afterEach(async () => {
        await setViewport({ width, height });
      });

      it('should adjust horizontally on decreasing viewport width', async () => {
        await setViewport({ width: width / 2, height });

        updatePosition();

        expectEdgesAligned(RIGHT, LEFT);
      });
    });
  });
});

describe('opened before attach', () => {
  let parent, overlay, target;

  beforeEach(() => {
    parent = fixtureSync(`
      <div>
        <div id="target"></div>
      </div>
    `);
    target = parent.firstElementChild;
  });

  it('should not throw when adding pre-opened overlay to the DOM', async () => {
    overlay = document.createElement('vaadin-positioned-overlay');
    overlay.owner = parent;
    overlay.positionTarget = target;
    overlay.opened = true;

    parent.appendChild(overlay);
    await oneEvent(overlay, 'vaadin-overlay-open');

    expect(overlay.hasAttribute('start-aligned')).to.be.true;
    expect(parent.hasAttribute('start-aligned')).to.be.true;
  });
});
