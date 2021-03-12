import { keyDownOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { flush } from '@polymer/polymer/lib/utils/flush.js';

export const infiniteDataProvider = (params, callback) => {
  callback(
    Array.apply(null, Array(params.pageSize)).map((item, index) => {
      const count = params.page * params.pageSize + index;
      return {
        name: 'foo' + count,
        age: count
      };
    })
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

export const getContainerCell = (container, row, col) => {
  const rows = getRows(container);
  const cells = getRowCells(rows[row]);
  return cells[col];
};

export const getCellEditor = (cell) => {
  return cell._column._getEditorComponent(cell);
};

export const getNativeInput = (editor) => {
  return editor.shadowRoot.querySelector('input');
};

export const flatMap = (array, mapper) => [].concat(...array.map(mapper));

export const arrowUp = (target) => {
  keyDownOn(target, 38, [], 'ArrowUp');
};

export const arrowDown = (target) => {
  keyDownOn(target, 40, [], 'ArrowDown');
};

export const keyDownChar = (target, letter, modifier) => {
  keyDownOn(target, letter.charCodeAt(0), modifier, letter);
};

export const space = (target) => {
  keyDownOn(target, 32, [], ' ');
};

export const tab = (target) => {
  keyDownOn(target, 9, [], 'Tab');
};

export const shiftTab = (target) => {
  keyDownOn(target, 9, 'shift', 'Tab');
};

export const enter = (target) => {
  keyDownOn(target, 13, [], 'Enter');
};

export const shiftEnter = (target) => {
  keyDownOn(target, 13, 'shift', 'Enter');
};

export const esc = (target) => {
  keyDownOn(target, 27, [], 'Escape');
};

export const isIOS =
  (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

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

export const nextRender = (target) => {
  return new Promise((resolve) => {
    afterNextRender(target, () => {
      resolve();
    });
  });
};

export const createItems = () => {
  return [
    { name: 'foo', age: 20, married: true, title: 'mrs' },
    { name: 'bar', age: 30, married: false, title: 'ms' },
    { name: 'baz', age: 40, married: false, title: 'mr' }
  ];
};
