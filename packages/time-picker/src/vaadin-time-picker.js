/**
 * @license
 * Copyright (c) 2018 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/src/vaadin-input-container.js';
import './vaadin-time-picker-item.js';
import './vaadin-time-picker-overlay.js';
import './vaadin-time-picker-scroller.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { timePickerStyles } from './styles/vaadin-time-picker-base-styles.js';
import { TimePickerMixin } from './vaadin-time-picker-mixin.js';

/**
 * `<vaadin-time-picker>` is a Web Component providing a time-selection field.
 *
 * ```html
 * <vaadin-time-picker></vaadin-time-picker>
 * ```
 * ```js
 * timePicker.value = '14:30';
 * ```
 *
 * When the selected `value` is changed, a `value-changed` event is triggered.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|----------------
 * `label`              | The label element
 * `input-field`        | The element that wraps prefix, value and buttons
 * `field-button`       | Set on both clear and toggle buttons
 * `clear-button`       | The clear button
 * `error-message`      | The error message element
 * `helper-text`        | The helper text element wrapper
 * `required-indicator` | The `required` state indicator element
 * `toggle-button`      | The toggle button
 * `overlay`            | The overlay container
 * `content`            | The overlay content
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
 * `focused`            | Set when the element is focused
 * `focus-ring`         | Set when the element is keyboard focused
 * `readonly`           | Set when the element is readonly
 * `opened`             | Set when the overlay is opened
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                                |
 * :--------------------------------------------------|
 * | `--vaadin-field-default-width`                   |
 * | `--vaadin-input-field-background`                |
 * | `--vaadin-input-field-border-color`              |
 * | `--vaadin-input-field-border-radius`             |
 * | `--vaadin-input-field-border-width`              |
 * | `--vaadin-input-field-bottom-end-radius`         |
 * | `--vaadin-input-field-bottom-start-radius`       |
 * | `--vaadin-input-field-button-text-color`         |
 * | `--vaadin-input-field-container-gap`             |
 * | `--vaadin-input-field-disabled-background`       |
 * | `--vaadin-input-field-disabled-text-color`       |
 * | `--vaadin-input-field-error-color`               |
 * | `--vaadin-input-field-error-font-size`           |
 * | `--vaadin-input-field-error-font-weight`         |
 * | `--vaadin-input-field-error-line-height`         |
 * | `--vaadin-input-field-gap`                       |
 * | `--vaadin-input-field-height`                    |
 * | `--vaadin-input-field-helper-color`              |
 * | `--vaadin-input-field-helper-font-size`          |
 * | `--vaadin-input-field-helper-font-weight`        |
 * | `--vaadin-input-field-helper-line-height`        |
 * | `--vaadin-input-field-label-color`               |
 * | `--vaadin-input-field-label-font-size`           |
 * | `--vaadin-input-field-label-font-weight`         |
 * | `--vaadin-input-field-label-line-height`         |
 * | `--vaadin-input-field-padding`                   |
 * | `--vaadin-input-field-placeholder-color`         |
 * | `--vaadin-input-field-required-indicator`        |
 * | `--vaadin-input-field-required-indicator-color`  |
 * | `--vaadin-input-field-top-end-radius`            |
 * | `--vaadin-input-field-top-start-radius`          |
 * | `--vaadin-input-field-value-color`               |
 * | `--vaadin-input-field-value-font-size`           |
 * | `--vaadin-input-field-value-font-weight`         |
 * | `--vaadin-input-field-value-line-height`         |
 * | `--vaadin-item-overlay-padding`                  |
 * | `--vaadin-time-picker-overlay-max-height`        |
 * | `--vaadin-time-picker-overlay-width`             |
 *
 * ### Internal components
 *
 * In addition to `<vaadin-time-picker>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-time-picker-item>` - has the same API as [`<vaadin-item>`](#/elements/vaadin-item).
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
 * unparsable => unparsable | unparsable-change
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {Event} unparsable-change - Fired when the user commits an unparsable value change and there is no change event.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @attr {string} theme - The theme variants to apply to the component.
 * @customElement vaadin-time-picker
 * @extends HTMLElement
 */
class TimePicker extends TimePickerMixin(ThemableMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-time-picker';
  }

  static get styles() {
    return [inputFieldShared, timePickerStyles];
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-time-picker-container">
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
          <slot name="prefix" slot="prefix"></slot>
          <slot name="input"></slot>
          <div id="clearButton" part="field-button clear-button" slot="suffix" aria-hidden="true"></div>
          <div id="toggleButton" part="field-button toggle-button" slot="suffix" aria-hidden="true"></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>

        <slot name="tooltip"></slot>
      </div>

      <vaadin-time-picker-overlay
        id="overlay"
        dir="ltr"
        .owner="${this}"
        .opened="${this._overlayOpened}"
        theme="${ifDefined(this._theme)}"
        .positionTarget="${this._inputContainer}"
        no-vertical-overlap
        exportparts="overlay, content"
      >
        <slot name="overlay"></slot>
      </vaadin-time-picker-overlay>
    `;
  }
}

defineCustomElement(TimePicker);

export { TimePicker };
