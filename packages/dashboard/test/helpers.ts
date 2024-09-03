function getCssGrid(element: Element): Element {
  return (element as any).$?.grid || element;
}

export function getScrollingContainer(dashboard: Element): Element {
  return (dashboard as any).$.grid;
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
