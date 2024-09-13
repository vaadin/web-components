/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const WRAPPER_LOCAL_NAME = 'vaadin-dashboard-widget-wrapper';
import { addListener } from '@vaadin/component-base/src/gestures.js';

/**
 * A controller to widget resizing inside a dashboard.
 */
export class WidgetResizeController extends EventTarget {
  constructor(host) {
    super();
    this.host = host;
    this.__resizedElementRemoveObserver = new MutationObserver(() => this.__restoreResizedElement());
    this.__touchMoveCancelListener = (e) => e.preventDefault();
    addListener(host, 'track', (e) => this.__onTrack(e));
  }

  /** @private */
  __onTrack(e) {
    if (e.detail.state === 'start') {
      this.__onResizeStart(e);
    } else if (e.detail.state === 'track') {
      this.__onResize(e);
    } else if (e.detail.state === 'end') {
      this.__onResizeEnd(e);
    }
  }

  /** @private */
  __onResizeStart(e) {
    const handle = [...e.composedPath()].find((el) => el.classList && el.classList.contains('resize-handle'));
    if (!handle) {
      return;
    }

    this.host.$.grid.toggleAttribute('resizing', true);
    this.resizedItem = this.__getElementItem(e.target);

    this.__resizeStartWidth = e.target.offsetWidth;
    this.__resizeStartHeight = e.target.offsetHeight;
    this.__resizeWidth = this.__resizeStartWidth + e.detail.dx;
    this.__resizeHeight = this.__resizeStartHeight + e.detail.dy;
    this.__updateWidgetStyles();

    this.host.dispatchEvent(new CustomEvent('dashboard-item-resize-start', { detail: { item: this.resizedItem } }));

    this.__resizedElement = e.target;
    // Observe the removal of the resized element from the DOM
    this.__resizedElementRemoveObserver.observe(this.host, { childList: true, subtree: true });

    // Prevent scrolling on touch devices while resizing
    document.addEventListener('touchmove', this.__touchMoveCancelListener, { passive: false });
  }

  /** @private */
  __onResize(e) {
    if (!this.resizedItem) {
      return;
    }

    this.__resizeWidth = this.__resizeStartWidth + e.detail.dx;
    this.__resizeHeight = this.__resizeStartHeight + e.detail.dy;
    this.__updateWidgetStyles();

    const itemWrapper = this.__getItemWrapper(this.resizedItem);
    if (!itemWrapper.firstElementChild) {
      return;
    }

    const gridStyle = getComputedStyle(this.host.$.grid);
    const gapSize = parseFloat(gridStyle.gap || 0);

    const currentElementWidth = itemWrapper.firstElementChild.offsetWidth;
    const columns = gridStyle.gridTemplateColumns.split(' ');
    const columnWidth = parseFloat(columns[0]);
    if (this.__resizeWidth > currentElementWidth + gapSize + columnWidth / 2) {
      // Resized horizontally above the half of the next column, increase colspan
      this.__updateResizedItem(Math.min((this.resizedItem.colspan || 1) + 1, columns.length), this.resizedItem.rowspan);
    } else if (this.__resizeWidth < currentElementWidth - columnWidth / 2) {
      // Resized horizontally below the half of the current column, decrease colspan
      this.__updateResizedItem(Math.max((this.resizedItem.colspan || 1) - 1, 1), this.resizedItem.rowspan);
    }

    if (!gridStyle.getPropertyValue('--vaadin-dashboard-row-min-height')) {
      return;
    }

    const currentElementHeight = itemWrapper.firstElementChild.offsetHeight;
    const rowMinHeight = Math.min(...gridStyle.gridTemplateRows.split(' ').map((height) => parseFloat(height)));
    if (this.__resizeHeight > currentElementHeight + gapSize + rowMinHeight / 2) {
      // Resized vertically above the half of the next row, increase rowspan
      this.__updateResizedItem(this.resizedItem.colspan, (this.resizedItem.rowspan || 1) + 1);
    } else if (this.__resizeHeight < currentElementHeight - rowMinHeight / 2) {
      // Resized vertically below the half of the current row, decrease rowspan
      this.__updateResizedItem(this.resizedItem.colspan, Math.max((this.resizedItem.rowspan || 1) - 1, 1));
    }
  }

  /** @private */
  __onResizeEnd() {
    if (!this.resizedItem) {
      return;
    }

    // If the originally resized element is restored to the DOM (as a direct child of the host),
    // to make sure "track" event gets dispatched, remove it to avoid duplicates
    if (this.__resizedElement.parentElement === this.host) {
      this.__resizedElement.remove();
    }

    const itemWrapper = this.__getItemWrapper(this.resizedItem);
    itemWrapper.style.removeProperty('--_vaadin-dashboard-widget-resizer-width');
    itemWrapper.style.removeProperty('--_vaadin-dashboard-widget-resizer-height');

    this.host.$.grid.toggleAttribute('resizing', false);

    // Disconnect the observer for the resized element removal
    this.__resizedElementRemoveObserver.disconnect();
    // Cleanup the touchmove listener
    document.removeEventListener('touchmove', this.__touchMoveCancelListener);

    // Dispatch the resize end event
    this.host.dispatchEvent(
      new CustomEvent('dashboard-item-resize-end', {
        detail: { item: this.resizedItem },
        cancelable: true,
      }),
    );
    this.resizedItem = null;
  }

  /** @private */
  __getElementItem(element) {
    return element.closest(WRAPPER_LOCAL_NAME).__item;
  }

  /** @private */
  __getItemWrapper(item) {
    return [...this.host.querySelectorAll(WRAPPER_LOCAL_NAME)].find((el) => el.__item === item);
  }

  /** @private */
  __updateResizedItem(colspan = 1, rowspan = 1) {
    if ((this.resizedItem.colspan || 1) === colspan && (this.resizedItem.rowspan || 1) === rowspan) {
      return;
    }

    const resizeEvent = new CustomEvent('dashboard-item-drag-resize', {
      detail: { item: this.resizedItem, colspan, rowspan },
      cancelable: true,
    });

    // Dispatch the resize event and resize items if the event is not canceled
    if (!this.host.dispatchEvent(resizeEvent)) {
      return;
    }

    this.resizedItem.colspan = colspan;
    this.resizedItem.rowspan = rowspan;
    this.host.items = [...this.host.items];
    requestAnimationFrame(() => this.__updateWidgetStyles());
  }

  /** @private */
  __updateWidgetStyles() {
    const itemWrapper = this.__getItemWrapper(this.resizedItem);
    itemWrapper.style.setProperty('--_vaadin-dashboard-widget-resizer-width', `${this.__resizeWidth}px`);
    itemWrapper.style.setProperty('--_vaadin-dashboard-widget-resizer-height', `${this.__resizeHeight}px`);
  }

  /** @private */
  __restoreResizedElement() {
    if (!this.host.contains(this.__resizedElement)) {
      this.__resizedElement.style.display = 'none';
      this.host.appendChild(this.__resizedElement);
    }
  }

  hostDisconnected() {
    document.removeEventListener('touchmove', this.__touchMoveCancelListener);
  }
}
