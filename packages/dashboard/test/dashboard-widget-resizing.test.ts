import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-dashboard.js';
import type { Dashboard, DashboardItem } from '../vaadin-dashboard.js';
import {
  expectLayout,
  fireResizeEnd,
  fireResizeOver,
  fireResizeStart,
  getElementFromCell,
  setGap,
  setMaximumColumnWidth,
  setMinimumColumnWidth,
  setMinimumRowHeight,
} from './helpers.js';

type TestDashboardItem = DashboardItem & { id: number };

describe('dashboard - widget resizing', () => {
  let dashboard: Dashboard<TestDashboardItem>;
  const columnWidth = 100;
  const rowHeight = 100;

  beforeEach(async () => {
    dashboard = fixtureSync('<vaadin-dashboard></vaadin-dashboard>');
    dashboard.style.width = `${columnWidth * 2}px`;
    setMinimumColumnWidth(dashboard, columnWidth);
    setMaximumColumnWidth(dashboard, columnWidth);
    setGap(dashboard, 0);
    setMinimumRowHeight(dashboard, rowHeight);

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

  describe('mouse drag', () => {
    it('should resize a widget while dragging (start -> end)', async () => {
      // Start dragging the first widget resize handle
      fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();

      // Drag over the end edge of the second one
      fireResizeOver(getElementFromCell(dashboard, 0, 1)!, 'end');
      await nextFrame();

      // Expect the widgets to be reordered
      // prettier-ignore
      expectLayout(dashboard, [
        [0, 0],
        [1],
      ]);
    });

    it('should not resize if dragged barely over another widget (start -> end)', async () => {
      fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();

      fireResizeOver(getElementFromCell(dashboard, 0, 1)!, 'start');
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
      ]);
    });

    it('should resize a widget while dragging (end -> start)', async () => {
      dashboard.items = [{ id: 0, colspan: 2 }, { id: 1 }];
      await nextFrame();
      // prettier-ignore
      expectLayout(dashboard, [
        [0, 0],
        [1],
      ]);

      fireResizeStart(getElementFromCell(dashboard, 0, 1)!);
      await nextFrame();

      fireResizeOver(getElementFromCell(dashboard, 0, 0)!, 'start');
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
      ]);
    });

    it('should not resize if dragged barely over another widget (end -> start)', async () => {
      dashboard.items = [{ id: 0, colspan: 2 }, { id: 1 }];
      await nextFrame();
      // prettier-ignore
      expectLayout(dashboard, [
        [0, 0],
        [1],
      ]);

      fireResizeStart(getElementFromCell(dashboard, 0, 1)!);
      await nextFrame();

      fireResizeOver(getElementFromCell(dashboard, 0, 0)!, 'end');
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [0, 0],
        [1],
      ]);
    });

    it('should resize a widget while dragging (top -> bottom)', async () => {
      dashboard.items = [{ id: 0 }, { id: 1 }, { id: 2 }];
      await nextFrame();
      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
        [2],
      ]);

      fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();

      fireResizeOver(getElementFromCell(dashboard, 1, 0)!, 'bottom');
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
        [0, 2],
      ]);
    });

    it('should not resize if dragged barely over another widget (top -> bottom)', async () => {
      dashboard.items = [{ id: 0 }, { id: 1 }, { id: 2 }];
      await nextFrame();
      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
        [2],
      ]);

      fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();

      fireResizeOver(getElementFromCell(dashboard, 1, 0)!, 'top');
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
        [2],
      ]);
    });

    it('should resize a widget while dragging (bottom -> top)', async () => {
      dashboard.items = [{ id: 0, rowspan: 2 }, { id: 1 }, { id: 2 }];
      await nextFrame();
      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
        [0, 2],
      ]);

      fireResizeStart(getElementFromCell(dashboard, 1, 0)!);
      await nextFrame();

      fireResizeOver(getElementFromCell(dashboard, 0, 0)!, 'top');
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
        [2],
      ]);
    });

    it('should not resize if dragged barely over another widget (bottom -> top)', async () => {
      dashboard.items = [{ id: 0, rowspan: 2 }, { id: 1 }, { id: 2 }];
      await nextFrame();
      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
        [0, 2],
      ]);

      fireResizeStart(getElementFromCell(dashboard, 1, 0)!);
      await nextFrame();

      fireResizeOver(getElementFromCell(dashboard, 0, 0)!, 'bottom');
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
        [0, 2],
      ]);
    });

    it('should not resize a widget if not dragging by the resize handle', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      widget.shadowRoot?.querySelector('.resize-handle')?.remove();

      // Start dragging the first widget by somewhere else than the resize handle
      fireResizeStart(widget);
      await nextFrame();

      // Drag over the end edge of the second one
      fireResizeOver(getElementFromCell(dashboard, 0, 1)!, 'end');
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
      ]);
    });

    it('should dispatch an item resize start event', async () => {
      const resizeStartSpy = sinon.spy();
      dashboard.addEventListener('dashboard-item-resize-start', resizeStartSpy);
      fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();

      expect(resizeStartSpy).to.have.been.calledOnce;
    });

    it('should dispatch an item drag resize event', async () => {
      const resizeSpy = sinon.spy();
      dashboard.addEventListener('dashboard-item-drag-resize', resizeSpy);
      dashboard.addEventListener('dashboard-item-drag-resize', (e) => e.preventDefault());
      fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();
      fireResizeOver(getElementFromCell(dashboard, 0, 1)!, 'end');
      await nextFrame();

      expect(resizeSpy).to.have.been.calledOnce;
      expect(resizeSpy.getCall(0).args[0].detail).to.deep.equal({
        item: { id: 0 },
        colspan: 2,
        rowspan: 1,
      });
    });

    it('should not resize if the drag resize event is cancelled', async () => {
      dashboard.addEventListener('dashboard-item-drag-resize', (e) => e.preventDefault());
      fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();
      fireResizeOver(getElementFromCell(dashboard, 0, 1)!, 'end');
      await nextFrame();
      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
      ]);
    });

    it('should dispatch an item resize end event', async () => {
      const resizeEndSpy = sinon.spy();
      dashboard.addEventListener('dashboard-item-resize-end', resizeEndSpy);
      fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();
      fireResizeOver(getElementFromCell(dashboard, 0, 1)!, 'end');
      await nextFrame();
      fireResizeEnd(dashboard);
      await nextFrame();

      expect(resizeEndSpy).to.have.been.calledOnce;
      expect(resizeEndSpy.getCall(0).args[0].detail).to.deep.equal({
        item: { id: 0, colspan: 2, rowspan: 1 },
      });
    });

    it('should cancel touchmove events while resizing', async () => {
      fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();
      const touchmove = new TouchEvent('touchmove', { cancelable: true, bubbles: true });
      document.dispatchEvent(touchmove);

      expect(touchmove.defaultPrevented).to.be.true;
    });

    it('should not cancel touchmove events after resizing has finished', async () => {
      fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();
      fireResizeEnd(dashboard);

      const touchmove = new TouchEvent('touchmove', { cancelable: true, bubbles: true });
      document.dispatchEvent(touchmove);

      expect(touchmove.defaultPrevented).to.be.false;
    });

    it('should prevent selection while resizing', async () => {
      expect(getComputedStyle(getElementFromCell(dashboard, 0, 0)!).userSelect).not.to.equal('none');
      fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();

      expect(getComputedStyle(getElementFromCell(dashboard, 0, 0)!).userSelect).to.equal('none');

      fireResizeEnd(dashboard);
      await nextFrame();

      expect(getComputedStyle(getElementFromCell(dashboard, 0, 0)!).userSelect).not.to.equal('none');
    });

    // Make sure the original resized element is restored in the host.
    // Otherwise, "track" event would stop working.
    describe('ensure track event', () => {
      it('should restore the original resized element in host', async () => {
        const originalResizedElement = getElementFromCell(dashboard, 0, 0)!;
        fireResizeStart(originalResizedElement);
        await nextFrame();
        fireResizeOver(getElementFromCell(dashboard, 0, 1)!, 'end');
        await nextFrame();

        expect(dashboard.contains(originalResizedElement)).to.be.true;
      });

      it('should remove duplicate elements once resize has ended', async () => {
        fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
        await nextFrame();
        fireResizeOver(getElementFromCell(dashboard, 0, 1)!, 'end');
        await nextFrame();

        fireResizeEnd(dashboard);
        await nextFrame();

        // Make sure the original dragged element is removed from the host if it was
        // restored.
        expect(dashboard.querySelectorAll(`vaadin-dashboard-widget[id='item-0']`).length).to.equal(1);
      });

      it('should not remove resized element with a renderer that reuses same instances', async () => {
        const reusedWidgets = [
          fixtureSync('<vaadin-dashboard-widget id="item-0" widget-title="0 title"></vaadin-dashboard-widget>'),
          fixtureSync('<vaadin-dashboard-widget id="item-1" widget-title="1 title"></vaadin-dashboard-widget>'),
        ];
        dashboard.renderer = (root, _, model) => {
          root.textContent = '';
          root.appendChild(reusedWidgets[model.item.id]);
        };
        await nextFrame();

        fireResizeStart(reusedWidgets[0]);
        await nextFrame();
        fireResizeOver(reusedWidgets[1], 'end');
        await nextFrame();

        fireResizeEnd(dashboard);
        expect(reusedWidgets[0].isConnected).to.be.true;
      });
    });
  });
});
