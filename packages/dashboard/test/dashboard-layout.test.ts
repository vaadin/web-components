import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextResize } from '@vaadin/testing-helpers';
import '../vaadin-dashboard-layout.js';
import '../vaadin-dashboard-section.js';
import '../vaadin-dashboard-widget.js';
import { DashboardLayout } from '../vaadin-dashboard-layout.js';
import { DashboardSection } from '../vaadin-dashboard-section.js';
import { DashboardWidget } from '../vaadin-dashboard-widget.js';
import {
  assertHeadingLevel,
  expectLayout,
  getColumnWidths,
  getRowHeights,
  getScrollingContainer,
  getTitleElement,
  setColspan,
  setMaximumColumnCount,
  setMaximumColumnWidth,
  setMinimumColumnWidth,
  setMinimumRowHeight,
  setRowspan,
  setSpacing,
} from './helpers.js';

// Corresponds to --_default-padding: var(--vaadin-padding-l); (16px)
const defaultPadding = 16;

// Corresponds to --_default-gap: var(--vaadin-gap-s); (8px)
const defaultSpacing = 8;

const defaultMinimumColumnWidth = (() => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  div.style.width = '1rem';
  const minColWidth = div.offsetWidth * 25;
  div.remove();
  return minColWidth;
})();

describe('dashboard layout', () => {
  let dashboard: DashboardLayout;
  let childElements: HTMLElement[];
  const columnWidth = 100;

  beforeEach(async () => {
    dashboard = fixtureSync(`
      <vaadin-dashboard-layout>
        <div id="0">Item 0</div>
        <div id="1">Item 1</div>
      </vaadin-dashboard-layout>
    `);
    childElements = [...dashboard.children] as HTMLElement[];
    await nextFrame();
    // Disable spacing between items in these tests
    setSpacing(dashboard, 0);
    // Set the column width to a fixed value
    setMinimumColumnWidth(dashboard, columnWidth);
    setMaximumColumnWidth(dashboard, columnWidth);
    setMinimumRowHeight(dashboard, undefined);
    // Make the dashboard wide enough to fit all items on a single row
    dashboard.style.width = `${columnWidth * dashboard.childElementCount}px`;

    await nextResize(dashboard);

    expect(getColumnWidths(dashboard)).to.eql([columnWidth, columnWidth]);
    /* prettier-ignore */
    expectLayout(dashboard, [
      [0, 1],
    ]);
  });

  it('should not display when hidden', () => {
    expect(dashboard.offsetHeight).to.be.above(0);
    dashboard.hidden = true;
    expect(dashboard.offsetHeight).to.eql(0);
  });

  it('should be responsive', async () => {
    // Narrow down the component to fit one column
    dashboard.style.width = `${columnWidth}px`;
    await nextResize(dashboard);

    /* prettier-ignore */
    expectLayout(dashboard, [
      [0],
      [1],
    ]);
  });

  it('should scroll vertically when content overflows', async () => {
    dashboard.style.width = `${columnWidth}px`;
    const rowHeight = Math.ceil(getRowHeights(dashboard)[0]);
    dashboard.style.height = `${rowHeight}px`;
    await nextResize(dashboard);

    const scrollingContainer = getScrollingContainer(dashboard);
    expect(getComputedStyle(scrollingContainer).overflowY).to.eql('auto');
    expect(scrollingContainer.scrollTop).to.eql(0);

    scrollingContainer.scrollTop = 1;
    expect(scrollingContainer.scrollTop).to.eql(1);
  });

  it('should scroll horizontally when content overflows', async () => {
    dashboard.style.width = `${columnWidth / 2}px`;
    await nextResize(dashboard);

    const scrollingContainer = getScrollingContainer(dashboard);
    expect(getComputedStyle(scrollingContainer).overflowX).to.eql('auto');
    expect(scrollingContainer.scrollLeft).to.eql(0);

    scrollingContainer.scrollLeft = 1;
    expect(scrollingContainer.scrollLeft).to.eql(1);
  });

  describe('minimum column width', () => {
    it('should have a default minimum column width', async () => {
      // Clear the minimum column width used in the tests
      setMinimumColumnWidth(dashboard, undefined);
      // Narrow down the component to have the width of 0
      dashboard.style.width = '0';
      await nextResize(dashboard);
      // Expect the column width to equal the default minimum column width
      expect(getColumnWidths(dashboard)).to.eql([defaultMinimumColumnWidth]);
    });

    it('should have one overflown column if narrowed below minimum column width', async () => {
      // Narrow down the component to have the width of half a column
      dashboard.style.width = `${columnWidth / 2}px`;
      await nextResize(dashboard);
      // Expect the column width to still be the same (overflown)
      expect(getColumnWidths(dashboard)).to.eql([columnWidth]);
    });

    it('should not overflow if narrowed to the minimum column width', async () => {
      // Set the min column width to half of the column width
      setMinimumColumnWidth(dashboard, columnWidth / 2);
      // Narrow down the component to have the width of half a column
      dashboard.style.width = `${columnWidth / 2}px`;
      await nextResize(dashboard);
      // Expect the column width to equal the min column width
      expect(getColumnWidths(dashboard)).to.eql([columnWidth / 2]);
    });

    it('should have one wide column with large minimum column width', () => {
      setMaximumColumnWidth(dashboard, columnWidth * 2);
      // Set the min column width to be twice as wide
      setMinimumColumnWidth(dashboard, columnWidth * 2);
      // Expect there to only be one column with twice the width
      expect(getColumnWidths(dashboard)).to.eql([columnWidth * 2]);
      /* prettier-ignore */
      expectLayout(dashboard, [
        [0],
        [1],
      ]);
    });
  });

  describe('maximum column width', () => {
    it('should have a default maximum column width', async () => {
      // Clear the maximum column width used in the tests
      setMaximumColumnWidth(dashboard, undefined);
      expect(getColumnWidths(dashboard)).to.eql([columnWidth, columnWidth]);
      // Widen the component to have the width of 2.5 columns
      dashboard.style.width = `${columnWidth * 2.5}px`;
      await nextResize(dashboard);
      expect(getColumnWidths(dashboard)).to.eql([columnWidth * 1.25, columnWidth * 1.25]);
      // Widen the component to have the width of 3 columns
      dashboard.style.width = `${columnWidth * 3}px`;
      await nextResize(dashboard);
      expect(getColumnWidths(dashboard)).to.eql([columnWidth, columnWidth, columnWidth]);
      // Shrink the component to have the width of 1.5 columns
      dashboard.style.width = `${columnWidth * 1.5}px`;
      await nextResize(dashboard);
      expect(getColumnWidths(dashboard)).to.eql([columnWidth * 1.5]);
    });

    it('should have one wide column with large maximum column width', () => {
      // Allow the column to be twice as wide
      setMaximumColumnWidth(dashboard, columnWidth * 2);
      // Expect there to only be one column with twice the width
      expect(getColumnWidths(dashboard)).to.eql([columnWidth * 2]);
      /* prettier-ignore */
      expectLayout(dashboard, [
        [0],
        [1],
      ]);
    });
  });

  describe('minimum row height', () => {
    const rowHeight = 100;

    it('should have the row height of the highest wigdet on a row by default', async () => {
      childElements[0].style.height = `${rowHeight}px`;
      childElements[1].style.height = '50px';
      await nextFrame();
      expect(getRowHeights(dashboard)).to.eql([rowHeight]);
    });

    it('should set a minimum row height', async () => {
      setMinimumRowHeight(dashboard, rowHeight);
      await nextFrame();
      expect(getRowHeights(dashboard)).to.eql([rowHeight]);
    });

    it('should not constrain widgets to the minumum row height', async () => {
      childElements[0].style.height = `${rowHeight * 2}px`;
      setMinimumRowHeight(dashboard, rowHeight);
      await nextFrame();
      expect(getRowHeights(dashboard)).to.eql([rowHeight * 2]);
    });

    it('should use minimum row height for all rows', async () => {
      dashboard.style.width = `${columnWidth}px`;
      setMinimumRowHeight(dashboard, rowHeight);
      await nextResize(dashboard);
      expect(getRowHeights(dashboard)).to.eql([rowHeight, rowHeight]);
    });
  });

  describe('column span', () => {
    it('should span multiple columns', async () => {
      setColspan(childElements[0], 2);
      await nextFrame();

      /* prettier-ignore */
      expectLayout(dashboard, [
        [0, 0],
        [1],
      ]);
    });

    it('should be capped to currently available columns', async () => {
      setColspan(childElements[0], 2);
      await nextFrame();

      dashboard.style.width = `${columnWidth}px`;
      await nextResize(dashboard);

      /* prettier-ignore */
      expectLayout(dashboard, [
        [0],
        [1],
      ]);
    });

    it('should span multiple columns on a single row', async () => {
      setColspan(childElements[0], 2);
      await nextFrame();

      dashboard.style.width = `${columnWidth * 3}px`;
      await nextResize(dashboard);

      /* prettier-ignore */
      expectLayout(dashboard, [
        [0, 0, 1],
      ]);
    });

    it('should not flicker on resize', async () => {
      setMinimumColumnWidth(dashboard, columnWidth / 2);
      setColspan(childElements[0], 2);
      await nextFrame();

      /* prettier-ignore */
      expectLayout(dashboard, [
        [0, 0],
        [1],
      ]);

      const widget1Width = childElements[1].offsetWidth;

      // Narrow down the dashboard
      dashboard.style.width = `${columnWidth}px`;
      // Expect widget 1 to still have the same width
      expect(childElements[1].offsetWidth).to.eql(widget1Width);

      await nextResize(dashboard);

      /* prettier-ignore */
      expectLayout(dashboard, [
        [0],
        [1],
      ]);

      // Expect widget 1 to still have the same width after the layout has been recalculated
      expect(childElements[1].offsetWidth).to.eql(widget1Width);
    });
  });

  describe('row span', () => {
    it('should span multiple rows', async () => {
      setMinimumRowHeight(dashboard, 100);
      setRowspan(childElements[0], 2);
      await nextFrame();

      /* prettier-ignore */
      expectLayout(dashboard, [
        [0, 1],
        [0],
      ]);
    });

    it('should span multiple rows on a single column', async () => {
      setMinimumRowHeight(dashboard, 100);
      setRowspan(childElements[0], 2);
      await nextFrame();

      dashboard.style.width = `${columnWidth}px`;
      await nextResize(dashboard);

      /* prettier-ignore */
      expectLayout(dashboard, [
        [0],
        [0],
        [1],
      ]);
    });
  });

  describe('gap', () => {
    it('should have default gap', async () => {
      // Clear the gap used in the tests
      setSpacing(dashboard, undefined);
      // Increase the width of the dashboard to fit two items, paddings and a gap
      dashboard.style.width = `calc(${columnWidth}px * 2 + ${defaultPadding * 2}px + ${defaultSpacing}px)`;
      await nextResize(dashboard);

      const { right: item0Right } = childElements[0].getBoundingClientRect();
      const { left: item1Left } = childElements[1].getBoundingClientRect();
      // Expect the items to have a gap of 1rem
      expect(item1Left - item0Right).to.eql(defaultSpacing);
    });

    it('should have custom gap between items horizontally', async () => {
      const customSpacing = 10;
      setSpacing(dashboard, customSpacing);
      // Increase the width of the dashboard to fit two items, paddings and a gap
      dashboard.style.width = `${columnWidth * 2 + customSpacing * 3}px`;
      await nextResize(dashboard);

      const { right: item0Right } = childElements[0].getBoundingClientRect();
      const { left: item1Left } = childElements[1].getBoundingClientRect();
      // Expect the items to have a gap of 10px
      expect(item1Left - item0Right).to.eql(customSpacing);
    });

    it('should have custom gap between items vertically', async () => {
      const customSpacing = 10;
      setSpacing(dashboard, customSpacing);
      dashboard.style.width = `${columnWidth}px`;
      await nextResize(dashboard);

      const { bottom: item0Bottom } = childElements[0].getBoundingClientRect();
      const { top: item1Top } = childElements[1].getBoundingClientRect();
      // Expect the items to have spacing of 10px
      expect(item1Top - item0Bottom).to.eql(customSpacing);
    });
  });

  describe('padding', () => {
    it('should have default padding', async () => {
      // Clear the padding used in the tests
      setSpacing(dashboard, undefined);
      await nextResize(dashboard);

      const { left: itemLeft } = childElements[0].getBoundingClientRect();
      const { left: dashboardLeft } = dashboard.getBoundingClientRect();
      // Expect the dashboard to have default padding of 1rem
      expect(itemLeft - dashboardLeft).to.eql(defaultPadding);
    });

    it('should have custom gap between items horizontally', async () => {
      const customSpacing = 10;
      setSpacing(dashboard, customSpacing);
      await nextResize(dashboard);

      const { left: itemLeft } = childElements[0].getBoundingClientRect();
      const { left: dashboardLeft } = dashboard.getBoundingClientRect();
      // Expect the items to have a gap of 10px
      expect(itemLeft - dashboardLeft).to.eql(customSpacing);
    });
  });

  describe('maximum column count', () => {
    it('should not limit column count by default', async () => {
      dashboard.style.width = `${columnWidth * 100}px`;
      await nextResize(dashboard);
      expect(getColumnWidths(dashboard).length).to.eql(100);
    });

    it('should limit column count to custom value', async () => {
      setMaximumColumnCount(dashboard, 5);
      dashboard.style.width = `${columnWidth * 100}px`;
      await nextResize(dashboard);
      expect(getColumnWidths(dashboard).length).to.eql(5);
    });

    it('should limit column count to one', async () => {
      setMaximumColumnCount(dashboard, 1);
      dashboard.style.width = `${columnWidth * 10}px`;
      await nextResize(dashboard);
      /* prettier-ignore */
      expectLayout(dashboard, [
        [0],
        [1],
      ]);
    });

    it('should allow fewer columns', async () => {
      setMaximumColumnCount(dashboard, 2);
      dashboard.style.width = `${columnWidth}px`;
      await nextResize(dashboard);
      /* prettier-ignore */
      expectLayout(dashboard, [
        [0],
        [1],
      ]);
    });

    it('should limit to a single column even with colspan applied', async () => {
      setMaximumColumnCount(dashboard, 1);
      setColspan(childElements[0], 2);
      await nextFrame();
      /* prettier-ignore */
      expectLayout(dashboard, [
        [0],
        [1],
      ]);
    });

    it('should increase max column count dynamically', async () => {
      setMaximumColumnCount(dashboard, 2);
      dashboard.style.width = `${columnWidth * 100}px`;
      await nextResize(dashboard);
      expect(getColumnWidths(dashboard).length).to.eql(2);

      setMaximumColumnCount(dashboard, 20);
      await nextFrame();
      expect(getColumnWidths(dashboard).length).to.eql(20);
    });
  });

  describe('section', () => {
    let section: DashboardSection;

    beforeEach(async () => {
      section = fixtureSync(`
        <vaadin-dashboard-section section-title="Section">
          <div id="2">Section item 2</div>
          <div id="3">Section item 3</div>
        </vaadin-dashboard-section>
      `);
      dashboard.appendChild(section);
      await nextFrame();
      childElements = [...dashboard.querySelectorAll('div')];
    });

    it('should span full width of the dashboard layout', () => {
      /* prettier-ignore */
      expectLayout(dashboard, [
        [0, 1],
        [2, 3],
      ]);
    });

    it('should be on its own row', async () => {
      dashboard.style.width = `${columnWidth * 4}px`;
      await nextResize(dashboard);

      /* prettier-ignore */
      expectLayout(dashboard, [
        [0, 1, null, null],
        [2, 3, null, null],
      ]);
    });

    it('following items should end up in the next row', async () => {
      dashboard.style.width = `${columnWidth * 4}px`;
      dashboard.appendChild(fixtureSync('<div id="4">Item 4</div>'));
      await nextResize(dashboard);

      /* prettier-ignore */
      expectLayout(dashboard, [
        [0, 1, null, null],
        [2, 3, null, null],
        [4],
      ]);
    });

    it('should be capped to currently available columns', async () => {
      dashboard.style.width = `${columnWidth}px`;
      await nextResize(dashboard);

      /* prettier-ignore */
      expectLayout(dashboard, [
        [0],
        [1],
        [2],
        [3],
      ]);
    });

    it('should span multiple columns inside a section', async () => {
      dashboard.style.width = `${columnWidth * 3}px`;
      setColspan(childElements[2], 2);
      await nextResize(dashboard);

      /* prettier-ignore */
      expectLayout(dashboard, [
        [0, 1, null],
        [2, 2, 3],
      ]);
    });

    it('should span multiple rows inside a section', async () => {
      // Using a minimum row height here causes Firefox to crash, disabling for now
      // setMinimumRowHeight(dashboard, 100);
      setRowspan(childElements[2], 2);
      await nextFrame();

      /* prettier-ignore */
      expectLayout(dashboard, [
        [0, 1],
        [2, 3],
        [2]
      ]);
    });

    it('should use minimum row height for all section rows', async () => {
      dashboard.style.width = `${columnWidth}px`;
      setMinimumRowHeight(dashboard, 300);
      await nextResize(dashboard);

      expect(childElements[2].offsetHeight).to.eql(300);
      expect(childElements[3].offsetHeight).to.eql(300);
    });

    it('should not use minimum row height for section header row', async () => {
      const title = getTitleElement(section);
      title.style.height = '100%';

      const titleHeight = title.offsetHeight;
      setMinimumRowHeight(dashboard, 300);
      await nextFrame();

      const newTitleHeight = title.offsetHeight;
      expect(newTitleHeight).to.eql(titleHeight);
    });

    describe('gap', () => {
      it('should have default gap', async () => {
        // Clear the spacing used in the tests
        setSpacing(dashboard, undefined);
        // Increase the width of the dashboard to fit two items, paddings and a gap
        dashboard.style.width = `calc(${columnWidth}px * 2 + ${defaultPadding * 3}px + ${defaultSpacing}px)`;
        await nextResize(dashboard);

        const { right: item2Right } = childElements[2].getBoundingClientRect();
        const { left: item3Left } = childElements[3].getBoundingClientRect();
        // Expect the items to have a gap of 1rem
        expect(item3Left - item2Right).to.eql(defaultSpacing);
      });

      it('should have a custom gap between items horizontally', async () => {
        const customSpacing = 10;
        setSpacing(dashboard, customSpacing);
        // Increase the width of the dashboard to fit two items, paddings and a gap
        dashboard.style.width = `${columnWidth * 2 + customSpacing * 3}px`;
        await nextResize(dashboard);

        const { right: item2Right } = childElements[2].getBoundingClientRect();
        const { left: item3Left } = childElements[3].getBoundingClientRect();
        // Expect the items to have a gap of 10px
        expect(item3Left - item2Right).to.eql(customSpacing);
      });

      it('should have a custom gap between items vertically', async () => {
        const customSpacing = 10;
        setSpacing(dashboard, customSpacing);
        dashboard.style.width = `${columnWidth}px`;
        await nextResize(dashboard);

        const { bottom: item2Bottom } = childElements[2].getBoundingClientRect();
        const { top: item3Top } = childElements[3].getBoundingClientRect();
        // Expect the items to have a gap of 10px
        expect(item3Top - item2Bottom).to.eql(customSpacing);
      });
    });
  });

  describe('dense layout', () => {
    beforeEach(async () => {
      dashboard.appendChild(fixtureSync('<div id="2">Item 2</div>'));
      childElements = [...dashboard.querySelectorAll('div')];
      setColspan(childElements[1], 2);
      dashboard.denseLayout = true;
      await nextFrame();
    });

    it('should display the items in dense mode', () => {
      /* prettier-ignore */
      expectLayout(dashboard, [
        [0, 2],
        [1, 1],
      ]);
    });

    it('should retain the order of items', async () => {
      dashboard.denseLayout = false;
      await nextFrame();
      /* prettier-ignore */
      expectLayout(dashboard, [
        [0],
        [1, 1],
        [2],
      ]);
    });
  });
});

describe('root heading level', () => {
  let dashboardLayout: DashboardLayout;
  let newDashboardLayout: DashboardLayout;
  let section: DashboardSection;
  let widget: DashboardWidget;
  let nestedWidget: DashboardWidget;

  beforeEach(async () => {
    const container = fixtureSync(`
      <div>
        <vaadin-dashboard-layout id="layout1">
          <vaadin-dashboard-widget widget-title="Widget"></vaadin-dashboard-widget>
          <vaadin-dashboard-section section-title="Section">
            <vaadin-dashboard-widget widget-title="Nested Widget"></vaadin-dashboard-widget>
          </vaadin-dashboard-section>
        </vaadin-dashboard-layout>
        <vaadin-dashboard-layout id="layout2" root-heading-level="3"></vaadin-dashboard-layout>
      </div>
    `);
    await nextFrame();
    dashboardLayout = container.querySelector('#layout1') as DashboardLayout;
    widget = dashboardLayout.querySelector('vaadin-dashboard-widget') as DashboardWidget;
    section = dashboardLayout.querySelector('vaadin-dashboard-section') as DashboardSection;
    nestedWidget = section.querySelector('vaadin-dashboard-widget') as DashboardWidget;
    newDashboardLayout = container.querySelector('#layout2') as DashboardLayout;
  });

  function assertHeadingLevels(expectedHeadingLevel: number) {
    assertHeadingLevel(widget, expectedHeadingLevel);
    assertHeadingLevel(section, expectedHeadingLevel);
    assertHeadingLevel(nestedWidget, expectedHeadingLevel + 1);
  }

  it('should use default title heading level (2) when not explicitly set', () => {
    assertHeadingLevels(2);
  });

  it('should use custom title heading level when set on dashboard layout', async () => {
    dashboardLayout.rootHeadingLevel = 4;
    await nextFrame();
    assertHeadingLevels(4);
  });

  it('should revert to default title heading level (2) when set to null', async () => {
    dashboardLayout.rootHeadingLevel = 4;
    await nextFrame();
    dashboardLayout.rootHeadingLevel = null;
    await nextFrame();
    assertHeadingLevels(2);
  });

  it('should update heading levels for newly added components', async () => {
    dashboardLayout.rootHeadingLevel = 3;
    await nextFrame();
    const newWidget = document.createElement('vaadin-dashboard-widget');
    dashboardLayout.appendChild(newWidget);
    const newSection = document.createElement('vaadin-dashboard-section');
    const nestedInNewSection = document.createElement('vaadin-dashboard-widget');
    newSection.appendChild(nestedInNewSection);
    dashboardLayout.appendChild(newSection);
    await nextFrame();
    assertHeadingLevel(newWidget, 3);
    assertHeadingLevel(newSection, 3);
    assertHeadingLevel(nestedInNewSection, 4);
  });

  describe('moving between parents', () => {
    it('should update heading level when moved to another dashboard layout', async () => {
      newDashboardLayout.appendChild(section);
      await nextFrame();
      assertHeadingLevel(section, 3);
      assertHeadingLevel(nestedWidget, 4);
    });

    it('should update heading level when a new widget is added', async () => {
      const newWidget = document.createElement('vaadin-dashboard-widget');
      newWidget.widgetTitle = 'New Widget';
      section.appendChild(newWidget);
      await nextFrame();
      assertHeadingLevel(newWidget, 3);
      newDashboardLayout.appendChild(section);
      await nextFrame();
      assertHeadingLevel(newWidget, 4);
    });
  });

  it('should update heading level when custom elements are used', async () => {
    class CustomLayout extends DashboardLayout {}
    customElements.define('custom-dashboard-layout', CustomLayout);
    class CustomSection extends DashboardSection {}
    customElements.define('custom-dashboard-section', CustomSection);
    class CustomWidget extends DashboardWidget {}
    customElements.define('custom-dashboard-widget', CustomWidget);
    const customLayout = fixtureSync(`
        <custom-dashboard-layout root-heading-level="5">
          <custom-dashboard-widget widget-title="Custom Widget"></custom-dashboard-widget>
          <custom-dashboard-section section-title="Custom Section">
            <custom-dashboard-widget widget-title="Custom Nested Widget"></custom-dashboard-widget>
          </custom-dashboard-section>
        </custom-dashboard-layout>
      `) as CustomLayout;
    await nextFrame();
    const widget = customLayout.querySelector('custom-dashboard-widget') as CustomWidget;
    const section = customLayout.querySelector('custom-dashboard-section') as CustomSection;
    const nestedWidget = section.querySelector('custom-dashboard-widget') as CustomWidget;
    assertHeadingLevel(widget, 5);
    assertHeadingLevel(section, 5);
    assertHeadingLevel(nestedWidget, 6);
  });
});
