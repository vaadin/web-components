import { expect } from '@vaadin/chai-plugins';
import sinon from 'sinon';

/**
 * Returns the effective column widths of the dashboard as an array of numbers.
 */
export function getColumnWidths(dashboard: HTMLElement): number[] {
  return getComputedStyle(dashboard)
    .gridTemplateColumns.split(' ')
    .map((width) => parseFloat(width));
}

function _getRowHeights(dashboard: HTMLElement): number[] {
  return getComputedStyle(dashboard)
    .gridTemplateRows.split(' ')
    .map((height) => parseFloat(height));
}

function _getElementFromCell(dashboard: HTMLElement, rowIndex: number, columnIndex: number, rowHeights: number[]) {
  const { top, left } = dashboard.getBoundingClientRect();
  const columnWidths = getColumnWidths(dashboard);
  const x = left + columnWidths.slice(0, columnIndex).reduce((sum, width) => sum + width, 0);
  const y = top + rowHeights.slice(0, rowIndex).reduce((sum, height) => sum + height, 0);

  return document
    .elementsFromPoint(x + columnWidths[columnIndex] / 2, y + rowHeights[rowIndex] - 1)
    .reverse()
    .find(
      (element) =>
        dashboard.contains(element) && element !== dashboard && element.localName !== 'vaadin-dashboard-section',
    )!;
}

/**
 * Returns the effective row heights with the row heights of nested sections flattened.
 */
export function getRowHeights(dashboard: HTMLElement): number[] {
  const dashboardRowHeights = _getRowHeights(dashboard);
  [...dashboardRowHeights].forEach((_height, index) => {
    const item = _getElementFromCell(dashboard, index, 0, dashboardRowHeights);
    const parentSection = item?.closest('vaadin-dashboard-section');
    if (parentSection) {
      const [headerRowHeight, firstRowHeight, ...remainingRowHeights] = _getRowHeights(parentSection);
      // Merge the first two row heights of the section since the first one is the section header
      dashboardRowHeights.splice(index, 1, headerRowHeight + firstRowHeight, ...remainingRowHeights);
    }
  });
  return dashboardRowHeights;
}

/**
 * Returns the element at the center of the cell at the given row and column index.
 */
export function getElementFromCell(dashboard: HTMLElement, rowIndex: number, columnIndex: number): Element | null {
  const rowHeights = getRowHeights(dashboard);
  return _getElementFromCell(dashboard, rowIndex, columnIndex, rowHeights);
}

/**
 * Sets the minimum column width of the dashboard.
 */
export function setMinimumColumnWidth(dashboard: HTMLElement, width?: number): void {
  dashboard.style.setProperty('--vaadin-dashboard-col-min-width', width !== undefined ? `${width}px` : null);
}

/**
 * Sets the maximum column width of the dashboard.
 */
export function setMaximumColumnWidth(dashboard: HTMLElement, width?: number): void {
  dashboard.style.setProperty('--vaadin-dashboard-col-max-width', width !== undefined ? `${width}px` : null);
}

/**
 * Sets the column span of the element
 */
export function setColspan(element: HTMLElement, colspan?: number): void {
  element.style.setProperty('--vaadin-dashboard-item-colspan', colspan !== undefined ? `${colspan}` : null);
}

/**
 * Sets the gap between the cells of the dashboard.
 */
export function setGap(dashboard: HTMLElement, gap?: number): void {
  dashboard.style.setProperty('--vaadin-dashboard-gap', gap !== undefined ? `${gap}px` : null);
}

/**
 * Sets the maximum column count of the dashboard.
 */
export function setMaximumColumnCount(dashboard: HTMLElement, count?: number): void {
  dashboard.style.setProperty('--vaadin-dashboard-col-max-count', count !== undefined ? `${count}` : null);
}

/**
 * Validates the given grid layout.
 *
 * This function iterates through a number matrix representing the IDs of
 * the items in the layout, and checks if the elements in the corresponding
 * cells of the grid match the expected IDs.
 *
 * For example, the following layout would expect a grid with two columns
 * and three rows, where the first row has one element with ID "item-0" spanning
 * two columns, and the second row has two elements with IDs "item-1" and "item-2"
 * where the first one spans two rows, and the last cell in the third row has
 * an element with ID "item-3":
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
  expect(getRowHeights(dashboard).length).to.eql(layout.length);
  expect(getColumnWidths(dashboard).length).to.eql(layout[0].length);

  layout.forEach((row, rowIndex) => {
    row.forEach((itemId, columnIndex) => {
      const element = getElementFromCell(dashboard, rowIndex, columnIndex);
      if (!element) {
        expect(itemId).to.be.null;
      } else {
        expect(element.id).to.equal(`item-${itemId}`);
      }
    });
  });
}

export function getDraggable(element: Element): Element {
  return element.shadowRoot!.querySelector('[draggable]')!;
}

type TestDragEvent = Event & {
  clientX: number;
  clientY: number;
  dataTransfer: {
    setDragImage: sinon.SinonSpy;
    setData(type: string, data: string): void;
    getData(type: string): string;
  };
};

function createDragEvent(type: string, { x, y }: { x: number; y: number }): TestDragEvent {
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

export function fireDragStart(draggable: Element): TestDragEvent {
  const draggableRect = draggable.getBoundingClientRect();
  const event = createDragEvent('dragstart', {
    x: draggableRect.left + draggableRect.width / 2,
    y: draggableRect.top + draggableRect.height / 2,
  });
  draggable.dispatchEvent(event);
  return event;
}

export function fireDragOver(dragOverTarget: Element, location: 'top' | 'botton' | 'start' | 'end'): TestDragEvent {
  const { top, bottom, left, right } = dragOverTarget.getBoundingClientRect();
  const y = location === 'top' ? top : bottom;
  const dir = document.dir;
  const x = location === 'start' ? (dir === 'rtl' ? right : left) : dir === 'rtl' ? left : right;
  const event = createDragEvent('dragover', { x, y });
  dragOverTarget.dispatchEvent(event);
  return event;
}

export function fireDragEnd(dashboard: Element): TestDragEvent {
  const event = createDragEvent('dragend', { x: 0, y: 0 });
  dashboard.dispatchEvent(event);
  return event;
}
