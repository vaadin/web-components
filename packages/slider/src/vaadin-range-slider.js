/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
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
 * @mixes SliderMixin
 * @mixes ThemableMixin
 */
class RangeSlider extends SliderMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-range-slider';
  }

  static get styles() {
    return sliderStyles;
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
    const { min, max } = this._getConstraints();
    const startValue = this.__value[0] || 0;
    const endValue = this.__value[1] || 0;

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
      <div
        role="slider"
        tabindex="0"
        aria-valuemin="${min}"
        aria-valuemax="${max}"
        aria-valuenow="${startValue}"
        part="thumb"
        style="${styleMap({ insetInlineStart: `${startPercent}%` })}"
      ></div>
      <div
        role="slider"
        tabindex="0"
        aria-valuemin="${min}"
        aria-valuemax="${max}"
        aria-valuenow="${endValue}"
        part="thumb"
        style="${styleMap({ insetInlineStart: `${endPercent}%` })}"
      ></div>
    `;
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
}

defineCustomElement(RangeSlider);

export { RangeSlider };
