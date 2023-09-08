/**
 * @license
 * Copyright (c) 2015 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ComboBoxBaseMixin } from '@vaadin/combo-box/src/vaadin-combo-box-base-mixin.js';

/**
 * @polymerMixin
 * @mixes ComboBoxBaseMixin
 */
export const TimePickerMixin = (subclass) =>
  class TimePickerMixinClass extends ComboBoxBaseMixin(subclass) {
    static get properties() {
      return {
        /** @protected */
        _dropdownItems: {
          type: Array,
          value: () => {
            // TODO: replace this hardcoded value with generated dropdown list
            return new Array(24).fill().map((_, idx) => {
              return { label: `${idx}:00`, value: `${idx}:00` };
            });
          },
        },

        /** @protected */
        _selectedItem: {
          type: Object,
          value: null,
        },
      };
    }

    static get observers() {
      return ['_updateScroller(_scroller, opened, _dropdownItems, _selectedItem, _focusedIndex)'];
    }

    constructor() {
      super();

      this._boundOnClearButtonMouseDown = this.__onClearButtonMouseDown.bind(this);
      this._boundOnOverlayTouchAction = this._onOverlayTouchAction.bind(this);
      this._boundOverlaySelectedItemChanged = this._overlaySelectedItemChanged.bind(this);
    }

    /**
     * Tag name prefix used by scroller and items.
     * @protected
     * @return {string}
     */
    get _tagNamePrefix() {
      return 'vaadin-time-picker';
    }

    /**
     * @protected
     * @override
     */
    _getItems() {
      return this._dropdownItems;
    }

    /**
     * @protected
     * @override
     */
    _initOverlay() {
      super._initOverlay();

      const overlay = this.$.overlay;

      // Manual two-way binding for the overlay "opened" property
      overlay.addEventListener('opened-changed', (e) => {
        this.opened = e.detail.value;
      });

      overlay.addEventListener('touchend', this._boundOnOverlayTouchAction);
      overlay.addEventListener('touchmove', this._boundOnOverlayTouchAction);
    }

    /**
     * @protected
     * @override
     */
    _openedChanged(opened, wasOpened) {
      super._openedChanged(opened, wasOpened);

      if (wasOpened) {
        this._onClosed();
      }
    }

    /**
     * Override an event listener from `InputMixin`.
     * @param {!Event} event
     * @protected
     * @override
     */
    _onChange(event) {
      // Suppress the native change event fired on the native input.
      event.stopPropagation();
    }

    /**
     * Override an event listener from `KeyboardMixin`.
     *
     * @param {KeyboardEvent} e
     * @protected
     * @override
     */
    _onEnter(e) {
      // TODO implement `autoOpenDisabled` and other logic.

      // Stop propagation of the enter event only if the dropdown is opened, this
      // "consumes" the enter event for the action of closing the dropdown
      if (this.opened) {
        // Do not submit the surrounding form.
        e.preventDefault();
        // Do not trigger global listeners
        e.stopPropagation();

        this.close();
      }
    }

    /** @private */
    _onClosed() {
      this._commitValue();
    }

    /** @private */
    _applySelectedItem() {
      const focusedItem = this._focusedItem;

      if (this._selectedItem !== focusedItem) {
        this._selectedItem = focusedItem;
      }

      this._inputElementValue = this._getItemLabel(this._selectedItem);
      this._focusedIndex = -1;
    }

    /** @private */
    _commitValue() {
      // TODO: implement the rest of logic from `ComboBoxMixin`
      if (this._focusedIndex > -1) {
        this._applySelectedItem();
      }

      this._clearSelectionRange();
    }

    /**
     * Create and initialize the scroller element.
     * Override to provide custom host reference.
     *
     * @protected
     * @override
     */
    _initScroller(host) {
      super._initScroller(host);

      const scroller = this._scroller;

      scroller.addEventListener('selection-changed', this._boundOverlaySelectedItemChanged);
    }

    /** @private */
    _overlaySelectedItemChanged(event) {
      // Stop this private event from leaking outside.
      event.stopPropagation();

      if (this.opened) {
        this._focusedIndex = this._getItems().indexOf(event.detail.item);
        this.close();
      }
    }

    /** @private */
    __onClearButtonMouseDown(event) {
      event.preventDefault(); // Prevent native focusout event
      this.inputElement.focus();
    }

    /** @private */
    _onOverlayTouchAction() {
      // On touch devices, blur the input on touch start inside the overlay, in order to hide
      // the virtual keyboard. But don't close the overlay on this blur.
      this._closeOnBlurIsPrevented = true;
      this.inputElement.blur();
      this._closeOnBlurIsPrevented = false;
    }

    /** @private */
    _updateScroller(scroller, opened, items, selectedItem, focusedIndex) {
      if (scroller) {
        if (opened) {
          scroller.style.maxHeight =
            getComputedStyle(this).getPropertyValue(`--${this._tagNamePrefix}-overlay-max-height`) || '65vh';
        }

        scroller.opened = opened;
        scroller.items = opened ? items : [];
        scroller.selectedItem = selectedItem;
        scroller.focusedIndex = focusedIndex;
      }
    }
  };
