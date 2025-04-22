/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { InfiniteScroller } from './vaadin-infinite-scroller.js';

const stylesTemplate = document.createElement('template');
stylesTemplate.innerHTML = `
  <style>
    :host {
      --vaadin-infinite-scroller-buffer-offset: 50%;
      --vaadin-infinite-scroller-item-height: 80px;
      background: var(--vaadin-date-picker-year-scroller-background, var(--_vaadin-background-container));
      grid-area: years;
      height: auto;
      position: relative;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      -webkit-user-select: none;
      width: var(--vaadin-date-picker-year-scroller-width, 3rem);
    }

    :host::before {
      background: var(--vaadin-overlay-background, var(--_vaadin-background));
      content: '';
      display: block;
      height: 1em;
      position: absolute;
      transform: translate(-50%) rotate(45deg);
      top: 50%;
      width: 1em;
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
