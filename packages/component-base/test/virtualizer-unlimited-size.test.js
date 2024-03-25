import { expect } from '@esm-bundle/chai';
import { fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import { Virtualizer } from '../src/virtualizer.js';

describe('unlimited size', () => {
  let virtualizer;
  let scrollTarget;
  let elementsContainer;

  beforeEach(() => {
    scrollTarget = fixtureSync(`
      <div style="height: 250px;">
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
        el.style.right = '0';
        el.style.left = '0';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.background = index % 2 === 0 ? '#e7e7e7' : '#d0d0d0';
        el.style.height = '30px';
        el.style.padding = '0 10px';
      },
      scrollTarget,
      scrollContainer,
    });

    virtualizer.size = 1000000;
  });

  function getLastRenderedIndex() {
    return [...elementsContainer.children].reduce((max, el) => Math.max(max, el.index), 0);
  }

  it('should scroll to a large index', () => {
    const index = Math.floor(virtualizer.size / 2);
    virtualizer.scrollToIndex(index);
    const item = elementsContainer.querySelector(`#item-${index}`);
    expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
  });

  it('should scroll near the end', () => {
    virtualizer.scrollToIndex(virtualizer.size - 1000);
    const item = elementsContainer.querySelector(`#item-${virtualizer.size - 1000}`);
    expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
  });

  it('should scroll to the second last index', () => {
    virtualizer.scrollToIndex(virtualizer.size - 2);
    const item = elementsContainer.querySelector(`#item-${virtualizer.size - 1}`);
    expect(item.getBoundingClientRect().bottom).to.be.closeTo(scrollTarget.getBoundingClientRect().bottom, 1);
  });

  it('should scroll to the second index', () => {
    virtualizer.scrollToIndex(1);
    const item = elementsContainer.querySelector(`#item-1`);
    expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
  });

  it('should scroll to an index with really large size', () => {
    virtualizer.size = 10000000000;
    virtualizer.scrollToIndex(200000);
    const item = elementsContainer.querySelector(`#item-200000`);
    expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
  });

  it('should scroll backwards to a large index', () => {
    const firstIndex = Math.floor(virtualizer.size / 2);
    const secondIndex = Math.floor(virtualizer.size / 3);
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

  it('should manually scroll to end when the scroll target has a border', async () => {
    scrollTarget.style.borderTop = '20px solid black';

    scrollTarget.scrollTop = scrollTarget.scrollHeight;
    await oneEvent(scrollTarget, 'scroll');

    const item = elementsContainer.querySelector(`#item-${virtualizer.size - 1}`);
    expect(item.getBoundingClientRect().bottom).to.be.closeTo(scrollTarget.getBoundingClientRect().bottom, 1);
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

      const item = elementsContainer.querySelector(`#item-${smallestIndex}`);
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

      const item = elementsContainer.querySelector(`#item-${largestIndex}`);
      expect(item).to.be.ok;
    }

    const item = elementsContainer.querySelector(`#item-${virtualizer.size - 1}`);
    expect(item.getBoundingClientRect().bottom).to.be.closeTo(scrollTarget.getBoundingClientRect().bottom, 1);
  });

  it('should have a first visible index at start', () => {
    const item = elementsContainer.querySelector(`#item-${virtualizer.firstVisibleIndex}`);
    const itemRect = item.getBoundingClientRect();
    expect(scrollTarget.getBoundingClientRect().top).to.be.within(itemRect.top, itemRect.bottom);
  });

  it('should have a last visible index at start', () => {
    const item = elementsContainer.querySelector(`#item-${virtualizer.lastVisibleIndex}`);
    const itemRect = item.getBoundingClientRect();
    expect(scrollTarget.getBoundingClientRect().bottom).to.be.within(
      Math.floor(itemRect.top),
      Math.ceil(itemRect.bottom),
    );
  });

  it('should have a first visible index at end', () => {
    virtualizer.scrollToIndex(virtualizer.size - 1);

    const item = elementsContainer.querySelector(`#item-${virtualizer.firstVisibleIndex}`);
    const itemRect = item.getBoundingClientRect();
    expect(scrollTarget.getBoundingClientRect().top).to.be.within(itemRect.top, itemRect.bottom);
  });

  it('should have a last visible index at end', () => {
    virtualizer.scrollToIndex(virtualizer.size - 1);

    const item = elementsContainer.querySelector(`#item-${virtualizer.lastVisibleIndex}`);
    const itemRect = item.getBoundingClientRect();
    expect(scrollTarget.getBoundingClientRect().bottom).to.be.within(
      Math.floor(itemRect.top),
      Math.ceil(itemRect.bottom),
    );
  });

  it('should add more items on size increase', () => {
    const index = virtualizer.size - 1;
    virtualizer.scrollToIndex(index);
    expect(getLastRenderedIndex()).to.equal(index);

    virtualizer.size += 2000;
    expect(getLastRenderedIndex()).to.be.above(index);
  });

  it('should remove exceeding items on size decrease', () => {
    const index = virtualizer.size - 1;
    virtualizer.scrollToIndex(index);
    expect(getLastRenderedIndex()).to.equal(index);

    virtualizer.size -= 1000;
    expect(getLastRenderedIndex()).to.be.below(index);
  });

  it('should set scroll to end when size decrease affects a visible index', async () => {
    virtualizer.scrollToIndex(virtualizer.size - 1000);
    virtualizer.size = virtualizer.firstVisibleIndex - 20;
    await oneEvent(scrollTarget, 'scroll');
    const lastItem = elementsContainer.querySelector(`#item-${virtualizer.size - 1}`);
    expect(lastItem.getBoundingClientRect().bottom).to.be.closeTo(scrollTarget.getBoundingClientRect().bottom, 1);
  });

  it('should preserve scroll position when size decrease affects a buffered index', async () => {
    // Make sure there are at least 2 buffered items at the end.
    expect(getLastRenderedIndex() - virtualizer.lastVisibleIndex).to.be.greaterThanOrEqual(2);

    // Scroll to an index and add an additional scroll offset.
    const index = virtualizer.size - 1000;
    virtualizer.scrollToIndex(index);
    scrollTarget.scrollTop += 10;

    // Decrease the size so that the last buffered index exceeds the new size bounds.
    virtualizer.size = virtualizer.lastVisibleIndex + 1;
    await oneEvent(scrollTarget, 'scroll');

    const item = elementsContainer.querySelector(`#item-${index}`);
    expect(item.getBoundingClientRect().top).to.be.closeTo(scrollTarget.getBoundingClientRect().top - 10, 1);
  });

  // FIXME: Fails due to a scroll offset reset caused by _adjustVirtualIndexOffset on scroll event.
  it.skip('should preserve scroll position when size decrease does not affect any rendered indexes', async () => {
    // Scroll to an index and add an additional scroll offset.
    const index = virtualizer.size - 2000;
    virtualizer.scrollToIndex(index);
    scrollTarget.scrollTop += 10;

    // Decrease the size so that no rendered indexes are affected.
    virtualizer.size -= 1000;
    await oneEvent(scrollTarget, 'scroll');

    const item = elementsContainer.querySelector(`#item-${index}`);
    expect(item.getBoundingClientRect().top).to.be.closeTo(scrollTarget.getBoundingClientRect().top - 10, 1);
  });

  // FIXME: Fails due to a scroll offset reset caused by _adjustVirtualIndexOffset on scroll event.
  it.skip('should preserve scroll position on size increase', async () => {
    const index = virtualizer.size - 2000;
    virtualizer.scrollToIndex(index);
    scrollTarget.scrollTop += 10;

    virtualizer.size += 1000;
    await oneEvent(scrollTarget, 'scroll');

    const item = elementsContainer.querySelector(`#item-${index}`);
    expect(item.getBoundingClientRect().top).to.be.closeTo(scrollTarget.getBoundingClientRect().top - 10, 1);
  });
});
