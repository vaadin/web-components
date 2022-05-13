import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { Virtualizer } from '@vaadin/component-base/src/virtualizer.js';

describe('virtualizer - workarounds', () => {
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
      scrollContainer,
    });

    virtualizer.size = 100000;
  });

  it('should have an item at the bottom of the viewport after scrolling up', async () => {
    // Scroll to end
    virtualizer.scrollToIndex(100000);
    await nextFrame();

    // Scroll upwards in 1000px steps
    for (let i = 0; i < 10; i++) {
      await nextFrame();
      scrollTarget.scrollTop -= 1000;
    }

    // There should be an item at the bottom of the viewport
    await nextFrame();
    const listRect = scrollTarget.getBoundingClientRect();
    const lastVisibleElement = scrollTarget.getRootNode().elementFromPoint(listRect.left, listRect.bottom - 1);
    expect([...lastVisibleElement.classList]).to.contain('item');
  });
});
