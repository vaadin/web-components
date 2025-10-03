import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextResize } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-dashboard.js';
import type { CustomElementType } from '@vaadin/component-base/src/define.js';
import type { DashboardSection } from '../src/vaadin-dashboard-section.js';
import type { DashboardWidget } from '../src/vaadin-dashboard-widget.js';
import type { Dashboard, DashboardI18n, DashboardItem, DashboardSectionItem } from '../vaadin-dashboard.js';
import {
  assertHeadingLevel,
  expectLayout,
  getColumnWidths,
  getDraggable,
  getElementFromCell,
  getParentSection,
  getRemoveButton,
  getResizeHandle,
  getScrollingContainer,
  setMaximumColumnWidth,
  setMinimumColumnWidth,
  setMinimumRowHeight,
  setSpacing,
  updateComplete,
} from './helpers.js';

type TestDashboardItem = DashboardItem & { id: string; component?: Element | string };

describe('dashboard', () => {
  let dashboard: Dashboard<TestDashboardItem> & { __effectiveI18n: DashboardI18n };
  const columnWidth = 200;

  beforeEach(async () => {
    dashboard = fixtureSync('<vaadin-dashboard></vaadin-dashboard>');
    await updateComplete(dashboard);

    dashboard.style.width = `${columnWidth * 2}px`;
    setMinimumColumnWidth(dashboard, columnWidth);
    setMaximumColumnWidth(dashboard, columnWidth);
    setMinimumRowHeight(dashboard, undefined);
    setSpacing(dashboard, 0);

    dashboard.items = [{ id: '0' }, { id: '1' }];
    dashboard.renderer = (root, _, model) => {
      root.textContent = '';
      const widget = document.createElement('vaadin-dashboard-widget');
      widget.widgetTitle = `Item ${model.item.id} title`;
      widget.id = model.item.id;
      root.appendChild(widget);
    };

    await updateComplete(dashboard);
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
    dashboard.items = [...dashboard.items, { id: '2' }];
    await updateComplete(dashboard);

    const newWidget = getElementFromCell(dashboard, 1, 0);
    expect(newWidget).to.be.ok;
    expect(newWidget?.localName).to.equal('vaadin-dashboard-widget');
    expect(newWidget).to.have.property('widgetTitle', 'Item 2 title');
  });

  it('should update the renderer', async () => {
    dashboard.renderer = (root, _, model) => {
      root.textContent = '';
      const widget = document.createElement('vaadin-dashboard-widget');
      widget.widgetTitle = `Item ${model.item.id} new title`;
      root.appendChild(widget);
    };
    await updateComplete(dashboard);

    const widgets = [getElementFromCell(dashboard, 0, 0), getElementFromCell(dashboard, 0, 1)];
    widgets.forEach((widget, index) => {
      expect(widget).to.be.ok;
      expect(widget?.localName).to.equal('vaadin-dashboard-widget');
      expect(widget).to.have.property('widgetTitle', `Item ${index} new title`);
    });
  });

  it('should clear the items', async () => {
    dashboard.items = [];
    await updateComplete(dashboard);

    expect(dashboard.querySelectorAll('vaadin-dashboard-widget')).to.be.empty;
  });

  it('should clear the renderer', async () => {
    dashboard.renderer = undefined;
    await updateComplete(dashboard);

    expect(dashboard.querySelectorAll('vaadin-dashboard-widget')).to.be.empty;
  });

  it('should remove a widget', () => {
    const widget = getElementFromCell(dashboard, 0, 1);
    getRemoveButton(widget as DashboardWidget).click();
    expect(dashboard.items).to.eql([{ id: '0' }]);
  });

  it('should dispatch an dashboard-item-removed event', () => {
    const spy = sinon.spy();
    dashboard.addEventListener('dashboard-item-removed', spy);
    const widget = getElementFromCell(dashboard, 0, 1);
    getRemoveButton(widget as DashboardWidget).click();
    expect(spy).to.be.calledOnce;
    expect(spy.firstCall.args[0].detail.item).to.eql({ id: '1' });
    expect(spy.firstCall.args[0].detail.items).to.eql([{ id: '0' }]);
  });

  it('should not dispatch an item-remove event', async () => {
    const spy = sinon.spy();
    // @ts-ignore unexpected event type
    dashboard.addEventListener('item-remove', spy);
    await updateComplete(dashboard);
    const widget = getElementFromCell(dashboard, 0, 1);
    getRemoveButton(widget as DashboardWidget).click();
    await updateComplete(dashboard);
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
      dashboard.items = [{ colspan: 2, id: '0' }];
      await updateComplete(dashboard);

      const widget = getElementFromCell(dashboard, 0, 0);
      expect(widget).to.have.property('widgetTitle', 'Item 0 title');
      expect(getElementFromCell(dashboard, 0, 1)).to.equal(widget);
    });
  });

  describe('row span', () => {
    it('should span one row by default', async () => {
      dashboard.style.width = `${columnWidth}px`;
      await nextResize(dashboard);
      const widgets = [getElementFromCell(dashboard, 0, 0), getElementFromCell(dashboard, 1, 0)];
      expect(widgets[0]).to.not.equal(widgets[1]);
    });

    it('should span multiple rows', async () => {
      dashboard.style.width = `${columnWidth}px`;
      dashboard.items = [{ rowspan: 2, id: '0' }];
      await nextResize(dashboard);

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
        selectWidget: 'foo',
      };

      await updateComplete(dashboard);

      const widget = getElementFromCell(dashboard, 0, 0) as DashboardWidget & { __i18n: { [key: string]: string } };
      expect(widget.__i18n.selectWidget).to.equal('foo');
      expect(widget.__i18n).to.eql(dashboard.__effectiveI18n);
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
      await updateComplete(dashboard);

      const widget = getElementFromCell(dashboard, 0, 0) as DashboardWidget & { __i18n: { [key: string]: string } };
      widget.focus();

      dashboard.i18n = {
        selectWidget: 'foo',
      };
      await updateComplete(dashboard);

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
      await updateComplete(dashboard);

      dashboard.i18n = {
        selectWidget: 'foo',
      };
      await updateComplete(dashboard);

      const widget = getElementFromCell(dashboard, 0, 0) as DashboardWidget & { __i18n: { [key: string]: string } };
      expect(widget.__i18n.selectWidget).to.equal('foo');
    });
  });

  describe('section', () => {
    beforeEach(async () => {
      dashboard.items = [{ id: '0' }, { id: '1' }, { title: 'Section', items: [{ id: '2' }, { id: '3' }] }];
      await updateComplete(dashboard);
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
      expect(dashboard.items).to.eql([{ id: '0' }, { id: '1' }]);
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
      await updateComplete(dashboard);
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
      await updateComplete(dashboard);
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
      await updateComplete(dashboard);
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
      await updateComplete(dashboard);

      dashboard.editable = true;
      await updateComplete(dashboard);
      const widget = getElementFromCell(dashboard, 0, 0) as DashboardWidget;
      const resizeHandle = getResizeHandle(widget);
      expect(resizeHandle.getBoundingClientRect().height).to.be.above(0);
    });

    describe('section', () => {
      beforeEach(async () => {
        dashboard.items = [{ id: '0' }, { id: '1' }, { title: 'Section', items: [{ id: '2' }, { id: '3' }] }];
        await updateComplete(dashboard);
      });

      it('should hide draggable handle by default', () => {
        const widget = getElementFromCell(dashboard, 1, 0)!;
        const section = widget.closest('vaadin-dashboard-section') as DashboardSection;
        const draggable = getDraggable(section);
        expect(draggable.getBoundingClientRect().height).to.equal(0);
      });

      it('should unhide draggable handle when editable', async () => {
        dashboard.editable = true;
        await updateComplete(dashboard);
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
        await updateComplete(dashboard);
        const widget = getElementFromCell(dashboard, 1, 0) as DashboardWidget;
        const section = widget.closest('vaadin-dashboard-section') as DashboardSection;
        const removeButton = getRemoveButton(section);
        expect(removeButton.getBoundingClientRect().height).to.be.above(0);
      });

      describe('i18n', () => {
        it('should localize section', async () => {
          dashboard.i18n = {
            selectSection: 'foo',
          };

          await updateComplete(dashboard);

          const widget = getElementFromCell(dashboard, 1, 0) as DashboardWidget;
          const section = widget.closest('vaadin-dashboard-section') as DashboardSection & {
            __i18n: { [key: string]: string };
          };
          expect(section.__i18n.selectSection).to.equal('foo');
          expect(section.__i18n).to.eql(dashboard.__effectiveI18n);
        });
      });
    });
  });

  describe('item components', () => {
    it('should use the item component as widget', async () => {
      const widget = fixtureSync('<vaadin-dashboard-widget widget-title="Component 0"></vaadin-dashboard-widget>');
      dashboard.items = [{ id: '0', component: widget }];
      await updateComplete(dashboard);

      expect(getElementFromCell(dashboard, 0, 0)).to.equal(widget);
    });

    it('should render default widgets if component is not an element', async () => {
      dashboard.items = [{ id: '0', component: 'not-an-element' }];
      await updateComplete(dashboard);

      const widget = getElementFromCell(dashboard, 0, 0);
      expect(widget).to.be.ok;
      expect(widget?.localName).to.equal('vaadin-dashboard-widget');
      expect(widget).to.have.property('widgetTitle', 'Item 0 title');
    });

    it('should not call renderer for item components', async () => {
      const renderer = sinon.spy();
      dashboard.renderer = renderer;
      const widget = fixtureSync('<vaadin-dashboard-widget widget-title="Component 0"></vaadin-dashboard-widget>');
      dashboard.items = [{ id: '0', component: widget }];
      await updateComplete(dashboard);

      expect(renderer).to.not.be.called;
    });

    it('should use the item component as section', async () => {
      const section = fixtureSync(`<vaadin-dashboard-section section-title="Section"></vaadin-dashboard-section>`);
      const widget = fixtureSync('<vaadin-dashboard-widget widget-title="Component 0"></vaadin-dashboard-widget>');
      (dashboard as any).items = [
        {
          component: section,
          items: [{ id: '0', component: widget }],
        },
      ];
      await updateComplete(dashboard);

      expect(getElementFromCell(dashboard, 0, 0)).to.equal(widget);
      expect(section.contains(widget)).to.be.true;
    });

    it('should render default section if component is not an element', async () => {
      (dashboard as any).items = [{ component: 'not-an-element', title: 'Section', items: [{ id: '0' }] }];
      await updateComplete(dashboard);

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
          items: [{ id: '0', component: widget }],
        },
      ];
      await updateComplete(dashboard);

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
      await updateComplete(dashboard);
    });

    it('should not lose focus when reassigning items', async () => {
      getElementFromCell(dashboard, 0, 0)!.focus();
      dashboard.items = [...dashboard.items];
      await updateComplete(dashboard);
      expect(document.activeElement).to.equal(getElementFromCell(dashboard, 0, 0)!);
    });

    it('should not lose focus when reassigning new items with same ids', async () => {
      getElementFromCell(dashboard, 0, 0)!.focus();
      dashboard.items = [{ id: '0' }, { id: '1' }];
      await updateComplete(dashboard);
      expect(document.activeElement).to.equal(getElementFromCell(dashboard, 0, 0)!);
    });

    it('should not lose focus when prepending items', async () => {
      getElementFromCell(dashboard, 0, 0)!.focus();
      dashboard.items = [{ id: '-1' }, ...dashboard.items];
      await updateComplete(dashboard);
      expect(document.activeElement).to.equal(getElementFromCell(dashboard, 0, 1)!);
    });

    it('should not lose focus when removing items', async () => {
      getElementFromCell(dashboard, 0, 1)!.focus();
      dashboard.items = [dashboard.items[1]];
      await updateComplete(dashboard);
      expect(document.activeElement).to.equal(getElementFromCell(dashboard, 0, 0)!);
    });

    it('should not lose focus when removing items inside shadow root', async () => {
      // Move the dashboard to a shadow root
      const wrapper = fixtureSync('<div></div>');
      const shadow = wrapper.attachShadow({ mode: 'open' });
      shadow.appendChild(dashboard);
      await updateComplete(dashboard);

      // Focus the second widget
      const secondWidget = dashboard.querySelectorAll('vaadin-dashboard-widget')[1];
      secondWidget.focus();

      // Remove the first widget
      dashboard.items = [dashboard.items[1]];
      await updateComplete(dashboard);

      // Expect the second widget to remain focused
      expect(shadow.activeElement).to.equal(secondWidget);
    });

    it('should not lose focus when reassigning section items', async () => {
      dashboard.items = [{ title: 'Section', items: [{ id: '0' }] }, { id: '1' }];
      await updateComplete(dashboard);
      getElementFromCell(dashboard, 0, 0)!.focus();
      dashboard.items = [...dashboard.items];
      await updateComplete(dashboard);
      expect(document.activeElement).to.equal(getElementFromCell(dashboard, 0, 0)!);
    });

    it('should unhide resize handle when editable', async () => {
      getElementFromCell(dashboard, 0, 0)!.focus();
      await updateComplete(dashboard);
      dashboard.editable = true;
      await updateComplete(dashboard);
      const widget = getElementFromCell(dashboard, 0, 0) as DashboardWidget;
      const resizeHandle = getResizeHandle(widget);
      expect(resizeHandle.getBoundingClientRect().height).to.be.above(0);
    });

    it('should unhide remove button of a section when editable', async () => {
      dashboard.items = [{ title: 'Section', items: [{ id: '0' }] }, { id: '1' }];
      await updateComplete(dashboard);
      getElementFromCell(dashboard, 0, 0)!.focus();
      await updateComplete(dashboard);
      dashboard.editable = true;
      await updateComplete(dashboard);
      const widget = getElementFromCell(dashboard, 0, 0) as DashboardWidget;
      const section = widget.closest('vaadin-dashboard-section') as DashboardSection;
      const removeButton = getRemoveButton(section);
      expect(removeButton.getBoundingClientRect().height).to.be.above(0);
    });

    it('should scroll the focused item outside dashboard viewport back into view', async () => {
      // Limit the dashboard height to force scrolling
      dashboard.style.height = '150px';
      await nextResize(dashboard);
      // Focus the first item
      getElementFromCell(dashboard, 0, 0)!.focus();

      // Add enough items to push the focused item out of view
      dashboard.items = Array.from({ length: 10 }, (_, i) => ({ id: i.toString() })).reverse();
      await updateComplete(dashboard);

      // Expect the focused item to have been scrolled back into view
      const widgetRect = document.activeElement!.getBoundingClientRect();
      const dashboardRect = dashboard.getBoundingClientRect();
      expect(widgetRect.bottom).to.be.above(dashboardRect.top);
      expect(widgetRect.top).to.be.below(dashboardRect.bottom);
    });

    it('should not scroll the focused item into view if it is partially visible', async () => {
      // Limit the dashboard height to force scrolling
      dashboard.style.height = '150px';
      await nextResize(dashboard);
      // Focus the first item
      getElementFromCell(dashboard, 0, 0)!.focus();

      // Add enough items to make the dashboard scrollable
      dashboard.items = Array.from({ length: 10 }, (_, i) => ({ id: i.toString() }));
      await updateComplete(dashboard);

      // Scroll the dashboard to make the focused item partially visible
      const scrollingContainer = getScrollingContainer(dashboard);
      const scrollTop = Math.round(document.activeElement!.getBoundingClientRect().height / 2);
      scrollingContainer.scrollTop = scrollTop;

      // Change the items to trigger a render
      dashboard.items = dashboard.items.slice(0, -1);
      await updateComplete(dashboard);

      // Expect no scrolling to have occurred
      expect(scrollingContainer.scrollTop).to.equal(scrollTop);
    });

    it('should scroll the focused item outside browser viewport back into view', async () => {
      // Focus the first item
      getElementFromCell(dashboard, 0, 0)!.focus();

      const columns = getColumnWidths(dashboard).length;
      const rows = window.innerHeight / (document.activeElement as DashboardWidget).offsetHeight;

      // Add enough items to push the focused item out of view
      dashboard.items = Array.from({ length: rows * columns * 2 }, (_, i) => ({ id: i.toString() })).reverse();
      await updateComplete(dashboard);

      // Expect the focused item to have been scrolled back into view
      const widgetRect = document.activeElement!.getBoundingClientRect();
      expect(widgetRect.bottom).to.be.above(0);
      expect(widgetRect.top).to.be.below(window.innerHeight);
    });

    describe('focus restore on focused item removal', () => {
      beforeEach(async () => {
        dashboard.editable = true;
        await updateComplete(dashboard);

        dashboard.items = [{ id: '0' }, { id: '1' }, { title: 'Section', items: [{ id: '2' }, { id: '3' }] }];
        await updateComplete(dashboard);

        /* prettier-ignore */
        expectLayout(dashboard, [
          [0, 1],
          [2, 3]
        ]);
      });

      async function renderAndFocusRestore() {
        // Wait for the updated wrapper layout to be rendered
        await updateComplete(dashboard);
        // Wait for the wrapper widgets to be rendered
        await updateComplete(dashboard);
      }

      it('should focus next widget on focused widget removal', async () => {
        getElementFromCell(dashboard, 0, 0)!.focus();
        dashboard.items = dashboard.items.slice(1);
        await renderAndFocusRestore();
        expect(document.activeElement).to.equal(getElementFromCell(dashboard, 0, 0)!);
      });

      it('should focus next widget on focused widget removal after reordering', async () => {
        getElementFromCell(dashboard, 0, 0)!.focus();
        // Reorder items (the focused widget is moved to the end)
        dashboard.items = [dashboard.items[1], dashboard.items[2], dashboard.items[0]];
        await updateComplete(dashboard);

        // Remove the focused widget
        dashboard.items = [dashboard.items[0], dashboard.items[1]];
        await updateComplete(dashboard);

        // Expect the section to be focused
        const sectionWidget = getElementFromCell(dashboard, 1, 0)!;
        const section = getParentSection(sectionWidget)!;
        expect(document.activeElement).to.equal(section);
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
        await updateComplete(dashboard);
        dashboard.items = [{ id: '100' }];
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

  describe('root heading level', () => {
    beforeEach(async () => {
      dashboard.rootHeadingLevel = 4;
      await updateComplete(dashboard);
      dashboard.items = [{ id: '0' }, { title: 'Section', items: [{ id: '1' }] }];
      await updateComplete(dashboard);
    });

    function assertHeadingLevels(expectedRootHeadingLevel: number) {
      const nonNestedWidget = getElementFromCell(dashboard, 0, 0) as DashboardWidget;
      assertHeadingLevel(nonNestedWidget, expectedRootHeadingLevel);

      const nestedWidget = getElementFromCell(dashboard, 1, 0) as DashboardWidget;
      assertHeadingLevel(nestedWidget, expectedRootHeadingLevel + 1);

      const section = nestedWidget?.closest('vaadin-dashboard-section') as DashboardSection;
      assertHeadingLevel(section, expectedRootHeadingLevel);
    }

    it('should use custom title heading level when set on dashboard', () => {
      assertHeadingLevels(4);
    });

    it('should update title heading level when set on dashboard', async () => {
      dashboard.rootHeadingLevel = 1;
      await updateComplete(dashboard);
      assertHeadingLevels(1);
    });

    it('should use default title heading level when not set on dashboard', async () => {
      dashboard.rootHeadingLevel = null;
      await updateComplete(dashboard);
      assertHeadingLevels(2);
    });
  });
});
