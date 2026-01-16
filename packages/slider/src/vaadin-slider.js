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
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes FocusMixin
 * @mixes SliderMixin
 * @mixes ThemableMixin
 */
class Slider extends SliderMixin(
  FocusMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))),
) {
  static get is() {
    return 'vaadin-slider';
  }

  static get styles() {
    return [
      sliderStyles,
      css`
        :host([focus-ring]) [part='thumb'] {
          outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
          outline-offset: 1px;
        }
      `,
    ];
  }

  static get experimental() {
    return 'sliderComponent';
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
      <div part="track">
        <div
          part="track-fill"
          style="${styleMap({
            insetInlineStart: 0,
            insetInlineEnd: `${100 - percent}%`,
          })}"
        ></div>
      </div>
      <div part="thumb" style="${styleMap({ insetInlineStart: `${percent}%` })}"></div>
      <slot name="input"></slot>
    `;
  }

  constructor() {
    super();

    this.__value = [this.value];
    this.__inputId = `slider-${generateUniqueId()}`;

    this.addEventListener('mousedown', (e) => this._onMouseDown(e));
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    const input = this.querySelector('[slot="input"]');
    this._inputElement = input;
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
          tabindex="0"
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

    if (props.has('value') || props.has('min') || props.has('max')) {
      this.__updateValue(this.value);
    }
  }

  /**
   * @param {FocusOptions=} options
   * @protected
   * @override
   */
  focus(options) {
    if (this._inputElement) {
      this._inputElement.focus();
    }

    super.focus(options);
  }

  /**
   * @private
   * @override
   */
  __commitValue() {
    this.value = this.__value[0];
  }

  /**
   * @param {PointerEvent} event
   * @protected
   */
  _onMouseDown(event) {
    // Prevent blur if already focused
    event.preventDefault();

    // Focus the input to allow modifying value using keyboard
    this.focus({ focusVisible: false });
  }
}

defineCustomElement(Slider);

export { Slider };
