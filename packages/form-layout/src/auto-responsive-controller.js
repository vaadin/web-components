/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

import { isElementHidden } from '@vaadin/a11y-base/src/focus-utils';

/**
 * Check if the node is a line break element.
 * @param {HTMLElement} el
 * @return {boolean}
 */
function isBreakLine(el) {
  return el.localName === 'br';
}

export class AutoResponsiveController {
  constructor(host) {
    this.host = host;
    this.props = {};

    this.__resizeObserver = new ResizeObserver((entries) => setTimeout(() => this.__onResize(entries)));
    this.__mutationObserver = new MutationObserver((entries) => this.__onMutation(entries));
  }

  hostConnected() {
    const { host, props } = this;

    this.__isConnected = true;
    this.__resizeObserver.observe(host);
    this.__mutationObserver.observe(host, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['colspan', 'data-colspan', 'hidden'],
    });

    host.style.setProperty('--_column-width', props.columnWidth);

    this.updateLayout();
  }

  hostDisconnected() {
    const { host } = this;

    this.__isConnected = false;

    this.__resizeObserver.disconnect();
    this.__mutationObserver.disconnect();

    host.style.removeProperty('--_column-width');
    host.style.removeProperty('--_max-columns');
  }

  updateProps(props) {
    this.props = props;

    if (this.__isConnected) {
      this.host.style.setProperty('--_column-width', props.columnWidth);
      this.updateLayout();
    }
  }

  updateLayout() {
    const { host, props } = this;
    if (!this.__isConnected || isElementHidden(host)) {
      return;
    }

    const children = this.__children;
    const fitsLabelsAside = this.__fitsLabelsAside;
    const renderedColumnCount = this.__renderedColumnCount;

    let columnCount = 0;
    let maxColumns = 0;

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

    maxColumns = Math.min(maxColumns, props.maxColumns);

    host.style.setProperty('--_max-columns', maxColumns);
    host.$.layout.toggleAttribute('fits-labels-aside', fitsLabelsAside);
    host.$.layout.style.setProperty('--_grid-rendered-column-count', Math.min(renderedColumnCount, maxColumns));
  }

  __onResize() {
    this.updateLayout();
  }

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
    return this.props.labelsAside && this.host.offsetWidth >= this.__columnWidthWithLabelsAside;
  }
}
