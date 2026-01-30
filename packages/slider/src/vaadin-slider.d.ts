/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { FieldMixin } from '@vaadin/field-base/src/field-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { SliderMixin } from './vaadin-slider-mixin.js';

/**
 * Fired when the user commits a value change.
 */
export type SliderChangeEvent = Event & {
  target: Slider;
};

/**
 * Fired when the slider value changes during user interaction.
 */
export type SliderInputEvent = Event & {
  target: Slider;
};

/**
 * Fired when the `value` property changes.
 */
export type SliderValueChangedEvent = CustomEvent<{ value: number }>;

export interface SliderCustomEventMap {
  'value-changed': SliderValueChangedEvent;
}

export interface SliderEventMap extends HTMLElementEventMap, SliderCustomEventMap {
  change: SliderChangeEvent;
  input: SliderInputEvent;
}

/**
 * `<vaadin-slider>` is a web component that represents a range slider
 * for selecting numerical values within a defined range.
 *
 * ```html
 * <vaadin-slider min="0" max="100" step="1"></vaadin-slider>
 * ```
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {Event} input - Fired when the slider value changes during user interaction.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class Slider extends FieldMixin(SliderMixin(FocusMixin(ThemableMixin(ElementMixin(HTMLElement))))) {
  /**
   * The value of the slider.
   */
  value: number;

  addEventListener<K extends keyof SliderEventMap>(
    type: K,
    listener: (this: Slider, ev: SliderEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof SliderEventMap>(
    type: K,
    listener: (this: Slider, ev: SliderEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-slider': Slider;
  }
}

export { Slider };
