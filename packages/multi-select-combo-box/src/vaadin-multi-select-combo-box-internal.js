/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-multi-select-combo-box-item.js';
import './vaadin-multi-select-combo-box-overlay.js';
import './vaadin-multi-select-combo-box-scroller.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ComboBoxDataProviderMixin } from '@vaadin/combo-box/src/vaadin-combo-box-data-provider-mixin.js';
import { ComboBoxMixin } from '@vaadin/combo-box/src/vaadin-combo-box-mixin.js';
import { ComboBoxPlaceholder } from '@vaadin/combo-box/src/vaadin-combo-box-placeholder.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-multi-select-combo-box>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes ComboBoxDataProviderMixin
 * @mixes ComboBoxMixin
 * @mixes ThemableMixin
 * @private
 */
class MultiSelectComboBoxInternal extends ComboBoxDataProviderMixin(ComboBoxMixin(ThemableMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-multi-select-combo-box-internal';
  }

  static get template() {
    return html`
      <style>
        :host([opened]) {
          pointer-events: auto;
        }
      </style>

      <slot></slot>

      <vaadin-multi-select-combo-box-overlay
        id="overlay"
        hidden$="[[_isOverlayHidden(_dropdownItems, loading)]]"
        opened="[[_overlayOpened]]"
        loading$="[[loading]]"
        theme$="[[_theme]]"
        position-target="[[_target]]"
        no-vertical-overlap
        restore-focus-node="[[inputElement]]"
      ></vaadin-multi-select-combo-box-overlay>
    `;
  }

  static get properties() {
    return {
      /**
       * When set to `true`, "loading" attribute is set
       * on the host and the overlay element.
       * @type {boolean}
       */
      loading: {
        type: Boolean,
        notify: true,
      },

      /**
       * Total number of items.
       * @type {number | undefined}
       */
      size: {
        type: Number,
        notify: true,
      },

      /**
       * Selected items to render in the dropdown
       * when the component is read-only.
       */
      selectedItems: {
        type: Array,
        value: () => [],
      },

      _target: {
        type: Object,
      },
    };
  }

  static get observers() {
    return ['_readonlyItemsChanged(readonly, selectedItems)'];
  }

  /**
   * Reference to the clear button element.
   * @protected
   * @return {!HTMLElement}
   */
  get clearElement() {
    return this.querySelector('[part="clear-button"]');
  }

  /**
   * Tag name prefix used by scroller and items.
   * @protected
   * @return {string}
   */
  get _tagNamePrefix() {
    return 'vaadin-multi-select-combo-box';
  }

  /**
   * Override method inherited from the combo-box
   * to allow opening dropdown when readonly.
   * @override
   */
  open() {
    if (!this.disabled && !(this.readonly && this.selectedItems.length === 0)) {
      this.opened = true;
    }
  }

  /** @protected */
  ready() {
    super.ready();

    this._target = this;
    this._toggleElement = this.querySelector('.toggle-button');

    // Set correct owner for using by item renderers
    this._scroller.comboBox = this.getRootNode().host;
  }

  /**
   * Override method from `InputMixin`.
   *
   * @protected
   * @override
   */
  clear() {
    super.clear();

    if (this.inputElement) {
      this.inputElement.value = '';
    }
  }

  /**
   * Override Enter handler to keep overlay open
   * when item is selected or unselected.
   * @param {!Event} event
   * @protected
   * @override
   */
  _onEnter(event) {
    this.__enterPressed = true;

    super._onEnter(event);
  }

  /**
   * @protected
   * @override
   */
  _closeOrCommit() {
    if (this.readonly) {
      this.close();
      return;
    }

    if (this.__enterPressed) {
      this.__enterPressed = null;

      // Keep selected item focused after committing on Enter.
      const focusedItem = this.filteredItems[this._focusedIndex];
      this._commitValue();
      this._focusedIndex = this.filteredItems.indexOf(focusedItem);

      return;
    }

    super._closeOrCommit();
  }

  /**
   * Override method inherited from the combo-box
   * to not update focused item when readonly.
   * @protected
   * @override
   */
  _onArrowDown() {
    if (!this.readonly) {
      super._onArrowDown();
    } else if (!this.opened) {
      this.open();
    }
  }

  /**
   * Override method inherited from the combo-box
   * to not update focused item when readonly.
   * @protected
   * @override
   */
  _onArrowUp() {
    if (!this.readonly) {
      super._onArrowUp();
    } else if (!this.opened) {
      this.open();
    }
  }

  /**
   * Override method inherited from the combo-box
   * to close dropdown on blur when readonly.
   * @param {FocusEvent} event
   * @protected
   * @override
   */
  _onFocusout(event) {
    // Disable combo-box logic that updates selectedItem
    // based on the overlay focused index on input blur
    this._ignoreCommitValue = true;

    super._onFocusout(event);

    if (this.readonly && !this._closeOnBlurIsPrevented) {
      this.close();
    }
  }

  /**
   * Override method inherited from the combo-box
   * to not commit an already selected item again
   * on blur, which would result in un-selecting.
   * @protected
   * @override
   */
  _detectAndDispatchChange() {
    if (this._ignoreCommitValue) {
      this._ignoreCommitValue = false;

      // Reset internal combo-box state
      this.selectedItem = null;
      this._inputElementValue = '';
      return;
    }

    super._detectAndDispatchChange();
  }

  /**
   * @param {CustomEvent} event
   * @protected
   * @override
   */
  _overlaySelectedItemChanged(event) {
    event.stopPropagation();

    // Do not un-select on click when readonly
    if (this.readonly) {
      return;
    }

    if (event.detail.item instanceof ComboBoxPlaceholder) {
      return;
    }

    if (this.opened) {
      this.dispatchEvent(
        new CustomEvent('combo-box-item-selected', {
          detail: {
            item: event.detail.item,
          },
        }),
      );
    }
  }

  /**
   * Override method inherited from the combo-box
   * to render only selected items when read-only,
   * even if a different set of items is provided.
   *
   * @protected
   * @override
   */
  _setDropdownItems(items) {
    const effectiveItems = this.readonly ? this.selectedItems : items;
    super._setDropdownItems(effectiveItems);
  }

  /**
   * Override method inherited from the combo-box
   * to not request data provider when read-only.
   *
   * @param {number}
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldLoadPage(page) {
    if (this.readonly) {
      return false;
    }

    return super._shouldLoadPage(page);
  }

  /** @private */
  _readonlyItemsChanged(readonly, selectedItems) {
    if (readonly && selectedItems) {
      this.__savedItems = this._dropdownItems;
      this._dropdownItems = selectedItems;
    }

    // Restore the original dropdown items
    if (readonly === false && this.__savedItems) {
      this._dropdownItems = this.__savedItems;
      this.__savedItems = null;
    }
  }
}

customElements.define(MultiSelectComboBoxInternal.is, MultiSelectComboBoxInternal);
