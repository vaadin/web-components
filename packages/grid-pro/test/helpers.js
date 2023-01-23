import { isIOS } from '@vaadin/testing-helpers';
export { flushGrid } from '@vaadin/grid/test/helpers.js';

export const infiniteDataProvider = (params, callback) => {
  callback(
    Array.from({ length: params.pageSize }, (_, index) => {
      const count = params.page * params.pageSize + index;
      return {
        name: `foo${count}`,
        age: count,
      };
    }),
  );
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
    if (grid.localName === 'vaadin-grid-pro') {
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

export const getContainerCell = (container, row, col) => {
  const rows = getRows(container);
  const cells = getRowCells(rows[row]);
  return cells[col];
};

export const getCellEditor = (cell) => {
  return cell._column._getEditorComponent(cell);
};

export const flatMap = (array, mapper) => [].concat(...array.map(mapper));

export const dblclick = (target) => {
  if (isIOS) {
    target.dispatchEvent(new CustomEvent('click', { bubbles: true, composed: true }));
    target.dispatchEvent(new CustomEvent('click', { bubbles: true, composed: true }));
  } else {
    target.dispatchEvent(new CustomEvent('dblclick', { bubbles: true, composed: true }));
  }
};

export const onceOpened = (element) => {
  return new Promise((resolve) => {
    const listener = (e) => {
      if (e.detail.value) {
        element.removeEventListener('opened-changed', listener);
        resolve();
      }
    };
    element.addEventListener('opened-changed', listener);
  });
};

export const createItems = () => {
  return [
    { name: 'foo', age: 20, married: true, title: 'mrs' },
    { name: 'bar', age: 30, married: false, title: 'ms' },
    { name: 'baz', age: 40, married: false, title: 'mr' },
  ];
};

/**
 * Emulates clicking outside the dropdown overlay
 */
export function outsideClick() {
  // Move focus to body
  document.body.tabIndex = 0;
  document.body.focus();
  document.body.tabIndex = -1;
  // Outside click
  document.body.click();
}
