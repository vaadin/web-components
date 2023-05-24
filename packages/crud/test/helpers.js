export { flushGrid } from '@vaadin/grid/test/helpers.js';

function isRowInViewport(grid, row) {
  const scrollTarget = grid.shadowRoot.querySelector('table');
  const scrollTargetRect = scrollTarget.getBoundingClientRect();
  const rowRect = row.getBoundingClientRect();
  const offset = parseInt(getComputedStyle(row.firstElementChild).borderTopWidth);
  const headerHeight = grid.shadowRoot.querySelector('thead').offsetHeight;
  const footerHeight = grid.shadowRoot.querySelector('tfoot').offsetHeight;
  return (
    rowRect.bottom > scrollTargetRect.top + headerHeight + offset &&
    rowRect.top < scrollTargetRect.bottom - footerHeight - offset
  );
}

export const getRows = (container) => {
  return container.querySelectorAll('tr');
};

export const getRowCells = (row) => {
  return Array.from(row.querySelectorAll('[part~="cell"]'));
};

export const getCellContent = (cell) => {
  return cell ? cell.querySelector('slot').assignedNodes()[0] : null;
};

export const getContainerCell = (container, row, col) => {
  const rows = getRows(container);

  if (!rows[row]) {
    return null;
  }

  const cells = getRowCells(rows[row]);
  return cells[col];
};

export const getContainerCellContent = (container, row, col) => {
  return getCellContent(getContainerCell(container, row, col));
};

export const getHeaderCellContent = (grid, row, col) => {
  const container = grid.$.header;
  return getContainerCellContent(container, row, col);
};

export const getBodyCellContent = (grid, row, col) => {
  const container = grid.$.items;
  return getContainerCellContent(container, row, col);
};

export function getBodyRowsInViewport(grid) {
  return [...getRows(grid.$.items)].filter((row) => isRowInViewport(grid, row));
}
