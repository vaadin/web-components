import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { Virtualizer } from '../src/virtualizer.js';

describe('virtualizer', () => {
  let virtualizer;
  let scrollTarget;
  let elementsContainer;

  function init({ size = 100, updateElement = undefined }) {
    if (scrollTarget) {
      // Hide a discarded instance
      scrollTarget.hidden = true;
    }

    scrollTarget = fixtureSync(`
      <div style="height: 100px;">
        <div></div>
      </div>
    `);
    const scrollContainer = scrollTarget.firstElementChild;
    elementsContainer = scrollContainer;

    virtualizer = new Virtualizer({
      createElements: (count) => Array.from(Array(count)).map(() => document.createElement('div')),
      updateElement:
        updateElement ||
        ((el, index) => {
          el.index = index;
          el.id = `item-${index}`;
          el.textContent = el.id;
        }),
      scrollTarget,
      scrollContainer,
    });

    virtualizer.size = size;
  }

  beforeEach(() => init({}));

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
    await new Promise((resolve) => {
      new MutationObserver(resolve).observe(secondItem, { attributes: true });
    });

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

  it('should not flush when hidden', () => {
    virtualizer.scrollToIndex(50);
    scrollTarget.hidden = true;
    virtualizer.flush();
    scrollTarget.hidden = false;
    const item = elementsContainer.querySelector('#item-50');
    expect(item).to.be.ok;
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
    await new Promise((resolve) => {
      new MutationObserver(resolve).observe(elementsContainer, { childList: true });
    });

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

  it('should scroll to an arbitrary index 2', async () => {
    // Wait for a possible resize observer flush
    await aTimeout(100);
    virtualizer.scrollToIndex(6);
    const item = elementsContainer.querySelector(`#item-6`);
    expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
  });

  it('should restore scroll position on size change', async () => {
    // Scroll to item 50 and an additional 10 pixels
    virtualizer.scrollToIndex(50);
    scrollTarget.scrollTop += 10;

    virtualizer.size *= 2;
    const item = elementsContainer.querySelector('#item-50');
    expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top - 10);
  });

  it('should not request item updates on size increase', () => {
    const updateElement = sinon.spy((el, index) => (el.textContent = `item-${index}`));
    init({ size: 100, updateElement });

    // Scroll halfway down the list
    updateElement.resetHistory();
    virtualizer.scrollToIndex(50);

    // Increase the size so it shouldn't affect the current viewport items
    updateElement.resetHistory();
    virtualizer.size = 200;

    expect(updateElement.called).to.be.false;
  });

  it('should request a different set of items on size decrease', () => {
    const updateElement = sinon.spy((el, index) => (el.textContent = `item-${index}`));
    init({ size: 100, updateElement });

    // Scroll halfway down the list
    updateElement.resetHistory();
    virtualizer.scrollToIndex(50);
    const updatedIndexes = updateElement.getCalls().map((call) => call.args[1]);

    // Decrease the size so that we end up at the top of the list
    updateElement.resetHistory();
    virtualizer.size = 5;
    const postResizeUpdatedIndexes = updateElement.getCalls().map((call) => call.args[1]);

    expect(postResizeUpdatedIndexes).not.to.include.members(updatedIndexes);
    expect(postResizeUpdatedIndexes).to.include(0);
  });

  it('should request an index only once', async () => {
    const updateElement = sinon.spy((el, index) => (el.textContent = `item-${index}`));
    init({ size: 100, updateElement });

    // Wait for a possible resize observer flush
    await aTimeout(100);

    const firstIndexUpdatesCount = updateElement.getCalls().filter((call) => call.args[1] === 0).length;
    expect(firstIndexUpdatesCount).to.equal(1);
  });

  it('should re-render an unhidden item', async () => {
    // Create a virtualizer with just one item (rendered content "foo-0")
    let prefix = 'foo-';
    const updateElement = (el, index) => (el.textContent = `${prefix}${index}`);
    init({ size: 1, updateElement });

    // Wait for a possible resize observer flush
    await aTimeout(100);

    // Reduce the size to 0 (the item gets hidden)
    virtualizer.size = 0;

    // Update the prefix used by the renderer to "bar-"
    prefix = 'bar-';

    // Increase the size back to 1
    virtualizer.size = 1;

    // Expect the unhidden item to be re-rendered with the new prefix even though its index hasn't changed
    expect(elementsContainer.firstElementChild.textContent).to.equal('bar-0');
  });

  it('should have physical items once visible', async () => {
    init({ size: 0 });
    // Wait for possibly active resize observers to flush
    await aTimeout(100);

    scrollTarget.hidden = true;

    virtualizer.size = 100;
    await nextFrame();

    scrollTarget.hidden = false;

    await nextFrame();
    expect(elementsContainer.childElementCount).to.be.above(0);
  });

  it('should not create unnecessary elements on size change', () => {
    const initialCount = elementsContainer.childElementCount;
    virtualizer.size = 1;
    virtualizer.scrollToIndex(0);
    virtualizer.size = 1000;

    expect(elementsContainer.childElementCount).to.equal(initialCount);
  });

  it('should initially have a decent amount of physical elements', () => {
    const initialCount = elementsContainer.childElementCount;
    const viewportHeight = scrollTarget.offsetHeight;
    const itemHeight = elementsContainer.querySelector('#item-0').offsetHeight;
    const expectedCount = Math.ceil((viewportHeight / itemHeight) * 1.3) + 1;
    expect(initialCount).not.to.be.above(expectedCount);
  });

  describe('lazy rendering', () => {
    let render = false;

    beforeEach(() => {
      init({
        size: 100,
        updateElement: (el, index) => {
          if (render) {
            el.textContent = `item-${index}`;
          }
        },
      });
    });

    it('should not create an excess amount of elements if lazily rendered', () => {
      expect(elementsContainer.childElementCount).to.be.below(virtualizer.size);
    });

    it('should create more elements if necessary once rendered', () => {
      const initialCount = elementsContainer.childElementCount;

      render = true;
      virtualizer.update();
      virtualizer.flush();
      expect(elementsContainer.childElementCount).to.be.above(initialCount);
    });
  });
});
