/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { ListMixin } from '@vaadin/a11y-base/src/list-mixin.js';
import { getNormalizedScrollLeft } from '@vaadin/component-base/src/dir-utils.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';

/**
 * @polymerMixin
 * @mixes ListMixin
 * @mixes ResizeMixin
 */
export const TabsMixin = (superClass) =>
  class TabsMixinClass extends ResizeMixin(ListMixin(superClass)) {
    static get properties() {
      return {
        /**
         * Set tabs disposition. Possible values are `horizontal|vertical`
         * @type {!TabsOrientation}
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

      this._scrollerElement.addEventListener('scroll', () => this._updateOverflow());

      this.setAttribute('role', 'tablist');

      // Wait for the vaadin-tab elements to upgrade and get styled
      afterNextRender(this, () => {
        this._updateOverflow();
      });
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

    /** @protected */
    _scrollForward() {
      // Calculations here are performed in order to optimize the loop that checks item visibility.
      const forwardButtonVisibleWidth = this._getNavigationButtonVisibleWidth('forward-button');
      const backButtonVisibleWidth = this._getNavigationButtonVisibleWidth('back-button');
      const scrollerRect = this._scrollerElement.getBoundingClientRect();
      const itemToScrollTo = [...this.items]
        .reverse()
        .find((item) => this._isItemVisible(item, forwardButtonVisibleWidth, backButtonVisibleWidth, scrollerRect));
      const itemRect = itemToScrollTo.getBoundingClientRect();
      // This hard-coded number accounts for the width of the mask that covers a part of the visible items.
      // A CSS variable can be introduced to get rid of this value.
      const overflowIndicatorCompensation = 20;
      const totalCompensation =
        overflowIndicatorCompensation + this.shadowRoot.querySelector('[part="back-button"]').clientWidth;
      let scrollOffset;
      if (this.__isRTL) {
        const scrollerRightEdge = scrollerRect.right - totalCompensation;
        scrollOffset = itemRect.right - scrollerRightEdge;
      } else {
        const scrollerLeftEdge = scrollerRect.left + totalCompensation;
        scrollOffset = itemRect.left - scrollerLeftEdge;
      }
      // It is possible that a scroll offset is calculated to be between 0 and 1. In this case, this offset
      // can be rounded down to zero, rendering the button useless. It is also possible that the offset is
      // calculated such that it results in scrolling backwards for a wide tab or edge cases. This is a
      // workaround for such cases.
      if (-this.__direction * scrollOffset < 1) {
        scrollOffset = -this.__direction * (this._scrollOffset - totalCompensation);
      }
      this._scroll(scrollOffset);
    }

    /** @protected */
    _scrollBack() {
      // Calculations here are performed in order to optimize the loop that checks item visibility.
      const forwardButtonVisibleWidth = this._getNavigationButtonVisibleWidth('forward-button');
      const backButtonVisibleWidth = this._getNavigationButtonVisibleWidth('back-button');
      const scrollerRect = this._scrollerElement.getBoundingClientRect();
      const itemToScrollTo = this.items.find((item) =>
        this._isItemVisible(item, forwardButtonVisibleWidth, backButtonVisibleWidth, scrollerRect),
      );
      const itemRect = itemToScrollTo.getBoundingClientRect();
      // This hard-coded number accounts for the width of the mask that covers a part of the visible items.
      // A CSS variable can be introduced to get rid of this value.
      const overflowIndicatorCompensation = 20;
      const totalCompensation =
        overflowIndicatorCompensation + this.shadowRoot.querySelector('[part="forward-button"]').clientWidth;
      let scrollOffset;
      if (this.__isRTL) {
        const scrollerLeftEdge = scrollerRect.left + totalCompensation;
        scrollOffset = itemRect.left - scrollerLeftEdge;
      } else {
        const scrollerRightEdge = scrollerRect.right - totalCompensation;
        scrollOffset = itemRect.right - scrollerRightEdge;
      }
      // It is possible that a scroll offset is calculated to be between 0 and 1. In this case, this offset
      // can be rounded down to zero, rendering the button useless. It is also possible that the offset is
      // calculated such that it results in scrolling forward for a wide tab or edge cases. This is a
      // workaround for such cases.
      if (this.__direction * scrollOffset < 1) {
        scrollOffset = this.__direction * (this._scrollOffset - totalCompensation);
      }
      this._scroll(scrollOffset);
    }

    /** @private */
    _isItemVisible(item, forwardButtonVisibleWidth, backButtonVisibleWidth, scrollerRect) {
      if (this._vertical) {
        throw new Error('Visibility check is only supported for horizontal tabs.');
      }
      const buttonOnTheRightWidth = this.__isRTL ? backButtonVisibleWidth : forwardButtonVisibleWidth;
      const buttonOnTheLeftWidth = this.__isRTL ? forwardButtonVisibleWidth : backButtonVisibleWidth;
      const scrollerRightEdge = scrollerRect.right - buttonOnTheRightWidth;
      const scrollerLeftEdge = scrollerRect.left + buttonOnTheLeftWidth;
      const itemRect = item.getBoundingClientRect();
      return scrollerRightEdge > Math.floor(itemRect.left) && scrollerLeftEdge < Math.ceil(itemRect.right);
    }

    /** @private */
    _getNavigationButtonVisibleWidth(buttonPartName) {
      const navigationButton = this.shadowRoot.querySelector(`[part="${buttonPartName}"]`);
      if (window.getComputedStyle(navigationButton).opacity === '0') {
        return 0;
      }
      return navigationButton.clientWidth;
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
