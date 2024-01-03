/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { InfiniteScroller } from './vaadin-infinite-scroller.js';

const stylesTemplate = document.createElement('template');
stylesTemplate.innerHTML = `
  <style>
    :host {
      --vaadin-infinite-scroller-item-height: 80px;
      width: 50px;
      display: block;
      height: 100%;
      position: absolute;
      right: 0;
      transform: translateX(100%);
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      /* Center the year scroller position. */
      --vaadin-infinite-scroller-buffer-offset: 50%;
    }

    :host::before {
      content: '';
      display: block;
      background: transparent;
      width: 0;
      height: 0;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      border-width: 6px;
      border-style: solid;
      border-color: transparent;
      border-left-color: #000;
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
class DatePickerYearScroller extends InfiniteScroller {
  static get is() {
    return 'vaadin-date-picker-year-scroller';
  }

  constructor() {
    super();

    this.bufferSize = 12;
    this.shadowRoot.appendChild(stylesTemplate.content.cloneNode(true));
  }

  /**
   * @protected
   * @override
   */
  _createElement() {
    return document.createElement('vaadin-date-picker-year');
  }

  /**
   * @param {HTMLElement} element
   * @param {number} index
   * @protected
   * @override
   */
  _updateElement(element, index) {
    element.year = this._yearAfterXYears(index);
  }

  /** @private */
  _yearAfterXYears(index) {
    const today = new Date();
    const result = new Date(today);
    result.setFullYear(parseInt(index) + today.getFullYear());
    return result.getFullYear();
  }
}

defineCustomElement(DatePickerYearScroller);
