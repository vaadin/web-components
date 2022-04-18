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
      _target: {
        type: Object
      }
    };
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

  /** @protected */
  _isClearButton(event) {
    return (
      super._isClearButton(event) ||
      (event.type === 'input' && !event.isTrusted) || // fake input event dispatched by clear button
      event.composedPath()[0].getAttribute('part') === 'clear-button'
    );
  }

  /**
   * @param {!Event} event
   * @protected
   */
  _onChange(event) {
    super._onChange(event);

    if (this._isClearButton(event)) {
      this._clear();
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
   * @param {CustomEvent} event
   * @protected
   * @override
   */
  _overlaySelectedItemChanged(event) {
    event.stopPropagation();

    if (event.detail.item instanceof ComboBoxPlaceholder) {
      return;
    }

    if (this.opened) {
      this.dispatchEvent(
        new CustomEvent('combo-box-item-selected', {
          detail: {
            item: event.detail.item
          }
        })
      );
    }
  }
}

customElements.define(MultiSelectComboBoxInternal.is, MultiSelectComboBoxInternal);
