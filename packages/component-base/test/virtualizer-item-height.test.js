import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import { Virtualizer } from '../src/virtualizer.js';

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
    await aTimeout(200);

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

  it('should take sub-pixel value when measuring items height', () => {
    const containerHeight = elementsContainer.getBoundingClientRect().height;
    expect(containerHeight).to.equal(Math.ceil(ITEM_HEIGHT));
  });
});
