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
    `;
  }

  constructor() {
    super();

    this.__value = [...this.value];
  }

  /** @protected */
  updated(props) {
    super.updated(props);

    if (props.has('value') || props.has('min') || props.has('max')) {
      const value = Array.isArray(this.value) ? this.value : [];
      value.forEach((value, idx) => {
        this.__updateValue(value, idx);
      });
    }
  }
}

defineCustomElement(RangeSlider);

export { RangeSlider };
