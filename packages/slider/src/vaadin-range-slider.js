/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-slider-bubble.js';
import { css, html, LitElement, render } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { isElementFocused } from '@vaadin/a11y-base/src/focus-utils.js';
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
 * `<vaadin-range-slider>` is a web component that represents a range slider
 * for selecting a subset of the given range.
 *
 * ```html
 * <vaadin-range-slider min="0" max="100" step="1"></vaadin-range-slider>
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
 * `thumb`              | The slider thumb (applies to both thumbs)
 * `thumb-start`        | The start (lower value) thumb
 * `thumb-end`          | The end (upper value) thumb
 *
 * The following state attributes are available for styling:
 *
 * Attribute       | Description
 * ----------------|-------------
 * `disabled`      | Set when the slider is disabled
 * `readonly`      | Set when the slider is read-only
 * `focused`       | Set when the slider has focus
 * `focus-ring`    | Set when the slider is focused using the keyboard
 * `start-active`  | Set when the start thumb is activated with mouse or touch
 * `end-active`    | Set when the end thumb is activated with mouse or touch
 * `start-focused` | Set when the start thumb has focus
 * `end-focused`   | Set when the end thumb has focus
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
 * @fires {Event} input - Fired when the slider value changes during user interaction.
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
class RangeSlider extends FieldMixin(
  SliderMixin(FocusMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))))),
) {
  static get is() {
    return 'vaadin-range-slider';
  }

  static get styles() {
    return [
      field,
      sliderStyles,
      css`
        :host([focus-ring][start-focused]) [part~='thumb-start'],
        :host([focus-ring][end-focused]) [part~='thumb-end'] {
          outline: var(--vaadin-focus-ring-width) var(--_outline-style, solid) var(--vaadin-focus-ring-color);
          outline-offset: 1px;
        }

        #controls {
          grid-template-columns:
            [track-start]
            calc(var(--start-value) * var(--_track-width))
            [thumb1]
            0
            [fill-start]
            calc((var(--end-value) - var(--start-value)) * var(--_track-width))
            [fill-end thumb2]
            0
            calc((1 - var(--end-value)) * var(--_track-width))
            var(--_thumb-width)
            [track-end];
        }

        [part='track-fill'] {
          margin-inline-start: var(--_thumb-width);
        }

        [part~='thumb-end'] {
          grid-column: thumb2;
        }

        :host([readonly]) [part='track-fill'] {
          border-inline-start: none;
        }

        ::slotted(input:last-of-type) {
          clip-path: inset(
            0 0 0
              clamp(
                0%,
                var(--_thumb-width) / 2 + var(--start-value) * var(--_track-width) +
                  (var(--end-value) - var(--start-value)) * var(--_track-width) / 2,
                100%
              )
          );
        }

        :host([dir='rtl']) ::slotted(input:last-of-type) {
          clip-path: inset(
            0
              clamp(
                0%,
                var(--_thumb-width) / 2 + var(--start-value) * var(--_track-width) +
                  (var(--end-value) - var(--start-value)) * var(--_track-width) / 2,
                100%
              )
              0 0
          );
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
        type: Array,
        value: () => [0, 100],
        notify: true,
        sync: true,
      },

      /**
       * Custom accessible name for the start (minimum) input.
       * When not set, defaults to "${label} min" or "min" if no label.
       * @attr {string} accessible-name-start
       */
      accessibleNameStart: {
        type: String,
      },

      /**
       * Custom accessible name for the end (maximum) input.
       * When not set, defaults to "${label} max" or "max" if no label.
       * @attr {string} accessible-name-end
       */
      accessibleNameEnd: {
        type: String,
      },

      /** @private */
      __startActive: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        attribute: 'start-active',
        sync: true,
      },

      /** @private */
      __endActive: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        attribute: 'end-active',
        sync: true,
      },

      /** @private */
      __startFocused: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        attribute: 'start-focused',
        sync: true,
      },

      /** @private */
      __endFocused: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        attribute: 'end-focused',
        sync: true,
      },
    };
  }

  /** @protected */
  render() {
    const [startValue, endValue] = this.__value;

    const startPercent = this.__getPercentFromValue(startValue);
    const endPercent = this.__getPercentFromValue(endValue);

    return html`
      <div class="vaadin-slider-container">
        <div part="label" @click="${this.focus}">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true"></span>
        </div>

        <div id="controls" style="${styleMap({ '--start-value': startPercent, '--end-value': endPercent })}">
          <div part="track">
            <div part="track-fill"></div>
          </div>
          <div part="thumb thumb-start"></div>
          <div part="thumb thumb-end"></div>
          <slot name="input"></slot>
          <slot name="bubble"></slot>
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

    this.__value = [...this.value];
    this.__inputId0 = `slider-${generateUniqueId()}`;
    this.__inputId1 = `slider-${generateUniqueId()}`;

    this.__onPointerUp = this.__onPointerUp.bind(this);
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    const inputs = this.querySelectorAll('[slot="input"]');
    this._inputElements = [...inputs];
    this.ariaTarget = this;

    this.__thumbStartElement = this.shadowRoot.querySelector('[part~="thumb-start"]');
    this.__thumbEndElement = this.shadowRoot.querySelector('[part~="thumb-end"]');

    this.__bubbleElements = [...this.querySelectorAll('vaadin-slider-bubble')];
  }

  /** @private */
  __onPointerDown(event) {
    super.__onPointerDown(event);

    const index = this._inputElements.indexOf(event.composedPath()[0]);

    if (index !== -1) {
      this.toggleAttribute('start-active', index === 0);
      this.toggleAttribute('end-active', index === 1);
      window.addEventListener('pointerup', this.__onPointerUp);
      window.addEventListener('pointercancel', this.__onPointerUp);
    }
  }

  /** @private */
  __onPointerUp() {
    window.removeEventListener('pointerup', this.__onPointerUp);
    window.removeEventListener('pointercancel', this.__onPointerUp);
    this.removeAttribute('start-active');
    this.removeAttribute('end-active');
  }

  /**
   * Override update to render slotted `<input type="range" />`
   * into light DOM after rendering shadow DOM.
   * @protected
   */
  update(props) {
    super.update(props);

    const [startValue, endValue] = this.__value;
    const { min, max, step } = this.__getConstraints();

    render(
      html`
        <input
          type="range"
          id="${this.__inputId0}"
          slot="input"
          aria-label="${this.accessibleNameStart || this.__getAriaLabel('min')}"
          .min="${min}"
          .max="${max}"
          .step="${step}"
          .value="${startValue}"
          .disabled="${this.disabled}"
          tabindex="${this.disabled ? -1 : 0}"
          @keydown="${this.__onKeyDown}"
          @input="${this.__onStartInput}"
          @change="${this.__onChange}"
        />
        <input
          type="range"
          id="${this.__inputId1}"
          slot="input"
          aria-label="${this.accessibleNameEnd || this.__getAriaLabel('max')}"
          .min="${min}"
          .max="${max}"
          .step="${step}"
          .value="${endValue}"
          .disabled="${this.disabled}"
          tabindex="${this.disabled ? -1 : 0}"
          @keydown="${this.__onKeyDown}"
          @input="${this.__onEndInput}"
          @change="${this.__onChange}"
        />
        <vaadin-slider-bubble
          slot="bubble"
          .positionTarget="${this.__thumbStartElement}"
          .opened="${this.valueAlwaysVisible || this.__hoverInside || this.__startFocused}"
          theme="${ifDefined(this._theme)}"
          .active="${this.__startActive}"
        >
          ${startValue}
        </vaadin-slider-bubble>
        <vaadin-slider-bubble
          slot="bubble"
          .positionTarget="${this.__thumbEndElement}"
          .opened="${this.valueAlwaysVisible || this.__hoverInside || this.__endFocused}"
          theme="${ifDefined(this._theme)}"
          .active="${this.__endActive}"
        >
          ${endValue}
        </vaadin-slider-bubble>
      `,
      this,
      { host: this },
    );
  }

  /** @protected */
  updated(props) {
    super.updated(props);

    if (props.has('value') || props.has('min') || props.has('max') || props.has('step')) {
      const value = [...this.value];
      value.forEach((v, idx) => {
        this.__updateValue(v, idx, value);
      });
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

    if (this._inputElements) {
      this._inputElements[0].focus();
    }

    super.focus(options);
  }

  /**
   * @protected
   * @override
   */
  blur() {
    if (this._inputElements) {
      const focusedInput = this._inputElements.find((input) => isElementFocused(input));
      if (focusedInput) {
        focusedInput.blur();
      }
    }
  }

  /**
   * Override method inherited from `FocusMixin` to set
   * state attributes indicating which thumb has focus.
   *
   * @param {boolean} focused
   * @protected
   * @override
   */
  _setFocused(focused) {
    super._setFocused(focused);

    this.__startFocused = isElementFocused(this._inputElements[0]);
    this.__endFocused = isElementFocused(this._inputElements[1]);
  }

  /** @private */
  __getAriaLabel(suffix) {
    return this.label ? `${this.label} ${suffix}` : suffix;
  }

  /** @private */
  __commitValue() {
    this.value = [...this.__value];
  }

  /** @private */
  __onStartInput(event) {
    event.stopPropagation();

    // Use second input value as first input max limit
    if (parseFloat(event.target.value) > this.__value[1]) {
      event.target.value = this.__value[1];
    }

    const value = event.target.value;
    this.__updateValue(value, 0);
    this.__updateBubble(0);
    this.__dispatchInputEvent();
    this.__commitValue();
  }

  /** @private */
  __onEndInput(event) {
    event.stopPropagation();

    // Use first input value as second input min limit
    if (parseFloat(event.target.value) < this.__value[0]) {
      event.target.value = this.__value[0];
    }

    const value = event.target.value;
    this.__updateValue(value, 1);
    this.__updateBubble(1);
    this.__dispatchInputEvent();
    this.__commitValue();
  }

  /** @private */
  __onKeyDown(event) {
    const prevKeys = ['ArrowLeft', 'ArrowDown'];
    const nextKeys = ['ArrowRight', 'ArrowUp'];

    const isNextKey = nextKeys.includes(event.key);
    const isPrevKey = prevKeys.includes(event.key);

    if (!isNextKey && !isPrevKey) {
      return;
    }

    const index = this._inputElements.indexOf(event.target);

    // Suppress native `input` event if start and end thumbs point to the same value,
    // to prevent the case where slotted range inputs would end up in broken state.
    if (
      this.readonly ||
      (this.__value[0] === this.__value[1] && ((index === 0 && isNextKey) || (index === 1 && isPrevKey)))
    ) {
      event.preventDefault();
    }
  }

  /** @private */
  __updateBubble(idx) {
    this.__bubbleElements[idx].$.overlay._updatePosition();
  }
}

defineCustomElement(RangeSlider);

export { RangeSlider };
