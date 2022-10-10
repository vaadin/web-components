import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
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
