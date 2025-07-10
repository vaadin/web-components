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

  let target, overlay, overlayContent;
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
    const parent = fixtureSync(`
      <div id="parent">
        <div id="target" style="position: fixed; top: 100px; left: 100px; width: 20px; height: 20px; border: 1px solid">
          target
        </div>
        <vaadin-positioned-overlay id="overlay"></vaadin-positioned-overlay>
      </div>
    `);
    target = parent.querySelector('#target');
    overlay = parent.querySelector('#overlay');
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

      target.style.top = `${targetPositionForCentering + 3}px`;
      updatePosition();
      expectEdgesAligned(BOTTOM, BOTTOM);
      expect(overlay.hasAttribute('bottom-aligned')).to.be.true;
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

      target.style.left = `${targetPositionForCentering + 3}px`;
      updatePosition();
      expectEdgesAligned(RIGHT, RIGHT);
      expect(overlay.hasAttribute('end-aligned')).to.be.true;
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

    overlay.positionTarget = target;
    overlay.opened = true;

    parent.appendChild(overlay);
    await oneEvent(overlay, 'vaadin-overlay-open');

    expect(overlay.hasAttribute('start-aligned')).to.be.true;
  });
});
