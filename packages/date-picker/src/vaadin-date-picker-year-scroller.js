/**
 * @license
 * Copyright (c) 2015 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { Virtualizer } from '@vaadin/component-base/src/virtualizer.js';

const ORIGIN_INDEX = 5000;

/**
 * Element for internal use only.
 *
 * @extends HTMLElement
 * @private
 */
export class DatePickerYearScroller extends PolymerElement {
  static get is() {
    return 'vaadin-date-picker-year-scroller';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          overflow: hidden;
          height: 500px;
        }

        #scroller {
          height: 100%;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
          overflow-x: hidden;
          margin-right: -20px;
        }

        #container {
          box-sizing: border-box;
          padding-right: 20px;
          width: 100%;
        }
      </style>
      <div id="scroller">
        <div id="container">
          <slot></slot>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      selectedDate: {
        type: Object, // TODO: update virtualizer when selected date changes
      },

      active: {
        type: Boolean,
        observer: '_activated',
      },

      /** @private */
      _originDate: {
        type: Object,
        value: new Date(),
      },
    };
  }

  /**
   * @return {number}
   */
  get itemHeight() {
    if (this._itemHeightVal === undefined) {
      const itemHeight = getComputedStyle(this).getPropertyValue('--vaadin-infinite-scroller-item-height');
      // Use background-position temp inline style for unit conversion
      const tmpStyleProp = 'background-position';
      this.$.container.style.setProperty(tmpStyleProp, itemHeight);
      const itemHeightPx = getComputedStyle(this.$.container).getPropertyValue(tmpStyleProp);
      this.$.container.style.removeProperty(tmpStyleProp);
      this._itemHeightVal = parseFloat(itemHeightPx);
    }

    return this._itemHeightVal;
  }

  get position() {
    return (this.$.scroller.scrollTop - this._originalScroll) / this.itemHeight;
  }

  /**
   * Current scroller position as index. Can be a fractional number.
   *
   * @type {number}
   */
  set position(position) {
    this._preventScrollEvent = true;
    this.$.scroller.scrollTop = this._originalScroll + position * this.itemHeight;
  }

  /** @private */
  _activated(active) {
    if (active && !this.__virtualizer) {
      this.__virtualizer = new Virtualizer({
        createElements: this.__createElements.bind(this),
        updateElement: this.__updateElement.bind(this),
        elementsContainer: this,
        scrollTarget: this.$.scroller,
        scrollContainer: this.$.container,
      });

      this.__virtualizer.size = ORIGIN_INDEX * 2;

      // Scroll the origin year into view
      const visibleItemsCount = this.__virtualizer.lastVisibleIndex - this.__virtualizer.firstVisibleIndex + 1;
      this.__virtualizer.scrollToIndex(ORIGIN_INDEX - visibleItemsCount / 2 + 1);

      const scrollerRect = this.$.scroller.getBoundingClientRect();

      // Adjust scroll position to center the year
      const item = [...this.children].find((el) => el.index === ORIGIN_INDEX);
      const itemRect = item.getBoundingClientRect();

      const adjustScrollTop = scrollerRect.top + scrollerRect.height / 2 - itemRect.top;
      this.$.scroller.scrollTop -= adjustScrollTop;

      this._originalScroll = this.$.scroller.scrollTop;

      // Flush to scroll to initial position correctly
      this.__virtualizer.flush();

      this.$.scroller.addEventListener('scroll', this.__onScroll.bind(this));
    }
  }

  /** @private */
  __onScroll() {
    if (!this._preventScrollEvent) {
      this.dispatchEvent(new CustomEvent('custom-scroll', { bubbles: false, composed: true }));
    }
    this._preventScrollEvent = false;
  }

  /** @private */
  __createElements(count) {
    return [...Array(count)].map(() => {
      const item = document.createElement('div');
      item.style.height = `${this.itemHeight}px`;
      item.style.width = 'calc(100% - 20px)';

      const year = document.createElement('div');
      year.setAttribute('part', 'year-number');
      item.appendChild(year);

      const separator = document.createElement('div');
      separator.setAttribute('part', 'year-separator');
      separator.setAttribute('aria-hidden', 'true');
      item.appendChild(separator);

      return item;
    });
  }

  /** @private */
  __updateElement(el, index) {
    const year = this.__yearAfterXYears(index);
    // Index can be fractional
    el.index = Math.floor(index);
    const item = el.firstChild;
    item.toggleAttribute('current', this._originDate.getFullYear() === year);
    // TODO: [selected] is currently not used for styling years, should we remove it?
    item.toggleAttribute('selected', this.selectedDate ? this.selectedDate.getFullYear() === year : false);
    item.textContent = year;
  }

  /** @private */
  __yearAfterXYears(index) {
    const result = new Date(this._originDate);
    result.setFullYear(this._originDate.getFullYear() + index - ORIGIN_INDEX);
    return result.getFullYear();
  }
}

customElements.define(DatePickerYearScroller.is, DatePickerYearScroller);
