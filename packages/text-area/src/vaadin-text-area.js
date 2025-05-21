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
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { CSSInjectionMixin } from '@vaadin/vaadin-themable-mixin/css-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { TextAreaMixin } from './vaadin-text-area-mixin.js';
import { textAreaStyles } from './vaadin-text-area-styles.js';

/**
 * `<vaadin-text-area>` is a web component for multi-line text input.
 *
 * ```html
 * <vaadin-text-area label="Comment"></vaadin-text-area>
 * ```
 *
 * ### Prefixes and suffixes
 *
 * These are child elements of a `<vaadin-text-area>` that are displayed
 * inline with the input, before or after.
 * In order for an element to be considered as a prefix, it must have the slot
 * attribute set to `prefix` (and similarly for `suffix`).
 *
 * ```html
 * <vaadin-text-area label="Description">
 *   <div slot="prefix">Details:</div>
 *   <div slot="suffix">The end!</div>
 * </vaadin-text-area>
 * ```
 *
 * ### Styling
 *
 * The following custom properties are available for styling:
 *
 * Custom property                | Description                | Default
 * -------------------------------|----------------------------|---------
 * `--vaadin-field-default-width` | Default width of the field | `12em`
 *
 * `<vaadin-text-area>` provides the same set of shadow DOM parts and state attributes as `<vaadin-text-field>`.
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes TextAreaMixin
 * @mixes ThemableMixin
 */
export class TextArea extends TextAreaMixin(CSSInjectionMixin(ThemableMixin(ElementMixin(PolylitMixin(LitElement))))) {
  static get is() {
    return 'vaadin-text-area';
  }

  static get styles() {
    return [inputFieldShared, textAreaStyles];
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-text-area-container">
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
          @scroll="${this._onScroll}"
        >
          <slot name="prefix" slot="prefix"></slot>
          <slot name="textarea"></slot>
          <slot name="suffix" slot="suffix"></slot>
          <div id="clearButton" part="clear-button" slot="suffix" aria-hidden="true"></div>
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

  /** @protected */
  ready() {
    super.ready();

    this._tooltipController = new TooltipController(this);
    this._tooltipController.setPosition('top');
    this._tooltipController.setAriaTarget(this.inputElement);
    this.addController(this._tooltipController);
  }
}

defineCustomElement(TextArea);
