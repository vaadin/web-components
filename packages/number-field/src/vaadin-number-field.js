/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/src/vaadin-input-container.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { numberFieldStyles } from './styles/vaadin-number-field-base-styles.js';
import { NumberFieldMixin } from './vaadin-number-field-mixin.js';

/**
 * `<vaadin-number-field>` is an input field web component that only accepts numeric input.
 *
 * ```html
 * <vaadin-number-field label="Balance"></vaadin-number-field>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|----------------
 * `label`              | The label element
 * `input-field`        | The element that wraps prefix, value and suffix
 * `field-button`       | Set on clear, decrease and increase buttons
 * `clear-button`       | The clear button
 * `error-message`      | The error message element
 * `helper-text`        | The helper text element wrapper
 * `required-indicator` | The `required` state indicator element
 * `increase-button`    | Increase ("plus") button
 * `decrease-button`    | Decrease ("minus") button
 *
 * The following state attributes are available for styling:
 *
 * Attribute            | Description
 * ---------------------|---------------------------------
 * `disabled`           | Set when the element is disabled
 * `has-value`          | Set when the element has a value
 * `has-label`          | Set when the element has a label
 * `has-helper`         | Set when the element has helper text or slot
 * `has-error-message`  | Set when the element has an error message
 * `has-tooltip`        | Set when the element has a slotted tooltip
 * `invalid`            | Set when the element is invalid
 * `input-prevented`    | Temporarily set when invalid input is prevented
 * `focused`            | Set when the element is focused
 * `focus-ring`         | Set when the element is keyboard focused
 * `readonly`           | Set when the element is readonly
 *
 * Note, the `input-prevented` state attribute is only supported when `allowedCharPattern` is set.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * ### Change events
 *
 * Depending on the nature of the value change that the user attempts to commit e.g. by pressing Enter,
 * the component can fire either a `change` event or an `unparsable-change` event:
 *
 * Value change             | Event
 * :------------------------|:------------------
 * empty => parsable        | change
 * empty => unparsable      | unparsable-change
 * parsable => empty        | change
 * parsable => parsable     | change
 * parsable => unparsable   | change
 * unparsable => empty      | unparsable-change
 * unparsable => parsable   | change
 * unparsable => unparsable | -
 *
 * Note, there is currently no way to detect unparsable => unparsable changes because the browser
 * doesn't provide access to unparsable values of native [type=number] inputs.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {Event} unparsable-change - Fired when the user commits an unparsable value change and there is no change event.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes NumberFieldMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class NumberField extends NumberFieldMixin(ThemableMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-number-field';
  }

  static get styles() {
    return [inputFieldShared, numberFieldStyles];
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-field-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" @click="${this.focus}"></span>
        </div>

        <vaadin-input-container
          part="input-field"
          .readonly="${this.readonly}"
          .disabled="${this.disabled}"
          .invalid="${this.invalid}"
          theme="${ifDefined(this._theme)}"
        >
          <div
            part="field-button decrease-button"
            ?disabled="${!this._isButtonEnabled(-1, this.value, this.min, this.max, this.step)}"
            ?hidden="${!this.stepButtonsVisible}"
            @click="${this._onDecreaseButtonClick}"
            @touchend="${this._onDecreaseButtonTouchend}"
            aria-hidden="true"
            slot="prefix"
          ></div>
          <slot name="prefix" slot="prefix"></slot>
          <slot name="input"></slot>
          <slot name="suffix" slot="suffix"></slot>
          <div id="clearButton" part="field-button clear-button" slot="suffix" aria-hidden="true"></div>
          <div
            part="field-button increase-button"
            ?disabled="${!this._isButtonEnabled(1, this.value, this.min, this.max, this.step)}"
            ?hidden="${!this.stepButtonsVisible}"
            @click="${this._onIncreaseButtonClick}"
            @touchend="${this._onIncreaseButtonTouchend}"
            aria-hidden="true"
            slot="suffix"
          ></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>

        <slot name="tooltip"></slot>
      </div>
    `;
  }
}

defineCustomElement(NumberField);

export { NumberField };
