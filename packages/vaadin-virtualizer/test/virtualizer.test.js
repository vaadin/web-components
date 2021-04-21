import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import { Virtualizer } from '../vaadin-virtualizer';

describe('virtualizer', () => {
  let virtualizer;
  let scrollTarget;
  let elementsContainer;

  function init(size = 100) {
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
      scrollContainer
    });

    virtualizer.size = size;
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

  it('should ignore scroll to invalid index', async () => {
    virtualizer.scrollToIndex();
    const item = elementsContainer.querySelector('#item-0');
    expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
  });

  it('should ignore scroll to index while invisible', async () => {
    scrollTarget.hidden = true;

    virtualizer.scrollToIndex(100);

    scrollTarget.hidden = false;

    const item = elementsContainer.querySelector('#item-0');
    expect(item.offsetHeight).to.be.above(0);
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

  it('should have physical items once visible', async () => {
    init(0);
    // Wait for possibly active resize observers to flush
    await aTimeout(100);

    scrollTarget.hidden = true;

    virtualizer.size = 100;
    await nextFrame();

    scrollTarget.hidden = false;

    await nextFrame();
    expect(elementsContainer.childElementCount).to.be.above(0);
  });
});
