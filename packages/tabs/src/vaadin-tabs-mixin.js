/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ListMixin } from '@vaadin/a11y-base/src/list-mixin.js';
import { getNormalizedScrollLeft } from '@vaadin/component-base/src/dir-utils.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';

export const TabsMixin = (superClass) =>
  class TabsMixinClass extends ResizeMixin(ListMixin(superClass)) {
    static get properties() {
      return {
        /**
         * Set tabs disposition. Possible values are `horizontal|vertical`
         */
        orientation: {
          value: 'horizontal',
          type: String,
          reflectToAttribute: true,
          sync: true,
        },

        /**
         * The index of the selected tab.
         */
        selected: {
          value: 0,
          type: Number,
          reflectToAttribute: true,
        },
      };
    }

    static get observers() {
      return ['__tabsItemsChanged(items)'];
    }

    constructor() {
      super();

      this.__itemsResizeObserver = new ResizeObserver(() => {
        setTimeout(() => this._updateOverflow());
      });
    }

    /**
     * @return {number}
     * @protected
     */
    get _scrollOffset() {
      return this._vertical ? this._scrollerElement.offsetHeight : this._scrollerElement.offsetWidth;
    }

    /**
     * @return {!HTMLElement}
     * @protected
     * @override
     */
    get _scrollerElement() {
      return this.$.scroll;
    }

    /** @private */
    get __direction() {
      return !this._vertical && this.__isRTL ? 1 : -1;
    }

    /** @protected */
    ready() {
      super.ready();

      this._updateOverflow();
      this._scrollerElement.addEventListener('scroll', () => this._updateOverflow());

      this.setAttribute('role', 'tablist');
    }

    /**
     * @protected
     * @override
     */
    _onResize() {
      this._updateOverflow();
    }

    /** @private */
    __tabsItemsChanged(items) {
      // Disconnected to unobserve any removed items
      this.__itemsResizeObserver.disconnect();

      // Observe current items
      (items || []).forEach((item) => {
        this.__itemsResizeObserver.observe(item);
      });

      this._updateOverflow();
    }

    _scrollToItem(idx) {
      const item = this.items[idx];
      const itemRect = item.getBoundingClientRect();
      const scrollerRect = this._scrollerElement.getBoundingClientRect();

      // This hard-coded number accounts for the width of the mask that covers a part of the visible items.
      // A CSS variable can be introduced to get rid of this value.
      const overflowIndicatorCompensation = this._vertical ? 10 : 20;

      if (this._vertical) {
        if (itemRect.bottom > scrollerRect.bottom - overflowIndicatorCompensation) {
          this._scrollerElement.scrollTop =
            item.offsetTop - (scrollerRect.height - itemRect.height) + overflowIndicatorCompensation;
        }
        if (itemRect.top < scrollerRect.top + overflowIndicatorCompensation) {
          this._scrollerElement.scrollTop = item.offsetTop - overflowIndicatorCompensation;
        }
      } else {
        const backButtonWidth = this.shadowRoot.querySelector(`[part="back-button"]`).offsetWidth;
        const forwardButtonWidth = this.shadowRoot.querySelector(`[part="forward-button"]`).offsetWidth;

        if (itemRect.right > scrollerRect.right - forwardButtonWidth - overflowIndicatorCompensation) {
          this._scrollerElement.scrollLeft =
            item.offsetLeft -
            (scrollerRect.width - itemRect.width) +
            forwardButtonWidth +
            overflowIndicatorCompensation;
        }
        if (itemRect.left < scrollerRect.left + backButtonWidth + overflowIndicatorCompensation) {
          this._scrollerElement.scrollLeft = item.offsetLeft - backButtonWidth - overflowIndicatorCompensation;
        }
      }
    }

    /** @protected */
    _scrollForward(e) {
      // Allow setInterval loop to trigger scroll (e is undefine in that case)
      // Allow programmatic click events to trigger scroll (__scrollTimer is undefine in that case)
      if (e === undefined || this.__scrollTimer === undefined) {
        this._scroll(this.__direction * (this._scrollOffset / 2) * -1);
      }
    }

    /** @protected */
    _scrollBack(e) {
      // Allow setInterval loop to trigger scroll (e is undefine in that case)
      // Allow programmatic click events to trigger scroll (__scrollTimer is undefine in that case)
      if (e === undefined || this.__scrollTimer === undefined) {
        this._scroll(this.__direction * (this._scrollOffset / 2));
      }
    }

    _startScrollForward(e) {
      if (e.button === 0) {
        this._scrollForward();
        this.__scrollTimer = setInterval(this._scrollForward.bind(this), 300);
      }
    }

    _startScrollBack(e) {
      if (e.button === 0) {
        this._scrollBack();
        this.__scrollTimer = setInterval(this._scrollBack.bind(this), 300);
      }
    }

    _stopScroll() {
      clearTimeout(this.__scrollTimer);
    }

    /** @private */
    _updateOverflow() {
      const scrollPosition = this._vertical
        ? this._scrollerElement.scrollTop
        : getNormalizedScrollLeft(this._scrollerElement, this.getAttribute('dir'));
      const scrollSize = this._vertical ? this._scrollerElement.scrollHeight : this._scrollerElement.scrollWidth;

      // Note that we are not comparing floored scrollPosition to be greater than zero here, which would make a natural
      // sense, but to be greater than one intentionally. There is a known bug in Chromium browsers on Linux/Mac
      // (https://bugs.chromium.org/p/chromium/issues/detail?id=1123301), which returns invalid value of scrollLeft when
      // text direction is RTL. The value is off by one pixel in that case. Comparing scrollPosition to be greater than
      // one on the following line is a workaround for that bug. Comparing scrollPosition to be greater than one means,
      // that the left overflow and left arrow will be displayed "one pixel" later than normal. In other words, if the tab
      // scroller element is scrolled just by 1px, the overflow is not yet showing.
      let overflow = Math.floor(scrollPosition) > 1 ? 'start' : '';
      if (Math.ceil(scrollPosition) < Math.ceil(scrollSize - this._scrollOffset)) {
        overflow += ' end';
      }

      if (this.__direction === 1) {
        overflow = overflow.replace(/start|end/giu, (matched) => {
          return matched === 'start' ? 'end' : 'start';
        });
      }

      if (overflow) {
        this.setAttribute('overflow', overflow.trim());
      } else {
        this.removeAttribute('overflow');
      }
    }
  };
