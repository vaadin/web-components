import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../vaadin-dashboard.js';
import type { CustomElementType } from '@vaadin/component-base/src/define.js';
import type { Dashboard, DashboardItem } from '../vaadin-dashboard.js';
import { getDraggable, getElementFromCell, setGap, setMaximumColumnWidth, setMinimumColumnWidth } from './helpers.js';

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

  describe('section', () => {
    beforeEach(async () => {
      dashboard.items = [
        { id: 'Item 0' },
        { id: 'Item 1' },
        { title: 'Section', items: [{ id: 'Item 2' }, { id: 'Item 3' }] },
      ];
      await nextFrame();
    });

    it('should render widgets inside a section', () => {
      const widget = getElementFromCell(dashboard, 1, 0);
      const section = widget?.closest('vaadin-dashboard-section');
      expect(section).to.be.ok;
    });

    it('should render a section title', () => {
      const widget = getElementFromCell(dashboard, 1, 0);
      const section = widget?.closest('vaadin-dashboard-section');
      expect(section?.sectionTitle).to.equal('Section');
    });

    it('should render a widget for each section item', () => {
      const widget2 = getElementFromCell(dashboard, 1, 0);
      expect(widget2).to.be.ok;
      expect(widget2?.localName).to.equal('vaadin-dashboard-widget');
      expect(widget2).to.have.property('widgetTitle', 'Item 2 title');

      const widget3 = getElementFromCell(dashboard, 1, 1);
      expect(widget3).to.be.ok;
      expect(widget3?.localName).to.equal('vaadin-dashboard-widget');
      expect(widget3).to.have.property('widgetTitle', 'Item 3 title');
    });
  });

  describe('editable', () => {
    it('should hide draggable handle by default', () => {
      const widget = getElementFromCell(dashboard, 0, 0)!;
      const draggable = getDraggable(widget);
      expect(draggable.getBoundingClientRect().height).to.equal(0);
    });

    it('should unhide draggable handle when editable', async () => {
      dashboard.editable = true;
      await nextFrame();
      const widget = getElementFromCell(dashboard, 0, 0)!;
      const draggable = getDraggable(widget);
      expect(draggable.getBoundingClientRect().height).to.be.above(0);
    });
  });
});
