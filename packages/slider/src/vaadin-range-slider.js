/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement, render } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { isElementFocused } from '@vaadin/a11y-base/src/focus-utils.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
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
class RangeSlider extends SliderMixin(
  FocusMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))),
) {
  static get is() {
    return 'vaadin-range-slider';
  }

  static get styles() {
    return [
      sliderStyles,
      css`
        :host([focus-ring][start-focused]) [part~='thumb-start'],
        :host([focus-ring][end-focused]) [part~='thumb-end'] {
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
        type: Array,
        value: () => [0, 100],
        notify: true,
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
      <div part="track">
        <div
          part="track-fill"
          style="${styleMap({
            insetInlineStart: `${startPercent}%`,
            insetInlineEnd: `${100 - endPercent}%`,
          })}"
        ></div>
      </div>
      <div part="thumb thumb-start" style="${styleMap({ insetInlineStart: `${startPercent}%` })}"></div>
      <div part="thumb thumb-end" style="${styleMap({ insetInlineStart: `${endPercent}%` })}"></div>
      <slot name="input"></slot>
    `;
  }

  constructor() {
    super();

    this.__value = [...this.value];
    this.__inputId0 = `slider-${generateUniqueId()}`;
    this.__inputId1 = `slider-${generateUniqueId()}`;
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    const inputs = this.querySelectorAll('[slot="input"]');
    this._inputElements = [...inputs];
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
          .min="${min}"
          .max="${max}"
          .step="${step}"
          .value="${startValue}"
          tabindex="0"
          @keydown="${this.__onKeyDown}"
          @input="${this.__onInput}"
          @change="${this.__onChange}"
        />
        <input
          type="range"
          id="${this.__inputId1}"
          slot="input"
          .min="${min}"
          .max="${max}"
          .step="${step}"
          .value="${endValue}"
          tabindex="0"
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

    if (props.has('value') || props.has('min') || props.has('max')) {
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
    if (this._inputElements) {
      this._inputElements[0].focus();
    }

    super.focus(options);
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

    this.toggleAttribute('start-focused', isElementFocused(this._inputElements[0]));
    this.toggleAttribute('end-focused', isElementFocused(this._inputElements[1]));
  }

  /**
   * @param {PointerEvent} event
   * @private
   */
  __focusInput(event) {
    const index = this.__getThumbIndex(event);
    this._inputElements[index].focus();
  }

  /** @private */
  __commitValue() {
    this.value = [...this.__value];
  }

  /**
   * @param {Event} event
   * @return {number}
   */
  __getThumbIndex(event) {
    if (event.type === 'input') {
      return this._inputElements.indexOf(event.target);
    }

    return this.__getClosestThumb(event);
  }

  /**
   * @param {PointerEvent} event
   * @return {number}
   * @private
   */
  __getClosestThumb(event) {
    let closestThumb;

    // If both thumbs are at the start, use the second thumb,
    // and if both are at tne end, use the first one instead.
    if (this.__value[0] === this.__value[1]) {
      const { min, max } = this.__getConstraints();
      if (this.__value[0] === min) {
        return 1;
      }

      if (this.__value[0] === max) {
        return 0;
      }
    }

    const percent = this.__getEventPercent(event);
    const value = this.__getValueFromPercent(percent);

    // First thumb position from the "end"
    const index = this.__value.findIndex((v) => value - v < 0);

    // Pick the first one
    if (index === 0) {
      closestThumb = index;
    } else if (index === -1) {
      // Pick the last one (position is past all the thumbs)
      closestThumb = this.__value.length - 1;
    } else {
      const lastStart = this.__value[index - 1];
      const firstEnd = this.__value[index];
      // Pick the first one from the "start" unless thumbs are stacked on top of each other
      if (Math.abs(lastStart - value) < Math.abs(firstEnd - value)) {
        closestThumb = index - 1;
      } else {
        // Pick the last one from the "end"
        closestThumb = index;
      }
    }

    return closestThumb;
  }

  /** @private */
  __onKeyDown(event) {
    const index = this._inputElements.indexOf(event.target);

    const prevKeys = ['ArrowLeft', 'ArrowDown'];
    const nextKeys = ['ArrowRight', 'ArrowUp'];

    // Suppress native `input` event if start and end thumbs point to the same value,
    // to prevent the case where slotted range inputs would end up in broken state.
    if (
      this.__value[0] === this.__value[1] &&
      ((index === 0 && nextKeys.includes(event.key)) || (index === 1 && prevKeys.includes(event.key)))
    ) {
      event.preventDefault();
    }
  }
}

defineCustomElement(RangeSlider);

export { RangeSlider };
