import sinon from 'sinon';

export const flushGrid = (grid) => {
  grid.performUpdate?.();
  grid._observer.flush();

  [
    grid.__clearCacheDebouncer,
    grid.__updateColumnTreeDebouncer,
    grid._debounceScrolling,
    grid._debouncerHiddenChanged,
    grid._debouncerApplyCachedData,
    grid.__debounceUpdateFrozenColumn,
  ].forEach((debouncer) => debouncer?.flush());

  [...grid.$.header.children, ...grid.$.footer.children].forEach((row) => {
    if (row.__debounceUpdateHeaderFooterRowVisibility) {
      row.__debounceUpdateHeaderFooterRowVisibility.flush();
    }
  });

  grid.__virtualizer.flush();
  grid.__preventScrollerRotatingCellFocusDebouncer?.flush();
  grid.performUpdate?.();
};

export function attributeRenderer(attributeName) {
  return (root, column, model) => {
    const attributeValue = column.getAttribute(attributeName) || attributeName;
    if (model) {
      root.textContent = `${attributeValue} ${model.item.value}`;
    } else {
      root.textContent = attributeValue;
    }
  };
}

export const getCell = (grid, index) => {
  return grid.$.items.querySelectorAll('[part~="cell"]')[index];
};

export const getFirstCell = (grid) => {
  return getCell(grid, 0);
};

export const infiniteDataProvider = (params, callback) => {
  callback(
    Array.from({ length: params.pageSize }, (_, index) => {
      return {
        value: `foo${params.page * params.pageSize + index}`,
      };
    }),
  );
};

export const buildItem = (index) => {
  return {
    index,
  };
};

export const wheel = (target, deltaX, deltaY, ctrlKey) => {
  const e = new CustomEvent('wheel', { bubbles: true, cancelable: true });
  e.deltaX = deltaX;
  e.deltaY = deltaY;
  e.ctrlKey = ctrlKey;
  target.dispatchEvent(e);
  return e;
};

export const buildDataSet = (size) => {
  const data = [];
  while (data.length < size) {
    data.push(buildItem(data.length));
  }
  return data;
};

export const scrollToEnd = (grid, callback) => {
  grid.scrollToIndex(grid.size - 1);
  flushGrid(grid);
  if (callback) {
    callback();
  }
};

const isVisible = (item, grid) => {
  const scrollTarget = grid.shadowRoot.querySelector('table');
  const scrollTargetRect = scrollTarget.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  const offset = parseInt(getComputedStyle(item.firstElementChild).borderTopWidth);
  const headerHeight = grid.shadowRoot.querySelector('thead').offsetHeight;
  const footerHeight = grid.shadowRoot.querySelector('tfoot').offsetHeight;
  return (
    itemRect.bottom > scrollTargetRect.top + headerHeight + offset &&
    itemRect.top < scrollTargetRect.bottom - footerHeight - offset
  );
};

export const getPhysicalItems = (grid) => {
  return Array.from(grid.shadowRoot.querySelector('tbody#items').children)
    .filter((item) => !item.hidden)
    .sort((a, b) => a.index - b.index);
};

export const getPhysicalAverage = (grid) => {
  const physicalItems = getPhysicalItems(grid);
  return physicalItems.map((el) => el.offsetHeight).reduce((sum, value) => sum + value, 0) / physicalItems.length;
};

export const scrollGrid = (grid, left, top) => {
  grid.shadowRoot.querySelector('table').scroll(left, top);
};

export const getVisibleItems = (grid) => {
  flushGrid(grid);
  return getPhysicalItems(grid).filter((item) => isVisible(item, grid));
};

export const getFirstVisibleItem = (grid) => {
  return getVisibleItems(grid)[0] || null;
};

export const getLastVisibleItem = (grid) => {
  return getVisibleItems(grid).pop() || null;
};

export const isWithinParentConstraints = (el, parent) => {
  const elRect = el.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  return (
    elRect.top >= parentRect.top &&
    elRect.right <= parentRect.right &&
    elRect.bottom <= parentRect.bottom &&
    elRect.left >= parentRect.left
  );
};

export const getRows = (container) => {
  return container.querySelectorAll('tr');
};

export const getRowCells = (row) => {
  return Array.from(row.querySelectorAll('[part~="cell"]'));
};

export const getRowBodyCells = (row) => {
  return Array.from(row.querySelectorAll('[part~="cell"]:not([part~="details-cell"]'));
};

export const getCellContent = (cell) => {
  return cell ? cell.querySelector('slot').assignedNodes()[0] : null;
};

export const getContainerCell = (container, row, col) => {
  const rows = getRows(container);
  const cells = getRowCells(rows[row]);
  return cells[col];
};

export const getContainerCellContent = (container, row, col) => {
  return getCellContent(getContainerCell(container, row, col));
};

export const getHeaderCell = (grid, row, col) => {
  const container = grid.$.header;
  return getContainerCell(container, row, col);
};

export const getHeaderCellContent = (grid, row, col) => {
  return getCellContent(getHeaderCell(grid, row, col));
};

export const getBodyCell = (grid, row, col) => {
  const physicalItems = getPhysicalItems(grid);
  const physicalRow = physicalItems.find((item) => item.index === row);
  const cells = getRowCells(physicalRow);
  return cells[col];
};

export const getBodyCellContent = (grid, row, col) => {
  return getCellContent(getBodyCell(grid, row, col));
};

export const fire = (type, detail, options) => {
  options ||= {};
  detail = detail === null || detail === undefined ? {} : detail;
  const event = new Event(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed,
  });
  event.detail = detail;
  const node = options.node || window;
  node.dispatchEvent(event);
  return event;
};

export const dragStart = (source) => {
  let grid = source.parentElement;
  while (grid) {
    if (grid.localName === 'vaadin-grid') {
      grid._touchDevice = false;
    }
    grid = grid.parentNode || grid.host;
  }
  const sourceRect = source.getBoundingClientRect();
  fire(
    'track',
    {
      x: Math.round(sourceRect.left + sourceRect.width / 2),
      y: Math.round(sourceRect.top + sourceRect.height / 2),
      state: 'start',
    },
    {
      node: source,
      bubbles: true,
    },
  );
};

export const dragOver = (source, target, clientX) => {
  dragStart(source);
  const targetRect = target.getBoundingClientRect();
  fire(
    'track',
    {
      x: Math.round(clientX || targetRect.left + targetRect.width / 2),
      y: Math.round(targetRect.top + targetRect.height / 2),
      state: 'track',
    },
    {
      node: source,
      bubbles: true,
    },
  );
};

export const dragAndDropOver = (source, target) => {
  dragOver(source, target);
  fire(
    'track',
    {
      x: 0,
      y: 0,
      state: 'end',
    },
    {
      node: source,
      bubbles: true,
    },
  );
};

export const makeSoloTouchEvent = (type, xy, node) => {
  const touches = [
    {
      identifier: 0,
      target: node,
      clientX: xy.x,
      clientY: xy.y,
    },
  ];
  const touchEventInit = {
    touches,
    targetTouches: touches,
    changedTouches: touches,
  };
  const event = new CustomEvent(type, { bubbles: true, cancelable: true });
  Object.entries(touchEventInit).forEach(([key, value]) => {
    event[key] = value;
  });
  node.dispatchEvent(event);
  return event;
};

/**
 * Resolves once the function is invoked on the given object.
 */
export function onceInvoked(object, functionName) {
  return new Promise((resolve) => {
    const stub = sinon.stub(object, functionName).callsFake((...args) => {
      stub.restore();
      object[functionName](...args);
      resolve();
    });
  });
}

export const shiftClick = (node) => {
  node.dispatchEvent(new MouseEvent('click', { shiftKey: true }));
};

export function getFocusedCellIndex(grid) {
  const focusedCell = grid.shadowRoot.activeElement;
  if (focusedCell instanceof HTMLTableCellElement) {
    return [...focusedCell.parentNode.children].indexOf(focusedCell);
  }
  return -1;
}

export function getFocusedRowIndex(grid) {
  const activeElement = grid.shadowRoot.activeElement;
  const focusedRow = activeElement instanceof HTMLTableRowElement ? activeElement : activeElement.parentNode;
  const section = focusedRow.parentNode;
  return section === grid.$.items ? focusedRow.index : [...section.children].indexOf(focusedRow);
}
