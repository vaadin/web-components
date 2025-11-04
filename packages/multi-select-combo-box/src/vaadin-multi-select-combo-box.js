/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-multi-select-combo-box-chip.js';
import './vaadin-multi-select-combo-box-container.js';
import './vaadin-multi-select-combo-box-item.js';
import './vaadin-multi-select-combo-box-overlay.js';
import './vaadin-multi-select-combo-box-scroller.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { multiSelectComboBoxStyles } from './styles/vaadin-multi-select-combo-box-base-styles.js';
import { MultiSelectComboBoxMixin } from './vaadin-multi-select-combo-box-mixin.js';

/**
 * `<vaadin-multi-select-combo-box>` is a web component that wraps `<vaadin-combo-box>` and extends
 * its functionality to allow selecting multiple items, in addition to basic features.
 *
 * ```html
 * <vaadin-multi-select-combo-box id="comboBox"></vaadin-multi-select-combo-box>
 * ```
 *
 * ```js
 * const comboBox = document.querySelector('#comboBox');
 * comboBox.items = ['apple', 'banana', 'lemon', 'orange'];
 * comboBox.selectedItems = ['lemon', 'orange'];
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name              | Description
 * -----------------------|----------------
 * `chips`                | The element that wraps slotted chips for selected items
 * `label`                | The label element
 * `input-field`          | The element that wraps prefix, value and suffix
 * `field-button`         | Set on both clear and toggle buttons
 * `clear-button`         | The clear button
 * `error-message`        | The error message element
 * `helper-text`          | The helper text element wrapper
 * `required-indicator`   | The `required` state indicator element
 * `toggle-button`        | The toggle button
 * `overlay`              | The overlay container
 * `content`              | The overlay content
 * `loader`               | The loading indicator shown while loading items
 *
 * The following state attributes are available for styling:
 *
 * Attribute              | Description
 * -----------------------|-----------------
 * `disabled`             | Set to a disabled element
 * `has-value`            | Set when the element has a value
 * `has-label`            | Set when the element has a label
 * `has-helper`           | Set when the element has helper text or slot
 * `has-error-message`    | Set when the element has an error message
 * `has-tooltip`          | Set when the element has a slotted tooltip
 * `invalid`              | Set when the element is invalid
 * `focused`              | Set when the element is focused
 * `focus-ring`           | Set when the element is keyboard focused
 * `loading`              | Set when loading items from the data provider
 * `opened`               | Set when the dropdown is open
 * `readonly`             | Set to a readonly element
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom property                                      | Description                | Default
 * -----------------------------------------------------|----------------------------|--------
 * `--vaadin-field-default-width`                       | Default width of the field | `12em`
 * `--vaadin-multi-select-combo-box-overlay-width`      | Width of the overlay       | `auto`
 * `--vaadin-multi-select-combo-box-overlay-max-height` | Max height of the overlay  | `65vh`
 * `--vaadin-multi-select-combo-box-input-min-width`    | Min width of the input     | `4em`
 *
 * ### Internal components
 *
 * In addition to `<vaadin-multi-select-combo-box>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-multi-select-combo-box-chip>`
 * - `<vaadin-multi-select-combo-box-item>` - has the same API as `<vaadin-item>`.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} custom-value-set - Fired when the user sets a custom value.
 * @fires {CustomEvent} filter-changed - Fired when the `filter` property changes.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} selected-items-changed - Fired when the `selectedItems` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes MultiSelectComboBoxMixin
 */
class MultiSelectComboBox extends MultiSelectComboBoxMixin(
  ThemableMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-multi-select-combo-box';
  }

  static get styles() {
    return [inputFieldShared, multiSelectComboBoxStyles];
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-multi-select-combo-box-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" @click="${this.focus}"></span>
        </div>

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
          <div id="clearButton" part="field-button clear-button" slot="suffix" aria-hidden="true"></div>
          <div id="toggleButton" part="field-button toggle-button" slot="suffix" aria-hidden="true"></div>
        </vaadin-multi-select-combo-box-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>

        <slot name="tooltip"></slot>
      </div>

      <vaadin-multi-select-combo-box-overlay
        id="overlay"
        exportparts="overlay, content, loader"
        .owner="${this}"
        .dir="${this.dir}"
        .opened="${this._overlayOpened}"
        ?loading="${this.loading}"
        theme="${ifDefined(this._theme)}"
        .positionTarget="${this._inputField}"
        no-vertical-overlap
      >
        <slot name="overlay"></slot>
      </vaadin-multi-select-combo-box-overlay>
    `;
  }
}

defineCustomElement(MultiSelectComboBox);

export { MultiSelectComboBox };
