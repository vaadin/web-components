/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-multi-select-combo-box-dropdown.js';
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

      <vaadin-multi-select-combo-box-dropdown
        id="dropdown"
        opened="[[opened]]"
        position-target="[[_target]]"
        renderer="[[renderer]]"
        _focused-index="[[_focusedIndex]]"
        _item-id-path="[[itemIdPath]]"
        _item-label-path="[[itemLabelPath]]"
        loading="[[loading]]"
        theme="[[theme]]"
      ></vaadin-multi-select-combo-box-dropdown>
    `;
  }

  static get properties() {
    return {
      /**
       * Total number of items.
       * @type {number | undefined}
       */
      size: {
        type: Number,
        notify: true,
      },

      /**
       * When present, it specifies that the field is read-only.
       */
      readonly: {
        type: Boolean,
        value: false,
        observer: '_readonlyChanged',
        reflectToAttribute: true,
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
   * Override method inherited from the combo-box
   * to allow opening dropdown when readonly.
   * @override
   */
  open() {
    if (!this.disabled && !(this.readonly && this.selectedItems.length === 0)) {
      this.opened = true;
    }
  }

  /**
   * @protected
   * @override
   */
  _getItemElements() {
    return Array.from(this.$.dropdown._scroller.querySelectorAll('vaadin-multi-select-combo-box-item'));
  }

  /** @protected */
  ready() {
    super.ready();

    this._target = this;
    this._toggleElement = this.querySelector('.toggle-button');
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
  _setOverlayItems(items) {
    const effectiveItems = this.readonly ? this.selectedItems : items;
    super._setOverlayItems(effectiveItems);
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
  _readonlyChanged(readonly, oldReadonly) {
    if (readonly) {
      this.__savedItems = this._getOverlayItems();
      this._setOverlayItems(this.selectedItems);
    } else if (oldReadonly) {
      this._setOverlayItems(this.__savedItems);
      this.__savedItems = null;
    }
  }

  /** @private */
  _readonlyItemsChanged(readonly, selectedItems) {
    if (readonly && selectedItems) {
      this._setOverlayItems(selectedItems);
    }
  }
}

customElements.define(MultiSelectComboBoxInternal.is, MultiSelectComboBoxInternal);
