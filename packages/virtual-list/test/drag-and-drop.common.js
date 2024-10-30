import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { resetMouse, sendMouse } from '@web/test-runner-commands';
import { hover } from '@vaadin/button/test/visual/helpers.js';

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

  async function dragElement(element) {
    await resetMouse();
    await hover(element);
    await sendMouse({ type: 'down' });
    await sendMouse({ type: 'move', position: [100, 100] });
    await sendMouse({ type: 'up' });
  }

  ['5000', '50000'].forEach((count) => {
    it(`should not crash when dragging a virtual list with ${count} items`, async () => {
      await setVirtualListItems(count);
      const initialMaxHeight = items.style.maxHeight;
      await dragElement(virtualList);
      expect(items.style.maxHeight).to.equal(initialMaxHeight);
    });

    it(`should not crash when dragging a container that has a virtual list with ${count} items`, async () => {
      virtualList.removeAttribute('draggable');
      container.setAttribute('draggable', true);
      await setVirtualListItems(count);
      const initialMaxHeight = items.style.maxHeight;
      await dragElement(container);
      expect(items.style.maxHeight).to.equal(initialMaxHeight);
    });
  });
});
