/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-lit-multi-select-combo-box-chip.js';
import './vaadin-lit-multi-select-combo-box-container.js';
import './vaadin-lit-multi-select-combo-box-internal.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { MultiSelectComboBoxMixin } from './vaadin-multi-select-combo-box-mixin.js';
import { multiSelectComboBox } from './vaadin-multi-select-combo-box-styles.js';

/**
 * LitElement based version of `<vaadin-multi-select-combo-box>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class MultiSelectComboBox extends MultiSelectComboBoxMixin(ThemableMixin(ElementMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-multi-select-combo-box';
  }

  static get styles() {
    return [inputFieldShared, multiSelectComboBox];
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-multi-select-combo-box-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" @click="${this.focus}"></span>
        </div>

        <vaadin-multi-select-combo-box-internal
          id="comboBox"
          .filteredItems="${this.filteredItems}"
          .items="${this.items}"
          .itemIdPath="${this.itemIdPath}"
          .itemLabelPath="${this.itemLabelPath}"
          .itemValuePath="${this.itemValuePath}"
          .disabled="${this.disabled}"
          .readonly="${this.readonly}"
          .autoOpenDisabled="${this.autoOpenDisabled}"
          .allowCustomValue="${this.allowCustomValue}"
          .overlayClass="${this.overlayClass}"
          .dataProvider="${this.dataProvider}"
          .filter="${this.filter}"
          .lastFilter="${this._lastFilter}"
          .loading="${this.loading}"
          .size="${this.size}"
          .selectedItems="${this.selectedItems}"
          .selectedItemsOnTop="${this.selectedItemsOnTop}"
          .itemClassNameGenerator="${this.itemClassNameGenerator}"
          .topGroup="${this._topGroup}"
          .opened="${this.opened}"
          .renderer="${this.renderer}"
          .keepFilter="${this.keepFilter}"
          theme="${ifDefined(this._theme)}"
          @combo-box-item-selected="${this._onComboBoxItemSelected}"
          @change="${this._onComboBoxChange}"
          @custom-value-set="${this._onCustomValueSet}"
          @filtered-items-changed="${this._onFilteredItemsChanged}"
          @filter-changed="${this._onComboBoxFilterChanged}"
          @last-filter-changed="${this._onComboBoxLastFilterChanged}"
          @loading-changed="${this._onComboBoxLoadingChanged}"
          @opened-changed="${this._onComboBoxOpenedChanged}"
          @size-changed="${this._onComboBoxSizeChanged}"
        >
          <vaadin-multi-select-combo-box-container
            part="input-field"
            .autoExpandVertically="${this.autoExpandVertically}"
            .readonly="${this.readonly}"
            .disabled="${this.disabled}"
            .invalid="${this.invalid}"
            theme="${ifDefined(this._theme)}"
          >
            <slot name="overflow" slot="prefix"></slot>
            <div id="chips" part="chips" slot="prefix">
              <slot name="chip"></slot>
            </div>
            <slot name="input"></slot>
            <div
              id="clearButton"
              part="clear-button"
              slot="suffix"
              @touchend="${this._onClearButtonTouchend}"
              aria-hidden="true"
            ></div>
            <div id="toggleButton" class="toggle-button" part="toggle-button" slot="suffix" aria-hidden="true"></div>
          </vaadin-multi-select-combo-box-container>
        </vaadin-multi-select-combo-box-internal>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>

      <slot name="tooltip"></slot>
    `;
  }

  /** @private */
  _onComboBoxFilterChanged(event) {
    this.filter = event.detail.value;
  }

  /** @private */
  _onComboBoxLoadingChanged(event) {
    this.loading = event.detail.value;
  }

  /** @private */
  _onComboBoxLastFilterChanged(event) {
    this._lastFilter = event.detail.value;
  }

  /** @private */
  _onComboBoxOpenedChanged(event) {
    this.opened = event.detail.value;
  }

  /** @private */
  _onComboBoxSizeChanged(event) {
    this.size = event.detail.value;
  }
}

defineCustomElement(MultiSelectComboBox);

export { MultiSelectComboBox };
