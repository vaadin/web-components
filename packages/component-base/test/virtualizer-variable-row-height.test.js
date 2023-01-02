import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { Virtualizer } from '../src/virtualizer.js';

describe('virtualizer - variable row height', () => {
  let virtualizer;
  let scrollTarget;

  beforeEach(() => {
    scrollTarget = fixtureSync(`
      <div style="height: 500px; width: 200px;">
        <div></div>
      </div>
    `);
    const scrollContainer = scrollTarget.firstElementChild;

    virtualizer = new Virtualizer({
      createElements: (count) => Array.from(Array(count)).map(() => document.createElement('div')),
      updateElement: (el, index) => {
        el.style.height = `${30 + index}px`;
        el.textContent = `Item ${index}`;
      },
      scrollTarget,
      scrollContainer,
    });

    virtualizer.size = 100;
  });

  it('should be able to scroll back to the top', async () => {
    // Scroll down
    scrollTarget.scrollTop = 1000;
    await nextFrame();

    //  Try scrolling back to the top until the first visible index is 0
    let attempts = 100;
    while (attempts > 0 && virtualizer.firstVisibleIndex !== 0) {
      attempts -= 1;
      scrollTarget.scrollTop = 0;
      await nextFrame();
    }

    expect(virtualizer.firstVisibleIndex).to.equal(0);
  });
});

describe('virtualizer - variable row height - large variance', () => {
  let virtualizer;
  let scrollTarget;
  let expandedItems;
  let updateElement;

  function fixItemPositioningTimeout() {
    return new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  }

  /**
   * Scrolls to the very end of the scroll target.
   */
  async function scrollToEnd() {
    // Scroll to last item
    virtualizer.scrollToIndex(virtualizer.size - 1);
    await nextFrame();
    await nextFrame();
    // Manually scroll to end
    scrollTarget.scrollTop = scrollTarget.scrollHeight - scrollTarget.offsetHeight;
    await nextFrame();
    await nextFrame();
  }

  /**
   * Scrolls downwards from the start of the scroll target in small enough steps
   * so that the issue described in https://github.com/vaadin/flow-components/issues/4306 would occur.
   */
  async function scrollDownwardsFromStart() {
    // Scroll downwards in small enough steps
    for (let step = 0; step < 9; step++) {
      scrollTarget.scrollTop += 100;
      await nextFrame();
    }
  }

  /**
   * Scrolls upwards from the end of the scroll target in small enough steps
   * so that the issue described in https://github.com/vaadin/flow-components/issues/4306 would occur.
   */
  async function scrollUpwardsFromEnd() {
    // Scroll upwards in small enough steps
    for (let step = 0; step < 9; step++) {
      scrollTarget.scrollTop -= 100;
      await nextFrame();
    }
  }

  beforeEach(() => {
    scrollTarget = fixtureSync(`
      <div style="height: 300px; width: 200px;">
        <div></div>
      </div>
    `);
    const scrollContainer = scrollTarget.firstElementChild;
    expandedItems = [];

    updateElement = sinon.spy((el, index) => {
      if (expandedItems.includes(index)) {
        el.style.height = '600px';
      } else {
        el.style.height = '30px';
      }
      el.textContent = `Item ${index}`;
    });

    virtualizer = new Virtualizer({
      createElements: (count) =>
        Array.from(Array(count)).map(() => {
          const el = document.createElement('div');
          el.classList.add('item');
          el.style.backgroundColor = 'red';
          el.style.width = '100%';
          return el;
        }),
      updateElement,
      scrollTarget,
      scrollContainer,
    });

    sinon.spy(virtualizer.__adapter, '__fixInvalidItemPositioning');

    virtualizer.size = 200000;

    // Expand the first and the last item
    expandedItems = [0, virtualizer.size - 1];
    virtualizer.update();
    virtualizer.scrollToIndex(0);
  });

  it('should reveal new items when scrolling downwards', async () => {
    const rect = scrollTarget.getBoundingClientRect();

    await scrollDownwardsFromStart();
    const itemAtTopText = document.elementFromPoint(rect.left + 1, rect.top + 1).textContent;
    await fixItemPositioningTimeout();

    // Expect the item at the botton of the viewport to be an actual item element
    const itemAtBottom = document.elementFromPoint(rect.left + 1, rect.bottom - 1);
    expect(itemAtBottom.classList.contains('item')).to.be.true;
    expect(itemAtBottom.textContent).to.equal(`Item ${itemAtBottom.__virtualIndex}`);

    // Expect the item at the top to be the same as before
    const itemAtTop = document.elementFromPoint(rect.left + 1, rect.top + 1);
    expect(itemAtTopText).to.equal(itemAtTop.textContent);
  });

  it('should reveal new items when scrolling upwards', async () => {
    const rect = scrollTarget.getBoundingClientRect();

    await scrollToEnd();
    await scrollUpwardsFromEnd();
    const itemAtBottomText = document.elementFromPoint(rect.left + 1, rect.bottom - 1).textContent;
    await fixItemPositioningTimeout();

    // Expect the item at the top of the viewport to be an actual item element
    const itemAtTop = document.elementFromPoint(rect.left + 1, rect.top + 1);
    expect(itemAtTop.classList.contains('item')).to.be.true;
    expect(itemAtTop.textContent).to.equal(`Item ${itemAtTop.__virtualIndex}`);

    // Expect the item at the bottom to be the same as before
    const itemAtBottom = document.elementFromPoint(rect.left + 1, rect.bottom - 1);
    expect(itemAtBottomText).to.equal(itemAtBottom.textContent);
  });

  it('should not update the item at last index', async () => {
    updateElement.resetHistory();
    await scrollDownwardsFromStart();
    await fixItemPositioningTimeout();

    const updatedIndexes = updateElement.getCalls().map((call) => call.args[1]);
    expect(updatedIndexes).not.to.include(virtualizer.size - 1);
    // Should not be scrolled to end
    const endScrollTop = scrollTarget.scrollHeight - scrollTarget.offsetHeight;
    expect(scrollTarget.scrollTop).to.be.lessThan(endScrollTop);
  });

  it('should not update the item at first index', async () => {
    await scrollToEnd();
    updateElement.resetHistory();
    await scrollUpwardsFromEnd();
    await fixItemPositioningTimeout();

    const updatedIndexes = updateElement.getCalls().map((call) => call.args[1]);
    expect(updatedIndexes).not.to.include(0);
    // Should not be scrolled to start
    expect(scrollTarget.scrollTop).to.be.greaterThan(0);
  });

  it('should allow scrolling to end of a padded scroll target', async () => {
    scrollTarget.style.padding = '60px 0 ';
    scrollTarget.style.boxSizing = 'border-box';

    await scrollToEnd();
    await fixItemPositioningTimeout();
    const targetScrollTop = scrollTarget.scrollHeight - scrollTarget.offsetHeight;

    expect(scrollTarget.scrollTop).to.equal(targetScrollTop);
  });

  it('should allow scrolling to start', async () => {
    // Expand every 10th item
    expandedItems = Array.from(Array(virtualizer.size).keys()).filter((index) => index % 10 === 0);

    // Make a minimal scroll sequence that caused an issue before the fix
    for (const scrollTop of [0, 2000, 0, 0]) {
      scrollTarget.scrollTop = scrollTop;
      await nextFrame();
    }

    expect(virtualizer.firstVisibleIndex).to.equal(0);
  });

  it('should not jam when when size is changed after fix', async () => {
    await scrollDownwardsFromStart();
    await fixItemPositioningTimeout();
    virtualizer.size = 1;
  });

  it('should not invoke when size is changed after scrolling', async () => {
    await scrollDownwardsFromStart();
    virtualizer.size = 0;
    await fixItemPositioningTimeout();
    expect(virtualizer.__adapter.__fixInvalidItemPositioning.callCount).to.equal(0);
  });
});
