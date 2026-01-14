/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
<<<<<<< HEAD
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
=======
import { css, html, LitElement, render } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { isElementFocused } from '@vaadin/a11y-base/src/focus-utils.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
>>>>>>> 6f4d3953a7 (--wip-- [skip ci])
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
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
<<<<<<< HEAD
 * @mixes SliderMixin
 * @mixes ThemableMixin
 */
class RangeSlider extends SliderMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
=======
 * @mixes FocusMixin
 * @mixes SliderMixin
 * @mixes ThemableMixin
 */
class RangeSlider extends SliderMixin(
  FocusMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))),
) {
>>>>>>> 6f4d3953a7 (--wip-- [skip ci])
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

  static get properties() {
    return {
      /**
       * The value of the slider.
       */
      value: {
        type: Array,
        value: () => [],
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

    this.__value = [0, 0];
    this.__inputId1 = `slider-${generateUniqueId()}`;
    this.__inputId2 = `slider-${generateUniqueId()}`;

    this.addEventListener('mousedown', (e) => this._onMouseDown(e));
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
    const { min, max } = this._getConstraints();

    render(
      html`
        <input
          type="range"
          id="${this.__inputId1}"
          slot="input"
          .min="${min}"
          .max="${max}"
          .value="${startValue}"
          tabindex="0"
          @input="${this.__onInput}"
          @change="${this.__onChange}"
        />
        <input
          type="range"
          id="${this.__inputId2}"
          slot="input"
          .min="${min}"
          .max="${max}"
          .value="${endValue}"
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
      const value = Array.isArray(this.value) ? this.value : [];
      value.forEach((value, idx) => {
        this._updateValue(value, idx);
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
      this._inputElements[this.__thumbIndex].focus();
    }

    super.focus(options);
  }

  /**
   * @protected
   * @override
   */
  _setFocused(focused) {
    super._setFocused(focused);

    if (focused) {
      const thumbIndex = this._inputElements.findIndex((input) => isElementFocused(input));
      if (thumbIndex === 0) {
        this.setAttribute('start-focused', '');
      } else {
        this.setAttribute('end-focused', '');
      }
    } else {
      this.removeAttribute('start-focused');
      this.removeAttribute('end-focused');
    }
  }

  /**
   * @param {PointerEvent} event
   * @protected
   * @override
   */
  _handlePointerDown(event) {
    const target = event.composedPath()[0];
    // Update value on track click
    if (target.getAttribute('part') !== 'thumb') {
      this.__thumbIndex = this.__getClosestThumb(event);
      this.__applyValue(event);
    } else {
      // Store index of the active thumb
      const thumbs = this.shadowRoot.querySelectorAll('[part="thumb"]');
      this.__thumbIndex = [...thumbs].indexOf(target);
    }
  }

  /**
   * @param {PointerEvent} event
   * @protected
   */
  _onMouseDown(event) {
    // Prevent native behavior as we handle focus manually
    event.preventDefault();

    // Focus the input to allow modifying value using keyboard
    this.focus({ focusVisible: false });
  }

  /**
   * @protected
   * @override
   */
  _commitValue() {
    this.value = [...this.__value];
  }

  /**
   * @param {PointerEvent} event
   * @return {number}
   * @private
   */
  __getClosestThumb(event) {
    let closestThumb;

    const percent = this._getEventPercent(event);
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
  __onInput(event) {
    this.__thumbIndex = this._inputElements.indexOf(event.target);
    this._updateValue(event.target.value);
    this._commitValue();
    this._detectAndDispatchChange();
  }

  /** @private */
  __onChange(event) {
    event.stopPropagation();
  }
}

defineCustomElement(RangeSlider);

export { RangeSlider };
