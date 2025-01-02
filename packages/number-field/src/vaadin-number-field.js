/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/src/vaadin-input-container.js';
import { html, PolymerElement } from '@polymer/polymer';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { NumberFieldMixin } from './vaadin-number-field-mixin.js';
import { numberFieldStyles } from './vaadin-number-field-styles.js';

registerStyles('vaadin-number-field', [inputFieldShared, numberFieldStyles], {
  moduleId: 'vaadin-number-field-styles',
});

/**
 * `<vaadin-number-field>` is an input field web component that only accepts numeric input.
 *
 * ```html
 * <vaadin-number-field label="Balance"></vaadin-number-field>
 * ```
 *
 * ### Styling
 *
 * `<vaadin-number-field>` provides the same set of shadow DOM parts and state attributes as `<vaadin-text-field>`.
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 * In addition to `<vaadin-text-field>` parts, the following parts are available for theming:
 *
 * Part name         | Description
 * ------------------|-------------------------
 * `increase-button` | Increase ("plus") button
 * `decrease-button` | Decrease ("minus") button
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
export class NumberField extends NumberFieldMixin(ThemableMixin(ElementMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-number-field';
  }

  static get template() {
    return html`
      <div class="vaadin-field-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" on-click="focus"></span>
        </div>

        <vaadin-input-container
          part="input-field"
          readonly="[[readonly]]"
          disabled="[[disabled]]"
          invalid="[[invalid]]"
          theme$="[[_theme]]"
        >
          <div
            disabled$="[[!_isButtonEnabled(-1, value, min, max, step)]]"
            part="decrease-button"
            on-click="_onDecreaseButtonClick"
            on-touchend="_onDecreaseButtonTouchend"
            hidden$="[[!stepButtonsVisible]]"
            aria-hidden="true"
            slot="prefix"
          ></div>
          <slot name="prefix" slot="prefix"></slot>
          <slot name="input"></slot>
          <slot name="suffix" slot="suffix"></slot>
          <div id="clearButton" part="clear-button" slot="suffix" aria-hidden="true"></div>
          <div
            disabled$="[[!_isButtonEnabled(1, value, min, max, step)]]"
            part="increase-button"
            on-click="_onIncreaseButtonClick"
            on-touchend="_onIncreaseButtonTouchend"
            hidden$="[[!stepButtonsVisible]]"
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
      </div>

      <slot name="tooltip"></slot>
    `;
  }
}

defineCustomElement(NumberField);
