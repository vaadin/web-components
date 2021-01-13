import { expect } from '@esm-bundle/chai';
import { fixtureSync, aTimeout } from '@open-wc/testing-helpers';
import {
  makeSoloTouchEvent,
  middleOfNode,
  touchstart,
  touchend,
  track
} from '@polymer/iron-test-helpers/mock-interactions.js';
import sinon from 'sinon';
import '../vaadin-split-layout.js';

const touchDevice = (() => {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
})();

function trackWithTouchSupport(node, dx, dy, steps) {
  dx = dx | 0;
  dy = dy | 0;
  steps = steps || 5;
  if (touchDevice) {
    var xy = middleOfNode(node);
    touchstart(node, xy);
    for (var i = 0; i <= steps; i++) {
      makeSoloTouchEvent(
        'touchmove',
        {
          x: xy.x + (dx * i) / steps,
          y: xy.y + (dy * i) / steps
        },
        node
      );
    }
    touchend(node, { x: xy.x + dx, y: xy.y + dy });
  } else {
    track(splitLayout.$.splitter, dx, dy, steps);
  }
}

const initialSizes = { width: 128, height: 128 };

let splitLayout, first, second;

describe('split layout', () => {
  beforeEach(() => {
    splitLayout = fixtureSync(`
      <vaadin-split-layout>
        <div id="first">some content</div>
        <div id="second">some content</div>
      </vaadin-split-layout>
    `);
  });

  describe('container', () => {
    it('should be a flex container', () => {
      expect(getComputedStyle(splitLayout).display).to.equal('flex');
    });
  });

  describe('splitter', () => {
    it('should have overflow visible', () => {
      expect(getComputedStyle(splitLayout.$.splitter).overflow).to.equal('visible');
    });
  });

  describe('content elements', () => {
    let splitter;

    beforeEach(async () => {
      await aTimeout(0);
      first = splitLayout.$.primary.assignedNodes({ flatten: true })[0];
      second = splitLayout.$.secondary.assignedNodes({ flatten: true })[0];
      splitter = splitLayout.$.splitter;
    });

    it('should be distributed', () => {
      expect(first.id).to.equal('first');
      expect(second.id).to.equal('second');
      expect(first.parentNode).to.equal(splitLayout);
      expect(second.parentNode).to.equal(splitLayout);
    });

    it('should have flex auto', () => {
      function getComputedFlexStyle(el) {
        const style = getComputedStyle(el);
        return style.flex || [style.flexGrow, style.flexShrink, style.flexBasis].join(' ');
      }
      expect(getComputedFlexStyle(first)).to.equal('1 1 auto');
      expect(getComputedFlexStyle(second)).to.equal('1 1 auto');
    });

    it('should have a splitter in between', () => {
      const previous = splitter.previousElementSibling;
      const next = splitter.nextElementSibling;
      expect(previous.assignedNodes({ flatten: true })[0]).to.equal(first);
      expect(next.assignedNodes({ flatten: true })[0]).to.equal(second);
    });

    it('should set pointer-events: none on down event and restore on up event', () => {
      first.style.pointerEvents = 'visible';
      second.style.pointerEvents = 'visible';

      splitter.dispatchEvent(new Event('down', { bubbles: true }));
      expect(getComputedStyle(first).pointerEvents).to.equal('none');
      expect(getComputedStyle(second).pointerEvents).to.equal('none');

      splitter.dispatchEvent(new Event('up', { bubbles: true }));
      expect(getComputedStyle(first).pointerEvents).to.equal('visible');
      expect(getComputedStyle(second).pointerEvents).to.equal('visible');
    });
  });
});

function testDimensions(isVertical) {
  const size = isVertical ? 'height' : 'width';
  const crossSize = isVertical ? 'width' : 'height';
  let splitLayoutRect;

  beforeEach(() => {
    splitLayoutRect = splitLayout.getBoundingClientRect();
  });

  describe('content elements', () => {
    let firstRect, secondRect;

    beforeEach(() => {
      firstRect = first.getBoundingClientRect();
      secondRect = second.getBoundingClientRect();
    });

    it('should have equal initial size', () => {
      expect(Math.abs(firstRect[size] - secondRect[size])).to.be.at.most(1);
    });

    it('should have have crossSize of container', () => {
      expect(firstRect[crossSize]).to.equal(splitLayoutRect[crossSize]);
    });

    it('should respect initial css size', () => {
      const initialTotalSize = initialSizes[size] - 8;
      const cssPrimarySize = 0.25;
      const cssSecondarySize = 1 - cssPrimarySize;
      first.style[size] = cssPrimarySize * 100 + '%';
      second.style[size] = cssSecondarySize * 100 + '%';

      expect(Math.abs(first.getBoundingClientRect()[size] / initialTotalSize - cssPrimarySize)).to.be.at.most(0.01);
      expect(Math.abs(second.getBoundingClientRect()[size] / initialTotalSize - cssSecondarySize)).to.be.at.most(0.01);
    });
  });

  describe('splitter', () => {
    let splitterRect;

    beforeEach(() => {
      splitterRect = splitLayout.$.splitter.getBoundingClientRect();
    });

    it('should have size of 8', () => {
      expect(splitterRect[size]).to.be.within(7.5, 8.5);
    });

    it('should have crossSize of container', () => {
      expect(splitterRect[crossSize]).to.equal(splitLayoutRect[crossSize]);
    });
  });

  describe('handle drag', () => {
    const distance = 30;
    const initialSize = (initialSizes[size] - 8) / 2;

    function dragHandle(d) {
      trackWithTouchSupport(splitLayout.$.splitter, isVertical ? 0 : d, isVertical ? d : 0);
    }

    it('should resize forwards', () => {
      dragHandle(distance);

      expect(Math.abs(first.getBoundingClientRect()[size] - (initialSize + distance))).to.be.at.most(1);
      expect(Math.abs(second.getBoundingClientRect()[size] - (initialSize - distance))).to.be.at.most(1);
    });

    it('should resize backwards', () => {
      dragHandle(distance);
      dragHandle(-distance);

      expect(Math.abs(first.getBoundingClientRect()[size] - initialSize)).to.be.at.most(1);
      expect(Math.abs(second.getBoundingClientRect()[size] - initialSize)).to.be.at.most(1);
    });

    it('should collapse primary', () => {
      dragHandle(-initialSize);

      expect(first.getBoundingClientRect()[size]).to.equal(0);
    });

    it('should reveal primary', () => {
      dragHandle(-initialSize);
      dragHandle(initialSize);

      expect(Math.abs(first.getBoundingClientRect()[size] - initialSize)).to.be.at.most(1);
    });

    it('should collapse secondary', () => {
      dragHandle(initialSize);

      expect(second.getBoundingClientRect()[size]).to.equal(0);
    });

    it('should reveal secondary', () => {
      dragHandle(initialSize);
      dragHandle(-initialSize);

      expect(Math.abs(second.getBoundingClientRect()[size] - initialSize)).to.be.at.most(1);
    });

    it('should respect the container boundaries', () => {
      dragHandle(-initialSize * 2);

      expect(first.getBoundingClientRect()[size]).to.equal(0);
      expect(Math.abs(second.getBoundingClientRect()[size] - initialSize * 2)).to.be.at.most(0.1);

      dragHandle(initialSize * 2);

      expect(Math.abs(first.getBoundingClientRect()[size] - initialSize * 2)).to.be.at.most(0.1);
      expect(second.getBoundingClientRect()[size]).to.equal(0);
    });

    describe('min and max css limits', () => {
      var min = 20;
      var max = 40;
      var minSize = isVertical ? 'minHeight' : 'minWidth';
      var maxSize = isVertical ? 'maxHeight' : 'maxWidth';

      function testCssLimits(element, directionToMinimum) {
        dragHandle(directionToMinimum * initialSize * 2);

        expect(Math.abs(element.getBoundingClientRect()[size] - min)).to.be.at.most(0.1);

        dragHandle(-directionToMinimum * initialSize * 2);

        expect(Math.abs(element.getBoundingClientRect()[size] - max)).to.be.at.most(0.1);
      }

      it('should be respected on the first element', () => {
        first.style[minSize] = min + 'px';
        first.style[maxSize] = max + 'px';
        testCssLimits(first, -1);
      });

      it('should be  respected on the second element', () => {
        second.style[minSize] = min + 'px';
        second.style[maxSize] = max + 'px';
        testCssLimits(second, 1);
      });
    });

    it('should notify resizables', () => {
      const spy = sinon.spy(splitLayout, 'notifyResize');
      dragHandle(initialSize / 2);
      expect(spy.callCount).to.be.above(0);
    });

    it('should dispatch `splitter-dragend` event', () => {
      const spy = sinon.spy();
      splitLayout.addEventListener('splitter-dragend', spy);
      dragHandle(distance);
      expect(spy.called).to.be.true;
    });

    describe('RTL mode', () => {
      beforeEach(() => {
        splitLayout.setAttribute('dir', 'rtl');
      });

      it('should resize forwards', () => {
        dragHandle(distance);

        expect(
          Math.abs((isVertical ? first : second).getBoundingClientRect()[size] - (initialSize + distance))
        ).to.be.at.most(1);
        expect(
          Math.abs((isVertical ? second : first).getBoundingClientRect()[size] - (initialSize - distance))
        ).to.be.at.most(1);
      });

      it('should resize backwards', () => {
        dragHandle(distance);
        dragHandle(-distance);

        expect(Math.abs((isVertical ? first : second).getBoundingClientRect()[size] - initialSize)).to.be.at.most(1);
        expect(Math.abs((isVertical ? second : first).getBoundingClientRect()[size] - initialSize)).to.be.at.most(1);
      });
    });
  });
}

describe('horizontal mode', () => {
  beforeEach(async () => {
    splitLayout = fixtureSync(`
      <vaadin-split-layout>
        <div id="first">some content</div>
        <div id="second">some content</div>
      </vaadin-split-layout>
    `);
    splitLayout.style.width = initialSizes.width + 'px';
    splitLayout.style.height = initialSizes.height + 'px';
    await aTimeout(1);
    first = splitLayout.$.primary.assignedNodes({ flatten: true })[0];
    second = splitLayout.$.secondary.assignedNodes({ flatten: true })[0];
  });

  testDimensions(false);
});

describe('vertical mode', () => {
  beforeEach(async () => {
    splitLayout = fixtureSync(`
      <vaadin-split-layout>
        <div id="first">some content</div>
        <div id="second">some content</div>
      </vaadin-split-layout>
    `);
    splitLayout.style.width = initialSizes.width + 'px';
    splitLayout.style.height = initialSizes.height + 'px';
    splitLayout.orientation = 'vertical';
    await aTimeout(1);
    first = splitLayout.$.primary.assignedNodes({ flatten: true })[0];
    second = splitLayout.$.secondary.assignedNodes({ flatten: true })[0];
  });

  testDimensions(true);
});

describe('layout with one child', () => {
  beforeEach(async () => {
    splitLayout = fixtureSync(`
      <vaadin-split-layout>
        <div id="first">some content</div>
      </vaadin-split-layout>
    `);
    await aTimeout(1);
    first = splitLayout.$.primary.assignedNodes({ flatten: true })[0];
  });

  it('does not throw when setting and removing pointer-events', () => {
    const splitter = splitLayout.$.splitter;

    const downAndUp = () => {
      splitter.dispatchEvent(new Event('down', { bubbles: true }));
      splitter.dispatchEvent(new Event('up', { bubbles: true }));
    };

    expect(downAndUp).to.not.throw(Error);
  });
});
