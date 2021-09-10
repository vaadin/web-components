/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import './vaadin-combo-box-item.js';
import './vaadin-combo-box-overlay.js';
import './vaadin-combo-box-scroller.js';

const TOUCH_DEVICE = (() => {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
})();

/**
 * Element for internal use only.
 *
 * @extends HTMLElement
 * @private
 */
class ComboBoxDropdown extends mixinBehaviors(IronResizableBehavior, PolymerElement) {
  static get is() {
    return 'vaadin-combo-box-dropdown';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <vaadin-combo-box-overlay
        id="overlay"
        hidden$="[[_isOverlayHidden(_items.*, loading)]]"
        loading$="[[loading]]"
        opened="[[_overlayOpened]]"
        theme$="[[theme]]"
        position-target="[[positionTarget]]"
        no-vertical-overlap
      ></vaadin-combo-box-overlay>
    `;
  }

  static get properties() {
    return {
      /**
       * True if the device supports touch events.
       */
      touchDevice: {
        type: Boolean,
        value: TOUCH_DEVICE
      },

      opened: Boolean,

      /**
       * The element to position/align the dropdown by.
       */
      positionTarget: {
        type: Object
      },

      /**
       * Custom function for rendering the content of the `<vaadin-combo-box-item>` propagated from the combo box element.
       */
      renderer: Function,

      /**
       * `true` when new items are being loaded.
       */
      loading: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Used to propagate the `theme` attribute from the host element.
       */
      theme: String,

      _selectedItem: {
        type: Object
      },

      _items: {
        type: Array
      },

      _focusedIndex: {
        type: Number,
        value: -1
      },

      focusedItem: {
        type: String,
        computed: '_getFocusedItem(_focusedIndex)'
      },

      _itemLabelPath: {
        type: String,
        value: 'label'
      },

      _itemValuePath: {
        type: String,
        value: 'value'
      },

      _scroller: Object,

      _itemIdPath: String,

      _overlayOpened: {
        type: Boolean,
        observer: '_openedChanged'
      }
    };
  }

  static get observers() {
    return [
      '_openedOrItemsChanged(opened, _items, loading)',
      '__updateScroller(_scroller, _items, opened, loading, _selectedItem, _itemIdPath, _focusedIndex, renderer, theme)'
    ];
  }

  constructor() {
    super();
    this._boundOutsideClickListener = this._outsideClickListener.bind(this);
  }

  ready() {
    super.ready();

    const overlay = this.$.overlay;

    overlay.renderer = (root) => {
      if (!root.firstChild) {
        const scroller = document.createElement('vaadin-combo-box-scroller');
        root.appendChild(scroller);
      }
    };

    // Ensure the scroller is rendered
    overlay.requestContentUpdate();

    this._scroller = overlay.content.querySelector('vaadin-combo-box-scroller');

    this._scroller.getItemLabel = this.getItemLabel.bind(this);
    this._scroller.comboBox = this.getRootNode().host;

    this._scroller.addEventListener('selection-changed', (e) => this._forwardScrollerEvent(e));
    this._scroller.addEventListener('index-requested', (e) => this._forwardScrollerEvent(e));

    overlay.addEventListener('touchend', (e) => this._fireTouchAction(e));
    overlay.addEventListener('touchmove', (e) => this._fireTouchAction(e));

    // Prevent blurring the input when clicking inside the overlay.
    overlay.addEventListener('mousedown', (e) => e.preventDefault());

    // Preventing the default modal behaviour of the overlay on input clicking
    overlay.addEventListener('vaadin-overlay-outside-click', (e) => {
      e.preventDefault();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // Making sure the overlay is closed and removed from DOM after detaching the dropdown.
    this._overlayOpened = false;
  }

  notifyResize() {
    super.notifyResize();

    if (this.positionTarget && this.opened) {
      this._setOverlayWidth();
      // Schedule another position update (to cover virtual keyboard opening for example)
      // requestAnimationFrame(() => {
      //   this._setPosition();
      // });
    }
  }

  _fireTouchAction(sourceEvent) {
    this.dispatchEvent(
      new CustomEvent('vaadin-overlay-touch-action', {
        detail: { sourceEvent: sourceEvent }
      })
    );
  }

  _forwardScrollerEvent(event) {
    this.dispatchEvent(new CustomEvent(event.type, { detail: event.detail }));
  }

  _openedChanged(opened, oldValue) {
    if (!!opened === !!oldValue) {
      return;
    }

    if (opened) {
      document.addEventListener('click', this._boundOutsideClickListener, true);
      this.dispatchEvent(new CustomEvent('vaadin-combo-box-dropdown-opened', { bubbles: true, composed: true }));
    } else if (!this.__emptyItems) {
      document.removeEventListener('click', this._boundOutsideClickListener, true);
      this.dispatchEvent(new CustomEvent('vaadin-combo-box-dropdown-closed', { bubbles: true, composed: true }));
    }
  }

  _openedOrItemsChanged(opened, items, loading) {
    // See https://github.com/vaadin/vaadin-combo-box/pull/964
    const hasItems = items && items.length;
    if (!hasItems) {
      this.__emptyItems = true;
    }
    this._overlayOpened = !!(opened && (loading || hasItems));
    this.__emptyItems = false;
  }

  _getFocusedItem(focusedIndex) {
    if (focusedIndex >= 0) {
      return this._items[focusedIndex];
    }
  }

  /**
   * Gets the index of the item with the provided label.
   * @return {number}
   */
  indexOfLabel(label) {
    if (this._items && label) {
      for (let i = 0; i < this._items.length; i++) {
        if (this.getItemLabel(this._items[i]).toString().toLowerCase() === label.toString().toLowerCase()) {
          return i;
        }
      }
    }

    return -1;
  }

  /**
   * Gets the label string for the item based on the `_itemLabelPath`.
   * @return {string}
   */
  getItemLabel(item, itemLabelPath) {
    itemLabelPath = itemLabelPath || this._itemLabelPath;
    let label = item && itemLabelPath ? this.get(itemLabelPath, item) : undefined;
    if (label === undefined || label === null) {
      label = item ? item.toString() : '';
    }
    return label;
  }

  _scrollIntoView(index) {
    if (!this._scroller) {
      return;
    }
    this._scroller.scrollIntoView(index);
  }

  adjustScrollPosition() {
    if (this.opened && this._items) {
      this._scrollIntoView(this._focusedIndex);
    }
  }

  __updateScroller(scroller, items, opened, loading, selectedItem, itemIdPath, focusedIndex, renderer, theme) {
    if (scroller) {
      scroller.setProperties({
        items: opened ? items : [],
        opened,
        loading,
        selectedItem,
        itemIdPath,
        focusedIndex,
        renderer,
        theme
      });
    }
  }

  _isOverlayHidden() {
    return !this.loading && !(this._items && this._items.length);
  }

  // We need to listen on 'click' event and capture it and close the overlay before
  // propagating the event to the listener in the button. Otherwise, if the clicked button would call
  // open(), this would happen: https://www.youtube.com/watch?v=Z86V_ICUCD4
  _outsideClickListener(event) {
    const eventPath = event.composedPath();
    if (eventPath.indexOf(this.positionTarget) < 0 && eventPath.indexOf(this.$.overlay) < 0) {
      this.opened = false;
    }
  }

  _setOverlayWidth() {
    const inputWidth = this.positionTarget.clientWidth + 'px';
    const customWidth = getComputedStyle(this).getPropertyValue('--vaadin-combo-box-overlay-width');

    this.$.overlay.style.setProperty('--_vaadin-combo-box-overlay-default-width', inputWidth);

    if (customWidth === '') {
      this.$.overlay.style.removeProperty('--vaadin-combo-box-overlay-width');
    } else {
      this.$.overlay.style.setProperty('--vaadin-combo-box-overlay-width', customWidth);
    }

    this.$.overlay._updatePosition();
  }

  /**
   * Fired after the `vaadin-combo-box-dropdown` opens.
   *
   * @event vaadin-combo-box-dropdown-opened
   */

  /**
   * Fired after the `vaadin-combo-box-dropdown` closes.
   *
   * @event vaadin-combo-box-dropdown-closed
   */
}

customElements.define(ComboBoxDropdown.is, ComboBoxDropdown);
