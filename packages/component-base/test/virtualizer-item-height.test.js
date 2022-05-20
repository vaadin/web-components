import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import { Virtualizer } from '../src/virtualizer.js';

describe('virtualizer - item height', () => {
  let elementsContainer;
  const ITEM_HEIGHT = 20;

  beforeEach(async () => {
    const scrollTarget = fixtureSync(`
      <div style="height: 300px;">
        <div class="container"></div>
      </div>
    `);
    const scrollContainer = scrollTarget.firstElementChild;
    elementsContainer = scrollContainer;

    const virtualizer = new Virtualizer({
      createElements: (count) => Array.from({ length: count }, () => document.createElement('div')),
      updateElement: (el, index) => {
        el.style.width = '100%';

        if (el.id !== index) {
          el.id = `item-${index}`;

          // The element initially has a height of 0.
          el.style.height = '';

          // Update the element content dynamically (after a timeout) so its intrinsic height increases.
          setTimeout(() => {
            el.textContent = el.id;
            el.style.height = `${ITEM_HEIGHT}px`;
          }, 50);
        }
      },
      scrollTarget,
      scrollContainer,
    });

    virtualizer.size = 10000;
  });

  it('should have the initial placeholder height', async () => {
    const firstItem = elementsContainer.querySelector(`#item-0`);
    expect(firstItem.offsetHeight).to.equal(200);
  });

  it('should resize the elements once the content updates', async () => {
    const firstItem = elementsContainer.querySelector(`#item-0`);
    // Wait for the content to update
    await aTimeout(100);
    expect(firstItem.offsetHeight).to.equal(ITEM_HEIGHT);
  });
});
