/**
 * Returns the effective column widths of the dashboard as an array of numbers.
 */
export function getColumnWidths(dashboard: HTMLElement): number[] {
  return getComputedStyle(dashboard)
    .gridTemplateColumns.split(' ')
    .map((width) => parseFloat(width));
}

/**
 * Returns the effective row heights of the dashboard as an array of numbers.
 */
export function getRowHeights(dashboard: HTMLElement): number[] {
  return getComputedStyle(dashboard)
    .gridTemplateRows.split(' ')
    .map((height) => parseFloat(height));
}

/**
 * Returns the element at the center of the cell at the given row and column index.
 */
export function getElementFromCell(dashboard: HTMLElement, rowIndex: number, columnIndex: number): Element | null {
  const { top, left } = dashboard.getBoundingClientRect();
  const columnWidths = getColumnWidths(dashboard);
  const rowHeights = getRowHeights(dashboard);

  const x = left + columnWidths.slice(0, columnIndex).reduce((sum, width) => sum + width, 0);
  const y = top + rowHeights.slice(0, rowIndex).reduce((sum, height) => sum + height, 0);

  return document.elementFromPoint(x + columnWidths[columnIndex] / 2, y + rowHeights[rowIndex] / 2);
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
 * Sets the gap between the cells of the dashboard.
 */
export function setGap(dashboard: HTMLElement, gap: number): void {
  dashboard.style.gap = `${gap}px`;
}
