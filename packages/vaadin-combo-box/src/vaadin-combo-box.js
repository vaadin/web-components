/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { AriaLabelMixin } from '@vaadin/field-base/src/aria-label-mixin.js';
import { ClearButtonMixin } from '@vaadin/field-base/src/clear-button-mixin.js';
import { FieldAriaMixin } from '@vaadin/field-base/src/field-aria-mixin.js';
import { InputSlotMixin } from '@vaadin/field-base/src/input-slot-mixin.js';
import { PatternMixin } from '@vaadin/field-base/src/pattern-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin';
import { ComboBoxDataProviderMixin } from './vaadin-combo-box-data-provider-mixin.js';
import { ComboBoxMixin } from './vaadin-combo-box-mixin.js';
import '@vaadin/input-container/src/vaadin-input-container.js';
import '@vaadin/text-field/src/vaadin-input-field-shared-styles.js';
import './vaadin-combo-box-dropdown.js';

class ComboBox extends ComboBoxDataProviderMixin(
  ComboBoxMixin(
    PatternMixin(
      FieldAriaMixin(ClearButtonMixin(AriaLabelMixin(InputSlotMixin(ThemableMixin(ElementMixin(PolymerElement))))))
    )
  )
) {
  static get is() {
    return 'vaadin-combo-box';
  }

  static get template() {
    return html`
      <style include="vaadin-input-field-shared-styles">
        :host([opened]) {
          pointer-events: auto;
        }
      </style>

      <div part="container">
        <div part="label" on-click="focus">
          <slot name="label"></slot>
          <span part="indicator" aria-hidden="true"></span>
        </div>

        <vaadin-input-container
          part="input-field"
          readonly="[[readonly]]"
          disabled="[[disabled]]"
          invalid="[[invalid]]"
          theme$="[[theme]]"
        >
          <slot name="prefix" slot="prefix"></slot>
          <slot name="input"></slot>
          <div id="clearButton" part="clear-button" slot="suffix"></div>
          <div id="toggleButton" part="toggle-button" slot="suffix"></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>

      <vaadin-combo-box-dropdown
        id="dropdown"
        opened="[[opened]]"
        renderer="[[renderer]]"
        position-target="[[_positionTarget]]"
        _focused-index="[[_focusedIndex]]"
        _item-id-path="[[itemIdPath]]"
        _item-label-path="[[itemLabelPath]]"
        loading="[[loading]]"
        theme="[[theme]]"
      ></vaadin-combo-box-dropdown>
    `;
  }

  static get properties() {
    return {
      /**
       * @protected
       */
      _positionTarget: {
        type: Object
      }
    };
  }

  /**
   * Used by `ClearButtonMixin` as a reference to the clear button element.
   * @protected
   * @return {!HTMLElement}
   */
  get clearElement() {
    return this.$.clearButton;
  }

  /**
   * Element used by `DelegatesFocusMixin` to handle focus.
   * @protected
   * @return {!HTMLInputElement}
   */
  get focusElement() {
    return this.inputElement;
  }

  /** @protected */
  ready() {
    super.ready();

    this._positionTarget = this.shadowRoot.querySelector('[part="input-field"]');
    this._toggleElement = this.$.toggleButton;
  }

  /**
   * Override method inherited from `FocusMixin` to validate on blur.
   * @param {boolean} focused
   * @protected
   * @override
   */
  _setFocused(focused) {
    super._setFocused(focused);

    if (!focused) {
      this.validate();
    }
  }

  /**
   * Override method inherited from `FocusMixin` to not remove focused
   * state when focus moves to the overlay.
   * @param {FocusEvent} event
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldRemoveFocus(event) {
    // Do not blur when focus moves to the overlay
    if (event.relatedTarget === this.$.dropdown.$.overlay) {
      event.composedPath()[0].focus();
      return false;
    }

    return true;
  }

  /**
   * Override method inherited from `ClearButtonMixin` to handle clear
   * button click and stop event from propagating to the host element.
   * @param {Event} event
   * @protected
   * @override
   */
  _onClearButtonClick(event) {
    event.stopPropagation();

    this._handleClearButtonClick(event);
  }
}

customElements.define(ComboBox.is, ComboBox);

export { ComboBox };
