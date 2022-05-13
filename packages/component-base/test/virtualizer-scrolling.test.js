import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import Sinon from 'sinon';
import { Virtualizer } from '../src/virtualizer.js';

function canScroll(el, deltaY) {
  const isScrollableElement = ['auto', 'scroll'].indexOf(getComputedStyle(el).overflow) !== -1;
  const canScrollAndScrollingDownwards = deltaY > 0 && el.scrollTop < el.scrollHeight - el.offsetHeight;
  const canScrollAndScrollingUpwards = deltaY < 0 && el.scrollTop > 0;

  return isScrollableElement && (canScrollAndScrollingDownwards || canScrollAndScrollingUpwards);
}

describe('virtualizer - wheel scrolling', () => {
  const IGNORE_WHEEL_TIMEOUT = 500;
  let wrapper;
  let virtualizer;
  let scrollTarget;
  let clock;
  let child;
  let grandchild;

  beforeEach(() => {
    wrapper = fixtureSync(`
      <div style="height: 100px; overflow: auto;">
        <div style="height: 200px;">
          <div></div>
        </div>
      </div>
    `);
    scrollTarget = wrapper.firstElementChild;
    const scrollContainer = scrollTarget.firstElementChild;

    const wheelListener = (e) => {
      if (!e.defaultPrevented && canScroll(e.currentTarget, e.deltaY)) {
        e.currentTarget.scrollTop += e.deltaY;
        e.preventDefault();
      }
    };

    wrapper.addEventListener('wheel', wheelListener);

    virtualizer = new Virtualizer({
      createElements: (count) => Array.from(Array(count)).map(() => document.createElement('div')),
      updateElement: (el, index) => {
        el.index = index;
        el.id = `item-${index}`;

        if (!el.firstElementChild) {
          el.innerHTML = `
            <div class="child" style="height: 20px; overflow: auto;">
              <div class="grandchild">
                <div class="content" style="height: 40px;">
                </div>
              </div>
            </div>
          `;
          el.querySelector('.child').addEventListener('wheel', wheelListener);
          el.querySelector('.grandchild').addEventListener('wheel', wheelListener);
        }

        el.querySelector('.content').textContent = index;
      },
      scrollTarget,
      scrollContainer
    });

    virtualizer.size = 100;

    child = scrollContainer.firstElementChild.querySelector('.child');
    grandchild = scrollContainer.firstElementChild.querySelector('.grandchild');

    clock = Sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  function wheel({
    element = scrollTarget,
    deltaX = 0,
    deltaY = 0,
    deltaMode = WheelEvent.DOM_DELTA_PIXEL,
    skipFlush = false,
    ctrlKey = false
  }) {
    const e = new CustomEvent('wheel', { bubbles: true, cancelable: true });
    e.deltaY = deltaY;
    e.deltaX = deltaX;
    e.deltaMode = deltaMode;
    e.ctrlKey = ctrlKey;
    element.dispatchEvent(e);
    if (!skipFlush) {
      virtualizer.flush();
    }
  }

  it('should scroll by pixels when deltaMode is DOM_DELTA_PIXEL (default)', () => {
    wheel({ deltaY: 1, deltaMode: WheelEvent.DOM_DELTA_PIXEL });
    expect(scrollTarget.scrollTop).to.equal(1);
  });

  it('should scroll by lines when deltaMode is DOM_DELTA_LINE', () => {
    wheel({ deltaY: 1, deltaMode: WheelEvent.DOM_DELTA_LINE });
    expect(scrollTarget.scrollTop).to.equal(16);
  });

  it('should scroll by pages when deltaMode is DOM_DELTA_PAGE', () => {
    wheel({ deltaY: 1, deltaMode: WheelEvent.DOM_DELTA_PAGE });
    expect(scrollTarget.scrollTop).to.equal(184);
  });

  it('should not scroll the wrapper right after virtualizer scrolled to end', async () => {
    // Wheel scroll to end
    wheel({ deltaY: scrollTarget.scrollHeight });
    // Wheel momentum settled down
    wheel({ deltaY: 0 });
    // Wheel scroll again
    wheel({ deltaY: 1 });
    // Expect the underlying wrapper not to have been scrolled
    expect(wrapper.scrollTop).to.equal(0);
  });

  it('should scroll the wrapper a while after virtualizer scrolled to end', async () => {
    wheel({ deltaY: scrollTarget.scrollHeight });
    wheel({ deltaY: 0 });
    clock.tick(IGNORE_WHEEL_TIMEOUT);
    wheel({ deltaY: 1 });
    expect(wrapper.scrollTop).to.equal(1);
  });

  it('should skip the custom wheel scrolling logic on ctrl-wheel', async () => {
    wheel({ deltaY: scrollTarget.scrollHeight });
    wheel({ deltaY: 1, ctrlKey: true });
    expect(wrapper.scrollTop).to.equal(1);
  });

  it('should not scroll the wrapper while the scroll momentum slowly settles', () => {
    let deltaY = scrollTarget.scrollHeight;
    const step = Math.floor(deltaY / 10);
    while (deltaY > 0) {
      wheel({ deltaY });
      deltaY -= step;
      clock.tick(100);
    }
    expect(wrapper.scrollTop).to.equal(0);
  });

  it('should scroll the wrapper normally if already scrolled to end', async () => {
    wheel({ deltaY: scrollTarget.scrollHeight });
    wheel({ deltaY: 0 });
    clock.tick(IGNORE_WHEEL_TIMEOUT);
    wheel({ deltaY: 2 });
    wheel({ deltaY: 1 });
    expect(wrapper.scrollTop).to.equal(3);
  });

  it('should process wheel delta one per frame', async () => {
    clock.restore();

    wheel({ deltaY: 1, skipFlush: true });
    wheel({ deltaY: 1, skipFlush: true });
    expect(scrollTarget.scrollTop).to.equal(1);

    await nextRender();
    wheel({ deltaY: 1, skipFlush: true });
    await nextRender();
    wheel({ deltaY: 1, skipFlush: true });
    expect(scrollTarget.scrollTop).to.equal(4);
  });

  it('should scroll a scrollable child', async () => {
    wheel({ deltaY: 1, element: child });
    expect(child.scrollTop).to.equal(1);
    expect(scrollTarget.scrollTop).to.equal(0);
    expect(wrapper.scrollTop).to.equal(0);
  });

  it('should scroll a scrollable child from wheel over grandchild', async () => {
    wheel({ deltaY: 1, element: grandchild });
    expect(child.scrollTop).to.equal(1);
    expect(scrollTarget.scrollTop).to.equal(0);
    expect(wrapper.scrollTop).to.equal(0);
  });

  it('should scroll the scrollTarget from wheel over grandchild', async () => {
    child.style.overflow = 'hidden';
    wheel({ deltaY: 1, element: grandchild });
    expect(child.scrollTop).to.equal(0);
    expect(scrollTarget.scrollTop).to.equal(1);
    expect(wrapper.scrollTop).to.equal(0);
  });
});

describe('virtualizer - scrollbar scrolling', () => {
  let virtualizer;
  let scrollTarget;

  beforeEach(() => {
    scrollTarget = fixtureSync(`
      <div style="height: 100px;">
        <div></div>
      </div>
    `);
    const scrollContainer = scrollTarget.firstElementChild;

    virtualizer = new Virtualizer({
      createElements: (count) => [...Array(count)].map(() => document.createElement('div')),
      updateElement: (el, index) => {
        el.textContent = `item ${index}`;
        el.classList.add(`item`);
      },
      scrollTarget,
      scrollContainer
    });
  });

  it('should have an item at the bottom of the viewport after scrolling up', async () => {
    virtualizer.size = 100000;

    // Scroll to end
    virtualizer.scrollToIndex(100000);
    await nextFrame();

    // Scroll upwards in 1000px steps
    for (let i = 0; i < 10; i++) {
      await nextFrame();
      scrollTarget.scrollTop -= 1000;

      // Sanity check for iron-list internal properties
      const adapter = virtualizer.__adapter;
      const firstItem = adapter._physicalItems[adapter._physicalStart];
      expect(firstItem.__virtualIndex).to.equal(adapter._virtualStart);
    }

    // There should be an item at the bottom of the viewport
    await nextFrame();
    const listRect = scrollTarget.getBoundingClientRect();
    const lastVisibleElement = scrollTarget.getRootNode().elementFromPoint(listRect.left, listRect.bottom - 1);
    expect([...lastVisibleElement.classList]).to.contain('item');
  });

  it('should not throw on flush if size is not set', () => {
    expect(() => virtualizer.flush()).not.to.throw(Error);
  });
});
