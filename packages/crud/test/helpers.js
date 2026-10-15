export { flushGrid } from '@vaadin/grid/test/helpers.js';

function isRowVisible(row) {
  const grid = row.getRootNode().host;
  const scrollTargetRect = grid.$.table.getBoundingClientRect();
  const itemRect = row.getBoundingClientRect();
  const headerHeight = grid.$.header.getBoundingClientRect().height;
  const footerHeight = grid.$.footer.getBoundingClientRect().height;
  return itemRect.bottom > scrollTargetRect.top + headerHeight && itemRect.top < scrollTargetRect.bottom - footerHeight;
}

export const getRows = (container) => {
  return [...container.querySelectorAll('tr')];
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

export function getVisibleRows(container) {
  return getRows(container).filter((row) => isRowVisible(row));
}

/**
 * Get the inline editor panel used with bottom / aside editor positions.
 * @param crud
 * @returns {Element}
 */
export function getInlineEditor(crud) {
  return crud.shadowRoot.querySelector('#editor');
}

/**
 * Get the editor dialog used with the default editor position or in fullscreen mode.
 * @param crud
 * @returns {Element}
 */
export function getDialogEditor(crud) {
  return crud.shadowRoot.querySelector('#dialog');
}
