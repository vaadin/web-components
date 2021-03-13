import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import Sinon from 'sinon';
import { Virtualizer } from '..';

describe('virtualizer', () => {
  let virtualizer;
  let scrollTarget;
  let elementsContainer;

  function init(config = {}) {
    scrollTarget = fixtureSync(`
      <div style="height: 100px;">
        <div></div>
      </div>
    `);
    const scrollContainer = scrollTarget.firstElementChild;
    elementsContainer = scrollContainer;

    virtualizer = new Virtualizer({
      createElements: (count) => Array.from(Array(count)).map(() => document.createElement('div')),
      updateElement: (el, index) => {
        el.index = index;
        el.id = `item-${index}`;
        el.textContent = el.id;
      },
      scrollTarget,
      scrollContainer,
      ...config
    });

    virtualizer.size = 100;
  }

  beforeEach(() => init());

  it('should have the first item at the top', () => {
    const item = elementsContainer.querySelector('#item-0');
    expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
  });

  it('should realign automatically on child item resize', async () => {
    // Wait for possibly active resize observers to flush
    await aTimeout(100);

    const firstItem = elementsContainer.querySelector('#item-0');
    const secondItem = elementsContainer.querySelector('#item-1');
    firstItem.style.height = '50px';

    // Wait for the resize observer to kick in and adjust the inline style transform
    await new Promise((resolve) => new MutationObserver(resolve).observe(secondItem, { attributes: true }));

    expect(secondItem.getBoundingClientRect().top).to.equal(firstItem.getBoundingClientRect().bottom);
  });

  it('should support padding-top on scroll target', () => {
    scrollTarget.style.paddingTop = '10px';
    virtualizer.flush();
    virtualizer.scrollToIndex(0);
    const item = elementsContainer.querySelector('#item-0');
    expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
  });

  it('should scroll to index', () => {
    virtualizer.scrollToIndex(50);
    const item = elementsContainer.querySelector('#item-50');
    expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
  });

  it('should scroll to start with an index smaller than the first index', () => {
    virtualizer.scrollToIndex(50);
    virtualizer.scrollToIndex(-1);
    const item = elementsContainer.querySelector('#item-0');
    expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
  });

  it('should scroll to end with an index larger than the last index', () => {
    virtualizer.scrollToIndex(100);
    const item = elementsContainer.querySelector('#item-99');
    expect(item.getBoundingClientRect().bottom).to.be.closeTo(scrollTarget.getBoundingClientRect().bottom, 1);
  });

  it('should not include the first item when scrolled to end', () => {
    virtualizer.scrollToIndex(virtualizer.size - 1);
    const item = elementsContainer.querySelector('#item-0');
    expect(item).not.to.be.ok;
  });

  it('should have the last item at the bottom when scrolled to end', () => {
    virtualizer.scrollToIndex(virtualizer.size - 1);
    const item = elementsContainer.querySelector(`#item-${virtualizer.size - 1}`);
    expect(item.getBoundingClientRect().bottom).to.be.closeTo(scrollTarget.getBoundingClientRect().bottom, 1);
  });

  it('should manually scroll to end', async () => {
    scrollTarget.scrollTop = scrollTarget.scrollHeight;
    await oneEvent(scrollTarget, 'scroll');
    const item = elementsContainer.querySelector(`#item-${virtualizer.size - 1}`);
    expect(item.getBoundingClientRect().bottom).to.be.closeTo(scrollTarget.getBoundingClientRect().bottom, 1);
  });

  it('should increase the physical item count on height increase', async () => {
    // Wait for possibly active resize observers to flush
    await aTimeout(100);

    const initialItemCount = elementsContainer.childElementCount;
    scrollTarget.style.height = `${scrollTarget.offsetHeight * 2}px`;

    // Wait for the resize observer to kick in and add more child elements
    await new Promise((resolve) => new MutationObserver(resolve).observe(elementsContainer, { childList: true }));

    expect(elementsContainer.childElementCount).to.be.above(initialItemCount);
  });

  it('should scroll to start after scrolling to end', () => {
    virtualizer.scrollToIndex(virtualizer.size - 1);
    virtualizer.scrollToIndex(0);
    const item = elementsContainer.querySelector('#item-0');
    expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
  });

  it('should scroll to an arbitrary index', async () => {
    // This is a special case that seems to be due to an iron-list bug (reproduces with plain iron-list)...
    // The bug is worked around in the virtualizer.
    scrollTarget.style.height = '200px';
    virtualizer.flush();
    virtualizer.scrollToIndex(25);
    const item = elementsContainer.querySelector(`#item-25`);
    expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
  });

  it('should restore scroll position on size change', async () => {
    // Scroll to item 50 and an additional 10 pixels
    virtualizer.scrollToIndex(50);
    scrollTarget.scrollTop = scrollTarget.scrollTop + 10;

    virtualizer.size = virtualizer.size * 2;
    const item = elementsContainer.querySelector('#item-50');
    expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top - 10);
  });

  describe('reorder elements', () => {
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
    async function scrollRecycle(skipFlush = false) {
      return await new Promise((resolve) => {
        new MutationObserver((mutations) => {
          resolve(mutations.flatMap((record) => [...record.removedNodes]));
        }).observe(elementsContainer, { childList: true });

        virtualizer.scrollToIndex(Math.ceil(elementsContainer.childElementCount / 2));

        if (!skipFlush) {
          virtualizer.flush();
        }
      });
    }

    beforeEach(() => {
      init({ reorderElements: true });
      recycledElement = elementsContainer.children[2];
      clock = Sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should have the elements in order', async () => {
      scrollRecycle();
      expect(elementsInOrder()).to.be.true;
    });

    it('should not have the elements in order', async () => {
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

    it('should not try to reorder an empty virtualizer', async () => {
      virtualizer.size = 0;
      expect(async () => await scrollRecycle()).not.to.throw(Error);
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
  });

  describe('unlimited size', () => {
    beforeEach(() => (virtualizer.size = 1000000));

    it('should scroll to a large index', async () => {
      const index = ~~(virtualizer.size / 2);
      virtualizer.scrollToIndex(index);
      const item = elementsContainer.querySelector(`#item-${index}`);
      expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
    });

    it('should scroll near the end', async () => {
      virtualizer.scrollToIndex(virtualizer.size - 1000);
      const item = elementsContainer.querySelector(`#item-${virtualizer.size - 1000}`);
      expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
    });

    it('should scroll to the second last index', async () => {
      virtualizer.scrollToIndex(virtualizer.size - 2);
      const item = elementsContainer.querySelector(`#item-${virtualizer.size - 1}`);
      expect(item.getBoundingClientRect().bottom).to.be.closeTo(scrollTarget.getBoundingClientRect().bottom, 1);
    });

    it('should scroll to the second index', async () => {
      virtualizer.scrollToIndex(1);
      const item = elementsContainer.querySelector(`#item-1`);
      expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
    });

    it('should scroll backwards to a large index', async () => {
      const firstIndex = ~~(virtualizer.size / 2);
      const secondIndex = ~~(virtualizer.size / 3);
      virtualizer.scrollToIndex(firstIndex);
      virtualizer.scrollToIndex(secondIndex);
      virtualizer.flush();
      const item = elementsContainer.querySelector(`#item-${secondIndex}`);
      expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
    });

    it('should manually scroll to around half way', async () => {
      scrollTarget.scrollTop = scrollTarget.scrollHeight / 2;
      await oneEvent(scrollTarget, 'scroll');
      const item = elementsContainer.children[0];
      expect(item.index).to.be.within(virtualizer.size * 0.4, virtualizer.size * 0.6);
    });

    it('should manually scroll backwards to start', async () => {
      scrollTarget.scrollTop = 12000;
      await oneEvent(scrollTarget, 'scroll');
      scrollTarget.scrollTop = 6000;
      await oneEvent(scrollTarget, 'scroll');
      scrollTarget.scrollTop = 0;
      await oneEvent(scrollTarget, 'scroll');

      const item = elementsContainer.querySelector('#item-0');
      expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
    });

    it('should manually scroll to start after scroll to index', async () => {
      virtualizer.scrollToIndex(virtualizer.size / 400);

      while (scrollTarget.scrollTop > 0) {
        scrollTarget.scrollTop = 0;
        await oneEvent(scrollTarget, 'scroll');
      }

      const item = elementsContainer.querySelector('#item-0');
      expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
    });

    it('should manually scroll to end after scroll to index', async () => {
      virtualizer.scrollToIndex(Math.floor(virtualizer.size / 2));

      while (scrollTarget.scrollTop < scrollTarget.scrollHeight - scrollTarget.clientHeight) {
        scrollTarget.scrollTop = scrollTarget.scrollHeight - scrollTarget.clientHeight;
        await oneEvent(scrollTarget, 'scroll');
      }

      const item = elementsContainer.querySelector(`#item-${virtualizer.size - 1}`);
      expect(item.getBoundingClientRect().bottom).to.be.closeTo(scrollTarget.getBoundingClientRect().bottom, 1);
    });

    it('should manually scroll to end after scroll to start', async () => {
      virtualizer.scrollToIndex(0);

      while (scrollTarget.scrollTop < scrollTarget.scrollHeight - scrollTarget.clientHeight) {
        scrollTarget.scrollTop = scrollTarget.scrollHeight - scrollTarget.clientHeight;
        await oneEvent(scrollTarget, 'scroll');
      }

      const item = elementsContainer.querySelector(`#item-${virtualizer.size - 1}`);
      expect(item.getBoundingClientRect().bottom).to.be.closeTo(scrollTarget.getBoundingClientRect().bottom, 1);
    });

    it('should slowly scroll backwards to start', async () => {
      virtualizer.scrollToIndex(virtualizer.size / 4000);

      const elementHeight = elementsContainer.children[0].offsetHeight;
      const elementCount = elementsContainer.children.length;

      let smallestIndex;
      while (scrollTarget.scrollTop > 0) {
        smallestIndex = Math.min(...Array.from(elementsContainer.children).map((el) => el.index));

        scrollTarget.scrollTop -= (elementHeight * elementCount) / 2;
        await oneEvent(scrollTarget, 'scroll');

        const item = elementsContainer.querySelector('#item-' + smallestIndex);
        expect(item).to.be.ok;
      }

      const item = elementsContainer.querySelector('#item-0');
      expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
    });

    it('should slowly scroll forwards to end', async () => {
      virtualizer.scrollToIndex(virtualizer.size - virtualizer.size / 4000);

      const elementHeight = elementsContainer.children[0].offsetHeight;
      const elementCount = elementsContainer.children.length;

      let largestIndex;
      while (scrollTarget.scrollTop < scrollTarget.scrollHeight - scrollTarget.clientHeight) {
        largestIndex = Math.max(...Array.from(elementsContainer.children).map((el) => el.index));

        scrollTarget.scrollTop += (elementHeight * elementCount) / 2;
        await oneEvent(scrollTarget, 'scroll');

        const item = elementsContainer.querySelector('#item-' + largestIndex);
        expect(item).to.be.ok;
      }

      const item = elementsContainer.querySelector(`#item-${virtualizer.size - 1}`);
      expect(item.getBoundingClientRect().bottom).to.be.closeTo(scrollTarget.getBoundingClientRect().bottom, 1);
    });
  });
});
