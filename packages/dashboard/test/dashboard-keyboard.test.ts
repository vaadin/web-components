import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, isChrome, isFirefox, nextFrame, nextResize } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-dashboard.js';
import type { Dashboard, DashboardItem } from '../src/vaadin-dashboard.js';
import {
  describeBidirectional,
  getDraggable,
  getElementFromCell,
  getMoveApplyButton,
  getMoveBackwardButton,
  getMoveForwardButton,
  getResizeApplyButton,
  getResizeGrowHeightButton,
  getResizeGrowWidthButton,
  getResizeHandle,
  getResizeShrinkHeightButton,
  getResizeShrinkWidthButton,
  setMaximumColumnCount,
  setMaximumColumnWidth,
  setMinimumColumnWidth,
  setMinimumRowHeight,
  setSpacing,
  updateComplete,
} from './helpers.js';

type TestDashboardItem = DashboardItem & { id: number };

describe('dashboard - keyboard interaction', () => {
  let dashboard: Dashboard<TestDashboardItem>;
  let keydownSpy;
  let firstGlobalFocusable: HTMLElement;
  const columnWidth = 200;

  beforeEach(async () => {
    [firstGlobalFocusable, dashboard] = fixtureSync(
      `<div>
        <input id="first-global-focusable" />
        <vaadin-dashboard></vaadin-dashboard>
      </div>`,
    ).children as unknown as [HTMLElement, Dashboard<TestDashboardItem>];
    firstGlobalFocusable.focus();
    await nextFrame();
    dashboard.editable = true;
    keydownSpy = sinon.spy();
    dashboard.addEventListener('keydown', keydownSpy);
    setMinimumColumnWidth(dashboard, columnWidth);
    setMaximumColumnWidth(dashboard, columnWidth);
    setMinimumRowHeight(dashboard, undefined);
    setSpacing(dashboard, 0);

    dashboard.items = [{ id: 0 }, { id: 1 }, { items: [{ id: 2 }, { id: 3 }] }];
    dashboard.renderer = (root, _, model) => {
      if (root.firstElementChild?.id !== `item-${model.item.id}`) {
        root.textContent = '';
        const widget = document.createElement('vaadin-dashboard-widget');
        widget.id = `item-${model.item.id}`;
        widget.widgetTitle = `${model.item.id} title`;
        root.appendChild(widget);
      }
    };

    dashboard.style.width = `${columnWidth * 2}px`;
    await nextResize(dashboard);
  });

  it('should focus the widget', async () => {
    const widget = getElementFromCell(dashboard, 0, 0)!;
    await sendKeys({ press: 'Tab' });
    expect(document.activeElement).to.equal(widget);
    expect(widget.hasAttribute('focused')).to.be.true;
    expect(widget.hasAttribute('selected')).to.be.false;
  });

  it('should select the widget', async () => {
    const widget = getElementFromCell(dashboard, 0, 0)!;
    await sendKeys({ press: 'Tab' });
    await sendKeys({ press: 'Space' });
    expect(widget.hasAttribute('focused')).to.be.false;
    expect(widget.hasAttribute('selected')).to.be.true;
    expect(dashboard.hasAttribute('item-selected')).to.be.true;
  });

  it('should unselect the widget on focus button click', async () => {
    const widget = getElementFromCell(dashboard, 0, 0)!;
    await sendKeys({ press: 'Tab' });
    await sendKeys({ press: 'Space' });

    // Focus the focus-button with shift + tab
    await sendKeys({ press: 'Shift+Tab' });

    // Click the focus-button
    await sendKeys({ press: 'Space' });

    expect(widget.hasAttribute('focused')).to.be.true;
    expect(widget.hasAttribute('selected')).to.be.false;
    expect(dashboard.hasAttribute('item-selected')).to.be.false;
  });

  it('should dispatch a selection event', async () => {
    const spy = sinon.spy();
    dashboard.addEventListener('dashboard-item-selected-changed', spy);
    await sendKeys({ press: 'Tab' });
    await sendKeys({ press: 'Space' });
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0].detail).to.eql({ item: { id: 0 }, value: true });
  });

  (isChrome || isFirefox ? it : it.skip)('should not remove the widget on Delete', async () => {
    await sendKeys({ press: 'Tab' });
    await sendKeys({ press: 'Delete' });
    expect(dashboard.items).to.eql([{ id: 0 }, { id: 1 }, { items: [{ id: 2 }, { id: 3 }] }]);
  });

  it('should not focus the section on section widget focus', async () => {
    const widget = getElementFromCell(dashboard, 1, 0)!;
    widget.focus();
    await nextFrame();
    expect(document.activeElement).to.equal(widget);
    expect(widget.hasAttribute('focused')).to.be.true;
    expect(widget.hasAttribute('selected')).to.be.false;

    const section = widget.closest('vaadin-dashboard-section')!;
    expect(section.hasAttribute('focused')).to.be.false;
  });

  it('should tab to the next widget', async () => {
    await sendKeys({ press: 'Tab' });
    await sendKeys({ press: 'Tab' });
    expect(document.activeElement).to.equal(getElementFromCell(dashboard, 0, 1));
  });

  describe('selected widget', () => {
    beforeEach(async () => {
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Space' });
    });

    it('should deselect the widget on escape', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      await sendKeys({ press: 'Escape' });
      expect(widget.hasAttribute('selected')).to.be.false;
      expect(widget.hasAttribute('focused')).to.be.true;
      expect(dashboard.hasAttribute('item-selected')).to.be.false;
    });

    it('should dispatch a selection event', async () => {
      const spy = sinon.spy();
      dashboard.addEventListener('dashboard-item-selected-changed', spy);
      await sendKeys({ press: 'Escape' });
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail).to.eql({ item: { id: 0 }, value: false });
    });

    it('should blur deselected widget on shift tab', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Shift+Tab' });
      expect(widget.hasAttribute('selected')).to.be.false;
      expect(widget.hasAttribute('focused')).to.be.false;
      expect(widget.contains(document.activeElement)).to.be.false;
    });

    it('should tab to the widget controls', async () => {
      await sendKeys({ press: 'Tab' });
      const widget = getElementFromCell(dashboard, 0, 0)!;
      expect(widget.contains(document.activeElement)).to.be.true;
    });

    it('should deselect the widget on blur', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      const anotherWidget = getElementFromCell(dashboard, 0, 1)!;
      anotherWidget.focus();
      await nextFrame();
      expect(widget.hasAttribute('selected')).to.be.false;
      expect(widget.hasAttribute('focused')).to.be.false;
    });

    it('should remove the widget on Delete', async () => {
      await sendKeys({ press: 'Delete' });
      expect(dashboard.items).to.eql([{ id: 1 }, { items: [{ id: 2 }, { id: 3 }] }]);
    });

    it('should remove the widget on delete', async () => {
      await sendKeys({ press: 'Delete' });
      expect(dashboard.items).to.eql([{ id: 1 }, { items: [{ id: 2 }, { id: 3 }] }]);
    });

    it('should dispatch an item removed event on Delete', async () => {
      const spy = sinon.spy();
      dashboard.addEventListener('dashboard-item-removed', spy);
      await sendKeys({ press: 'Delete' });
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail.item).to.eql({ id: 0 });
      expect(spy.firstCall.args[0].detail.items).to.eql(dashboard.items);
    });

    it('should move the widget forwards on arrow down', async () => {
      await sendKeys({ press: 'ArrowDown' });
      expect(dashboard.items).to.eql([{ id: 1 }, { id: 0 }, { items: [{ id: 2 }, { id: 3 }] }]);
    });

    it('should move the widget backwards on arrow up', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await updateComplete(dashboard);
      await sendKeys({ press: 'ArrowUp' });
      expect(dashboard.items).to.eql([{ id: 0 }, { id: 1 }, { items: [{ id: 2 }, { id: 3 }] }]);
    });

    it('should dispatch an item moved event arrow down', async () => {
      const spy = sinon.spy();
      dashboard.addEventListener('dashboard-item-moved', spy);
      await sendKeys({ press: 'ArrowDown' });
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail.item).to.eql({ id: 0 });
      expect(spy.firstCall.args[0].detail.items).to.eql(dashboard.items);
      expect(spy.firstCall.args[0].detail.section).to.be.undefined;
    });

    it('should not dispatch an item-move event', async () => {
      const spy = sinon.spy();
      // @ts-ignore unexpected event type
      dashboard.addEventListener('item-move', spy);
      await sendKeys({ press: 'ArrowDown' });
      expect(spy.called).to.be.false;
    });

    it('should increase the widget row span on shift + arrow down', async () => {
      // Set minimum row height to enable vertical resizing
      setMinimumRowHeight(dashboard, 100);
      await sendKeys({ press: 'Shift+ArrowDown' });
      expect((dashboard.items[0] as DashboardItem).rowspan).to.equal(2);
    });

    it('should decrease the widget row span on shift + arrow up', async () => {
      // Set minimum row height to enable vertical resizing
      setMinimumRowHeight(dashboard, 100);
      await sendKeys({ press: 'Shift+ArrowDown' });
      await updateComplete(dashboard);
      await sendKeys({ press: 'Shift+ArrowUp' });
      expect((dashboard.items[0] as DashboardItem).rowspan).to.equal(1);
    });

    it('should dispatch an item resized event shift + arrow down', async () => {
      const spy = sinon.spy();
      dashboard.addEventListener('dashboard-item-resized', spy);
      await sendKeys({ press: 'Shift+ArrowDown' });
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail.item).to.eql({ id: 0 });
      expect(spy.firstCall.args[0].detail.items).to.eql(dashboard.items);
      expect(spy.firstCall.args[0].detail.section).to.be.undefined;
    });

    it('should not dispatch an item-resize event', async () => {
      const spy = sinon.spy();
      // @ts-ignore unexpected event type
      dashboard.addEventListener('item-resize', spy);
      await sendKeys({ press: 'Shift+ArrowDown' });
      expect(spy.called).to.be.false;
    });

    it('should not increase the widget row span on shift + arrow down if row min height is not defined', async () => {
      await sendKeys({ press: 'Shift+ArrowDown' });
      expect((dashboard.items[0] as DashboardItem).rowspan).to.not.equal(2);
    });

    it('should not move the widget on arrow down if ctrl key is pressed', async () => {
      await sendKeys({ press: 'Control+ArrowDown' });
      expect(dashboard.items).to.eql([{ id: 0 }, { id: 1 }, { items: [{ id: 2 }, { id: 3 }] }]);
    });

    it('should cancel the default action on Delete', async () => {
      keydownSpy.resetHistory();
      await sendKeys({ press: 'Delete' });
      expect(keydownSpy.firstCall.args[0].defaultPrevented).to.be.true;
    });

    it('should cancel the default action on escape', async () => {
      keydownSpy.resetHistory();
      await sendKeys({ press: 'Escape' });
      expect(keydownSpy.firstCall.args[0].defaultPrevented).to.be.true;
    });

    it('should cancel the default action on ArrowDown', async () => {
      keydownSpy.resetHistory();
      await sendKeys({ press: 'ArrowDown' });
      expect(keydownSpy.firstCall.args[0].defaultPrevented).to.be.true;
    });

    it('should cancel the default action on shift + ArrowDown', async () => {
      await sendKeys({ down: 'Shift' });
      keydownSpy.resetHistory();
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ up: 'Shift' });
      expect(keydownSpy.firstCall.args[0].defaultPrevented).to.be.true;
    });

    it('should not cancel the default action on unrelated keydown', async () => {
      keydownSpy.resetHistory();
      await sendKeys({ press: 'A' });
      expect(keydownSpy.firstCall.args[0].defaultPrevented).to.be.false;
    });

    it('should do nothing to the first widget on arrow up', async () => {
      await sendKeys({ press: 'ArrowUp' });
      expect(dashboard.items).to.eql([{ id: 0 }, { id: 1 }, { items: [{ id: 2 }, { id: 3 }] }]);
    });

    it('should do nothing to the last widget on arrow down', async () => {
      getElementFromCell(dashboard, 1, 1)!.focus();
      await sendKeys({ press: 'Space' });
      await sendKeys({ press: 'ArrowDown' });
      expect(dashboard.items).to.eql([{ id: 0 }, { id: 1 }, { items: [{ id: 2 }, { id: 3 }] }]);
    });

    it('should trap focus inside the widget', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      for (let i = 0; i < 10; i++) {
        await sendKeys({ press: 'Tab' });
        expect(widget.contains(document.activeElement)).to.be.true;
      }
    });

    it('should release focus trap on deselect', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Shift+Tab' });
      expect(widget.contains(document.activeElement)).to.be.false;
    });

    describeBidirectional('horizontal', () => {
      let arrowForwards;
      let arrowBackwards;

      beforeEach(() => {
        arrowForwards = document.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
        arrowBackwards = document.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
      });

      it('should move the widget forwards on arrow forwards', async () => {
        await sendKeys({ press: arrowForwards });
        expect(dashboard.items).to.eql([{ id: 1 }, { id: 0 }, { items: [{ id: 2 }, { id: 3 }] }]);
      });

      it('should move the widget backwards on arrow backwards', async () => {
        await sendKeys({ press: arrowForwards });
        await updateComplete(dashboard);
        await sendKeys({ press: arrowBackwards });
        expect(dashboard.items).to.eql([{ id: 0 }, { id: 1 }, { items: [{ id: 2 }, { id: 3 }] }]);
      });

      it('should increase the widget column span on shift + arrow forwards', async () => {
        await sendKeys({ press: `Shift+${arrowForwards}` });
        expect((dashboard.items[0] as DashboardItem).colspan).to.equal(2);
      });

      it('should decrease the widget column span on shift + arrow backwards', async () => {
        await sendKeys({ press: `Shift+${arrowForwards}` });
        await updateComplete(dashboard);
        await sendKeys({ press: `Shift+${arrowBackwards}` });
        expect((dashboard.items[0] as DashboardItem).colspan).to.equal(1);
      });
    });
  });

  describe('selected section', () => {
    let section: HTMLElement;
    beforeEach(async () => {
      const widget = getElementFromCell(dashboard, 1, 0)!;
      section = widget.closest('vaadin-dashboard-section')!;
      section.focus();
      await sendKeys({ press: 'Space' });
      await nextFrame();
    });

    it('should deselect the section on escape', async () => {
      await sendKeys({ press: 'Escape' });
      expect(section.hasAttribute('selected')).to.be.false;
      expect(section.hasAttribute('focused')).to.be.true;
    });

    it('should dispatch a selection event', async () => {
      const spy = sinon.spy();
      dashboard.addEventListener('dashboard-item-selected-changed', spy);
      await sendKeys({ press: 'Escape' });
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail).to.eql({ item: { items: [{ id: 2 }, { id: 3 }] }, value: false });
    });

    it('should blur deselected selected on shift tab', async () => {
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Shift+Tab' });
      expect(section.hasAttribute('selected')).to.be.false;
      expect(section.hasAttribute('focused')).to.be.false;
      expect(section.contains(document.activeElement)).to.be.false;
    });

    it('should tab to the section controls', async () => {
      await sendKeys({ press: 'Tab' });
      expect(section.contains(document.activeElement)).to.be.true;
    });

    it('should deselect the section on blur', async () => {
      const anotherWidget = getElementFromCell(dashboard, 0, 1)!;
      anotherWidget.focus();
      await nextFrame();
      expect(section.hasAttribute('selected')).to.be.false;
      expect(section.hasAttribute('focused')).to.be.false;
    });

    it('should trap focus inside the widget', async () => {
      const sectionWidgets = section.querySelectorAll('vaadin-dashboard-widget');
      for (let i = 0; i < 10; i++) {
        await sendKeys({ press: 'Tab' });
        expect(section.contains(document.activeElement)).to.be.true;
        sectionWidgets.forEach((sectionWidget) => {
          expect(sectionWidget.contains(document.activeElement)).to.be.false;
        });
      }
    });

    it('should release focus trap on deselect', async () => {
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Shift+Tab' });
      expect(section.contains(document.activeElement)).to.be.false;
    });

    it('should not increase the section row span on shift + arrow down', async () => {
      await sendKeys({ press: 'Shift+ArrowDown' });
      expect(dashboard.items).to.eql([{ id: 0 }, { id: 1 }, { items: [{ id: 2 }, { id: 3 }] }]);
    });
  });

  it('should enter move mode', async () => {
    const widget = getElementFromCell(dashboard, 0, 0)!;
    // Select
    await sendKeys({ press: 'Tab' });
    await sendKeys({ press: 'Space' });
    // Enter move mode
    await sendKeys({ press: 'Space' });

    expect(widget.hasAttribute('focused')).to.be.false;
    expect(widget.hasAttribute('selected')).to.be.true;
    expect(widget.hasAttribute('move-mode')).to.be.true;
  });

  // These tests don't work on Firefox / Safari even though the functionality they test works
  (isChrome ? it : it.skip)('should blur the focused widget when dashboard becomes non-editable', async () => {
    const widget = getElementFromCell(dashboard, 0, 0)!;
    await sendKeys({ press: 'Tab' });
    await nextFrame();
    expect(widget.contains(document.activeElement)).to.be.true;
    expect(widget.hasAttribute('focused')).to.be.true;
    dashboard.editable = false;
    await nextFrame();
    expect(widget.contains(document.activeElement)).to.be.false;
    expect(widget.hasAttribute('focused')).to.be.false;
  });

  it('should enter move mode without selecting first', async () => {
    const widget = getElementFromCell(dashboard, 0, 0)!;
    (getDraggable(widget) as HTMLElement).click();
    await nextFrame();

    expect(widget.hasAttribute('focused')).to.be.false;
    expect(widget.hasAttribute('selected')).to.be.true;
    expect(widget.hasAttribute('move-mode')).to.be.true;
  });

  it('should dispatch a move mode event', async () => {
    const spy = sinon.spy();
    dashboard.addEventListener('dashboard-item-move-mode-changed', spy);
    const widget = getElementFromCell(dashboard, 0, 0)!;
    (getDraggable(widget) as HTMLElement).click();
    await nextFrame();
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0].detail).to.eql({ item: { id: 0 }, value: true });
  });

  describe('widget in move mode', () => {
    beforeEach(async () => {
      // Select
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Space' });
      // Enter move mode
      await sendKeys({ press: 'Space' });
      await nextFrame();
    });

    it('should exit move mode on escape', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      await sendKeys({ press: 'Escape' });
      expect(widget.hasAttribute('move-mode')).to.be.false;
      expect(widget.hasAttribute('selected')).to.be.true;
      expect(widget.hasAttribute('focused')).to.be.false;
    });

    it('should dispatch a move mode event', async () => {
      const spy = sinon.spy();
      dashboard.addEventListener('dashboard-item-move-mode-changed', spy);
      await sendKeys({ press: 'Escape' });
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail).to.eql({ item: { id: 0 }, value: false });
    });

    it('should exit move mode on apply', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      // Apply button focused, click it
      await sendKeys({ press: 'Space' });
      expect(widget.hasAttribute('move-mode')).to.be.false;
      expect(widget.hasAttribute('selected')).to.be.true;
      expect(widget.hasAttribute('focused')).to.be.false;
    });

    it('should focus drag handle on exit move mode', async () => {
      // Apply button focused, click it
      await sendKeys({ press: 'Space' });
      expect(getDraggable(getElementFromCell(dashboard, 0, 0)!).matches(':focus')).to.be.true;
    });

    it('should move the widget forwards on forward button click', async () => {
      // Focus forward button, click it
      await sendKeys({ press: 'Tab' });
      const widget = getElementFromCell(dashboard, 0, 0)!;
      expect(getMoveForwardButton(widget).matches(':focus')).to.be.true;
      await sendKeys({ press: 'Space' });
      expect(dashboard.items).to.eql([{ id: 1 }, { id: 0 }, { items: [{ id: 2 }, { id: 3 }] }]);
    });

    it('should move the widget backwards on backward button click', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;

      // Focus forward button, click it
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Space' });
      await nextFrame();
      // Focus backward button, click it
      await sendKeys({ press: 'Shift+Tab' });
      await sendKeys({ press: 'Shift+Tab' });
      await nextFrame();

      expect(getMoveBackwardButton(widget).matches(':focus')).to.be.true;
      await sendKeys({ press: 'Space' });
      await nextFrame();

      expect(dashboard.items).to.eql([{ id: 0 }, { id: 1 }, { items: [{ id: 2 }, { id: 3 }] }]);
    });

    it('should dispatch an item moved event on forward button click', async () => {
      const spy = sinon.spy();
      dashboard.addEventListener('dashboard-item-moved', spy);
      // Focus forward button, click it
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Space' });
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail.item).to.eql({ id: 0 });
      expect(spy.firstCall.args[0].detail.items).to.eql(dashboard.items);
      expect(spy.firstCall.args[0].detail.section).to.be.undefined;
    });

    it('should not lose move mode when the focused backward button is hidden', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;

      // Focus forward button, click it
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Space' });
      await nextFrame();
      // Focus backwards button, click it
      await sendKeys({ press: 'Shift+Tab' });
      await sendKeys({ press: 'Shift+Tab' });
      await sendKeys({ press: 'Space' });
      await nextFrame();

      // As the widget becomes the first child, the backwards button is hidden but the focus
      // should remain in the move mode (apply button focused)
      expect(getComputedStyle(getMoveBackwardButton(widget)).display).to.equal('none');

      // This for some reason does not work on CI, passes locally
      // expect(getMoveApplyButton(widget).matches(':focus')).to.be.true;

      expect(widget.hasAttribute('move-mode')).to.be.true;
      expect(widget.hasAttribute('selected')).to.be.true;
      expect(widget.hasAttribute('focused')).to.be.false;
    });

    it('should not lose move mode when the focused forward button is hidden', async () => {
      const widget = getElementFromCell(dashboard, 1, 0)!;
      widget.focus();
      await nextFrame();

      // Enter move mode
      await sendKeys({ press: 'Space' });
      await sendKeys({ press: 'Space' });
      await nextFrame();

      // Focus forward button, click it
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Space' });
      await nextFrame();

      // Expect the items to have been reordered
      expect(dashboard.items).to.eql([{ id: 0 }, { id: 1 }, { items: [{ id: 3 }, { id: 2 }] }]);

      // As the widget becomes the last child, the forward button is hidden but the focus
      // should remain in the move mode (apply button focused)
      expect(getComputedStyle(getMoveForwardButton(widget)).display).to.equal('none');

      // This for some reason does not work on CI, passes locally
      // expect(getMoveApplyButton(widget).matches(':focus')).to.be.true;

      expect(widget.hasAttribute('move-mode')).to.be.true;
      expect(widget.hasAttribute('selected')).to.be.true;
      expect(widget.hasAttribute('focused')).to.be.false;
    });

    it('should deselect the section on blur', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      const anotherWidget = getElementFromCell(dashboard, 0, 1)!;
      anotherWidget.focus();
      await nextFrame();
      expect(widget.hasAttribute('move-mode')).to.be.false;
      expect(widget.hasAttribute('selected')).to.be.false;
      expect(widget.hasAttribute('focused')).to.be.false;
    });

    it('should trap focus inside the move mode', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      const moveModeButtons = [getMoveBackwardButton(widget), getMoveForwardButton(widget), getMoveApplyButton(widget)];
      for (let i = 0; i < 10; i++) {
        await sendKeys({ press: 'Tab' });
        expect(moveModeButtons.includes(widget.shadowRoot!.activeElement as HTMLElement)).to.be.true;
      }
    });

    it('should trap back inside the widget after exiting move mode', async () => {
      await sendKeys({ press: 'Escape' });
      const widget = getElementFromCell(dashboard, 0, 0)!;
      const moveModeButtons = [getMoveBackwardButton(widget), getMoveForwardButton(widget), getMoveApplyButton(widget)];
      for (let i = 0; i < 10; i++) {
        await sendKeys({ press: 'Tab' });
        expect(widget.contains(document.activeElement)).to.be.true;
        expect(moveModeButtons.includes(widget.shadowRoot!.activeElement as HTMLElement)).to.be.false;
      }
    });

    it('should move the section backwards on backward button click', async () => {
      const widget = getElementFromCell(dashboard, 1, 0)!;
      const section = widget.closest('vaadin-dashboard-section')!;
      section.focus();
      // Enter move mode
      await sendKeys({ press: 'Space' });
      await sendKeys({ press: 'Space' });
      await nextFrame();

      // backward button focused, click it
      expect(getMoveBackwardButton(section).matches(':focus')).to.be.true;
      await sendKeys({ press: 'Space' });
      await nextFrame();

      expect(dashboard.items).to.eql([{ id: 0 }, { items: [{ id: 2 }, { id: 3 }] }, { id: 1 }]);
    });

    (isChrome ? it : it.skip)('should blur the widget when dashboard becomes non-editable', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      expect(widget.contains(document.activeElement)).to.be.true;
      expect(widget.hasAttribute('selected')).to.be.true;
      expect(widget.hasAttribute('focused')).to.be.false;
      dashboard.editable = false;
      await nextFrame();
      expect(widget.contains(document.activeElement)).to.be.false;
      expect(widget.hasAttribute('selected')).to.be.false;
      expect(widget.hasAttribute('focused')).to.be.false;
    });
  });

  it('should enter resize mode', async () => {
    const widget = getElementFromCell(dashboard, 0, 0)!;
    // Select
    await sendKeys({ press: 'Tab' });
    await sendKeys({ press: 'Space' });
    // Enter resize mode
    await sendKeys({ press: 'Tab' });
    await sendKeys({ press: 'Tab' });
    await sendKeys({ press: 'Space' });

    expect(widget.hasAttribute('focused')).to.be.false;
    expect(widget.hasAttribute('selected')).to.be.true;
    expect(widget.hasAttribute('resize-mode')).to.be.true;
  });

  it('should enter resize mode without selecting first', async () => {
    const widget = getElementFromCell(dashboard, 0, 0)!;
    (getResizeHandle(widget) as HTMLElement).click();
    await nextFrame();

    expect(widget.hasAttribute('focused')).to.be.false;
    expect(widget.hasAttribute('selected')).to.be.true;
    expect(widget.hasAttribute('resize-mode')).to.be.true;
  });

  it('should dispatch a resize mode event', async () => {
    const spy = sinon.spy();
    dashboard.addEventListener('dashboard-item-resize-mode-changed', spy);
    const widget = getElementFromCell(dashboard, 0, 0)!;
    (getResizeHandle(widget) as HTMLElement).click();
    await nextFrame();
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0].detail).to.eql({ item: { id: 0 }, value: true });
  });

  describe('widget in resize mode', () => {
    beforeEach(async () => {
      // Select
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Space' });
      // Enter resize mode
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Space' });
      await nextFrame();
    });

    it('should exit resize mode on escape', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      await sendKeys({ press: 'Escape' });
      expect(widget.hasAttribute('resize-mode')).to.be.false;
      expect(widget.hasAttribute('selected')).to.be.true;
      expect(widget.hasAttribute('focused')).to.be.false;
    });

    it('should dispatch a resize mode event', async () => {
      const spy = sinon.spy();
      dashboard.addEventListener('dashboard-item-resize-mode-changed', spy);
      await sendKeys({ press: 'Escape' });
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail).to.eql({ item: { id: 0 }, value: false });
    });

    it('should exit resize mode on apply', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      // Apply button focused, click it
      await sendKeys({ press: 'Space' });
      expect(widget.hasAttribute('resize-mode')).to.be.false;
      expect(widget.hasAttribute('selected')).to.be.true;
      expect(widget.hasAttribute('focused')).to.be.false;
    });

    it('should focus resize handle on exit resize mode', async () => {
      // Apply button focused, click it
      await sendKeys({ press: 'Space' });
      expect(getResizeHandle(getElementFromCell(dashboard, 0, 0)!).matches(':focus')).to.be.true;
    });

    it('should increase the widget column span on grow width button click', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      // Focus forward button, click it
      getResizeGrowWidthButton(widget).focus();
      await sendKeys({ press: 'Space' });
      expect((dashboard.items[0] as DashboardItem).colspan).to.equal(2);
    });

    it('should increase the widget row span on grow height button click', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;

      // Set minimum row height to enable vertical resizing
      setMinimumRowHeight(dashboard, 100);
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Space' });
      await nextFrame();

      // Focus forward button, click it
      getResizeGrowHeightButton(widget).focus();
      await sendKeys({ press: 'Space' });
      expect((dashboard.items[0] as DashboardItem).rowspan).to.equal(2);
    });

    it('should decrease the widget column span on shrink width button click', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      // Focus forward button, click it
      getResizeGrowWidthButton(widget).focus();
      await sendKeys({ press: 'Space' });
      getResizeShrinkWidthButton(widget).focus();
      await sendKeys({ press: 'Space' });
      expect((dashboard.items[0] as DashboardItem).colspan).to.equal(1);
    });

    it('should decrease the widget row span on shrink height button click', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;

      // Set minimum row height to enable vertical resizing
      setMinimumRowHeight(dashboard, 100);
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Space' });
      await nextFrame();

      // Focus forward button, click it
      getResizeGrowHeightButton(widget).focus();
      await sendKeys({ press: 'Space' });
      getResizeShrinkHeightButton(widget).focus();
      await sendKeys({ press: 'Space' });
      expect((dashboard.items[0] as DashboardItem).rowspan).to.equal(1);
    });

    it('should dispatch an item resized event on on grow width button click', async () => {
      const spy = sinon.spy();
      dashboard.addEventListener('dashboard-item-resized', spy);
      // Focus forward button, click it
      const widget = getElementFromCell(dashboard, 0, 0)!;
      getResizeGrowWidthButton(widget).focus();
      await sendKeys({ press: 'Space' });
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail.item).to.eql(dashboard.items[0]);
      expect(spy.firstCall.args[0].detail.items).to.eql(dashboard.items);
    });

    it('should deselect the widget on blur', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      const anotherWidget = getElementFromCell(dashboard, 0, 1)!;
      anotherWidget.focus();
      await nextFrame();
      expect(widget.hasAttribute('resize-mode')).to.be.false;
      expect(widget.hasAttribute('selected')).to.be.false;
      expect(widget.hasAttribute('focused')).to.be.false;
    });

    it('should trap focus inside the resize mode', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      const resizeModeButtons = [
        getResizeGrowHeightButton(widget),
        getResizeGrowWidthButton(widget),
        getResizeShrinkHeightButton(widget),
        getResizeShrinkWidthButton(widget),
        getResizeApplyButton(widget),
      ];
      for (let i = 0; i < resizeModeButtons.length * 2; i++) {
        await sendKeys({ press: 'Tab' });
        expect(resizeModeButtons.includes(widget.shadowRoot!.activeElement as HTMLElement)).to.be.true;
      }
    });

    it('should trap back inside the widget after exiting resize mode', async () => {
      await sendKeys({ press: 'Escape' });
      const widget = getElementFromCell(dashboard, 0, 0)!;
      const resizeModeButtons = [
        getResizeGrowHeightButton(widget),
        getResizeGrowWidthButton(widget),
        getResizeShrinkHeightButton(widget),
        getResizeShrinkWidthButton(widget),
        getResizeApplyButton(widget),
      ];
      for (let i = 0; i < 10; i++) {
        await sendKeys({ press: 'Tab' });
        expect(widget.contains(document.activeElement)).to.be.true;
        expect(resizeModeButtons.includes(widget.shadowRoot!.activeElement as HTMLElement)).to.be.false;
      }
    });

    it('should hide the grow/shrink height buttons if row min height is not defined', async () => {
      await sendKeys({ press: 'Escape' });
      setMinimumRowHeight(dashboard, undefined);
      await sendKeys({ press: 'Space' });
      const widget = getElementFromCell(dashboard, 0, 0)!;

      expect(getComputedStyle(getResizeGrowHeightButton(widget)).display).to.equal('none');
      expect(getComputedStyle(getResizeShrinkHeightButton(widget)).display).to.equal('none');
      expect(getComputedStyle(getResizeGrowWidthButton(widget)).display).to.not.equal('none');
    });

    it('should hide the shrink width button if the widget only covers one column', () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      expect(getComputedStyle(getResizeShrinkWidthButton(widget)).display).to.equal('none');
    });

    it('should not hide the grow width button if the widget does not cover all visible columns', () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      expect(getComputedStyle(getResizeGrowWidthButton(widget)).display).to.not.equal('none');
    });

    it('should hide the grow width button if the widget already covers all visible columns', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      // Focus grow width button, click it
      getResizeGrowWidthButton(widget).focus();
      await sendKeys({ press: 'Space' });

      expect(getComputedStyle(getResizeGrowWidthButton(widget)).display).to.equal('none');
    });

    (isChrome ? it : it.skip)('should focus the apply button if focused resize button is hidden', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      // Focus grow width button, click it
      getResizeGrowWidthButton(widget).focus();
      await sendKeys({ press: 'Space' });

      expect(getResizeApplyButton(widget).matches(':focus')).to.be.true;
    });

    it('should not hide the shrink width button if the widget covers more than one column', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      // Focus grow width button, click it
      getResizeGrowWidthButton(widget).focus();
      await sendKeys({ press: 'Space' });

      expect(getComputedStyle(getResizeShrinkWidthButton(widget)).display).to.not.equal('none');
    });

    (isFirefox ? it.skip : it)('should hide the shrink height button if the widget only covers one row', async () => {
      // Set minimum row height to enable vertical resizing
      setMinimumRowHeight(dashboard, 100);
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Space' });
      await nextFrame();

      const widget = getElementFromCell(dashboard, 0, 0)!;
      expect(getComputedStyle(getResizeShrinkHeightButton(widget)).display).to.equal('none');
    });

    (isFirefox ? it.skip : it)(
      'should not hide the shrink height button if the widget covers more than one row',
      async () => {
        // Set minimum row height to enable vertical resizing
        setMinimumRowHeight(dashboard, 100);
        await sendKeys({ press: 'Escape' });
        await sendKeys({ press: 'Space' });
        await nextFrame();

        const widget = getElementFromCell(dashboard, 0, 0)!;
        // Focus grow height button, click it
        getResizeGrowHeightButton(widget).focus();
        await sendKeys({ press: 'Space' });
        expect(getComputedStyle(getResizeShrinkHeightButton(widget)).display).to.not.equal('none');
      },
    );

    it('should hide the grow width button if the dashboard is shrunk to only one column', async () => {
      dashboard.style.width = `${columnWidth}px`;
      await nextFrame();
      const widget = getElementFromCell(dashboard, 0, 0)!;
      expect(getComputedStyle(getResizeGrowWidthButton(widget)).display).to.equal('none');
    });

    it('should hide the grow width button if dashboard max col count is shrunk to only one column', async () => {
      setMaximumColumnCount(dashboard, 1);
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Space' });
      await nextFrame();

      const widget = getElementFromCell(dashboard, 0, 0)!;
      expect(getComputedStyle(getResizeGrowWidthButton(widget)).display).to.equal('none');
    });
  });
});
