import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown, mouseup, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { Virtualizer } from '../src/virtualizer.js';

describe('reorder elements', () => {
  let virtualizer;
  let scrollTarget;
  let elementsContainer;
  const REORDER_DEBOUNCE_TIMEOUT = 500;
  let recycledElement;
  let clock;

  // This helper checks whether all the elements are in numerical order by their index
  function elementsInOrder() {
    return Array.from(elementsContainer.children).every((element, index, [firstElement]) => {
      return element.hidden || element.index === firstElement.index + index;
    });
  }

  // This helper scrolls the virtualizer enough to cause some elements to get
  // recycled but not too much to cause a full recycle.
  // Returns a list of the elements that were detached while being reordered.
  function scrollRecycle(skipFlush = false) {
    return new Promise((resolve) => {
      new MutationObserver((mutations) => {
        resolve(mutations.flatMap((record) => [...record.removedNodes]));
      }).observe(elementsContainer, { childList: true });

      virtualizer.scrollToIndex(Math.ceil(elementsContainer.childElementCount / 2));

      if (!skipFlush) {
        virtualizer.flush();
      }
    });
  }

  function init(config = {}) {
    scrollTarget = fixtureSync(`
      <div style="height: 100px;">
        <div></div>
      </div>
    `);
    const scrollContainer = scrollTarget.firstElementChild;
    elementsContainer = scrollContainer;

    virtualizer = new Virtualizer({
      createElements: (count) => {
        return Array.from({ length: count }).map(() => {
          const el = document.createElement('div');
          el.style.minHeight = '1lh';
          return el;
        });
      },
      updateElement: (el, index) => {
        el.index = index;
        el.id = `item-${index}`;
        el.textContent = el.id;
        el.tabIndex = 0;
      },
      scrollTarget,
      scrollContainer,
      __disableHeightPlaceholder: true,
      ...config,
    });

    virtualizer.size = 100;
  }

  beforeEach(() => {
    init({ reorderElements: true });
    recycledElement = elementsContainer.children[2];
    clock = sinon.useFakeTimers({
      shouldClearNativeTimers: true,
    });
  });

  afterEach(() => {
    clock.restore();
  });

  it('should have the elements in order', () => {
    scrollRecycle();
    expect(elementsInOrder()).to.be.true;
  });

  it('should not have the elements in order', () => {
    init({ reorderElements: false });

    scrollRecycle();
    expect(elementsInOrder()).to.be.false;
  });

  it('should detach the element without focus on reorder', async () => {
    const detachedElements = await scrollRecycle();
    expect(detachedElements).to.include(recycledElement);
  });

  it('should not detach the element with focus on reorder', async () => {
    recycledElement.tabIndex = 0;
    recycledElement.focus();

    const detachedElements = await scrollRecycle();
    expect(detachedElements).not.to.include(recycledElement);
  });

  it('should not try to reorder an empty virtualizer', () => {
    virtualizer.size = 0;
    expect(() => scrollRecycle()).not.to.throw(Error);
  });

  it('should not reorder before debouncer flushes', () => {
    scrollRecycle(true);
    clock.tick(REORDER_DEBOUNCE_TIMEOUT - 10);
    expect(elementsInOrder()).to.be.false;
  });

  it('should reorder once debouncer flushes', () => {
    scrollRecycle(true);
    clock.tick(REORDER_DEBOUNCE_TIMEOUT);
    expect(elementsInOrder()).to.be.true;
  });

  it('should not reorder while mouse down', () => {
    mousedown(elementsContainer);
    scrollRecycle();
    expect(elementsInOrder()).to.be.false;
  });

  it('should reorder once mousedown is released', () => {
    mousedown(elementsContainer);
    scrollRecycle();
    mouseup(elementsContainer);
    expect(elementsInOrder()).to.be.true;
  });

  describe('focus', () => {
    beforeEach(() => {
      // Don't use a fake clock for these tests
      clock.restore();
    });

    it('should tab through the elements in order', async () => {
      const firstElement = elementsContainer.children[0];
      expect(firstElement.id).to.equal('item-0');
      firstElement.focus();

      const tabToIndex = 20;

      // Tab downwards
      for (let i = 1; i <= tabToIndex; i++) {
        await nextFrame();
        await sendKeys({ press: 'Tab' });
        await nextFrame();
        expect(document.activeElement.id).to.equal(`item-${i}`);
      }

      // Tab upwards
      for (let i = tabToIndex - 1; i >= 0; i--) {
        await nextFrame();
        await sendKeys({ press: 'Shift+Tab' });
        await nextFrame();
        expect(document.activeElement.id).to.equal(`item-${i}`);
      }
    });

    it('should not throw if non-item element is focused', () => {
      elementsContainer.tabIndex = 0;
      expect(() => elementsContainer.focus()).not.to.throw();
    });

    it('should not change scroll position if elements are being reordered - scrolling forwards', () => {
      const lastRenderedElement = [...elementsContainer.children].pop();
      // Scroll the last rendered element into view
      scrollTarget.scrollTop +=
        lastRenderedElement.getBoundingClientRect().bottom - scrollTarget.getBoundingClientRect().bottom;
      // Make sure the next sibling is also inside the viewport
      scrollTarget.scrollTop += 10;

      // Record the current scroll position
      const scrollTop = scrollTarget.scrollTop;

      // Focus the element
      lastRenderedElement.focus();

      // Make sure scroll position has not changed
      expect(scrollTarget.scrollTop).to.equal(scrollTop);
    });

    it('should not change scroll position if elements are being reordered - scrolling backwards', () => {
      virtualizer.scrollToIndex(virtualizer.size - 1);
      virtualizer.flush();

      const firstRenderedElement = elementsContainer.children[0];
      // Scroll the first rendered element into view
      scrollTarget.scrollTop -=
        scrollTarget.getBoundingClientRect().top - firstRenderedElement.getBoundingClientRect().top;
      // Make sure the previous sibling is also inside the viewport
      scrollTarget.scrollTop -= 10;

      // Record the current scroll position
      const scrollTop = scrollTarget.scrollTop;

      // Focus the element
      firstRenderedElement.focus();

      // Make sure scroll position has not changed
      expect(scrollTarget.scrollTop).to.equal(scrollTop);
    });
  });
});
