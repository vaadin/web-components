/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/src/vaadin-input-container.js';
import './vaadin-month-picker-overlay.js';
import './vaadin-month-picker-overlay-content.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { InputControlMixin } from '@vaadin/field-base/src/input-control-mixin.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { monthPickerStyles } from './styles/vaadin-month-picker-base-styles.js';
import { MonthPickerMixin } from './vaadin-month-picker-mixin.js';

/**
 * `<vaadin-month-picker>` is an input field that allows the user to select
 * a month and a year.
 *
 * ```html
 * <vaadin-month-picker label="Month"></vaadin-month-picker>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|------------------------------------------------
 * `label`              | The label element wrapper.
 * `input-field`        | The element that wraps prefix, value and suffix.
 * `helper-text`        | The element that wraps the helper text.
 * `error-message`      | The element that wraps the error message.
 * `required-indicator` | The `required` state indicator element.
 * `clear-button`       | The clear button shown when the field has a value.
 * `toggle-button`      | The button that opens / closes the overlay.
 * `overlay`            | The overflow overlay panel (re-exported from the internal overlay).
 * `content`            | The inner wrapper inside the overlay.
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|--------------------------------------------------------
 * `opened`     | Set when the overlay is open.
 * `disabled`   | Set when the field is disabled.
 * `readonly`   | Set when the field is read-only.
 * `invalid`    | Set when the field has failed validation.
 * `focused`    | Set when the field has focus.
 * `focus-ring` | Set when the field is keyboard-focused.
 * `has-value`  | Set when the field has a non-empty value.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} unparsable-change - Fired when the user commits an unparsable value change.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @customElement vaadin-month-picker
 * @extends HTMLElement
 */
class MonthPicker extends MonthPickerMixin(
  InputControlMixin(ThemableMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement))))),
) {
  static get is() {
    return 'vaadin-month-picker';
  }

  static get experimental() {
    return 'monthPickerComponent';
  }

  static get styles() {
    return [inputFieldShared, monthPickerStyles];
  }

  static get properties() {
    return {
      /** @private */
      _positionTarget: {
        type: Object,
        sync: true,
      },
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

  /** @protected */
  render() {
    return html`
      <div class="vaadin-month-picker-container">
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
          <div part="field-button toggle-button" slot="suffix" aria-hidden="true" @click="${this._toggle}"></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>

      <vaadin-month-picker-overlay
        id="overlay"
        .owner="${this}"
        ?fullscreen="${this._fullscreen}"
        theme="${ifDefined(this._theme)}"
        .opened="${this.opened}"
        @opened-changed="${this._onOpenedChanged}"
        @vaadin-overlay-open="${this._onOverlayOpened}"
        @vaadin-overlay-close="${this._onVaadinOverlayClose}"
        restore-focus-on-close
        no-vertical-overlap
        exportparts="overlay, content"
        .restoreFocusNode="${this.inputElement}"
        .positionTarget="${this._positionTarget}"
      >
        <slot name="overlay"></slot>
      </vaadin-month-picker-overlay>

      <slot name="tooltip"></slot>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    this.addController(
      new InputController(
        this,
        (input) => {
          this._setInputElement(input);
          this._setFocusElement(input);
          this.stateTarget = input;
          this.ariaTarget = input;
        },
        {
          // The "search" word is a trick to prevent Safari from enabling AutoFill,
          // which is causing click issues:
          // https://github.com/vaadin/web-components/issues/6817#issuecomment-2268229567
          uniqueIdPrefix: 'search-input',
        },
      ),
    );
    this.addController(new LabelledInputController(this.inputElement, this._labelController));

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
    this._tooltipController.setPosition('top');
    this._tooltipController.setAriaTarget(this.inputElement);
    this._tooltipController.setShouldShow((target) => !target.opened);

    this._positionTarget = this.shadowRoot.querySelector('[part="input-field"]');

    const toggleButton = this.shadowRoot.querySelector('[part~="toggle-button"]');
    toggleButton.addEventListener('mousedown', (e) => e.preventDefault());
  }

  /** @private */
  _onOpenedChanged(event) {
    this.opened = event.detail.value;
  }

  /** @private */
  _onVaadinOverlayClose(e) {
    // Prevent closing the overlay on label element click
    const event = e.detail.sourceEvent;
    if (event && event.composedPath().includes(this) && !event.composedPath().includes(this._overlayElement)) {
      e.preventDefault();
    }
  }

  /** @private */
  _toggle(e) {
    e.stopPropagation();
    if (this.$.overlay.opened) {
      this.close();
    } else {
      this.open();
    }
  }
}

defineCustomElement(MonthPicker);

export { MonthPicker };
