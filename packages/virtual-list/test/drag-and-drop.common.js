import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';

describe('drag and drop', () => {
  let virtualList;
  let container;
  let items;

  beforeEach(async () => {
    container = fixtureSync(`
      <div style="width: 300px; height: 300px;">
        <vaadin-virtual-list draggable="true"></vaadin-virtual-list>
      </div>
    `);
    virtualList = container.querySelector('vaadin-virtual-list');
    virtualList.renderer = (root, _, { item }) => {
      root.innerHTML = `<div>${item.label}</div>`;
    };
    document.body.appendChild(container);
    await nextFrame();
    items = virtualList.shadowRoot.querySelector('#items');
  });

  async function setVirtualListItems(count) {
    virtualList.items = Array.from({ length: count }).map((_, i) => {
      return { label: `Item ${i}` };
    });
    await nextFrame();
  }

  async function getMaxHeightDuringDragStart(element, items) {
    let maxHeightDuringDragStart;
    element.addEventListener(
      'dragstart',
      () => {
        maxHeightDuringDragStart = items.style.maxHeight;
      },
      { once: true },
    );
    element.dispatchEvent(new DragEvent('dragstart'));
    await new Promise((resolve) => {
      requestAnimationFrame(resolve);
    });
    return maxHeightDuringDragStart;
  }

  it('should not modify maxHeight on dragstart for small virtual lists', async () => {
    await setVirtualListItems(50);
    const initialMaxHeight = items.style.maxHeight;
    const maxHeightDuringDragStart = await getMaxHeightDuringDragStart(virtualList, items);
    expect(maxHeightDuringDragStart).to.equal(initialMaxHeight);
  });

  ['5000', '50000'].forEach((count) => {
    it('should temporarily set maxHeight to 0 on dragstart for large virtual lists', async () => {
      await setVirtualListItems(count);
      const initialMaxHeight = items.style.maxHeight;
      const maxHeightDuringDragStart = await getMaxHeightDuringDragStart(virtualList, items);
      expect(maxHeightDuringDragStart).to.equal('0px');
      expect(items.style.maxHeight).to.equal(initialMaxHeight);
    });

    it('should temporarily set maxHeight to 0 on dragstart for large virtual lists in draggable containers', async () => {
      virtualList.removeAttribute('draggable');
      container.setAttribute('draggable', true);
      await setVirtualListItems(count);
      const initialMaxHeight = items.style.maxHeight;
      const maxHeightDuringDragStart = await getMaxHeightDuringDragStart(container, items);
      expect(maxHeightDuringDragStart).to.equal('0px');
      expect(items.style.maxHeight).to.equal(initialMaxHeight);
    });
  });
});
