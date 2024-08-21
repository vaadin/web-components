import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../vaadin-dashboard.js';
import type { CustomElementType } from '@vaadin/component-base/src/define.js';
import type { Dashboard, DashboardItem } from '../vaadin-dashboard.js';
import { getElementFromCell, setGap, setMaximumColumnWidth, setMinimumColumnWidth } from './helpers.js';

type TestDashboardItem = DashboardItem & { id: string };

describe('dashboard', () => {
  let dashboard: Dashboard<TestDashboardItem>;
  const columnWidth = 100;

  beforeEach(async () => {
    dashboard = fixtureSync('<vaadin-dashboard></vaadin-dashboard>');
    dashboard.style.width = `${columnWidth * 100}px`;
    setMinimumColumnWidth(dashboard, columnWidth);
    setMaximumColumnWidth(dashboard, columnWidth);
    setGap(dashboard, 0);

    dashboard.items = [{ id: 'Item 0' }, { id: 'Item 1' }];
    dashboard.renderer = (root, _, model) => {
      root.textContent = '';
      const widget = document.createElement('vaadin-dashboard-widget');
      widget.widgetTitle = `${model.item.id} title`;
      root.appendChild(widget);
    };
    await nextFrame();
  });

  it('should render a widget for each item', () => {
    const widgets = [getElementFromCell(dashboard, 0, 0), getElementFromCell(dashboard, 0, 1)];
    widgets.forEach((widget, index) => {
      expect(widget).to.be.ok;
      expect(widget?.localName).to.equal('vaadin-dashboard-widget');
      expect(widget).to.have.property('widgetTitle', `Item ${index} title`);
    });
  });

  it('should render a new widget', async () => {
    dashboard.items = [...dashboard.items, { id: 'Item 2' }];
    await nextFrame();

    const newWidget = getElementFromCell(dashboard, 0, 2);
    expect(newWidget).to.be.ok;
    expect(newWidget?.localName).to.equal('vaadin-dashboard-widget');
    expect(newWidget).to.have.property('widgetTitle', 'Item 2 title');
  });

  it('should update the renderer', async () => {
    dashboard.renderer = (root, _, model) => {
      root.textContent = '';
      const widget = document.createElement('vaadin-dashboard-widget');
      widget.widgetTitle = `${model.item.id} new title`;
      root.appendChild(widget);
    };
    await nextFrame();

    const widgets = [getElementFromCell(dashboard, 0, 0), getElementFromCell(dashboard, 0, 1)];
    widgets.forEach((widget, index) => {
      expect(widget).to.be.ok;
      expect(widget?.localName).to.equal('vaadin-dashboard-widget');
      expect(widget).to.have.property('widgetTitle', `Item ${index} new title`);
    });
  });

  it('should clear the items', async () => {
    dashboard.items = [];
    await nextFrame();

    expect(dashboard.querySelectorAll('vaadin-dashboard-widget')).to.be.empty;
  });

  it('should clear the renderer', async () => {
    dashboard.renderer = undefined;
    await nextFrame();

    expect(dashboard.querySelectorAll('vaadin-dashboard-widget')).to.be.empty;
  });

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      tagName = dashboard.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as CustomElementType).is).to.equal(tagName);
    });
  });

  describe('column span', () => {
    it('should span one column by default', () => {
      const widgets = [getElementFromCell(dashboard, 0, 0), getElementFromCell(dashboard, 0, 1)];
      expect(widgets[0]).to.not.equal(widgets[1]);
    });

    it('should span multiple columns', async () => {
      dashboard.items = [{ colspan: 2, id: 'Item 0' }];
      await nextFrame();

      const widget = getElementFromCell(dashboard, 0, 0);
      expect(widget).to.have.property('widgetTitle', 'Item 0 title');
      expect(getElementFromCell(dashboard, 0, 1)).to.equal(widget);
    });
  });
});
