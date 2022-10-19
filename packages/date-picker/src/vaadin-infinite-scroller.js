/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { templatize } from '@polymer/polymer/lib/utils/templatize.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { timeOut } from '@vaadin/component-base/src/async.js';
import { isFirefox } from '@vaadin/component-base/src/browser-utils.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';

/**
 * @extends HTMLElement
 * @private
 */
class InfiniteScroller extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          overflow: hidden;
          height: 500px;
        }

        #scroller {
          position: relative;
          height: 100%;
          overflow: auto;
          outline: none;
          margin-right: -40px;
          -webkit-overflow-scrolling: touch;
          overflow-x: hidden;
        }

        #scroller.notouchscroll {
          -webkit-overflow-scrolling: auto;
        }

        #scroller::-webkit-scrollbar {
          display: none;
        }

        .buffer {
          position: absolute;
          width: var(--vaadin-infinite-scroller-buffer-width, 100%);
          box-sizing: border-box;
          padding-right: 40px;
          top: var(--vaadin-infinite-scroller-buffer-offset, 0);
          animation: fadein 0.2s;
        }

        @keyframes fadein {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      </style>

      <div id="scroller" on-scroll="_scroll">
        <div class="buffer"></div>
        <div class="buffer"></div>
        <div id="fullHeight"></div>
      </div>
    `;
  }

  static get is() {
    return 'vaadin-infinite-scroller';
  }

  static get properties() {
    return {
      /**
       * Count of individual items in each buffer.
       * The scroller has 2 buffers altogether so bufferSize of 20
       * will result in 40 buffered DOM items in total.
       * Changing after initialization not supported.
       */
      bufferSize: {
        type: Number,
        value: 20,
      },

      /**
       * The amount of initial scroll top. Needed in order for the
       * user to be able to scroll backwards.
       * @private
       */
      _initialScroll: {
        value: 500000,
      },

      /**
       * The index/position mapped at _initialScroll point.
       * @private
       */
      _initialIndex: {
        value: 0,
      },

      /** @private */
      _buffers: Array,

      /** @private */
      _preventScrollEvent: Boolean,

      /** @private */
      _mayHaveMomentum: Boolean,

      /** @private */
      _initialized: Boolean,

      active: {
        type: Boolean,
        observer: '_activated',
      },
    };
  }

  /** @protected */
  ready() {
    super.ready();

    this._buffers = [...this.shadowRoot.querySelectorAll('.buffer')];

    this.$.fullHeight.style.height = `${this._initialScroll * 2}px`;

    const tpl = this.querySelector('template');
    this._TemplateClass = templatize(tpl, this, {
      forwardHostProp(prop, value) {
        if (prop !== 'index') {
          this._buffers.forEach((buffer) => {
            [...buffer.children].forEach((slot) => {
              slot._itemWrapper.instance[prop] = value;
            });
          });
        }
      },
    });

    // Firefox interprets elements with overflow:auto as focusable
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1069739
    if (isFirefox) {
      this.$.scroller.tabIndex = -1;
    }
  }

  /**
   * Force the scroller to update clones after a reset, without
   * waiting for the debouncer to resolve.
   */
  forceUpdate() {
    if (this._debouncerUpdateClones) {
      this._buffers[0].updated = this._buffers[1].updated = false;
      this._updateClones();
      this._debouncerUpdateClones.cancel();
    }
  }

  /** @private */
  _activated(active) {
    if (active && !this._initialized) {
      this._createPool();
      this._initialized = true;
    }
  }

  /** @private */
  _finishInit() {
    if (!this._initDone) {
      // Once the first set of items start fading in, stamp the rest
      this._buffers.forEach((buffer) => {
        [...buffer.children].forEach((slot) => {
          this._ensureStampedInstance(slot._itemWrapper);
        });
      });

      if (!this._buffers[0].translateY) {
        this._reset();
      }

      this._initDone = true;
    }
  }

  /** @private */
  _translateBuffer(up) {
    const index = up ? 1 : 0;
    this._buffers[index].translateY = this._buffers[index ? 0 : 1].translateY + this._bufferHeight * (index ? -1 : 1);
    this._buffers[index].style.transform = `translate3d(0, ${this._buffers[index].translateY}px, 0)`;
    this._buffers[index].updated = false;
    this._buffers.reverse();
  }

  /** @private */
  _scroll() {
    if (this._scrollDisabled) {
      return;
    }

    const scrollTop = this.$.scroller.scrollTop;
    if (scrollTop < this._bufferHeight || scrollTop > this._initialScroll * 2 - this._bufferHeight) {
      // Scrolled near the end/beginning of the scrollable area -> reset.
      this._initialIndex = ~~this.position;
      this._reset();
    }

    // Check if we scrolled enough to translate the buffer positions.
    const offset = this.itemHeight + this.bufferOffset;
    const upperThresholdReached = scrollTop > this._buffers[1].translateY + offset;
    const lowerThresholdReached = scrollTop < this._buffers[0].translateY + offset;

    if (upperThresholdReached || lowerThresholdReached) {
      this._translateBuffer(lowerThresholdReached);
      this._updateClones();
    }

    if (!this._preventScrollEvent) {
      this.dispatchEvent(new CustomEvent('custom-scroll', { bubbles: false, composed: true }));
      this._mayHaveMomentum = true;
    }
    this._preventScrollEvent = false;

    this._debouncerScrollFinish = Debouncer.debounce(this._debouncerScrollFinish, timeOut.after(200), () => {
      const scrollerRect = this.$.scroller.getBoundingClientRect();
      if (!this._isVisible(this._buffers[0], scrollerRect) && !this._isVisible(this._buffers[1], scrollerRect)) {
        this.position = this.position; // eslint-disable-line no-self-assign
      }
    });
  }

  /**
   * @return {number}
   */
  get bufferOffset() {
    return this._buffers[0].offsetTop;
  }

  /**
   * @return {number}
   */
  get position() {
    return (this.$.scroller.scrollTop - this._buffers[0].translateY) / this.itemHeight + this._firstIndex;
  }

  /**
   * Current scroller position as index. Can be a fractional number.
   *
   * @type {number}
   */
  set position(index) {
    this._preventScrollEvent = true;
    if (index > this._firstIndex && index < this._firstIndex + this.bufferSize * 2) {
      this.$.scroller.scrollTop = this.itemHeight * (index - this._firstIndex) + this._buffers[0].translateY;
    } else {
      this._initialIndex = ~~index;
      this._reset();
      this._scrollDisabled = true;
      this.$.scroller.scrollTop += (index % 1) * this.itemHeight;
      this._scrollDisabled = false;
    }

    if (this._mayHaveMomentum) {
      // Stop the possible iOS Safari momentum with -webkit-overflow-scrolling: auto;
      this.$.scroller.classList.add('notouchscroll');
      this._mayHaveMomentum = false;

      setTimeout(() => {
        // Restore -webkit-overflow-scrolling: touch; after a small delay.
        this.$.scroller.classList.remove('notouchscroll');
      }, 10);
    }
  }

  /**
   * @return {number}
   */
  get itemHeight() {
    if (!this._itemHeightVal) {
      const itemHeight = getComputedStyle(this).getPropertyValue('--vaadin-infinite-scroller-item-height');
      // Use background-position temp inline style for unit conversion
      const tmpStyleProp = 'background-position';
      this.$.fullHeight.style.setProperty(tmpStyleProp, itemHeight);
      const itemHeightPx = getComputedStyle(this.$.fullHeight).getPropertyValue(tmpStyleProp);
      this.$.fullHeight.style.removeProperty(tmpStyleProp);
      this._itemHeightVal = parseFloat(itemHeightPx);
    }

    return this._itemHeightVal;
  }

  /** @private */
  get _bufferHeight() {
    return this.itemHeight * this.bufferSize;
  }

  /** @private */
  _reset() {
    this._scrollDisabled = true;
    this.$.scroller.scrollTop = this._initialScroll;
    this._buffers[0].translateY = this._initialScroll - this._bufferHeight;
    this._buffers[1].translateY = this._initialScroll;
    this._buffers.forEach((buffer) => {
      buffer.style.transform = `translate3d(0, ${buffer.translateY}px, 0)`;
    });
    this._buffers[0].updated = this._buffers[1].updated = false;
    this._updateClones(true);

    this._debouncerUpdateClones = Debouncer.debounce(this._debouncerUpdateClones, timeOut.after(200), () => {
      this._buffers[0].updated = this._buffers[1].updated = false;
      this._updateClones();
    });

    this._scrollDisabled = false;
  }

  /** @private */
  _createPool() {
    const container = this.getBoundingClientRect();
    this._buffers.forEach((buffer) => {
      for (let i = 0; i < this.bufferSize; i++) {
        const itemWrapper = document.createElement('div');
        itemWrapper.style.height = `${this.itemHeight}px`;
        itemWrapper.instance = {};

        const contentId = (InfiniteScroller._contentIndex = InfiniteScroller._contentIndex + 1 || 0);
        const slotName = `vaadin-infinite-scroller-item-content-${contentId}`;

        const slot = document.createElement('slot');
        slot.setAttribute('name', slotName);
        slot._itemWrapper = itemWrapper;
        buffer.appendChild(slot);

        itemWrapper.setAttribute('slot', slotName);
        this.appendChild(itemWrapper);

        setTimeout(() => {
          // Only stamp the visible instances first
          if (this._isVisible(itemWrapper, container)) {
            this._ensureStampedInstance(itemWrapper);
          }
        }, 1); // Wait for first reset
      }
    });

    setTimeout(() => {
      afterNextRender(this, this._finishInit.bind(this));
    }, 1);
  }

  /** @private */
  _ensureStampedInstance(itemWrapper) {
    if (itemWrapper.firstElementChild) {
      return;
    }

    const tmpInstance = itemWrapper.instance;

    itemWrapper.instance = new this._TemplateClass({});
    itemWrapper.appendChild(itemWrapper.instance.root);

    Object.keys(tmpInstance).forEach((prop) => {
      itemWrapper.instance.set(prop, tmpInstance[prop]);
    });
  }

  /** @private */
  _updateClones(viewPortOnly) {
    this._firstIndex = ~~((this._buffers[0].translateY - this._initialScroll) / this.itemHeight) + this._initialIndex;

    const scrollerRect = viewPortOnly ? this.$.scroller.getBoundingClientRect() : undefined;
    this._buffers.forEach((buffer, bufferIndex) => {
      if (!buffer.updated) {
        const firstIndex = this._firstIndex + this.bufferSize * bufferIndex;

        [...buffer.children].forEach((slot, index) => {
          const itemWrapper = slot._itemWrapper;
          if (!viewPortOnly || this._isVisible(itemWrapper, scrollerRect)) {
            itemWrapper.instance.index = firstIndex + index;
          }
        });
        buffer.updated = true;
      }
    });
  }

  /** @private */
  _isVisible(element, container) {
    const rect = element.getBoundingClientRect();
    return rect.bottom > container.top && rect.top < container.bottom;
  }
}

customElements.define(InfiniteScroller.is, InfiniteScroller);
