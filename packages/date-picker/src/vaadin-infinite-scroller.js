/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import { timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

const template = document.createElement('template');
template.innerHTML = `
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

  <div id="scroller" tabindex="-1">
    <div class="buffer"></div>
    <div class="buffer"></div>
    <div id="fullHeight"></div>
  </div>
`;

/**
 * @extends HTMLElement
 * @private
 */
export class InfiniteScroller extends HTMLElement {
  constructor() {
    super();

    const root = this.attachShadow({ mode: 'open' });
    root.appendChild(template.content.cloneNode(true));

    /**
     * Count of individual items in each buffer.
     * The scroller has 2 buffers altogether so bufferSize of 20
     * will result in 40 buffered DOM items in total.
     * Changing after initialization not supported.
     * @type {number}
     */
    this.bufferSize = 20;

    /**
     * The amount of initial scroll top. Needed in order for the
     * user to be able to scroll backwards.
     * @type {number}
     * @private
     */
    this._initialScroll = 500000;

    /**
     * The index/position mapped at _initialScroll point.
     * @type {number}
     * @private
     */
    this._initialIndex = 0;

    /**
     * @type {boolean}
     * @private
     */
    this._activated = false;
  }

  /**
   * @return {boolean}
   */
  get active() {
    return this._activated;
  }

  set active(active) {
    if (active && !this._activated) {
      this._createPool();
      this._activated = true;
    }
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

  /** @protected */
  connectedCallback() {
    if (!this._ready) {
      this._ready = true;

      this.$ = {};
      this.shadowRoot.querySelectorAll('[id]').forEach((node) => {
        this.$[node.id] = node;
      });

      this.$.scroller.addEventListener('scroll', () => this._scroll());

      /** @private */
      this._buffers = [...this.shadowRoot.querySelectorAll('.buffer')];

      this.$.fullHeight.style.height = `${this._initialScroll * 2}px`;
    }
  }

  /** @protected */
  disconnectedCallback() {
    if (this._debouncerScrollFinish) {
      this._debouncerScrollFinish.cancel();
    }

    if (this._debouncerUpdateClones) {
      this._debouncerUpdateClones.cancel();
    }

    if (this.__pendingFinishInit) {
      cancelAnimationFrame(this.__pendingFinishInit);
    }
  }

  /**
   * Force the scroller to update clones after a reset, without
   * waiting for the debouncer to resolve.
   */
  forceUpdate() {
    if (this._debouncerScrollFinish) {
      this._debouncerScrollFinish.flush();
    }

    if (this._debouncerUpdateClones) {
      this._buffers[0].updated = this._buffers[1].updated = false;
      this._updateClones();
      this._debouncerUpdateClones.cancel();
    }

    flush();
  }

  /**
   * @protected
   * @override
   */
  _createElement() {
    // To be implemented.
  }

  /**
   * @param {HTMLElement} _element
   * @param {number} _index
   * @protected
   * @override
   */
  _updateElement(_element, _index) {
    // To be implemented.
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
      this.dispatchEvent(new CustomEvent('init-done'));
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

        const slotName = `vaadin-infinite-scroller-item-content-${generateUniqueId()}`;

        const slot = document.createElement('slot');
        slot.setAttribute('name', slotName);
        slot._itemWrapper = itemWrapper;
        buffer.appendChild(slot);

        itemWrapper.setAttribute('slot', slotName);
        this.appendChild(itemWrapper);

        // Only stamp the visible instances first
        if (this._isVisible(itemWrapper, container)) {
          this._ensureStampedInstance(itemWrapper);
        }
      }
    });

    this.__pendingFinishInit = requestAnimationFrame(() => {
      this._finishInit();
      this.__pendingFinishInit = null;
    });
  }

  /** @private */
  _ensureStampedInstance(itemWrapper) {
    if (itemWrapper.firstElementChild) {
      return;
    }

    const tmpInstance = itemWrapper.instance;

    itemWrapper.instance = this._createElement();
    itemWrapper.appendChild(itemWrapper.instance);

    Object.keys(tmpInstance).forEach((prop) => {
      itemWrapper.instance[prop] = tmpInstance[prop];
    });
  }

  /** @private */
  _updateClones(viewPortOnly) {
    this._firstIndex =
      Math.round((this._buffers[0].translateY - this._initialScroll) / this.itemHeight) + this._initialIndex;

    const scrollerRect = viewPortOnly ? this.$.scroller.getBoundingClientRect() : undefined;
    this._buffers.forEach((buffer, bufferIndex) => {
      if (!buffer.updated) {
        const firstIndex = this._firstIndex + this.bufferSize * bufferIndex;

        [...buffer.children].forEach((slot, index) => {
          const itemWrapper = slot._itemWrapper;
          if (!viewPortOnly || this._isVisible(itemWrapper, scrollerRect)) {
            this._updateElement(itemWrapper.instance, firstIndex + index);
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
