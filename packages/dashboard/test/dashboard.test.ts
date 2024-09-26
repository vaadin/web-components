import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-dashboard.js';
import type { CustomElementType } from '@vaadin/component-base/src/define.js';
import type { DashboardSection } from '../src/vaadin-dashboard-section.js';
import type { DashboardWidget } from '../src/vaadin-dashboard-widget.js';
import type { Dashboard, DashboardItem, DashboardSectionItem } from '../vaadin-dashboard.js';
import {
  expectLayout,
  getDraggable,
  getElementFromCell,
  getParentSection,
  getRemoveButton,
  getResizeHandle,
  onceResized,
  setGap,
  setMaximumColumnWidth,
  setMinimumColumnWidth,
} from './helpers.js';

type TestDashboardItem = DashboardItem & { id: string; component?: Element | string };

describe('dashboard', () => {
  let dashboard: Dashboard<TestDashboardItem>;
  const columnWidth = 200;

  beforeEach(async () => {
    dashboard = fixtureSync('<vaadin-dashboard></vaadin-dashboard>');
    dashboard.style.width = `${columnWidth * 2}px`;
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

    // @ts-expect-error Test without padding
    dashboard.$.grid.style.padding = '0';
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

    const newWidget = getElementFromCell(dashboard, 1, 0);
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

  it('should remove a widget', () => {
    const widget = getElementFromCell(dashboard, 0, 1);
    getRemoveButton(widget as DashboardWidget).click();
    expect(dashboard.items).to.eql([{ id: 'Item 0' }]);
  });

  it('should dispatch an dashboard-item-removed event', () => {
    const spy = sinon.spy();
    dashboard.addEventListener('dashboard-item-removed', spy);
    const widget = getElementFromCell(dashboard, 0, 1);
    getRemoveButton(widget as DashboardWidget).click();
    expect(spy).to.be.calledOnce;
    expect(spy.firstCall.args[0].detail.item).to.eql({ id: 'Item 1' });
    expect(spy.firstCall.args[0].detail.items).to.eql([{ id: 'Item 0' }]);
  });

  it('should not dispatch an item-remove event', () => {
    const spy = sinon.spy();
    // @ts-ignore unexpected event type
    dashboard.addEventListener('item-remove', spy);
    const widget = getElementFromCell(dashboard, 0, 1);
    getRemoveButton(widget as DashboardWidget).click();
    expect(spy).to.not.be.called;
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

  describe('row span', () => {
    it('should span one row by default', async () => {
      dashboard.style.width = `${columnWidth}px`;
      await onceResized(dashboard);
      const widgets = [getElementFromCell(dashboard, 0, 0), getElementFromCell(dashboard, 1, 0)];
      expect(widgets[0]).to.not.equal(widgets[1]);
    });

    it('should span multiple rows', async () => {
      dashboard.style.width = `${columnWidth}px`;
      dashboard.items = [{ rowspan: 2, id: 'Item 0' }];
      await onceResized(dashboard);

      const widget = getElementFromCell(dashboard, 0, 0);
      expect(widget).to.have.property('widgetTitle', 'Item 0 title');
      expect(getElementFromCell(dashboard, 1, 0)).to.equal(widget);
    });
  });

  describe('i18n', () => {
    it('should have default values', () => {
      expect(dashboard.i18n).to.eql({
        selectSection: 'Select section for editing',
        selectWidget: 'Select widget for editing',
        remove: 'Remove',
        resize: 'Resize',
        resizeApply: 'Apply',
        resizeShrinkWidth: 'Shrink width',
        resizeGrowWidth: 'Grow width',
        resizeShrinkHeight: 'Shrink height',
        resizeGrowHeight: 'Grow height',
        move: 'Move',
        moveApply: 'Apply',
        moveForward: 'Move Forward',
        moveBackward: 'Move Backward',
      });
    });

    it('should localize widget', async () => {
      dashboard.i18n = {
        ...dashboard.i18n,
        selectWidget: 'foo',
      };

      await nextFrame();

      const widget = getElementFromCell(dashboard, 0, 0) as DashboardWidget & { __i18n: { [key: string]: string } };
      expect(widget.__i18n.selectWidget).to.equal('foo');
      expect(widget.__i18n).to.eql(dashboard.i18n);
    });

    it('should localize focused widget', async () => {
      dashboard.editable = true;
      // Use a custom renderer that reuses the same widget instance
      dashboard.renderer = (root, _, model) => {
        let widget = root.querySelector('vaadin-dashboard-widget');
        if (!widget || widget.tabIndex !== 0) {
          root.textContent = '';
          widget = document.createElement('vaadin-dashboard-widget');
          widget.tabIndex = 0;
          root.appendChild(widget);
        }
        widget.widgetTitle = `${model.item.id} title`;
      };
      await nextFrame();

      const widget = getElementFromCell(dashboard, 0, 0) as DashboardWidget & { __i18n: { [key: string]: string } };
      widget.focus();

      dashboard.i18n = {
        ...dashboard.i18n,
        selectWidget: 'foo',
      };
      await nextFrame();

      expect(widget.__i18n.selectWidget).to.equal('foo');
    });

    it('should localize a lazily rendered widget', async () => {
      // Assign a renderer that initially renders nothing
      const syncRenderer = dashboard.renderer!;
      dashboard.renderer = (root, _, model) => {
        root.textContent = '';
        requestAnimationFrame(() => {
          syncRenderer(root, _, model);
        });
      };
      await nextFrame();

      dashboard.i18n = {
        ...dashboard.i18n,
        selectWidget: 'foo',
      };
      await nextFrame();

      const widget = getElementFromCell(dashboard, 0, 0) as DashboardWidget & { __i18n: { [key: string]: string } };
      expect(widget.__i18n.selectWidget).to.equal('foo');
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

    it('should remove a section', () => {
      const widget = getElementFromCell(dashboard, 1, 0);
      const section = widget?.closest('vaadin-dashboard-section');
      getRemoveButton(section!).click();
      expect(dashboard.items).to.eql([{ id: 'Item 0' }, { id: 'Item 1' }]);
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

    it('should hide remove button by default', () => {
      const widget = getElementFromCell(dashboard, 0, 0) as DashboardWidget;
      const removeButton = getRemoveButton(widget);
      expect(removeButton.getBoundingClientRect().height).to.equal(0);
    });

    it('should unhide remove button when editable', async () => {
      dashboard.editable = true;
      await nextFrame();
      const widget = getElementFromCell(dashboard, 0, 0) as DashboardWidget;
      const removeButton = getRemoveButton(widget);
      expect(removeButton.getBoundingClientRect().height).to.be.above(0);
    });

    it('should hide resize handle by default', () => {
      const widget = getElementFromCell(dashboard, 0, 0) as DashboardWidget;
      const resizeHandle = getResizeHandle(widget);
      expect(resizeHandle.getBoundingClientRect().height).to.equal(0);
    });

    it('should unhide resize handle when editable', async () => {
      dashboard.editable = true;
      await nextFrame();
      const widget = getElementFromCell(dashboard, 0, 0) as DashboardWidget;
      const resizeHandle = getResizeHandle(widget);
      expect(resizeHandle.getBoundingClientRect().height).to.be.above(0);
    });

    it('should unhide resize handle when editable with a lazy renderer', async () => {
      // Assign a renderer that initially renders nothing
      const syncRenderer = dashboard.renderer!;
      dashboard.renderer = (root, _, model) => {
        root.textContent = '';
        requestAnimationFrame(() => {
          syncRenderer(root, _, model);
        });
      };
      await nextFrame();

      dashboard.editable = true;
      await nextFrame();
      const widget = getElementFromCell(dashboard, 0, 0) as DashboardWidget;
      const resizeHandle = getResizeHandle(widget);
      expect(resizeHandle.getBoundingClientRect().height).to.be.above(0);
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

      it('should hide draggable handle by default', () => {
        const widget = getElementFromCell(dashboard, 1, 0)!;
        const section = widget.closest('vaadin-dashboard-section') as DashboardSection;
        const draggable = getDraggable(section);
        expect(draggable.getBoundingClientRect().height).to.equal(0);
      });

      it('should unhide draggable handle when editable', async () => {
        dashboard.editable = true;
        await nextFrame();
        const widget = getElementFromCell(dashboard, 1, 0)!;
        const section = widget.closest('vaadin-dashboard-section') as DashboardSection;
        const draggable = getDraggable(section);
        expect(draggable.getBoundingClientRect().height).to.be.above(0);
      });

      it('should hide remove button by default', () => {
        const widget = getElementFromCell(dashboard, 1, 0) as DashboardWidget;
        const section = widget.closest('vaadin-dashboard-section') as DashboardSection;
        const removeButton = getRemoveButton(section);
        expect(removeButton.getBoundingClientRect().height).to.equal(0);
      });

      it('should unhide remove button when editable', async () => {
        dashboard.editable = true;
        await nextFrame();
        const widget = getElementFromCell(dashboard, 1, 0) as DashboardWidget;
        const section = widget.closest('vaadin-dashboard-section') as DashboardSection;
        const removeButton = getRemoveButton(section);
        expect(removeButton.getBoundingClientRect().height).to.be.above(0);
      });

      describe('i18n', () => {
        it('should localize section', async () => {
          dashboard.i18n = {
            ...dashboard.i18n,
            selectSection: 'foo',
          };

          await nextFrame();

          const widget = getElementFromCell(dashboard, 1, 0) as DashboardWidget;
          const section = widget.closest('vaadin-dashboard-section') as DashboardSection & {
            __i18n: { [key: string]: string };
          };
          expect(section.__i18n.selectSection).to.equal('foo');
          expect(section.__i18n).to.eql(dashboard.i18n);
        });
      });
    });
  });

  describe('item components', () => {
    it('should use the item component as widget', async () => {
      const widget = fixtureSync('<vaadin-dashboard-widget widget-title="Component 0"></vaadin-dashboard-widget>');
      dashboard.items = [{ id: 'Item 0', component: widget }];
      await nextFrame();

      expect(getElementFromCell(dashboard, 0, 0)).to.equal(widget);
    });

    it('should render default widgets if component is not an element', async () => {
      dashboard.items = [{ id: 'Item 0', component: 'not-an-element' }];
      await nextFrame();

      const widget = getElementFromCell(dashboard, 0, 0);
      expect(widget).to.be.ok;
      expect(widget?.localName).to.equal('vaadin-dashboard-widget');
      expect(widget).to.have.property('widgetTitle', 'Item 0 title');
    });

    it('should not call renderer for item components', async () => {
      const renderer = sinon.spy();
      dashboard.renderer = renderer;
      const widget = fixtureSync('<vaadin-dashboard-widget widget-title="Component 0"></vaadin-dashboard-widget>');
      dashboard.items = [{ id: 'Item 0', component: widget }];
      await nextFrame();

      expect(renderer).to.not.be.called;
    });

    it('should use the item component as section', async () => {
      const section = fixtureSync(`<vaadin-dashboard-section section-title="Section"></vaadin-dashboard-section>`);
      const widget = fixtureSync('<vaadin-dashboard-widget widget-title="Component 0"></vaadin-dashboard-widget>');
      (dashboard as any).items = [
        {
          component: section,
          items: [{ id: 'Item 0', component: widget }],
        },
      ];
      await nextFrame();

      expect(getElementFromCell(dashboard, 0, 0)).to.equal(widget);
      expect(section.contains(widget)).to.be.true;
    });

    it('should render default section if component is not an element', async () => {
      (dashboard as any).items = [{ component: 'not-an-element', title: 'Section', items: [{ id: 'Item 0' }] }];
      await nextFrame();

      const widget = getElementFromCell(dashboard, 0, 0);
      expect(widget).to.be.ok;
      expect(widget?.localName).to.equal('vaadin-dashboard-widget');
      expect(widget).to.have.property('widgetTitle', 'Item 0 title');

      const section = widget?.closest('vaadin-dashboard-section');
      expect(section).to.be.ok;
      expect(section?.sectionTitle).to.equal('Section');
    });

    it('should not override the component titles', async () => {
      const section = fixtureSync(
        `<vaadin-dashboard-section section-title="Section"></vaadin-dashboard-section>`,
      ) as DashboardSection;
      const widget = fixtureSync(
        '<vaadin-dashboard-widget widget-title="Component 0"></vaadin-dashboard-widget>',
      ) as DashboardWidget;

      (dashboard as any).items = [
        {
          component: section,
          items: [{ id: 'Item 0', component: widget }],
        },
      ];
      await nextFrame();

      expect(widget.widgetTitle).to.equal('Component 0');
      expect(section.sectionTitle).to.equal('Section');
    });
  });

  describe('focus', () => {
    beforeEach(async () => {
      // Use a custom renderer that reuses the same widget instance
      // with a tab index to test focus behavior
      dashboard.renderer = (root, _, model) => {
        let widget = root.querySelector('vaadin-dashboard-widget');
        if (!widget || widget.tabIndex !== 0) {
          root.textContent = '';
          widget = document.createElement('vaadin-dashboard-widget');
          widget.id = model.item.id;
          widget.tabIndex = 0;
          root.appendChild(widget);
        }
        widget.widgetTitle = `${model.item.id} title`;
      };
      await nextFrame();
    });

    it('should not lose focus when reassigning items', async () => {
      getElementFromCell(dashboard, 0, 0)!.focus();
      dashboard.items = [...dashboard.items];
      await nextFrame();
      expect(document.activeElement).to.equal(getElementFromCell(dashboard, 0, 0)!);
    });

    it('should not lose focus when prepending items', async () => {
      getElementFromCell(dashboard, 0, 0)!.focus();
      dashboard.items = [{ id: 'Item -1' }, ...dashboard.items];
      await nextFrame();
      expect(document.activeElement).to.equal(getElementFromCell(dashboard, 0, 1)!);
    });

    it('should not lose focus when removing items', async () => {
      getElementFromCell(dashboard, 0, 1)!.focus();
      dashboard.items = [dashboard.items[1]];
      await nextFrame();
      expect(document.activeElement).to.equal(getElementFromCell(dashboard, 0, 0)!);
    });

    it('should not lose focus when reassigning section items', async () => {
      dashboard.items = [{ title: 'Section', items: [{ id: 'Item 0' }] }, { id: 'Item 1' }];
      await nextFrame();
      getElementFromCell(dashboard, 0, 0)!.focus();
      dashboard.items = [...dashboard.items];
      await nextFrame();
      expect(document.activeElement).to.equal(getElementFromCell(dashboard, 0, 0)!);
    });

    it('should unhide resize handle when editable', async () => {
      getElementFromCell(dashboard, 0, 0)!.focus();
      await nextFrame();
      dashboard.editable = true;
      await nextFrame();
      const widget = getElementFromCell(dashboard, 0, 0) as DashboardWidget;
      const resizeHandle = getResizeHandle(widget);
      expect(resizeHandle.getBoundingClientRect().height).to.be.above(0);
    });

    it('should unhide remove button of a section when editable', async () => {
      dashboard.items = [{ title: 'Section', items: [{ id: 'Item 0' }] }, { id: 'Item 1' }];
      await nextFrame();
      getElementFromCell(dashboard, 0, 0)!.focus();
      await nextFrame();
      dashboard.editable = true;
      await nextFrame();
      const widget = getElementFromCell(dashboard, 0, 0) as DashboardWidget;
      const section = widget.closest('vaadin-dashboard-section') as DashboardSection;
      const removeButton = getRemoveButton(section);
      expect(removeButton.getBoundingClientRect().height).to.be.above(0);
    });

    describe('focus restore on focused item removal', () => {
      beforeEach(async () => {
        dashboard.editable = true;
        await nextFrame();

        dashboard.items = [
          { id: 'Item 0' },
          { id: 'Item 1' },
          { title: 'Section', items: [{ id: 'Item 2' }, { id: 'Item 3' }] },
        ];
        await nextFrame();

        /* prettier-ignore */
        expectLayout(dashboard, [
          [0, 1],
          [2, 3]
        ]);
      });

      async function renderAndFocusRestore() {
        // Wait for the updated wrapper layout to be rendered
        await nextFrame();
        // Wait for the wrapper widgets to be rendered
        await nextFrame();
      }

      it('should focus next widget on focused widget removal', async () => {
        getElementFromCell(dashboard, 0, 0)!.focus();
        dashboard.items = dashboard.items.slice(1);
        await renderAndFocusRestore();
        expect(document.activeElement).to.equal(getElementFromCell(dashboard, 0, 0)!);
      });

      it('should focus the previous widget on focused widget removal', async () => {
        const sectionWidget = getElementFromCell(dashboard, 1, 1)!;
        getParentSection(sectionWidget)!.focus();
        dashboard.items = dashboard.items.slice(0, 2);
        await renderAndFocusRestore();
        expect(document.activeElement).to.equal(getElementFromCell(dashboard, 0, 1)!);
      });

      it('should focus the first widget on focused widget removal', async () => {
        getElementFromCell(dashboard, 1, 0)!.focus();
        dashboard.items = [dashboard.items[0]];
        await renderAndFocusRestore();
        expect(document.activeElement).to.equal(getElementFromCell(dashboard, 0, 0)!);
      });

      it('should focus the last widget on focused widget removal', async () => {
        getElementFromCell(dashboard, 0, 0)!.focus();
        dashboard.items = [dashboard.items[2]];
        await renderAndFocusRestore();
        expect(document.activeElement).to.equal(getParentSection(getElementFromCell(dashboard, 0, 0))!);
      });

      it('should focus a root level widget on focused section removal', async () => {
        getElementFromCell(dashboard, 1, 0)!.focus();
        dashboard.items = dashboard.items.slice(0, 2);
        await renderAndFocusRestore();
        expect(document.activeElement).to.equal(getElementFromCell(dashboard, 0, 1)!);
      });

      it('should focus the section on focused section widget removal', async () => {
        const widget = getElementFromCell(dashboard, 1, 0)!;
        const section = getParentSection(widget)!;
        widget.focus();
        (dashboard.items[2] as DashboardSectionItem<TestDashboardItem>).items = [];
        dashboard.items = [...dashboard.items];

        await renderAndFocusRestore();
        expect(document.activeElement).to.equal(section);
      });

      it('should focus the body on all items removal', async () => {
        getElementFromCell(dashboard, 0, 0)!.focus();
        dashboard.items = [];
        await renderAndFocusRestore();
        expect(document.activeElement).to.equal(document.body);
      });

      it('should focus a new widget when items are replaced', async () => {
        getElementFromCell(dashboard, 0, 0)!.focus();
        await nextFrame();
        dashboard.items = [{ id: 'Item 100' }];
        await renderAndFocusRestore();
        expect(document.activeElement).to.equal(getElementFromCell(dashboard, 0, 0)!);
      });

      it('should not restore focus if no widget had focus', async () => {
        dashboard.items = dashboard.items.slice(1);
        await renderAndFocusRestore();
        expect(document.activeElement).to.equal(document.body);
      });

      it('should not try to focus an empty wrapper', async () => {
        getElementFromCell(dashboard, 0, 0)!.focus();
        dashboard.renderer = (root) => {
          root.textContent = '';
        };
        dashboard.items = dashboard.items.slice(1);
        await renderAndFocusRestore();
      });
    });
  });
});
