import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-dashboard.js';
import { isSafari } from '@vaadin/component-base/src/browser-utils.js';
import type { Dashboard, DashboardItem } from '../vaadin-dashboard.js';
import {
  describeBidirectional,
  expectLayout,
  fireResizeEnd,
  fireResizeOver,
  fireResizeStart,
  getElementFromCell,
  onceResized,
  setMaximumColumnWidth,
  setMinimumColumnWidth,
  setMinimumRowHeight,
  setSpacing,
} from './helpers.js';

type TestDashboardItem = DashboardItem & { id: number };

describe('dashboard - widget resizing', () => {
  let dashboard: Dashboard<TestDashboardItem>;
  const columnWidth = 200;
  const rowHeight = 100;

  beforeEach(async () => {
    dashboard = fixtureSync('<vaadin-dashboard></vaadin-dashboard>');
    await nextFrame();

    setMinimumColumnWidth(dashboard, columnWidth);
    setMaximumColumnWidth(dashboard, columnWidth);
    setSpacing(dashboard, 0);
    setMinimumRowHeight(dashboard, rowHeight);

    dashboard.editable = true;

    dashboard.items = [{ id: 0 }, { id: 1 }];
    dashboard.renderer = (root, _, model) => {
      root.textContent = '';
      const widget = fixtureSync(`
        <vaadin-dashboard-widget id="${model.item.id}" widget-title="${model.item.id} title">
          <div class="content">Widget content</div>
        </vaadin-dashboard-widget>`);
      root.appendChild(widget);
    };
    dashboard.style.width = `${columnWidth * 2}px`;
    await onceResized(dashboard);

    // prettier-ignore
    expectLayout(dashboard, [
      [0, 1],
    ]);
  });

  describe('mouse drag', () => {
    describeBidirectional('horizontal', () => {
      it('should resize a widget while dragging (start -> end)', async () => {
        // Start dragging the first widget resize handle
        fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
        await nextFrame();

        // Drag over the end edge of the second one
        fireResizeOver(getElementFromCell(dashboard, 0, 1)!, 'end');
        await nextFrame();

        fireResizeEnd(dashboard);
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

        fireResizeEnd(dashboard);
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

        fireResizeEnd(dashboard);
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

        fireResizeEnd(dashboard);
        await nextFrame();

        // prettier-ignore
        expectLayout(dashboard, [
          [0, 0],
          [1],
        ]);
      });
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

      fireResizeEnd(dashboard);
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

      fireResizeEnd(dashboard);
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

      fireResizeEnd(dashboard);
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

      fireResizeEnd(dashboard);
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
        [0, 2],
      ]);
    });

    it('should not resize vertically if minimum row height is not defined', async () => {
      setMinimumRowHeight(dashboard, undefined);
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

      fireResizeEnd(dashboard);
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
        [2],
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

      fireResizeEnd(dashboard);
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
      ]);
    });

    // This test fails in Safari but only on CI. Locally it works fine.
    (isSafari ? it.skip : it)('should not resize beyond effective column count', async () => {
      const widget1Rect = getElementFromCell(dashboard, 0, 1)!.getBoundingClientRect();

      // Narrow the dashboard to have only one column
      dashboard.style.width = `${columnWidth}px`;
      await onceResized(dashboard);
      // prettier-ignore
      expectLayout(dashboard, [
        [0],
        [1],
      ]);

      fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
      // Try to resize the widget to the cover two columns
      const x = widget1Rect.right;
      const y = widget1Rect.bottom;
      const event = new MouseEvent('mousemove', {
        bubbles: true,
        composed: true,
        clientX: x,
        clientY: y,
        buttons: 1,
      });
      dashboard.dispatchEvent(event);
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [0],
        [1],
      ]);
    });

    it('should dispatch an item resized event', async () => {
      const resizeEndSpy = sinon.spy();
      dashboard.addEventListener('dashboard-item-resized', resizeEndSpy);
      fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();
      fireResizeOver(getElementFromCell(dashboard, 0, 1)!, 'end');
      await nextFrame();
      fireResizeEnd(dashboard);
      await nextFrame();

      expect(resizeEndSpy).to.have.been.calledOnce;
      expect(resizeEndSpy.getCall(0).args[0].detail.item).to.deep.equal({ id: 0, colspan: 2, rowspan: 1 });
      expect(resizeEndSpy.getCall(0).args[0].detail.items).to.deep.equal(dashboard.items);
    });

    it('should not dispatch an item resized event if drag has not started', async () => {
      const resizeEndSpy = sinon.spy();
      dashboard.addEventListener('dashboard-item-resized', resizeEndSpy);

      const widget = getElementFromCell(dashboard, 0, 0)!;
      widget.shadowRoot?.querySelector('.resize-handle')?.remove();
      // Start dragging the first widget by somewhere else than the resize handle
      fireResizeStart(widget);
      await nextFrame();

      fireResizeEnd(dashboard);
      await nextFrame();

      expect(resizeEndSpy).to.not.have.been.called;
    });

    it('should cancel touchmove events while resizing', async () => {
      fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();
      const touchmove = new Event('touchmove', { cancelable: true, bubbles: true });
      document.dispatchEvent(touchmove);

      expect(touchmove.defaultPrevented).to.be.true;
    });

    it('should not cancel touchmove events after resizing has finished', async () => {
      fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();
      fireResizeEnd(dashboard);

      const touchmove = new Event('touchmove', { cancelable: true, bubbles: true });
      document.dispatchEvent(touchmove);

      expect(touchmove.defaultPrevented).to.be.false;
    });

    it('should prevent selection while resizing', async () => {
      const propertyName = isSafari ? 'WebkitUserSelect' : 'userSelect';

      expect(getComputedStyle((dashboard as any).$.grid)[propertyName]).not.to.equal('none');
      fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();

      expect(getComputedStyle((dashboard as any).$.grid)[propertyName]).to.equal('none');

      fireResizeEnd(dashboard);
      await nextFrame();

      expect(getComputedStyle((dashboard as any).$.grid)[propertyName]).not.to.equal('none');
    });

    it('should not throw with a lazy renderer while resizing', async () => {
      dashboard.style.width = `${columnWidth}px`;
      await onceResized(dashboard);
      // prettier-ignore
      expectLayout(dashboard, [
        [0],
        [1],
      ]);

      const widget1Rect = getElementFromCell(dashboard, 1, 0)!.getBoundingClientRect();

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

      fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();
      fireResizeOver(getElementFromCell(dashboard, 0, 0)!, 'top');
      await nextFrame();

      expect(() => {
        // Dispatch dragover event while the renderer is still rendering (no widget in the cells)
        const x = widget1Rect.left + widget1Rect.width / 2;
        const y = widget1Rect.bottom;
        const event = new MouseEvent('mousemove', {
          bubbles: true,
          composed: true,
          clientX: x,
          clientY: y,
          buttons: 1,
        });
        dashboard.dispatchEvent(event);
      }).to.not.throw();
    });

    it('should take gap into account when resizing', async () => {
      dashboard.style.width = `${columnWidth * 3}px`;
      setSpacing(dashboard, 20);
      await onceResized(dashboard);

      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
      ]);

      fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();

      const widget1Rect = getElementFromCell(dashboard, 0, 1)!.getBoundingClientRect();
      const x = widget1Rect.left + widget1Rect.width / 2 - 10;
      const y = widget1Rect.bottom;
      const event = new MouseEvent('mousemove', {
        bubbles: true,
        composed: true,
        clientX: x,
        clientY: y,
        buttons: 1,
      });
      dashboard.dispatchEvent(event);
      await nextFrame();

      // prettier-ignore
      expectLayout(dashboard, [
        [0, 1],
      ]);
    });

    it('should not shrink colspan below 0', async () => {
      fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();
      fireResizeOver(getElementFromCell(dashboard, 0, 0)!, 'start');
      await nextFrame();

      expect((dashboard.items[0] as TestDashboardItem).colspan).to.be.undefined;
    });

    it('should not shrink rowspan below 0', async () => {
      fireResizeStart(getElementFromCell(dashboard, 0, 0)!);
      await nextFrame();
      fireResizeOver(getElementFromCell(dashboard, 0, 0)!, 'top');
      await nextFrame();

      expect((dashboard.items[0] as TestDashboardItem).rowspan).to.be.undefined;
    });

    it('should have resizing attributes on the widget', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      fireResizeStart(widget);
      await nextFrame();

      expect(widget.hasAttribute('resizing')).to.be.true;
    });

    it('should remove resizing attributes from the widget', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      fireResizeStart(widget);
      await nextFrame();
      fireResizeEnd(dashboard);
      await nextFrame();

      expect(widget.hasAttribute('resizing')).to.be.false;
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
        expect(dashboard.querySelectorAll(`vaadin-dashboard-widget[id='0']`).length).to.equal(1);
      });

      it('should not remove resized element with a renderer that reuses same instances', async () => {
        const reusedWidgets = [
          fixtureSync('<vaadin-dashboard-widget id="0" widget-title="0 title"></vaadin-dashboard-widget>'),
          fixtureSync('<vaadin-dashboard-widget id="1" widget-title="1 title"></vaadin-dashboard-widget>'),
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
