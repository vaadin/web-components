/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { dateAfterXMonths } from './vaadin-date-picker-helper.js';
import { InfiniteScroller } from './vaadin-infinite-scroller.js';

const stylesTemplate = document.createElement('template');
stylesTemplate.innerHTML = `
  <style>
    :host {
      --vaadin-infinite-scroller-item-height: 270px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100%;
    }
  </style>
`;

/**
 * An element used internally by `<vaadin-date-picker>`. Not intended to be used separately.
 *
 * @customElement
 * @extends InfiniteScroller
 * @private
 */
class DatePickerMonthScroller extends InfiniteScroller {
  static get is() {
    return 'vaadin-date-picker-month-scroller';
  }

  constructor() {
    super();

    this.bufferSize = 3;
    this.shadowRoot.appendChild(stylesTemplate.content.cloneNode(true));
  }

  /**
   * @protected
   * @override
   */
  _createElement() {
    return document.createElement('vaadin-month-calendar');
  }

  /**
   * @param {HTMLElement} element
   * @param {number} index
   * @protected
   * @override
   */
  _updateElement(element, index) {
    element.month = dateAfterXMonths(index);
  }
}

defineCustomElement(DatePickerMonthScroller);
