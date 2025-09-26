import { expect } from '@vaadin/chai-plugins';
import { aTimeout, nextFrame, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import type { DashboardSection } from '../src/vaadin-dashboard-section.js';
import type { DashboardWidget } from '../src/vaadin-dashboard-widget.js';

function getCssGrid(element: Element): Element {
  return (element as any).$?.grid || element;
}

/**
 * Returns the scrolling container of the dashboard.
 */
export function getScrollingContainer(dashboard: Element): Element {
  return dashboard;
}

export function getParentSection(element?: Element | null): DashboardSection | null {
  if (!element) {
    return null;
  }
  return element.closest('vaadin-dashboard-section') as DashboardSection;
}

/**
 * Returns the effective column widths of the dashboard as an array of numbers.
 */
export function getColumnWidths(dashboard: Element): number[] {
  return getComputedStyle(getCssGrid(dashboard))
    .gridTemplateColumns.split(' ')
    .map((width) => parseFloat(width));
}

function _getRowHeights(dashboard: Element): number[] {
  return getComputedStyle(getCssGrid(dashboard))
    .gridTemplateRows.split(' ')
    .map((height) => parseFloat(height));
}

function _getElementFromCell(dashboard: HTMLElement, rowIndex: number, columnIndex: number, rowHeights: number[]) {
  const { top, left, right } = dashboard.getBoundingClientRect();
  const columnWidths = getColumnWidths(dashboard);
  const columnOffset = columnWidths.slice(0, columnIndex).reduce((sum, width) => sum + width, 0);
  const rtl = document.dir === 'rtl';
  const x = rtl ? right - columnOffset : left + columnOffset;
  const y = top + rowHeights.slice(0, rowIndex).reduce((sum, height) => sum + height, 0);

  return document
    .elementsFromPoint(x + (columnWidths[columnIndex] / 2) * (rtl ? -1 : 1), y + rowHeights[rowIndex] - 10)
    .reverse()
    .find(
      (element) =>
        dashboard.contains(element) && element !== dashboard && element.localName !== 'vaadin-dashboard-section',
    ) as HTMLElement;
}

/**
 * Returns the effective row heights with the row heights of nested sections flattened.
 */
export function getRowHeights(dashboard: HTMLElement): number[] {
  const dashboardRowHeights = _getRowHeights(dashboard);
  [...dashboardRowHeights].forEach((_height, index) => {
    const item = _getElementFromCell(dashboard, index, 0, dashboardRowHeights);
    const parentSection = getParentSection(item);
    if (parentSection) {
      const [headerRowHeight, firstRowHeight, ...remainingRowHeights] = _getRowHeights(parentSection);
      // Merge the first two row heights of the section since the first one is the section header
      dashboardRowHeights.splice(index, 1, headerRowHeight + firstRowHeight, ...remainingRowHeights);
    }
  });
  return dashboardRowHeights;
}

export function getTitleElement(item: DashboardWidget | DashboardSection): HTMLElement {
  return item.shadowRoot!.querySelector('#title')!;
}

/**
 * Returns the element at the center of the cell at the given row and column index.
 */
export function getElementFromCell(dashboard: HTMLElement, rowIndex: number, columnIndex: number): HTMLElement | null {
  const rowHeights = getRowHeights(dashboard);
  return _getElementFromCell(dashboard, rowIndex, columnIndex, rowHeights);
}

/**
 * Sets the minimum column width of the dashboard.
 */
export function setMinimumColumnWidth(dashboard: HTMLElement, width?: number): void {
  dashboard.style.setProperty('--vaadin-dashboard-col-min-width', width !== undefined ? `${width}px` : null);
  // The ResizeObserver doesn't react to changes in column width, so we need to trigger a resize manually
  (dashboard as any)._onResize();
}

/**
 * Sets the maximum column width of the dashboard.
 */
export function setMaximumColumnWidth(dashboard: HTMLElement, width?: number): void {
  dashboard.style.setProperty('--vaadin-dashboard-col-max-width', width !== undefined ? `${width}px` : null);
  // The ResizeObserver doesn't react to changes in column width, so we need to trigger a resize manually
  (dashboard as any)._onResize();
}

/**
 * Sets the column span of the element
 */
export function setColspan(element: HTMLElement, colspan?: number): void {
  element.style.setProperty('--vaadin-dashboard-widget-colspan', colspan !== undefined ? `${colspan}` : null);
}

/**
 * Sets the row span of the element
 */
export function setRowspan(element: HTMLElement, rowspan?: number): void {
  element.style.setProperty('--vaadin-dashboard-widget-rowspan', rowspan !== undefined ? `${rowspan}` : null);
}

/**
 * Sets the spacing of the dashboard. This value adjusts the spacing between elements within the dashboard and the space around its outer edges.
 */
export function setSpacing(dashboard: HTMLElement, spacing?: number): void {
  dashboard.style.setProperty('--vaadin-dashboard-gap', spacing !== undefined ? `${spacing}px` : null);
  dashboard.style.setProperty('--vaadin-dashboard-padding', spacing !== undefined ? `${spacing}px` : null);
}

/**
 * Sets the maximum column count of the dashboard.
 */
export function setMaximumColumnCount(dashboard: HTMLElement, count?: number): void {
  dashboard.style.setProperty('--vaadin-dashboard-col-max-count', count !== undefined ? `${count}` : null);
}

/**
 * Sets the minimum row height of the dashboard.
 */
export function setMinimumRowHeight(dashboard: HTMLElement, height?: number): void {
  dashboard.style.setProperty('--vaadin-dashboard-row-min-height', height !== undefined ? `${height}px` : 'auto');
}

/**
 * Validates the given grid layout.
 *
 * This function iterates through a number matrix representing the IDs of
 * the items in the layout, and checks if the elements in the corresponding
 * cells of the grid match the expected IDs.
 *
 * For example, the following layout would expect a grid with two columns
 * and three rows, where the first row has one element with ID "0" spanning
 * two columns, and the second row has two elements with IDs "1" and "2"
 * where the first one spans two rows, and the last cell in the third row has
 * an element with ID "3":
 *
 * ```
 * [
 *  [0, 0],
 *  [1, 2],
 *  [1, 3]
 * ]
 * ```
 */
export function expectLayout(dashboard: HTMLElement, layout: Array<Array<number | null>>): void {
  if (getRowHeights(dashboard).length !== layout.length) {
    expect.fail(`Expected layout row count: ${layout.length}, actual: ${getRowHeights(dashboard).length}`);
  }
  if (getColumnWidths(dashboard).length !== Math.max(...layout.map((row) => row.length))) {
    expect.fail(`Expected layout column count: ${layout[0].length}, actual: ${getColumnWidths(dashboard).length}`);
  }

  const actualLayout: Array<Array<number | null>> = [];
  layout.forEach((row, rowIndex) => {
    const actualRow: Array<number | null> = [];
    actualLayout.push(actualRow);
    row.forEach((_itemId, columnIndex) => {
      const element = getElementFromCell(dashboard, rowIndex, columnIndex);
      if (!element) {
        actualRow.push(null);
      } else {
        actualRow.push(parseInt(element.id));
      }
    });
  });

  function printLayout(layout: Array<Array<number | null>>): string {
    return layout.map((row) => row.map((id) => (id === null ? 'null' : id)).join(', ')).join('\n');
  }

  if (printLayout(layout) !== printLayout(actualLayout)) {
    expect.fail(`\n\nExpected layout: \n${printLayout(layout)}\n\nActual layout: \n${printLayout(actualLayout)}`);
  }
}

export function getDraggable(element: Element): Element {
  return element.shadowRoot!.querySelector('[part~="move-button"]')!;
}

type TestDragEvent = Event & {
  clientX: number;
  clientY: number;
  dataTransfer: {
    dropEffect?: string;
    setDragImage: sinon.SinonSpy;
    setData(type: string, data: string): void;
    getData(type: string): string;
  };
};

export function createDragEvent(type: string, { x, y }: { x: number; y: number }): TestDragEvent {
  const event = new Event(type, {
    bubbles: true,
    cancelable: true,
    composed: true,
  }) as TestDragEvent;

  event.clientX = x;
  event.clientY = y;

  const dragData: Record<string, string> = {};
  event.dataTransfer = {
    setDragImage: sinon.spy(),
    setData: (type: string, data: string) => {
      dragData[type] = data;
    },
    getData: (type: string) => dragData[type],
  };

  return event;
}

export function getEventCoordinates(
  relativeElement: Element,
  location: 'top' | 'bottom' | 'start' | 'end',
): { x: number; y: number } {
  const { top, bottom, left, right } = relativeElement.getBoundingClientRect();
  const y = location === 'top' ? top : bottom;
  const dir = document.dir;
  const x = location === 'start' ? (dir === 'rtl' ? right : left) : dir === 'rtl' ? left : right;
  return { x, y };
}

export function fireDragOver(dragOverTarget: Element, location: 'top' | 'bottom' | 'start' | 'end'): TestDragEvent {
  const event = createDragEvent('dragover', getEventCoordinates(dragOverTarget, location));
  dragOverTarget.dispatchEvent(event);
  return event;
}

export function fireDragStart(dragStartTarget: Element): TestDragEvent {
  const draggable = getDraggable(dragStartTarget);
  const draggableRect = draggable.getBoundingClientRect();
  const event = createDragEvent('dragstart', {
    x: draggableRect.left + draggableRect.width / 2,
    y: draggableRect.top + draggableRect.height / 2,
  });
  draggable.dispatchEvent(event);

  // Dispatch initial dragover event to make sure any following dragover has some delta
  draggable.dispatchEvent(
    createDragEvent('dragover', {
      x: draggableRect.left + draggableRect.width / 2,
      y: draggableRect.top + draggableRect.height / 2,
    }),
  );

  return event;
}

export function fireDragEnd(dashboard: Element): TestDragEvent {
  const event = createDragEvent('dragend', { x: 0, y: 0 });
  dashboard.dispatchEvent(event);
  return event;
}

export function fireDrop(dragOverTarget: Element): TestDragEvent {
  const event = createDragEvent('drop', { x: 0, y: 0 });
  dragOverTarget.dispatchEvent(event);
  return event;
}

export function resetReorderTimeout(dashboard: HTMLElement): void {
  (dashboard as any).__widgetReorderController.__reordering = false;
}

export function fireResizeOver(dragOverTarget: Element, location: 'top' | 'bottom' | 'start' | 'end'): void {
  const { x, y } = getEventCoordinates(dragOverTarget, location);
  const event = new MouseEvent('mousemove', { bubbles: true, composed: true, clientX: x, clientY: y, buttons: 1 });
  dragOverTarget.dispatchEvent(event);
}

export function getResizeHandle(resizedWidget: Element): Element {
  return resizedWidget.shadowRoot!.querySelector('.resize-handle')!;
}

export function fireResizeStart(resizedWidget: Element): void {
  let handle = getResizeHandle(resizedWidget);
  if (!handle) {
    handle = resizedWidget;
  }
  const { x, y } = getEventCoordinates(handle, 'bottom');
  handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true, clientX: x, clientY: y }));
  // Initiate track
  fireResizeOver(resizedWidget, 'top');
}

export function fireResizeEnd(dragOverTarget: Element): void {
  dragOverTarget.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, composed: true }));
}

export function getRemoveButton(section: DashboardWidget | DashboardSection): HTMLElement {
  return section.shadowRoot!.querySelector('[part~="remove-button"]') as HTMLElement;
}

export function describeBidirectional(name: string, tests: () => void): void {
  describe(name, tests);
  describe(`${name} (RTL)`, () => {
    before(() => {
      document.dir = 'rtl';
    });

    after(() => {
      document.dir = 'ltr'; // Reset to default after tests
    });

    tests();
  });
}

export function getMoveForwardButton(element: HTMLElement): HTMLElement {
  return element.shadowRoot!.querySelector('[part~="move-forward-button"]') as HTMLElement;
}

export function getMoveBackwardButton(element: HTMLElement): HTMLElement {
  return element.shadowRoot!.querySelector('[part~="move-backward-button"]') as HTMLElement;
}

export function getMoveApplyButton(element: HTMLElement): HTMLElement {
  return element.shadowRoot!.querySelector('[part~="move-apply-button"]') as HTMLElement;
}

export function getResizeApplyButton(element: HTMLElement): HTMLElement {
  return element.shadowRoot!.querySelector('[part~="resize-apply-button"]') as HTMLElement;
}

export function getResizeShrinkWidthButton(element: HTMLElement): HTMLElement {
  return element.shadowRoot!.querySelector('[part~="resize-shrink-width-button"]') as HTMLElement;
}

export function getResizeGrowWidthButton(element: HTMLElement): HTMLElement {
  return element.shadowRoot!.querySelector('[part~="resize-grow-width-button"]') as HTMLElement;
}

export function getResizeShrinkHeightButton(element: HTMLElement): HTMLElement {
  return element.shadowRoot!.querySelector('[part~="resize-shrink-height-button"]') as HTMLElement;
}

export function getResizeGrowHeightButton(element: HTMLElement): HTMLElement {
  return element.shadowRoot!.querySelector('[part~="resize-grow-height-button"]') as HTMLElement;
}

export async function updateComplete(dashboard: HTMLElement): Promise<void> {
  await nextUpdate(dashboard);

  const widgetsAndSections = dashboard.querySelectorAll('vaadin-dashboard-widget, vaadin-dashboard-section');
  for (const child of widgetsAndSections) {
    await nextUpdate(child as HTMLElement);
  }

  // Next frame is also needed to wait for a possible ResizeObserver invocation
  // The observer uses a timeout internally so an additional timeout is also needed
  await nextFrame();
  await aTimeout(0);
}

export function assertHeadingLevel(item: DashboardWidget | DashboardSection, expectedHeadingLevel: number): void {
  expect(getTitleElement(item).getAttribute('aria-level')).to.equal(expectedHeadingLevel.toString());
}
