/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isElementHidden } from '@vaadin/a11y-base/src/focus-utils';

/**
 * Check if the node is a line break element.
 *
 * @param {HTMLElement} el
 * @return {boolean}
 */
function isBreakLine(el) {
  return el.localName === 'br';
}

/**
 * A controller that implements the auto-responsive layout algorithm.
 */
export class AutoResponsiveController {
  constructor(host) {
    /** @type {HTMLElement} */
    this.host = host;

    /** @type {{ columnWidth?: string, maxColumns?: number, autoRows?: boolean, labelsAside?: boolean, expandColumns?: boolean }} */
    this.props = {};

    this.__resizeObserver = new ResizeObserver((entries) => setTimeout(() => this.__onResize(entries)));
    this.__mutationObserver = new MutationObserver((entries) => this.__onMutation(entries));
  }

  /**
   * Connects the controller to the host element.
   */
  connect() {
    if (this.__isConnected) {
      return;
    }

    this.__isConnected = true;
    this.__resizeObserver.observe(this.host);
    this.__mutationObserver.observe(this.host, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['colspan', 'data-colspan', 'hidden'],
    });

    this.updateLayout();
  }

  /**
   * Disconnects the controller from the host element.
   */
  disconnect() {
    if (!this.__isConnected) {
      return;
    }

    this.__isConnected = false;
    this.__resizeObserver.disconnect();
    this.__mutationObserver.disconnect();

    const { host } = this;
    host.style.removeProperty('--_column-width');
    host.style.removeProperty('--_max-columns');
    host.$.layout.removeAttribute('fits-labels-aside');
    host.$.layout.style.removeProperty('--_grid-rendered-column-count');

    this.__children.forEach((child) => {
      child.style.removeProperty('--_grid-colstart');
      child.style.removeProperty('--_grid-colspan');
    });
  }

  /**
   * Sets the controller's properties and updates the layout.
   */
  setProps(props) {
    this.props = props;

    if (this.__isConnected) {
      this.updateLayout();
    }
  }

  /**
   * Updates the layout based on the current properties.
   */
  updateLayout() {
    const { host, props } = this;
    if (!this.__isConnected || isElementHidden(host)) {
      return;
    }

    let columnCount = 0;
    let maxColumns = 0;

    const children = this.__children;
    children
      .filter((child) => isBreakLine(child) || !isElementHidden(child))
      .forEach((child, index, children) => {
        const prevChild = children[index - 1];

        if (isBreakLine(child)) {
          columnCount = 0;
          return;
        }

        if (
          (prevChild && prevChild.parentElement !== child.parentElement) ||
          (!props.autoRows && child.parentElement === host)
        ) {
          columnCount = 0;
        }

        if (props.autoRows && columnCount === 0) {
          child.style.setProperty('--_grid-colstart', 1);
        } else {
          child.style.removeProperty('--_grid-colstart');
        }

        const colspan = child.getAttribute('colspan') || child.getAttribute('data-colspan');
        if (colspan) {
          columnCount += parseInt(colspan);
          child.style.setProperty('--_grid-colspan', colspan);
        } else {
          columnCount += 1;
          child.style.removeProperty('--_grid-colspan');
        }

        maxColumns = Math.max(maxColumns, columnCount);
      });

    children.filter(isElementHidden).forEach((child) => {
      child.style.removeProperty('--_grid-colstart');
    });

    host.style.setProperty('--_column-width', props.columnWidth);
    host.style.setProperty('--_max-columns', Math.min(props.maxColumns, maxColumns));

    host.$.layout.toggleAttribute('fits-labels-aside', this.props.labelsAside && this.__fitsLabelsAside);
    host.$.layout.style.setProperty('--_grid-rendered-column-count', this.__renderedColumnCount);
  }

  /** @private */
  __onResize() {
    this.updateLayout();
  }

  /** @private */
  __onMutation(entries) {
    const shouldUpdateLayout = entries.some(({ target }) => {
      return (
        target === this.host ||
        target.parentElement === this.host ||
        target.parentElement.localName === 'vaadin-form-row'
      );
    });
    if (shouldUpdateLayout) {
      this.updateLayout();
    }
  }

  /** @private */
  get __children() {
    return [...this.host.children].flatMap((child) => {
      return child.localName === 'vaadin-form-row' ? [...child.children] : child;
    });
  }

  /** @private */
  get __renderedColumnCount() {
    // Calculate the number of rendered columns, excluding CSS grid auto columns (0px)
    const { gridTemplateColumns } = getComputedStyle(this.host.$.layout);
    return gridTemplateColumns.split(' ').filter((width) => width !== '0px').length;
  }

  /** @private */
  get __columnWidthWithLabelsAside() {
    const { backgroundPositionY } = getComputedStyle(this.host.$.layout, '::before');
    return parseFloat(backgroundPositionY);
  }

  /** @private */
  get __fitsLabelsAside() {
    return this.host.offsetWidth >= this.__columnWidthWithLabelsAside;
  }
}
