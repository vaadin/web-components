import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { Virtualizer } from '../src/virtualizer.js';

describe('virtualizer - average item height', () => {
  let virtualizer, scrollTarget, scrollContainer;

  function init(heightForIndex) {
    scrollTarget = fixtureSync(`
      <div style="height: 300px;">
        <div></div>
      </div>
    `);
    scrollContainer = scrollTarget.firstElementChild;
    virtualizer = new Virtualizer({
      createElements: (count) => Array.from({ length: count }, () => document.createElement('div')),
      updateElement: (el, index) => {
        el.index = index;
        el.style.width = '100%';
        el.style.boxSizing = 'border-box';
        el.style.height = `${heightForIndex(index)}px`;
        el.textContent = `item ${index}`;
      },
      scrollTarget,
      scrollContainer,
    });
    virtualizer.size = 10000;
  }

  async function measure() {
    // Scroll away from the top so a metrics update runs and the average is
    // computed from measured rows.
    virtualizer.scrollToIndex(5000);
    await nextFrame();
    virtualizer.flush();
  }

  it('should not inflate the average by ceiling fractional row heights', async () => {
    init(() => 30.1);
    await measure();
    // Averaging the ceiled per-row heights would make the average 31.
    expect(virtualizer.__adapter._physicalAverage).to.equal(30);
  });

  it('should not overestimate the total scroll height for fractional rows', async () => {
    init(() => 30.1);
    await measure();
    // scrollToIndex estimates the scroll position from the average, so an
    // inflated average makes the grid scroll past the target row. The total
    // scrollable height reflects the average and must stay close to the real
    // total (10000 * ~30.1), not the inflated 10000 * 31.
    const contentHeight = parseFloat(scrollContainer.style.height);
    expect(contentHeight).to.be.closeTo(10000 * 30, 10000 * 0.5);
  });
});
