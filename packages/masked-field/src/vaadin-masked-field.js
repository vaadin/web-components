/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { TextField } from '@vaadin/text-field/src/vaadin-text-field.js';
import { maskedFieldStyles } from './styles/vaadin-masked-field-base-styles.js';
import { MaskedFieldMixin } from './vaadin-masked-field-mixin.js';

/**
 * `<vaadin-masked-field>` is an extension of `<vaadin-text-field>` component that lays the value out
 * as the user types. The layout is configured either with `formatBlocks`, `formatDelimiter` and
 * `formatTextCase`, which group the characters into blocks of a fixed length, or with `formatMask`,
 * which describes the whole shape of the value. The `value` property stays plain, without any of the
 * characters that the format adds, and the text that the user sees is exposed as `formattedValue`.
 *
 * ```html
 * <vaadin-masked-field label="Phone number" format-mask="+1 (000) 000-0000"></vaadin-masked-field>
 * ```
 *
 * This component is experimental. Enable the feature flag before importing it:
 *
 * ```js
 * window.Vaadin.featureFlags.maskedFieldComponent = true;
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
 * `prompt`             | The visual mask shown for the unfilled part of `formatMask` when `formatPrompt` is set
 * `field-button`       | Set on the clear button
 * `clear-button`       | The clear button
 * `error-message`      | The error message element
 * `helper-text`        | The helper text element wrapper
 * `required-indicator` | The `required` state indicator element
 *
 * The following state attributes are available for styling:
 *
 * Attribute            | Description
 * ---------------------|---------------------------------
 * `disabled`           | Set when the element is disabled
 * `has-value`          | Set when the element has a value
 * `has-format-prompt`  | Set when the visual mask has something to show
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
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @customElement vaadin-masked-field
 * @extends HTMLElement
 */
class MaskedField extends MaskedFieldMixin(TextField) {
  static get is() {
    return 'vaadin-masked-field';
  }

  static get experimental() {
    return true;
  }

  static get styles() {
    return [...super.styles, maskedFieldStyles];
  }

  /** @private */
  #resizeObserver = new ResizeObserver(() => this.#syncPromptGeometry());

  /**
   * Override a method from `LitElement` to add the visual mask to the template
   * that `TextField` renders: one node inside the input container, holding the
   * presented text as an invisible spacer followed by the shape that is still to
   * come. The node is `aria-hidden` because the accessible description of the
   * shape belongs to the label and the helper text, not to a decorative overlay.
   *
   * Apart from that node the template is a copy of `TextField.render()` in
   * `packages/text-field/src/vaadin-text-field.js`, and has to be copied again
   * whenever that template changes. After a format change the shape settles one
   * update cycle later, since `formattedValue` is written in the `updated()` of
   * `InputFormatMixin`, after the render that reads it.
   *
   * @protected
   * @override
   */
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
          <slot name="prefix" slot="prefix"></slot>
          <slot name="input"></slot>
          <div part="prompt" aria-hidden="true"><span>${this.formattedValue}</span>${this._formatPromptRemainder}</div>
          ${this._renderSuffix()}
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

  /**
   * Override a method from `LitElement` to observe the input element that the
   * visual mask is laid over again once it is reconnected.
   *
   * @protected
   * @override
   */
  connectedCallback() {
    super.connectedCallback();

    if (this.inputElement) {
      this.#resizeObserver.observe(this.inputElement);
    }

    this.#observeContainer();
  }

  /**
   * Override a method from `LitElement` to measure the visual mask against the
   * container as well, so that a change of its border or padding that leaves the
   * input element the same size still moves the overlay.
   *
   * @param {!Object} props
   * @protected
   * @override
   */
  firstUpdated(props) {
    super.firstUpdated(props);

    this.#observeContainer();
  }

  /**
   * Override a method from `LitElement` to stop measuring the input element while
   * the field is not in the document.
   *
   * @protected
   * @override
   */
  disconnectedCallback() {
    super.disconnectedCallback();

    this.#resizeObserver.disconnect();
  }

  /**
   * Override a method from `LitElement` to flag whether the visual mask has
   * anything to show, which is what its styles use to hide it, and to lay it over
   * the input element once it does.
   *
   * @param {!Object} props
   * @protected
   * @override
   */
  updated(props) {
    super.updated(props);

    const hasPrompt = this._formatPromptRemainder !== '';
    const wasShown = this.hasAttribute('has-format-prompt');

    this.toggleAttribute('has-format-prompt', hasPrompt);

    // The observer covers every later change of the box, so the only measurement
    // it does not cover is the first one, when the overlay starts being shown.
    if (hasPrompt && !wasShown) {
      this.#syncPromptGeometry();
    }
  }

  /**
   * Override a method from `InputMixin` to measure the visual mask against the
   * input element that it is laid over.
   *
   * @param {HTMLElement | undefined} input
   * @param {HTMLElement | undefined} oldInput
   * @protected
   * @override
   */
  _inputElementChanged(input, oldInput) {
    super._inputElementChanged(input, oldInput);

    if (oldInput) {
      this.#resizeObserver.unobserve(oldInput);
    }

    if (input) {
      this.#resizeObserver.observe(input);
    }
  }

  /**
   * Starts measuring the container that the visual mask is positioned against.
   *
   * @private
   */
  #observeContainer() {
    const container = this.shadowRoot?.querySelector('[part="input-field"]');

    if (container) {
      this.#resizeObserver.observe(container);
    }
  }

  /**
   * Lays the visual mask exactly over the input element. The box is measured
   * rather than mirrored from the styles, since a prefix, a suffix and the theme
   * padding all move the input element inside its container.
   *
   * @private
   */
  #syncPromptGeometry() {
    // A hidden overlay is measured by `updated()` at the moment it is shown, so
    // there is nothing for a resize of a field without a shape to keep in sync.
    if (!this.hasAttribute('has-format-prompt')) {
      return;
    }

    const input = this.inputElement;
    const container = this.shadowRoot?.querySelector('[part="input-field"]');
    const prompt = this.shadowRoot?.querySelector('[part="prompt"]');

    if (!input || !container || !prompt) {
      return;
    }

    const inputRect = input.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // A field that is not rendered has nothing to measure, and writing the zeroes
    // would leave the overlay collapsed once it is shown again.
    if (inputRect.width === 0 && inputRect.height === 0) {
      return;
    }

    // An absolutely positioned box is placed against the padding box of its
    // containing block, so the border of the container is taken off the offsets.
    prompt.style.top = `${inputRect.top - containerRect.top - container.clientTop}px`;
    prompt.style.left = `${inputRect.left - containerRect.left - container.clientLeft}px`;
    prompt.style.width = `${inputRect.width}px`;
    prompt.style.height = `${inputRect.height}px`;
  }
}

defineCustomElement(MaskedField);

export { MaskedField };
