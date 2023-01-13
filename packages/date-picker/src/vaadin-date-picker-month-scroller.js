/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dateAfterXMonths } from './vaadin-date-picker-helper.js';
import { InfiniteScroller } from './vaadin-infinite-scroller.js';

const stylesTemplate = html`
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

let memoizedTemplate;

/**
 * An element used internally by `<vaadin-date-picker>`. Not intended to be used separately.
 *
 * @extends InfiniteScroller
 * @private
 */
class DatePickerMonthScroller extends InfiniteScroller {
  static get is() {
    return 'vaadin-date-picker-month-scroller';
  }

  static get template() {
    if (!memoizedTemplate) {
      memoizedTemplate = super.template.cloneNode(true);
      memoizedTemplate.content.appendChild(stylesTemplate.content.cloneNode(true));
    }

    return memoizedTemplate;
  }

  static get properties() {
    return {
      bufferSize: {
        type: Number,
        value: 3,
      },
    };
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

customElements.define(DatePickerMonthScroller.is, DatePickerMonthScroller);
