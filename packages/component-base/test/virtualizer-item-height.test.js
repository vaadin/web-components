import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { Virtualizer } from '../src/virtualizer.js';

async function contentUpdate() {
  // Wait for the content to update (and resize observer to fire)
  await aTimeout(200);
}

describe('virtualizer - item height', () => {
  let elementsContainer;
  let virtualizer;
  const EVEN_ITEM_HEIGHT = 20;
  const ODD_ITEM_HEIGHT = 40;

  beforeEach(() => {
    const scrollTarget = fixtureSync(`
      <div style="height: 300px;">
        <div class="container"></div>
      </div>
    `);
    const scrollContainer = scrollTarget.firstElementChild;
    elementsContainer = scrollContainer;

    virtualizer = new Virtualizer({
      createElements: (count) => Array.from({ length: count }, () => document.createElement('div')),
      updateElement: (el, index) => {
        el.style.width = '100%';

        if (el.id !== index) {
          el.id = `item-${index}`;

          // The element initially has a height of 0.
          el.style.height = '';
          el.textContent = '';

          // Update the element content dynamically (after a timeout) so its intrinsic height increases.
          setTimeout(() => {
            el.textContent = el.id;
            el.style.height = `${index % 2 ? ODD_ITEM_HEIGHT : EVEN_ITEM_HEIGHT}px`;
          }, 50);
        }
      },
      scrollTarget,
      scrollContainer,
    });

    virtualizer.size = 10000;
  });

  afterEach(() => {
    // Flush the virtualizer to avoid test flakiness
    virtualizer.flush();
  });

  it('should have the initial placeholder height', () => {
    const firstItem = elementsContainer.querySelector(`#item-0`);
    expect(firstItem.offsetHeight).to.equal(200);
  });

  it('should resize the elements once the content updates', async () => {
    const firstItem = elementsContainer.querySelector(`#item-0`);
    // Wait for the content to update
    await aTimeout(100);
    expect(firstItem.offsetHeight).to.equal(EVEN_ITEM_HEIGHT);
  });

  it('should adjust the placeholder height', async () => {
    // Wait for the content to update
    await aTimeout(100);
    // Scroll down
    virtualizer.scrollToIndex(100);

    const item = elementsContainer.querySelector(`#item-100`);
    // The item content should not yet have been updated so it uses the placeholder height
    // which should be an average of the previous n items heights.
    expect(item.offsetHeight).to.be.above(EVEN_ITEM_HEIGHT);
    expect(item.offsetHeight).to.be.below(ODD_ITEM_HEIGHT);
  });

  it('should clear the temporary placeholder padding from the item', async () => {
    // Wait for the content to update (and resize observer to fire)
    await contentUpdate();

    // Cache the height of the first item
    const firstItem = elementsContainer.querySelector(`#item-0`);
    const firstItemHeight = firstItem.offsetHeight;

    // Update the first item. Due to how the test updateElement function is implemented,
    // the item height will first be set to 0, which causes the virtualizer to
    // temporarily add padding to the element.
    virtualizer.update(0, 0);

    // Manually restore the item's height
    firstItem.style.height = `${firstItemHeight}px`;

    // Give some time for the resize observer to fire
    await aTimeout(100);

    // The padding should have been be cleared and the item should have its original height.
    expect(firstItem.offsetHeight).to.equal(firstItemHeight);
  });
});

describe('virtualizer - item height - sub-pixel', () => {
  let elementsContainer;
  let virtualizer;
  const ITEM_HEIGHT = 30.25;

  beforeEach(() => {
    const fixture = fixtureSync(`
      <div style="height: auto;">
        <div class="scroller">
          <div style="min-height: 1px;"></div>
        </div>
      </div>
    `);
    const scrollTarget = fixture.firstElementChild;
    const scrollContainer = scrollTarget.firstElementChild;
    elementsContainer = scrollContainer;

    virtualizer = new Virtualizer({
      createElements: (count) => Array.from({ length: count }, () => document.createElement('div')),
      updateElement: (el, index) => {
        el.style.width = '100%';
        el.id = `item-${index}`;

        if (el.id !== index) {
          el.textContent = `item-${index}`;
          el.style.height = `${ITEM_HEIGHT}px`;
        }
      },
      scrollTarget,
      scrollContainer,
    });

    virtualizer.size = 1;
  });

  it('should take sub-pixel value into account when measuring items height', () => {
    const containerHeight = elementsContainer.getBoundingClientRect().height;
    expect(containerHeight).to.equal(Math.ceil(ITEM_HEIGHT));
  });

  it('should measure height correctly if some transform is applied to virtualizer', () => {
    elementsContainer.style.transform = 'scale(0.5)';

    virtualizer.scrollToIndex(0);

    let containerHeight = elementsContainer.offsetHeight;
    expect(containerHeight).to.equal(Math.ceil(ITEM_HEIGHT));

    elementsContainer.style.transform = 'scale(1.5)';

    virtualizer.scrollToIndex(0);

    containerHeight = elementsContainer.offsetHeight;
    expect(containerHeight).to.equal(Math.ceil(ITEM_HEIGHT));
  });

  it('should measure item height when box-sizing content-box is used', () => {
    const firstItem = elementsContainer.querySelector('#item-0');

    firstItem.style.boxSizing = 'content-box';
    firstItem.style.paddingBottom = '3px';
    firstItem.style.borderTop = '4px solid red';
    firstItem.style.borderBottom = '5px solid red';

    virtualizer.scrollToIndex(0);

    const containerHeight = elementsContainer.offsetHeight;
    expect(containerHeight).to.equal(Math.ceil(ITEM_HEIGHT + 3 + 4 + 5));
  });

  it('should measure item height when box-sizing border-box is used', () => {
    const firstItem = elementsContainer.querySelector('#item-0');

    firstItem.style.boxSizing = 'border-box';
    firstItem.style.paddingBottom = '3px';
    firstItem.style.borderTop = '4px solid red';
    firstItem.style.borderBottom = '5px solid red';

    virtualizer.scrollToIndex(0);

    const containerHeight = elementsContainer.offsetHeight;
    expect(containerHeight).to.equal(Math.ceil(ITEM_HEIGHT));
  });
});

describe('virtualizer - item height - initial render', () => {
  let virtualizer, elementsContainer, itemHeight, createElements;

  beforeEach(() => {
    const scrollTarget = fixtureSync(`
      <div style="height: 300px;">
        <div class="container"></div>
      </div>
    `);
    const scrollContainer = scrollTarget.firstElementChild;
    elementsContainer = scrollContainer;

    createElements = sinon.spy((count) => Array.from({ length: count }, () => document.createElement('div')));

    virtualizer = new Virtualizer({
      createElements,
      updateElement: (el, index) => {
        el.style.width = '100%';
        el.style.height = itemHeight;
        el.textContent = `Item ${index}`;
      },
      scrollTarget,
      scrollContainer,
    });
  });

  describe('large item height', () => {
    beforeEach(async () => {
      itemHeight = '100px';
      virtualizer.size = 100;
      await nextFrame();
    });

    it('should have the expected amount of physical elements', () => {
      expect(elementsContainer.childElementCount).to.equal(5);
    });

    it('should have created the items in the expected amount of batches', () => {
      expect(createElements.callCount).to.equal(2);
    });
  });

  describe('small item height', () => {
    beforeEach(async () => {
      itemHeight = '20px';
      virtualizer.size = 100;
      await nextFrame();
    });

    it('should have the expected amount of physical elements', () => {
      expect(elementsContainer.childElementCount).to.equal(20);
    });

    it('should have created the items in the expected amount of batches', () => {
      expect(createElements.callCount).to.equal(2);
    });
  });
});

describe('virtualizer - item height - lazy rendering', () => {
  let virtualizer;
  let renderPlaceholders;
  let scrollTarget;

  beforeEach(() => {
    scrollTarget = fixtureSync(`
      <div style="height: 400px;">
        <div class="container"></div>
      </div>
    `);
    const scrollContainer = scrollTarget.firstElementChild;

    renderPlaceholders = true;

    virtualizer = new Virtualizer({
      createElements: (count) => Array.from({ length: count }, () => document.createElement('div')),
      updateElement: (el, index) => {
        el.dataset.index = index;
        el.style.width = '100%';
        el.textContent = renderPlaceholders ? '' : `Item ${index}`;
      },
      scrollTarget,
      scrollContainer,
    });

    virtualizer.size = 1000;
  });

  describe('placeholders', () => {
    it('should have placeholders visually hidden', () => {
      const item = document.querySelector('[data-index="0"]');

      expect(getComputedStyle(item).opacity).to.equal('0');
      // They should still have height (not hidden with display: none)
      expect(item.offsetHeight).to.be.above(0);
    });

    it('should visually unhide items once no longer placeholders', async () => {
      const item = document.querySelector('[data-index="0"]');

      renderPlaceholders = false;
      virtualizer.update();
      await contentUpdate();

      expect(getComputedStyle(item).opacity).to.equal('1');
    });
  });

  [false, true].forEach((initiallyRendered) => {
    describe(`scroll to index - initially rendered: ${initiallyRendered}`, () => {
      beforeEach(async () => {
        if (initiallyRendered) {
          // Setup where the virtualizer has initially rendered all the items once
          renderPlaceholders = false;
          virtualizer.update();
          await contentUpdate();
          renderPlaceholders = true;
        }
      });

      it('should have scrolled to the correct index after placeholders are removed', async () => {
        // Scroll to an index while the virtualizer may still be creating physical items
        virtualizer.scrollToIndex(500);

        // At this point, only placeholders are rendered.
        // Enable actual content rendering and update.
        renderPlaceholders = false;
        virtualizer.update();
        // Wait for the content to update (and resize observer to fire)
        await contentUpdate();

        // The first visible index should be correct
        expect(virtualizer.firstVisibleIndex).to.equal(500);
      });

      it('should scroll to the lastly requested index', async () => {
        virtualizer.scrollToIndex(500);
        virtualizer.scrollToIndex(600);

        renderPlaceholders = false;
        virtualizer.update();
        await contentUpdate();

        expect(virtualizer.firstVisibleIndex).to.equal(600);
      });

      it('should not scroll to the old index', async () => {
        virtualizer.scrollToIndex(500);

        renderPlaceholders = false;
        virtualizer.scrollToIndex(0);
        await contentUpdate();

        expect(virtualizer.firstVisibleIndex).to.equal(0);
      });

      it('should not scroll to pending index when there are no placeholders', async () => {
        virtualizer.scrollToIndex(500);

        renderPlaceholders = false;
        virtualizer.scrollToIndex(0);

        const scrollToIndexSpy = sinon.spy(virtualizer.__adapter, 'scrollToIndex');
        await contentUpdate();

        // Expect spy to not have been called
        expect(scrollToIndexSpy).to.not.have.been.called;
      });

      it('should not scroll away from manually scrolled position', async () => {
        virtualizer.scrollToIndex(500);
        await contentUpdate();
        renderPlaceholders = false;
        virtualizer.update();
        await contentUpdate();
        scrollTarget.scrollTop += 500;
        await contentUpdate();

        expect(virtualizer.firstVisibleIndex).not.to.equal(500);
      });

      it('should not change scroll position after item height change', async () => {
        renderPlaceholders = false;
        virtualizer.scrollToIndex(1);
        await contentUpdate();
        const scrollTop = scrollTarget.scrollTop;

        // Increase item height
        fixtureSync(`
          <style>
            .container div {
              height: 100px;
            }
          </style>
        `);
        await contentUpdate();

        // Expect the scroll position to be the same as before
        expect(scrollTarget.scrollTop).to.equal(scrollTop);
      });
    });

    it('should scroll to end', async () => {
      renderPlaceholders = false;
      virtualizer.update();
      virtualizer.scrollToIndex(Infinity);
      await contentUpdate();

      expect(virtualizer.lastVisibleIndex).to.equal(999);

      const { top, bottom, left } = scrollTarget.getBoundingClientRect();

      // Expect the first visible item to be at the top of the viewport
      const topMostItem = document.elementFromPoint(left, top);
      const firstVisibleItem = document.querySelector(`[data-index="${virtualizer.firstVisibleIndex}"]`);
      expect(topMostItem).to.equal(firstVisibleItem);

      // Expect the last visible item to be at the bottom of the viewport
      const bottomMostItem = document.elementFromPoint(left, bottom - 1);
      const lastVisibleItem = document.querySelector(`[data-index="${virtualizer.lastVisibleIndex}"]`);
      expect(bottomMostItem).to.equal(lastVisibleItem);
    });
  });
});

describe('virtualizer - item height - placeholders are disabled', () => {
  let virtualizer;
  let scrollTarget;

  beforeEach(() => {
    scrollTarget = fixtureSync(`
      <div style="height: 200px;">
        <div class="container"></div>
      </div>
    `);

    virtualizer = new Virtualizer({
      createElements: (count) => Array.from({ length: count }, () => document.createElement('div')),
      updateElement: (el, index) => {
        el.id = `item-${index}`;
      },
      scrollTarget,
      scrollContainer: scrollTarget.firstElementChild,
      __disableHeightPlaceholder: true,
    });

    virtualizer.size = 1;
  });

  it('should not add placeholder padding to items with zero height', () => {
    const item = document.querySelector('#item-0');
    expect(item.offsetHeight).to.equal(0);
  });
});
