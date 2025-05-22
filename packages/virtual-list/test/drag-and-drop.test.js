import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../src/vaadin-virtual-list.js';

describe('drag and drop', () => {
  let virtualList;
  let container;

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
  });

  async function setVirtualListItems(count) {
    virtualList.items = Array.from({ length: count }).map((_, i) => {
      return { label: `Item ${i}` };
    });
    await nextFrame();
  }

  async function dragElement(element) {
    await resetMouse();
    await sendMouseToElement({ type: 'move', element });
    await sendMouse({ type: 'down' });
    await sendMouse({ type: 'move', position: [100, 100] });
    await sendMouse({ type: 'up' });
  }

  async function assertDragSucceeds(draggedElement) {
    await dragElement(draggedElement);
    await nextFrame();
    expect(virtualList.$.items.style.display).to.equal('');
  }

  ['5000', '50000'].forEach((count) => {
    it(`should not crash when dragging a virtual list with ${count} items`, async () => {
      await setVirtualListItems(count);
      await assertDragSucceeds(virtualList);
    });

    it(`should not crash when dragging a container that has a virtual list with ${count} items`, async () => {
      virtualList.removeAttribute('draggable');
      container.setAttribute('draggable', true);
      await setVirtualListItems(count);
      await assertDragSucceeds(container);
    });
  });
});
