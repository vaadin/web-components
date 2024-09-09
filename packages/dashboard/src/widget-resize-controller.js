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

    this.host.toggleAttribute('resizing', true);
    this.resizedItem = this.__getElementItem(e.target);

    this.__resizeStartWidth = e.target.offsetWidth;
    this.__resizeStartHeight = e.target.offsetHeight;
    this.__resizeWidth = this.__resizeStartWidth + e.detail.dx;
    this.__resizeHeight = this.__resizeStartHeight + e.detail.dy;
    this.__updateWidgetStyles();

    this.host.dispatchEvent(new CustomEvent('dashboard-item-resize-start'));

    this.__resizedElement = e.target;
    this.__resizedElementRemoveObserver.observe(this.host, { childList: true, subtree: true });
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
      this.__updateResizedItem(Math.min((this.resizedItem.colspan || 1) + 1, columns.length), this.resizedItem.rowspan);
    } else if (this.__resizeWidth < currentElementWidth - columnWidth / 2) {
      this.__updateResizedItem(Math.max((this.resizedItem.colspan || 1) - 1, 1), this.resizedItem.rowspan);
    }

    const currentElementHeight = itemWrapper.firstElementChild.offsetHeight;
    const rowMinHeight = Math.min(...gridStyle.gridTemplateRows.split(' ').map((height) => parseFloat(height)));
    if (this.__resizeHeight > currentElementHeight + gapSize + rowMinHeight / 2) {
      this.__updateResizedItem(this.resizedItem.colspan, (this.resizedItem.rowspan || 1) + 1);
    } else if (this.__resizeHeight < currentElementHeight - rowMinHeight / 2) {
      this.__updateResizedItem(this.resizedItem.colspan, Math.max((this.resizedItem.rowspan || 1) - 1, 1));
    }
  }

  /** @private */
  __onResizeEnd() {
    if (!this.resizedItem) {
      return;
    }

    const itemWrapper = this.__getItemWrapper(this.resizedItem);
    itemWrapper.style.removeProperty('--_vaadin-dashboard-widget-resizer-width');
    itemWrapper.style.removeProperty('--_vaadin-dashboard-widget-resizer-height');

    this.resizedItem = null;
    this.host.toggleAttribute('resizing', false);

    this.__resizedElementRemoveObserver.disconnect();

    this.host.dispatchEvent(new CustomEvent('dashboard-item-resize-end'));
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
  __updateResizedItem(colspan, rowspan) {
    if (this.resizedItem.colspan !== colspan || this.resizedItem.rowspan !== rowspan) {
      this.resizedItem.colspan = colspan;
      this.resizedItem.rowspan = rowspan;
      this.host.dispatchEvent(new CustomEvent('dashboard-item-resize', { detail: { item: this.resizedItem } }));
      this.host.items = [...this.host.items];
      requestAnimationFrame(() => this.__updateWidgetStyles());
    }
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
}
