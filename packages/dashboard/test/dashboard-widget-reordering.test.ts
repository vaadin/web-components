import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-dashboard.js';
import type { Dashboard, DashboardItem, DashboardSectionItem } from '../vaadin-dashboard.js';
import {
  createDragEvent,
  expectLayout,
  fireDragEnd,
  fireDragOver,
  fireDragStart,
  fireDrop,
  getDraggable,
  getElementFromCell,
  getParentSection,
  onceResized,
  resetReorderTimeout,
  setGap,
  setMaximumColumnWidth,
  setMinimumColumnWidth,
} from './helpers.js';

type TestDashboardItem = DashboardItem & { id: number };

describe('dashboard - widget reordering', () => {
  let dashboard: Dashboard<TestDashboardItem>;
  const columnWidth = 200;

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

    // @ts-expect-error Test without padding
    dashboard.$.grid.style.padding = '0';

    // prettier-ignore
    expectLayout(dashboard, [
      [0, 1],
    ]);
  });

  describe('drag and drop', () => {
    it('should reorder the widgets while dragging (start -> end)', async () => {
      // Start dragging the first widget
      fireDragStart(getElementFromCell(dashboard, 0, 0)!);
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
      fireDragStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();

      fireDragOver(getElementFromCell(dashboard, 0, 1)!, 'start');
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
      ]);
    });

    it('should reorder the widgets while dragging (end -> start)', async () => {
      fireDragStart(getElementFromCell(dashboard, 0, 1)!);
      await nextFrame();

      fireDragOver(getElementFromCell(dashboard, 0, 0)!, 'start');
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [1, 0],
      ]);
    });

    it('should not reorder if dragged barely over another widget (end -> start)', async () => {
      fireDragStart(getElementFromCell(dashboard, 0, 1)!);
      await nextFrame();

      fireDragOver(getElementFromCell(dashboard, 0, 0)!, 'end');
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
      ]);
    });

    it('should reorder the widgets while dragging (top -> bottom)', async () => {
      dashboard.style.width = `${columnWidth}px`;
      await onceResized(dashboard);

      // prettier-ignore
      expectLayout(dashboard, [
        [0],
        [1],
      ]);

      fireDragStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();

      fireDragOver(getElementFromCell(dashboard, 1, 0)!, 'bottom');
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [1],
        [0],
      ]);
    });

    it('should not reorder if dragged barely over another widget (top -> bottom)', async () => {
      dashboard.style.width = `${columnWidth}px`;
      await onceResized(dashboard);

      // prettier-ignore
      expectLayout(dashboard, [
        [0],
        [1],
      ]);

      fireDragStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();

      fireDragOver(getElementFromCell(dashboard, 1, 0)!, 'top');
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [0],
        [1],
      ]);
    });

    it('should reorder the widgets while dragging (bottom -> top)', async () => {
      dashboard.style.width = `${columnWidth}px`;
      await onceResized(dashboard);

      // prettier-ignore
      expectLayout(dashboard, [
        [0],
        [1],
      ]);

      fireDragStart(getElementFromCell(dashboard, 1, 0)!);
      await nextFrame();

      fireDragOver(getElementFromCell(dashboard, 0, 0)!, 'top');
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [1],
        [0],
      ]);
    });

    it('should not reorder if dragged barely over another widget (bottom -> top)', async () => {
      dashboard.style.width = `${columnWidth}px`;
      await onceResized(dashboard);

      // prettier-ignore
      expectLayout(dashboard, [
        [0],
        [1],
      ]);

      fireDragStart(getElementFromCell(dashboard, 1, 0)!);
      await nextFrame();

      fireDragOver(getElementFromCell(dashboard, 0, 0)!, 'bottom');
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [0],
        [1],
      ]);
    });

    it('should not throw with a lazy renderer while reordering', async () => {
      // Assign a renderer that initially renders nothing
      const syncRenderer = dashboard.renderer!;
      dashboard.renderer = (root, _, model) => {
        root.textContent = '';
        requestAnimationFrame(() => {
          syncRenderer(root, _, model);
        });
      };
      await nextFrame();
      await nextFrame();

      fireDragStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();

      expect(() => {
        // Dispatch dragover event while the renderer is still rendering (no widget in the cells)
        const dashboardRect = dashboard.getBoundingClientRect();
        const dragOverEvent = createDragEvent('dragover', {
          x: dashboardRect.right - dashboardRect.width / 4,
          y: dashboardRect.top + dashboardRect.height / 2,
        });
        dashboard.dispatchEvent(dragOverEvent);
      }).to.not.throw();

      await nextFrame();

      // Expect no changes in the layout
      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
      ]);
    });

    it('should set the widget as the drag image', async () => {
      const draggedElement = getElementFromCell(dashboard, 0, 0)!;
      const draggableRect = getDraggable(draggedElement).getBoundingClientRect();
      const setDragImage = fireDragStart(draggedElement).dataTransfer.setDragImage;
      await nextFrame();

      expect(setDragImage).to.have.been.calledOnce;
      expect(setDragImage.getCall(0).args[0]).to.equal(draggedElement);
      expect(setDragImage.getCall(0).args[1]).to.equal(draggableRect.left + draggableRect.width / 2);
      expect(setDragImage.getCall(0).args[2]).to.equal(draggableRect.top + draggableRect.height / 2);
    });

    it('should set data transfer data on drag start', async () => {
      const event = fireDragStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();

      expect(event.dataTransfer.getData('text/plain')).to.be.ok;
    });

    it('should not throw when dragging something inside the widgets', () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      const widgetContent = widget.querySelector('.content')!;
      expect(() =>
        widgetContent.dispatchEvent(new DragEvent('dragstart', { bubbles: true, composed: true })),
      ).to.not.throw();
    });

    it('should cancel the dragover event', async () => {
      fireDragStart(getElementFromCell(dashboard, 0, 0)!);
      const event = fireDragOver(getElementFromCell(dashboard, 0, 1)!, 'end');
      await nextFrame();

      expect(event.defaultPrevented).to.be.true;
    });

    it('should not cancel the dragover event if drag has not started', async () => {
      const event = fireDragOver(getElementFromCell(dashboard, 0, 1)!, 'end');
      await nextFrame();

      expect(event.defaultPrevented).to.be.false;
    });

    it('should set the dropEffect as move', async () => {
      fireDragStart(getElementFromCell(dashboard, 0, 0)!);
      const event = fireDragOver(getElementFromCell(dashboard, 0, 1)!, 'end');
      await nextFrame();

      expect(event.dataTransfer.dropEffect).to.equal('move');
    });

    it('should dispatch an item moved event', async () => {
      const reorderEndSpy = sinon.spy();
      dashboard.addEventListener('dashboard-item-moved', reorderEndSpy);
      fireDragStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();
      fireDragEnd(dashboard);
      await nextFrame();

      expect(reorderEndSpy).to.have.been.calledOnce;
      expect(reorderEndSpy.getCall(0).args[0].detail.item).to.equal(dashboard.items[0]);
      expect(reorderEndSpy.getCall(0).args[0].detail.items).to.deep.equal(dashboard.items);
      expect(reorderEndSpy.getCall(0).args[0].detail.section).to.be.undefined;
    });

    it('should not dispatch an item moved event if drag has not started', async () => {
      const reorderEndSpy = sinon.spy();
      dashboard.addEventListener('dashboard-item-moved', reorderEndSpy);
      fireDragEnd(dashboard);
      await nextFrame();

      expect(reorderEndSpy).to.not.have.been.called;
    });

    it('should primarily reorder the dragged over element', async () => {
      // Add a third widget
      dashboard.style.width = `${columnWidth * 4}px`;
      (dashboard.items[1] as TestDashboardItem).colspan = 2;
      dashboard.items = [...dashboard.items, { id: 2 }];
      await onceResized(dashboard);

      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1, 1, 2],
      ]);

      // Start dragging the first widget
      fireDragStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();

      // Drag the first widget over the end edge of the second one
      fireDragOver(getElementFromCell(dashboard, 0, 1)!, 'end');
      await nextFrame();

      // Expect the widgets to be reordered
      // prettier-ignore
      expectLayout(dashboard, [
        [1, 1, 0, 2],
      ]);
    });

    it('should reorder the element closest to the drag event coordinates', async () => {
      // Add a third widget
      dashboard.style.width = `${columnWidth * 3}px`;
      dashboard.items = [...dashboard.items, { id: 2 }];
      await onceResized(dashboard);
      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1, 2],
      ]);

      // Start dragging the first widget
      fireDragStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();

      // Drag the first widget over the end edge of the third one
      fireDragOver(getElementFromCell(dashboard, 0, 2)!, 'end');
      await nextFrame();

      // Expect the widgets to be reordered
      // prettier-ignore
      expectLayout(dashboard, [
        [1, 2, 0],
      ]);
    });

    it('should reorder the element closest to the empty area under drag event coordinates', async () => {
      // Add a third widget
      dashboard.style.width = `${columnWidth * 2}px`;
      dashboard.items = [...dashboard.items, { id: 2 }];
      await onceResized(dashboard);
      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
        [2]
      ]);

      // Start dragging the first widget
      fireDragStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();

      // Drag the first over the second row but not over any widget
      const dashboardRect = dashboard.getBoundingClientRect();
      const dragOverEvent = createDragEvent('dragover', {
        x: dashboardRect.left + dashboardRect.width / 2 + 1,
        y: dashboardRect.bottom,
      });
      dashboard.dispatchEvent(dragOverEvent);
      await nextFrame();

      // Expect the widgets to be reordered
      // prettier-ignore
      expectLayout(dashboard, [
        [1, 2],
        [0]
      ]);
    });

    it('should cancel drop event', async () => {
      fireDragStart(getElementFromCell(dashboard, 0, 0)!);
      const event = fireDrop(getElementFromCell(dashboard, 0, 1)!);
      await nextFrame();

      expect(event.defaultPrevented).to.be.true;
    });

    it('should not cancel drop event if drag has not started', async () => {
      const event = fireDrop(getElementFromCell(dashboard, 0, 1)!);
      await nextFrame();

      expect(event.defaultPrevented).to.be.false;
    });

    it('should allow changes to items while dragging', async () => {
      // Start dragging the first widget
      fireDragStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();

      // Drag over the second widget to reorder
      fireDragOver(getElementFromCell(dashboard, 0, 1)!, 'end');
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [1, 0],
      ]);

      // Add a new widget after widget 1
      dashboard.items = [dashboard.items[0], { id: 2 }, dashboard.items[1]];
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [1, 2],
        [0],
      ]);

      // Drag over the new widget 2
      resetReorderTimeout(dashboard);
      fireDragOver(getElementFromCell(dashboard, 0, 1)!, 'top');
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [1, 0],
        [2],
      ]);

      // Remove the dragged widget
      dashboard.items = [dashboard.items[0], dashboard.items[2]];
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [1, 2],
      ]);

      // Try dragging over the remaining widgets
      resetReorderTimeout(dashboard);
      fireDragOver(getElementFromCell(dashboard, 0, 1)!, 'end');
      await nextFrame();

      resetReorderTimeout(dashboard);
      fireDragOver(getElementFromCell(dashboard, 0, 0)!, 'start');
      await nextFrame();

      fireDragEnd(dashboard);
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [1, 2],
      ]);
    });

    it('should throw when dragging when there is only one widget', async () => {
      dashboard.items = [{ id: 0 }];
      await nextFrame();
      // Start dragging the first widget
      fireDragStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();

      expect(() => {
        const dashboardRect = dashboard.getBoundingClientRect();
        const dragOverEvent = createDragEvent('dragover', {
          x: dashboardRect.right - dashboardRect.width / 4,
          y: dashboardRect.top + dashboardRect.height / 2,
        });
        dashboard.dispatchEvent(dragOverEvent);
      }).to.not.throw();
    });

    describe('sections', () => {
      beforeEach(async () => {
        dashboard.items = [{ id: 0 }, { id: 1 }, { items: [{ id: 2 }, { id: 3 }] }];
        await nextFrame();

        // prettier-ignore
        expectLayout(dashboard, [
          [0, 1],
          [2, 3],
        ]);
      });

      it('should reorder the widgets inside a section', async () => {
        fireDragStart(getElementFromCell(dashboard, 1, 0)!);
        await nextFrame();

        fireDragOver(getElementFromCell(dashboard, 1, 1)!, 'end');
        await nextFrame();

        // prettier-ignore
        expectLayout(dashboard, [
          [0, 1],
          [3, 2],
        ]);
      });

      it('should dispatch an item moved event inside a section', async () => {
        const reorderEndSpy = sinon.spy();
        dashboard.addEventListener('dashboard-item-moved', reorderEndSpy);
        fireDragStart(getElementFromCell(dashboard, 1, 0)!);
        await nextFrame();

        fireDragOver(getElementFromCell(dashboard, 1, 1)!, 'end');
        await nextFrame();

        fireDragEnd(dashboard);

        expect(reorderEndSpy).to.have.been.calledOnce;
        expect(reorderEndSpy.getCall(0).args[0].detail.item).to.equal(
          (dashboard.items[2] as DashboardSectionItem<TestDashboardItem>).items[1],
        );
        expect(reorderEndSpy.getCall(0).args[0].detail.items).to.deep.equal(dashboard.items);
        expect(reorderEndSpy.getCall(0).args[0].detail.section).to.equal(dashboard.items[2]);
      });

      it('should reorder the widgets and sections', async () => {
        fireDragStart(getElementFromCell(dashboard, 0, 0)!);
        await nextFrame();

        fireDragOver(getElementFromCell(dashboard, 1, 0)!, 'bottom');
        await nextFrame();

        // prettier-ignore
        expectLayout(dashboard, [
          [1, null],
          [2, 3],
          [0, null],
        ]);
      });

      it('should reorder the sections and widgets', async () => {
        const section = getParentSection(getElementFromCell(dashboard, 1, 0))!;
        fireDragStart(section);
        await nextFrame();

        fireDragOver(getElementFromCell(dashboard, 0, 0)!, 'top');
        await nextFrame();

        fireDragEnd(dashboard);
        await nextFrame();

        // prettier-ignore
        expectLayout(dashboard, [
          [2, 3],
          [0, 1],
        ]);
      });
    });

    // Make sure the original dragged element is restored in the host.
    // Otherwise, "dragend" event would not be fired with native drag and drop.
    describe('ensure dragend event', () => {
      it('should restore the original dragged element in host', async () => {
        const originalDraggedElement = getElementFromCell(dashboard, 0, 0)!;
        fireDragStart(originalDraggedElement);
        await nextFrame();
        fireDragOver(getElementFromCell(dashboard, 0, 1)!, 'end');
        await nextFrame();

        expect(dashboard.contains(originalDraggedElement)).to.be.true;
      });

      it('should remove duplicate elements once drag has ended', async () => {
        fireDragStart(getElementFromCell(dashboard, 0, 0)!);
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

        fireDragStart(reusedWidgets[0]);
        await nextFrame();
        fireDragOver(reusedWidgets[1], 'end');
        await nextFrame();

        fireDragEnd(dashboard);
        expect(reusedWidgets[0].isConnected).to.be.true;
      });
    });
  });
});
