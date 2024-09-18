import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../vaadin-dashboard.js';
import type { Dashboard, DashboardItem } from '../vaadin-dashboard.js';
import {
  describeBidirectional,
  getElementFromCell,
  setGap,
  setMaximumColumnWidth,
  setMinimumColumnWidth,
} from './helpers.js';

type TestDashboardItem = DashboardItem & { id: number };

describe('dashboard - keyboard interaction', () => {
  let dashboard: Dashboard<TestDashboardItem>;
  let keydownSpy;
  const columnWidth = 200;

  beforeEach(async () => {
    dashboard = fixtureSync('<vaadin-dashboard></vaadin-dashboard>');
    dashboard.style.width = `${columnWidth * 2}px`;
    dashboard.editable = true;
    keydownSpy = sinon.spy();
    dashboard.addEventListener('keydown', keydownSpy);
    setMinimumColumnWidth(dashboard, columnWidth);
    setMaximumColumnWidth(dashboard, columnWidth);
    setGap(dashboard, 0);

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
    document.body.focus();
    await nextFrame();
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
    expect(widget.hasAttribute('focused')).to.be.true;
    expect(widget.hasAttribute('selected')).to.be.true;
  });

  it('should not remove the widget on backspace', async () => {
    await sendKeys({ press: 'Tab' });
    await sendKeys({ press: 'Backspace' });
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
    });

    it('should blur deselected widget on shift tab', async () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      await sendKeys({ press: 'Escape' });
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
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
      widget.blur();
      await nextFrame();
      expect(widget.hasAttribute('selected')).to.be.false;
      expect(widget.hasAttribute('focused')).to.be.false;
    });

    it('should remove the widget on backspace', async () => {
      await sendKeys({ press: 'Backspace' });
      expect(dashboard.items).to.eql([{ id: 1 }, { items: [{ id: 2 }, { id: 3 }] }]);
    });

    it('should remove the widget on delete', async () => {
      await sendKeys({ press: 'Delete' });
      expect(dashboard.items).to.eql([{ id: 1 }, { items: [{ id: 2 }, { id: 3 }] }]);
    });

    it('should move the widget forwards on arrow down', async () => {
      await sendKeys({ press: 'ArrowDown' });
      expect(dashboard.items).to.eql([{ id: 1 }, { id: 0 }, { items: [{ id: 2 }, { id: 3 }] }]);
    });

    it('should move the widget backwards on arrow up', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'ArrowUp' });
      expect(dashboard.items).to.eql([{ id: 0 }, { id: 1 }, { items: [{ id: 2 }, { id: 3 }] }]);
    });

    it('should increase the widget row span on shift + arrow down', async () => {
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ up: 'Shift' });
      expect((dashboard.items[0] as DashboardItem).rowspan).to.equal(2);
    });

    it('should decrease the widget row span on shift + arrow up', async () => {
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ press: 'ArrowUp' });
      await sendKeys({ up: 'Shift' });
      expect((dashboard.items[0] as DashboardItem).rowspan).to.equal(1);
    });

    it('should not move the widget on arrow down if ctrl key is pressed', async () => {
      await sendKeys({ down: 'Control' });
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ up: 'Control' });
      expect(dashboard.items).to.eql([{ id: 0 }, { id: 1 }, { items: [{ id: 2 }, { id: 3 }] }]);
    });

    it('should cancel the default action on backspace', async () => {
      keydownSpy.resetHistory();
      await sendKeys({ press: 'Backspace' });
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
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
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
        await sendKeys({ press: arrowBackwards });
        expect(dashboard.items).to.eql([{ id: 0 }, { id: 1 }, { items: [{ id: 2 }, { id: 3 }] }]);
      });

      it('should increase the widget column span on shift + arrow forwards', async () => {
        await sendKeys({ down: 'Shift' });
        await sendKeys({ press: arrowForwards });
        await sendKeys({ up: 'Shift' });
        expect((dashboard.items[0] as DashboardItem).colspan).to.equal(2);
      });

      it('should decrease the widget column span on shift + arrow backwards', async () => {
        await sendKeys({ down: 'Shift' });
        await sendKeys({ press: arrowForwards });
        await sendKeys({ press: arrowBackwards });
        await sendKeys({ up: 'Shift' });
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

    it('should blur deselected selected on shift tab', async () => {
      await sendKeys({ press: 'Escape' });
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
      expect(section.hasAttribute('selected')).to.be.false;
      expect(section.hasAttribute('focused')).to.be.false;
      expect(section.contains(document.activeElement)).to.be.false;
    });

    it('should tab to the section controls', async () => {
      await sendKeys({ press: 'Tab' });
      expect(section.contains(document.activeElement)).to.be.true;
    });

    it('should deselect the section on blur', async () => {
      section.blur();
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
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
      expect(section.contains(document.activeElement)).to.be.false;
    });
  });
});
