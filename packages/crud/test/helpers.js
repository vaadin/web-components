import { flush } from '@polymer/polymer/lib/utils/flush.js';

export const flushGrid = (grid) => {
  grid._observer.flush();
  if (grid._debounceScrolling) {
    grid._debounceScrolling.flush();
  }
  if (grid._debounceScrollPeriod) {
    grid._debounceScrollPeriod.flush();
  }
  flush();
  if (grid._debouncerLoad) {
    grid._debouncerLoad.flush();
  }
  if (grid._debounceOverflow) {
    grid._debounceOverflow.flush();
  }
  while (grid._debounceIncreasePool) {
    grid._debounceIncreasePool.flush();
    grid._debounceIncreasePool = null;
    flush();
  }
};

export const getRows = (container) => {
  return container.querySelectorAll('tr');
};

export const getRowCells = (row) => {
  return Array.from(row.querySelectorAll('[part~="cell"]'));
};

export const getCellContent = (cell) => {
  return cell ? cell.querySelector('slot').assignedNodes()[0] : null;
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

export const getContainerCell = (container, row, col) => {
  const rows = getRows(container);
  const cells = getRowCells(rows[row]);
  return cells[col];
};
