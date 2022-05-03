import sinon from 'sinon';

export const flushGrid = (grid) => {
  grid._observer.flush();
  if (grid._debounceScrolling) {
    grid._debounceScrolling.flush();
  }
  grid._afterScroll();
  if (grid._debounceOverflow) {
    grid._debounceOverflow.flush();
  }
  if (grid._debouncerHiddenChanged) {
    grid._debouncerHiddenChanged.flush();
  }
  if (grid._debouncerApplyCachedData) {
    grid._debouncerApplyCachedData.flush();
  }

  grid.__virtualizer.flush();
};

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
    index: index,
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
  return Array.from(grid.shadowRoot.querySelector('tbody').children)
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
  return Array.prototype.slice.call(row.querySelectorAll('[part~="cell"]'));
};

export const hasCellForColumn = (container, column) => {
  const cells = container.querySelectorAll('[part~="cell"]');
  return Array.from(cells).some((cell) => cell._column === column);
};

export const getCellContent = (cell) => {
  return cell ? cell.querySelector('slot').assignedNodes()[0] : null;
};

export const getHeaderCellContent = (grid, row, col) => {
  const container = grid.$.header;
  return getContainerCellContent(container, row, col);
};

export const getBodyCellContent = (grid, row, col) => {
  const container = grid.$.items;
  return getContainerCellContent(container, row, col);
};

export const getContainerCellContent = (container, row, col) => {
  return getCellContent(getContainerCell(container, row, col));
};

export const getContainerCell = (container, row, col) => {
  const rows = getRows(container);
  const cells = getRowCells(rows[row]);
  return cells[col];
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
    touches: touches,
    targetTouches: touches,
    changedTouches: touches,
  };
  const event = new CustomEvent(type, { bubbles: true, cancelable: true });
  for (const property in touchEventInit) {
    event[property] = touchEventInit[property];
  }
  node.dispatchEvent(event);
  return event;
};

export const fire = (type, detail, options) => {
  options = options || {};
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

export const nextResize = (target) => {
  return new Promise((resolve) => {
    new ResizeObserver(() => setTimeout(resolve)).observe(target);
  });
};

/**
 * Resolves once the function is invoked on the given object.
 */
function onceInvoked(object, functionName) {
  return new Promise((resolve) => {
    const stub = sinon.stub(object, functionName).callsFake((...args) => {
      stub.restore();
      object[functionName](...args);
      resolve();
    });
  });
}

/**
 * Resolves once the ResizeObserver in grid has processed a resize.
 */
export async function onceResized(grid) {
  await onceInvoked(grid, '_onResize');
}
