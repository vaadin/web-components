import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown, mouseup, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
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
  function scrollRecycle(skipFlush = false) {
    return new Promise((resolve) => {
      new MutationObserver((mutations) => {
        resolve(mutations.flatMap((record) => [...record.removedNodes]));
      }).observe(elementsContainer, { childList: true });

      virtualizer.scrollToIndex(Math.ceil(elementsContainer.childElementCount / 2));

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
        el.tabIndex = 0;
      },
      scrollTarget,
      scrollContainer,
      ...config,
    });

    virtualizer.hostConnected();
    virtualizer.size = 100;
  }

  beforeEach(() => {
    init({ reorderElements: true });
    recycledElement = elementsContainer.children[2];
    clock = sinon.useFakeTimers({
      shouldClearNativeTimers: true,
    });
  });

  afterEach(() => {
    clock.restore();
  });

  it('should have the elements in order', () => {
    scrollRecycle();
    expect(elementsInOrder()).to.be.true;
  });

  it('should not have the elements in order', () => {
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

  it('should not try to reorder an empty virtualizer', () => {
    virtualizer.size = 0;
    expect(() => scrollRecycle()).not.to.throw(Error);
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

  it('should not reorder while mouse down', () => {
    mousedown(elementsContainer);
    scrollRecycle();
    expect(elementsInOrder()).to.be.false;
  });

  it('should reorder once mousedown is released', () => {
    mousedown(elementsContainer);
    scrollRecycle();
    mouseup(elementsContainer);
    expect(elementsInOrder()).to.be.true;
  });

  describe('focus', () => {
    beforeEach(() => {
      // Don't use a fake clock for these tests
      clock.restore();
    });

    it('should tab through the elements in order', async () => {
      const firstElement = elementsContainer.children[0];
      expect(firstElement.id).to.equal('item-0');
      firstElement.focus();

      const tabToIndex = 20;

      // Tab downwards
      for (let i = 1; i <= tabToIndex; i++) {
        await nextFrame();
        await sendKeys({ press: 'Tab' });
        await nextFrame();
        expect(document.activeElement.id).to.equal(`item-${i}`);
      }

      // Tab upwards
      for (let i = tabToIndex - 1; i >= 0; i--) {
        await nextFrame();
        await sendKeys({ press: 'Shift+Tab' });
        await nextFrame();
        expect(document.activeElement.id).to.equal(`item-${i}`);
      }
    });

    it('should not throw if non-item element is focused', () => {
      elementsContainer.tabIndex = 0;
      expect(() => elementsContainer.focus()).not.to.throw();
    });

    it('should not change scroll position if elements are being reordered - scrolling forwards', () => {
      const lastRenderedElement = [...elementsContainer.children].pop();
      // Scroll the last rendered element into view
      scrollTarget.scrollTop +=
        lastRenderedElement.getBoundingClientRect().bottom - scrollTarget.getBoundingClientRect().bottom;
      // Make sure the next sibling is also inside the viewport
      scrollTarget.scrollTop += 10;

      // Record the current scroll position
      const scrollTop = scrollTarget.scrollTop;

      // Focus the element
      lastRenderedElement.focus();

      // Make sure scroll position has not changed
      expect(scrollTarget.scrollTop).to.equal(scrollTop);
    });

    it('should not change scroll position if elements are being reordered - scrolling backwards', () => {
      virtualizer.scrollToIndex(virtualizer.size - 1);
      virtualizer.flush();

      const firstRenderedElement = elementsContainer.children[0];
      // Scroll the first rendered element into view
      scrollTarget.scrollTop -=
        scrollTarget.getBoundingClientRect().top - firstRenderedElement.getBoundingClientRect().top;
      // Make sure the previous sibling is also inside the viewport
      scrollTarget.scrollTop -= 10;

      // Record the current scroll position
      const scrollTop = scrollTarget.scrollTop;

      // Focus the element
      firstRenderedElement.focus();

      // Make sure scroll position has not changed
      expect(scrollTarget.scrollTop).to.equal(scrollTop);
    });
  });

  // Regression tests for vaadin/web-components#11639. When the virtualizer
  // lives inside a shadow root, the focused row must be located via the
  // shadow root's `activeElement` (focus inside the shadow tree) or by
  // walking the flattened ancestors via `assignedSlot` from the scroll
  // target's root activeElement (focus on slotted light-DOM content).
  describe('focused element detection in shadow tree', () => {
    beforeEach(() => {
      // Remove default scroll target
      scrollTarget.remove();
      clock.restore();

      scrollTarget = fixtureSync('<div style="height: 100px;"></div>');
      const shadowRoot = scrollTarget.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = `
        <style>:host { display: block; height: 100%; }</style>
        <div id="scrollTarget" style="height: 100%; overflow: auto;">
          <div id="container"></div>
        </div>
      `;

      virtualizer = new Virtualizer({
        createElements: (count) =>
          Array.from(Array(count)).map(() => {
            const row = document.createElement('div');
            const slot = document.createElement('slot');
            slot.name = `cell-${scrollTarget.children.length}`;
            row.appendChild(slot);

            const cellContent = document.createElement('div');
            cellContent.slot = slot.name;
            cellContent.tabIndex = 0;
            scrollTarget.appendChild(cellContent);

            return row;
          }),
        updateElement: (row, index) => {
          row.index = index;
          row.id = `row-${index}`;
          const cellContent = row.querySelector('slot').assignedNodes()[0];
          cellContent.textContent = index;
        },
        scrollTarget: shadowRoot.getElementById('scrollTarget'),
        scrollContainer: shadowRoot.getElementById('container'),
        reorderElements: true,
      });
      virtualizer.hostConnected();
      virtualizer.size = 100;
      elementsContainer = shadowRoot.getElementById('container');
    });

    it('should not detach a focused row on reorder', async () => {
      // The row that will receive focus (should not get detached)
      const rowContainingFocus = elementsContainer.children[4];
      // Focus the row directly. The row lives inside the shadow tree, so
      // `document.activeElement` resolves to the shadow host, not the row.
      rowContainingFocus.tabIndex = 0;
      rowContainingFocus.focus();

      // Scroll and collect the detached elements
      const detachedElements = await scrollRecycle();
      // Expect the focused row to not have been detached
      expect(detachedElements).not.to.include(rowContainingFocus);
    });

    it('should not detach a row whose slotted content has focus on reorder', async () => {
      // The row that will include the focused cell (should not get detached)
      const rowContainingFocus = elementsContainer.children[4];
      // Focus the slotted cell content on the row
      rowContainingFocus.querySelector('slot').assignedNodes()[0].focus();

      // Scroll and collect the detached elements
      const detachedElements = await scrollRecycle();
      // Expect the row containing focus to not have been detached
      expect(detachedElements).not.to.include(rowContainingFocus);
    });

    // When the entire virtualizer host is itself nested inside another
    // shadow root, `document.activeElement` retargets to the outermost
    // host. The scroll target's root activeElement remains the actual
    // slotted focused element and must be used as the walk's starting
    // point.
    it('should not detach a row whose slotted content has focus when wrapped in an outer shadow', async () => {
      // Move the virtualizer host into an outer shadow root, keeping the
      // slotted cell contents (currently in `scrollTarget`'s light DOM)
      // wrapped inside the outer shadow as well.
      const outerHost = fixtureSync('<div></div>');
      const outerShadow = outerHost.attachShadow({ mode: 'open' });
      outerShadow.appendChild(scrollTarget);

      // The row that will include the focused cell (should not get detached)
      const rowContainingFocus = elementsContainer.children[4];
      // Focus the slotted cell content on the row
      rowContainingFocus.querySelector('slot').assignedNodes()[0].focus();

      // Scroll and collect the detached elements
      const detachedElements = await scrollRecycle();
      // Expect the row containing focus to not have been detached
      expect(detachedElements).not.to.include(rowContainingFocus);
    });
  });
});
