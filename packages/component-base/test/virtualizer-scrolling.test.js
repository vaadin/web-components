import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { Virtualizer } from '../src/virtualizer.js';

describe('virtualizer - scrollbar scrolling', () => {
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
  });

  it('should have an item at the bottom of the viewport after scrolling up', async () => {
    virtualizer.size = 100000;

    // Scroll to end
    virtualizer.scrollToIndex(100000);
    await nextFrame();

    // Scroll upwards in 1000px steps
    for (let i = 0; i < 10; i++) {
      await nextFrame();
      scrollTarget.scrollTop -= 1000;

      // Sanity check for iron-list internal properties
      const adapter = virtualizer.__adapter;
      const firstItem = adapter._physicalItems[adapter._physicalStart];
      expect(firstItem.__virtualIndex).to.equal(adapter._virtualStart);
    }

    // There should be an item at the bottom of the viewport
    await nextFrame();
    const listRect = scrollTarget.getBoundingClientRect();
    const lastVisibleElement = scrollTarget.getRootNode().elementFromPoint(listRect.left, listRect.bottom - 1);
    expect([...lastVisibleElement.classList]).to.contain('item');
  });

  it('should not throw on flush if size is not set', () => {
    expect(() => virtualizer.flush()).not.to.throw(Error);
  });

  it('should have 0 for the first visible index when scrolled to start', async () => {
    virtualizer.size = 100000;

    // Scroll to start, taking a couple of steps on the way
    const scrollPositions = [115000, 3500, 0];
    for (const scrollPosition of scrollPositions) {
      scrollTarget.scrollTop = scrollPosition;
      await nextFrame();
    }

    // The index of the first visible item should be 0
    expect(virtualizer.firstVisibleIndex).to.equal(0);
  });
});
