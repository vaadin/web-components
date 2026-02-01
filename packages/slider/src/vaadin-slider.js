/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement, render } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { FieldMixin } from '@vaadin/field-base/src/field-mixin.js';
import { field } from '@vaadin/field-base/src/styles/field-base-styles.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { sliderStyles } from './styles/vaadin-slider-base-styles.js';
import { SliderMixin } from './vaadin-slider-mixin.js';

/**
 * `<vaadin-slider>` is a web component that represents a range slider
 * for selecting numerical values within a defined range.
 *
 * ```html
 * <vaadin-slider min="0" max="100" step="1"></vaadin-slider>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|-----------------
 * `label`              | The label element
 * `required-indicator` | The required indicator element
 * `helper-text`        | The helper text element
 * `error-message`      | The error message element
 * `track`              | The slider track
 * `track-fill`         | The filled portion of the track
 * `thumb`              | The slider thumb
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `disabled`   | Set when the slider is disabled
 * `readonly`   | Set when the slider is read-only
 * `focused`    | Set when the slider has focus
 * `focus-ring` | Set when the slider is focused using the keyboard
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                          |
 * :--------------------------------------------|
 * `--vaadin-field-default-width`               |
 * `--vaadin-input-field-error-color`           |
 * `--vaadin-input-field-error-font-size`       |
 * `--vaadin-input-field-error-font-weight`     |
 * `--vaadin-input-field-helper-color`          |
 * `--vaadin-input-field-helper-font-size`      |
 * `--vaadin-input-field-helper-font-weight`    |
 * `--vaadin-input-field-label-color`           |
 * `--vaadin-input-field-label-font-size`       |
 * `--vaadin-input-field-label-font-weight`     |
 * `--vaadin-input-field-required-indicator`    |
 * `--vaadin-slider-fill-background`            |
 * `--vaadin-slider-thumb-height`               |
 * `--vaadin-slider-thumb-width`                |
 * `--vaadin-slider-track-background`           |
 * `--vaadin-slider-track-border-radius`        |
 * `--vaadin-slider-track-height`               |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes FieldMixin
 * @mixes FocusMixin
 * @mixes SliderMixin
 * @mixes ThemableMixin
 */
class Slider extends FieldMixin(
  SliderMixin(FocusMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))))),
) {
  static get is() {
    return 'vaadin-slider';
  }

  static get styles() {
    return [
      field,
      sliderStyles,
      css`
        :host([focus-ring]) [part='thumb'] {
          outline: var(--vaadin-focus-ring-width) var(--_outline-style, solid) var(--vaadin-focus-ring-color);
          outline-offset: 1px;
        }

        #controls {
          grid-template-columns:
            [track-start fill-start]
            calc(var(--value) * var(--_track-width))
            [fill-end thumb1]
            var(--_thumb-width)
            calc((1 - var(--value)) * var(--_track-width))
            [track-end];
        }

        [part='track-fill'] {
          border-start-start-radius: inherit;
          border-end-start-radius: inherit;
        }
      `,
    ];
  }

  static get experimental() {
    return 'sliderComponent';
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  static get properties() {
    return {
      /**
       * The value of the slider.
       */
      value: {
        type: Number,
        value: 0,
        notify: true,
        sync: true,
      },
    };
  }

  /** @protected */
  render() {
    const [value] = this.__value;
    const percent = this.__getPercentFromValue(value);

    return html`
      <div class="vaadin-slider-container">
        <div part="label" @click="${this.focus}">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true"></span>
        </div>

        <div id="controls" style="${styleMap({ '--value': percent })}">
          <div part="track">
            <div part="track-fill"></div>
          </div>
          <div part="thumb"></div>
          <slot name="input"></slot>
        </div>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>
    `;
  }

  constructor() {
    super();

    this.__value = [this.value];
    this.__inputId = `slider-${generateUniqueId()}`;
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    const input = this.querySelector('[slot="input"]');
    this._inputElement = input;
    this.ariaTarget = input;
  }

  /**
   * Override update to render slotted `<input type="range" />`
   * into light DOM after rendering shadow DOM.
   * @protected
   */
  update(props) {
    super.update(props);

    const [value] = this.__value;
    const { min, max, step } = this.__getConstraints();

    render(
      html`
        <input
          type="range"
          id="${this.__inputId}"
          slot="input"
          .min="${min}"
          .max="${max}"
          .value="${value}"
          .step="${step}"
          .disabled="${this.disabled}"
          tabindex="${this.disabled ? -1 : 0}"
          @keydown="${this.__onKeyDown}"
          @input="${this.__onInput}"
          @change="${this.__onChange}"
        />
      `,
      this,
      { host: this },
    );
  }

  /** @protected */
  updated(props) {
    super.updated(props);

    if (props.has('value') || props.has('min') || props.has('max') || props.has('step')) {
      this.__updateValue(this.value);
    }
  }

  /**
   * @param {FocusOptions=} options
   * @protected
   * @override
   */
  focus(options) {
    if (this.disabled) {
      return;
    }

    if (this._inputElement) {
      this._inputElement.focus();
    }

    super.focus(options);
  }

  /**
   * @protected
   * @override
   */
  blur() {
    if (this._inputElement) {
      this._inputElement.blur();
    }
  }

  /**
   * @private
   * @override
   */
  __commitValue() {
    this.value = this.__value[0];
  }

  /** @private */
  __onInput(event) {
    this.__updateValue(event.target.value, 0);
    this.__commitValue();
  }

  /** @private */
  __onKeyDown(event) {
    const arrowKeys = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'];
    if (this.readonly && arrowKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}

defineCustomElement(Slider);

export { Slider };
