import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
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
      await nextFrame();

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
      await nextFrame();

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
      await nextFrame();

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
      await nextFrame();

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

    it('should dispatch an item reorder start event', async () => {
      const reorderStartSpy = sinon.spy();
      dashboard.addEventListener('dashboard-item-reorder-start', reorderStartSpy);
      fireDragStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();

      expect(reorderStartSpy).to.have.been.calledOnce;
    });

    it('should should not throw when dragging something inside the widgets', () => {
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

    it('should dispatch an item drag reorder event', async () => {
      const reorderSpy = sinon.spy();
      dashboard.addEventListener('dashboard-item-drag-reorder', reorderSpy);
      fireDragStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();
      fireDragOver(getElementFromCell(dashboard, 0, 1)!, 'end');
      await nextFrame();

      expect(reorderSpy).to.have.been.calledOnce;
      expect(reorderSpy.getCall(0).args[0].detail).to.deep.equal({
        item: { id: 0 },
        target: { id: 1 },
      });
    });

    it('should not reorder if the drag reorder event is cancelled', async () => {
      dashboard.addEventListener('dashboard-item-drag-reorder', (e) => e.preventDefault());
      fireDragStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();
      fireDragOver(getElementFromCell(dashboard, 0, 1)!, 'end');
      await nextFrame();
      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
      ]);
    });

    it('should ignore subsequent dragover events', async () => {
      dashboard.addEventListener('dashboard-item-drag-reorder', (e) => e.preventDefault());
      const reorderSpy = sinon.spy();
      dashboard.addEventListener('dashboard-item-drag-reorder', reorderSpy);
      fireDragStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();
      fireDragOver(getElementFromCell(dashboard, 0, 1)!, 'end');
      fireDragOver(getElementFromCell(dashboard, 0, 1)!, 'end');
      await nextFrame();

      expect(reorderSpy).to.have.been.calledOnce;
    });

    it('should not ignore subsequent dragover events after a short timeout', () => {
      const clock = sinon.useFakeTimers();

      dashboard.addEventListener('dashboard-item-drag-reorder', (e) => e.preventDefault());
      const reorderSpy = sinon.spy();
      dashboard.addEventListener('dashboard-item-drag-reorder', reorderSpy);
      fireDragStart(getElementFromCell(dashboard, 0, 0)!);

      fireDragOver(getElementFromCell(dashboard, 0, 1)!, 'end');
      clock.tick(500);
      fireDragOver(getElementFromCell(dashboard, 0, 1)!, 'end');
      clock.restore();

      expect(reorderSpy).to.have.been.calledTwice;
    });

    it('should dispatch an item reorder end event', async () => {
      const reorderEndSpy = sinon.spy();
      dashboard.addEventListener('dashboard-item-reorder-end', reorderEndSpy);
      fireDragStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();
      fireDragEnd(dashboard);
      await nextFrame();

      expect(reorderEndSpy).to.have.been.calledOnce;
    });

    it('should not dispatch an item reorder end event if drag has not started', async () => {
      const reorderEndSpy = sinon.spy();
      dashboard.addEventListener('dashboard-item-reorder-end', reorderEndSpy);
      fireDragEnd(dashboard);
      await nextFrame();

      expect(reorderEndSpy).to.not.have.been.called;
    });

    it('should reorder the element closest to the drag event coordinates', async () => {
      // Add a third widget
      dashboard.style.width = `${columnWidth * 3}px`;
      dashboard.items = [...dashboard.items, { id: 2 }];
      await nextFrame();
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
        const section = dashboard.querySelector('vaadin-dashboard-section')!;
        fireDragStart(section);
        await nextFrame();

        fireDragOver(getElementFromCell(dashboard, 0, 0)!, 'top');
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
