import { expect } from '@esm-bundle/chai';
import { fixtureSync, mousedown, mouseup } from '@vaadin/testing-helpers';
import Sinon from 'sinon';
import { Virtualizer } from '../src/virtualizer.js';

describe('reorder elements', () => {
  let virtualizer;
  let scrollTarget;
  let elementsContainer;
  const REORDER_DEBOUNCE_TIMEOUT = 500;
  let recycledElement;
  let clock;

  // This helper checks whether all the elements are in numerical order by their index
  function elementsInOrder() {
    return Array.from(elementsContainer.children).every((element, index, [firstElement]) => {
      return element.hidden || element.index === firstElement.index + index;
    });
  }

  // This helper scrolls the virtualizer enough to cause some elements to get
  // recycled but not too much to cause a full recycle.
  // Returns a list of the elements that were detached while being reordered.
  async function scrollRecycle(skipFlush = false) {
    return new Promise((resolve) => {
      new MutationObserver((mutations) => {
        resolve(mutations.flatMap((record) => [...record.removedNodes]));
      }).observe(elementsContainer, { childList: true });

      virtualizer.scrollToIndex(Math.ceil(elementsContainer.childElementCount / 3));

      if (!skipFlush) {
        virtualizer.flush();
      }
    });
  }

  function init(config = {}) {
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
      scrollContainer,
      ...config,
    });

    virtualizer.size = 100;
  }

  beforeEach(() => {
    init({ reorderElements: true });
    recycledElement = elementsContainer.children[2];
    clock = Sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('should have the elements in order', async () => {
    scrollRecycle();
    expect(elementsInOrder()).to.be.true;
  });

  it('should not have the elements in order', async () => {
    init({ reorderElements: false });

    scrollRecycle();
    expect(elementsInOrder()).to.be.false;
  });

  it('should detach the element without focus on reorder', async () => {
    const detachedElements = await scrollRecycle();
    expect(detachedElements).to.include(recycledElement);
  });

  it('should not detach the element with focus on reorder', async () => {
    recycledElement.tabIndex = 0;
    recycledElement.focus();

    const detachedElements = await scrollRecycle();
    expect(detachedElements).not.to.include(recycledElement);
  });

  it('should not try to reorder an empty virtualizer', async () => {
    virtualizer.size = 0;
    expect(async () => scrollRecycle()).not.to.throw(Error);
  });

  it('should not reorder before debouncer flushes', () => {
    scrollRecycle(true);
    clock.tick(REORDER_DEBOUNCE_TIMEOUT - 10);
    expect(elementsInOrder()).to.be.false;
  });

  it('should reorder once debouncer flushes', () => {
    scrollRecycle(true);
    clock.tick(REORDER_DEBOUNCE_TIMEOUT);
    expect(elementsInOrder()).to.be.true;
  });

  it('should not reorder while mouse down', async () => {
    mousedown(elementsContainer);
    scrollRecycle();
    expect(elementsInOrder()).to.be.false;
  });

  it('should reorder once mousedown is released', async () => {
    mousedown(elementsContainer);
    scrollRecycle();
    mouseup(elementsContainer);
    expect(elementsInOrder()).to.be.true;
  });
});
