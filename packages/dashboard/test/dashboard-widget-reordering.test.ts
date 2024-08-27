import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../vaadin-dashboard.js';
import type { Dashboard, DashboardItem } from '../vaadin-dashboard.js';
import {
  expectLayout,
  fireDragEnd,
  fireDragOver,
  fireDragStart,
  getDraggable,
  getElementFromCell,
  setGap,
  setMaximumColumnWidth,
  setMinimumColumnWidth,
} from './helpers.js';

type TestDashboardItem = DashboardItem & { id: number };

describe('dashboard - widget reordering', () => {
  let dashboard: Dashboard<TestDashboardItem>;
  const columnWidth = 100;

  beforeEach(async () => {
    dashboard = fixtureSync('<vaadin-dashboard></vaadin-dashboard>');
    dashboard.style.width = `${columnWidth * 2}px`;
    setMinimumColumnWidth(dashboard, columnWidth);
    setMaximumColumnWidth(dashboard, columnWidth);
    setGap(dashboard, 0);

    dashboard.editable = true;

    dashboard.items = [{ id: 0 }, { id: 1 }];
    dashboard.renderer = (root, _, model) => {
      root.textContent = '';
      const widget = fixtureSync(`
        <vaadin-dashboard-widget id="item-${model.item.id}" widget-title="${model.item.id} title">
          <div class="content">Widget content</div>
        </vaadin-dashboard-widget>`);
      root.appendChild(widget);
    };
    await nextFrame();

    // prettier-ignore
    expectLayout(dashboard, [
      [0, 1],
    ]);
  });

  describe('drag and drop', () => {
    it('should reorder the widgets while dragging (start -> end)', async () => {
      // Start dragging the first widget by its draggable header
      fireDragStart(getDraggable(getElementFromCell(dashboard, 0, 0)!));
      await nextFrame();

      // Drag the first widget over the end edge of the second one
      fireDragOver(getElementFromCell(dashboard, 0, 1)!, 'end');
      await nextFrame();

      // Expect the widgets to be reordered
      // prettier-ignore
      expectLayout(dashboard, [
        [1, 0],
      ]);
    });

    it('should not reorder if dragged barely over another widget (start -> end)', async () => {
      fireDragStart(getDraggable(getElementFromCell(dashboard, 0, 0)!));
      await nextFrame();

      fireDragOver(getElementFromCell(dashboard, 0, 1)!, 'start');
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
      ]);
    });

    // Make sure the original dragged element is restored in the host.
    // Otherwise, "dragend" event would not be fired with native drag and drop.
    describe('ensure dragend event', () => {
      it('should restore the original dragged element in host', async () => {
        const originalDraggedElement = getElementFromCell(dashboard, 0, 0)!;
        fireDragStart(getDraggable(originalDraggedElement));
        await nextFrame();
        fireDragOver(getElementFromCell(dashboard, 0, 1)!, 'end');
        await nextFrame();

        expect(dashboard.contains(originalDraggedElement)).to.be.true;
      });

      it('should remove duplicate elements once drag has ended', async () => {
        fireDragStart(getDraggable(getElementFromCell(dashboard, 0, 0)!));
        await nextFrame();
        fireDragOver(getElementFromCell(dashboard, 0, 1)!, 'end');
        await nextFrame();

        fireDragEnd(dashboard);
        await nextFrame();

        // Make sure the original dragged element is removed from the host if it was
        // restored.
        expect(dashboard.querySelectorAll(`vaadin-dashboard-widget[id='item-0']`).length).to.equal(1);
      });

      it('should not remove dragged element with a renderer that reuses same instances', async () => {
        const reusedWidgets = [
          fixtureSync('<vaadin-dashboard-widget id="item-0" widget-title="0 title"></vaadin-dashboard-widget>'),
          fixtureSync('<vaadin-dashboard-widget id="item-1" widget-title="1 title"></vaadin-dashboard-widget>'),
        ];
        dashboard.renderer = (root, _, model) => {
          root.textContent = '';
          root.appendChild(reusedWidgets[model.item.id]);
        };
        await nextFrame();

        fireDragStart(getDraggable(reusedWidgets[0]));
        await nextFrame();
        fireDragOver(reusedWidgets[1], 'end');
        await nextFrame();

        fireDragEnd(dashboard);
        expect(reusedWidgets[0].isConnected).to.be.true;
      });
    });
  });
});
