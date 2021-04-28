import { flush } from '@polymer/polymer/lib/utils/flush.js';

export const flushGrid = (grid) => {
  grid._observer.flush();
  if (grid._debounceScrolling) {
    grid._debounceScrolling.flush();
  }
  if (grid._debouncerForceReflow) {
    grid._debouncerForceReflow.flush();
  }
  flush();
  if (grid._debounceOverflow) {
    grid._debounceOverflow.flush();
  }
  while (grid._debounceIncreasePool) {
    grid._debounceIncreasePool.flush();
    grid._debounceIncreasePool = null;
    flush();
  }
  if (grid._debouncerHiddenChanged) {
    grid._debouncerHiddenChanged.flush();
  }
  if (grid._debouncerApplyCachedData) {
    grid._debouncerApplyCachedData.flush();
  }
  if (grid._debouncerIgnoreNewWheel) {
    grid._debouncerIgnoreNewWheel.flush();
  }
  grid._scrollHandler();
};

export const getCell = (grid, index) => {
  return grid.$.items.querySelectorAll('[part~="cell"]')[index];
};

export const getFirstCell = (grid) => {
  return getCell(grid, 0);
};

export const infiniteDataProvider = (params, callback) => {
  callback(
    Array.apply(null, Array(params.pageSize)).map((item, index) => {
      return {
        value: 'foo' + (params.page * params.pageSize + index)
      };
    })
  );
};

export const listenOnce = (element, eventName, callback) => {
  const listener = (e) => {
    element.removeEventListener(eventName, listener);
    callback(e);
  };
  element.addEventListener(eventName, listener);
};

export const buildItem = (index) => {
  return {
    index: index
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
  grid._scrollToIndex(grid.size - 1);

  // Ensure rows are in order
  grid._debounceScrolling.flush();

  grid.$.table.scrollTop = grid.$.table.scrollHeight;
  grid._scrollHandler();
  flushGrid(grid);
  if (callback) {
    callback();
  }
};

// http://stackoverflow.com/a/15203639/1331425
export const isVisible = (el) => {
  let top = el.offsetTop;
  let left = el.offsetLeft;
  const width = el.offsetWidth;
  const height = el.offsetHeight;

  while (el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top < window.pageYOffset + window.innerHeight &&
    left < window.pageXOffset + window.innerWidth &&
    top + height > window.pageYOffset &&
    left + width > window.pageXOffset
  );
};

export const getVisibleItems = (grid) => {
  flushGrid(grid);
  const rows = grid.$.items.children;
  const visibleRows = [];
  for (let i = 0; i < rows.length; i++) {
    if (isVisible(rows[i])) {
      visibleRows.push(rows[i]);
    }
  }
  return visibleRows;
};

export const getFirstVisibleItem = (grid) => {
  const visibleRows = getVisibleItems(grid);
  if (visibleRows.length) {
    return visibleRows[0];
  }
  return null;
};

export const getLastVisibleItem = (grid) => {
  const visibleRows = getVisibleItems(grid);
  if (visibleRows.length) {
    return visibleRows.pop();
  }
  return null;
};

export const isWithinParentConstraints = (el, parent) => {
  return ['top', 'bottom', 'left', 'right'].every(
    (constraint) => el.getBoundingClientRect[constraint] === parent.getBoundingClientRect[constraint]
  );
};

export const getRows = (container) => {
  return container.querySelectorAll('tr');
};

export const getRowCells = (row) => {
  return Array.prototype.slice.call(row.querySelectorAll('[part~="cell"]'));
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
      state: 'start'
    },
    {
      node: source,
      bubbles: true
    }
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
      state: 'track'
    },
    {
      node: source,
      bubbles: true
    }
  );
};

export const dragAndDropOver = (source, target) => {
  dragOver(source, target);
  fire(
    'track',
    {
      x: 0,
      y: 0,
      state: 'end'
    },
    {
      node: source,
      bubbles: true
    }
  );
};

export const makeSoloTouchEvent = (type, xy, node) => {
  const touches = [
    {
      identifier: 0,
      target: node,
      clientX: xy.x,
      clientY: xy.y
    }
  ];
  const touchEventInit = {
    touches: touches,
    targetTouches: touches,
    changedTouches: touches
  };
  const event = new CustomEvent(type, { bubbles: true, cancelable: true });
  for (let property in touchEventInit) {
    event[property] = touchEventInit[property];
  }
  node.dispatchEvent(event);
  return event;
};

export function click(element) {
  const event = new CustomEvent('click', {
    bubbles: true,
    cancelable: true,
    composed: true
  });
  element.dispatchEvent(event);
  return event;
}

export const flushColumns = (grid) => {
  Array.prototype.forEach.call(grid.querySelectorAll('vaadin-grid-column, vaadin-grid-column-group'), (col) =>
    col._templateObserver.flush()
  );
};

export const fire = (type, detail, options) => {
  options = options || {};
  detail = detail === null || detail === undefined ? {} : detail;
  const event = new Event(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed
  });
  event.detail = detail;
  const node = options.node || window;
  node.dispatchEvent(event);
  return event;
};

export const isIOS =
  (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
