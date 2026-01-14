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
 * `<vaadin-slider>` is a web component that represents a range slider
 * for selecting numerical values within a defined range.
 *
 * ```html
 * <vaadin-slider min="0" max="100" step="1"></vaadin-slider>
 * ```
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes SliderMixin
 * @mixes ThemableMixin
 */
class Slider extends SliderMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-slider';
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
    `;
  }

  constructor() {
    super();

    this.__value = [this.value];
  }

  /** @protected */
  updated(props) {
    super.updated(props);

    if (props.has('value') || props.has('min') || props.has('max')) {
      this.__updateValue(this.value);
    }
  }
}

defineCustomElement(Slider);

export { Slider };
