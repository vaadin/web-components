/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { addListener } from '@vaadin/component-base/src/gestures.js';
import { getElementItem, itemsEqual, WRAPPER_LOCAL_NAME } from './vaadin-dashboard-helpers.js';

/**
 * A controller to widget resizing inside a dashboard.
 */
export class WidgetResizeController {
  constructor(host) {
    this.host = host;
    this.__resizedElementRemoveObserver = new MutationObserver(() => this.__restoreResizedElement());
    this.__touchMoveCancelListener = (e) => e.preventDefault();
    addListener(host, 'track', (e) => this.__onTrack(e));
    host.addEventListener('item-resize', (e) => this.__itemResize(e));
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

    this.host.$.grid.toggleAttribute('item-resizing', true);
    this.resizedItem = getElementItem(e.target);

    this.__resizeStartWidth = e.target.offsetWidth;
    this.__resizeStartHeight = e.target.offsetHeight;
    this.__resizeWidth = this.__resizeStartWidth + e.detail.dx;
    this.__resizeHeight = this.__resizeStartHeight + e.detail.dy;
    this.__updateWidgetStyles();

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

    this.__resizeWidth = this.__resizeStartWidth + (document.dir === 'rtl' ? -e.detail.dx : e.detail.dx);
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
      this.__updateResizedItem(1, 0);
    } else if (this.__resizeWidth < currentElementWidth - columnWidth / 2) {
      // Resized horizontally below the half of the current column, decrease colspan
      this.__updateResizedItem(-1, 0);
    }

    const currentElementHeight = itemWrapper.firstElementChild.offsetHeight;
    const rowMinHeight = Math.min(...gridStyle.gridTemplateRows.split(' ').map((height) => parseFloat(height)));
    if (e.detail.ddy > 0 && this.__resizeHeight > currentElementHeight + gapSize + rowMinHeight / 2) {
      // Resized vertically above the half of the next row, increase rowspan
      this.__updateResizedItem(0, 1);
    } else if (e.detail.ddy < 0 && this.__resizeHeight < currentElementHeight - rowMinHeight / 2) {
      // Resized vertically below the half of the current row, decrease rowspan
      this.__updateResizedItem(0, -1);
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
    if (itemWrapper.firstElementChild) {
      itemWrapper.firstElementChild.toggleAttribute('resizing', false);
    }

    this.host.$.grid.toggleAttribute('item-resizing', false);

    // Disconnect the observer for the resized element removal
    this.__resizedElementRemoveObserver.disconnect();
    // Cleanup the touchmove listener
    document.removeEventListener('touchmove', this.__touchMoveCancelListener);

    // Dispatch the resize end event
    this.__fireItemResizedEvent(this.resizedItem);
    this.resizedItem = null;
  }

  /** @private */
  __fireItemResizedEvent(item) {
    this.host.dispatchEvent(
      new CustomEvent('dashboard-item-resized', {
        detail: { item, items: this.host.items },
      }),
    );
  }

  /** @private */
  __getItemWrapper(item) {
    return [...this.host.querySelectorAll(WRAPPER_LOCAL_NAME)].find((el) => itemsEqual(el.__item, item));
  }

  /** @private */
  __updateResizedItem(colspanDelta, rowspanDelta) {
    this.__resizeItem(this.resizedItem, colspanDelta, rowspanDelta);
    requestAnimationFrame(() => this.__updateWidgetStyles());
  }

  /** @private */
  __resizeItem(item, colspanDelta, rowspanDelta) {
    if (item.items) {
      // Do not resize sections
      return;
    }

    const gridStyle = getComputedStyle(this.host.$.grid);
    if (rowspanDelta && gridStyle.getPropertyValue('--_vaadin-dashboard-row-min-height') === 'auto') {
      // Do not resize vertically if the min row height is not set
      return;
    }

    const columns = gridStyle.gridTemplateColumns.split(' ');
    const currentColspan = item.colspan || 1;
    const currentRowspan = item.rowspan || 1;

    const newColspan = Math.min(Math.max(currentColspan + colspanDelta, 1), columns.length);
    const newRowspan = Math.max(currentRowspan + rowspanDelta, 1);

    if ((item.colspan || 1) === newColspan && (item.rowspan || 1) === newRowspan) {
      // No change in size
      return;
    }

    item.colspan = newColspan;
    item.rowspan = newRowspan;
    this.host.items = [...this.host.items];
  }

  /** @private */
  __updateWidgetStyles() {
    const itemWrapper = this.__getItemWrapper(this.resizedItem);
    itemWrapper.style.setProperty('--_vaadin-dashboard-widget-resizer-width', `${this.__resizeWidth}px`);
    itemWrapper.style.setProperty('--_vaadin-dashboard-widget-resizer-height', `${this.__resizeHeight}px`);
    if (itemWrapper.firstElementChild) {
      itemWrapper.firstElementChild.toggleAttribute('resizing', true);
    }
  }

  /** @private */
  __restoreResizedElement() {
    if (!this.host.contains(this.__resizedElement)) {
      this.__resizedElement.style.display = 'none';
      this.host.appendChild(this.__resizedElement);
    }
  }

  /**
   * Handle the item-resize event dispatched by a widget / section.
   * @private
   */
  __itemResize(e) {
    e.stopImmediatePropagation();
    const item = getElementItem(e.target);
    this.__resizeItem(item, e.detail.colspanDelta, e.detail.rowspanDelta);
    this.__fireItemResizedEvent(item);
  }

  hostDisconnected() {
    document.removeEventListener('touchmove', this.__touchMoveCancelListener);
  }
}
