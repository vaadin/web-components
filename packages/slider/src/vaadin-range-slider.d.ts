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
export type RangeSliderChangeEvent = Event & {
  target: RangeSlider;
};

/**
 * Fired when the `value` property changes.
 */
export type RangeSliderValueChangedEvent = CustomEvent<{ value: number[] }>;

export interface RangeSliderCustomEventMap {
  'value-changed': RangeSliderValueChangedEvent;
}

export interface RangeSliderEventMap extends HTMLElementEventMap, RangeSliderCustomEventMap {
  change: RangeSliderChangeEvent;
}

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
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                      |
 * :----------------------------------------|
 * | `--vaadin-slider-fill-background`      |
 * | `--vaadin-slider-thumb-height`         |
 * | `--vaadin-slider-thumb-width`          |
 * | `--vaadin-slider-track-background`     |
 * | `--vaadin-slider-track-border-radius`  |
 * | `--vaadin-slider-track-height`         |
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
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class RangeSlider extends FieldMixin(SliderMixin(FocusMixin(ThemableMixin(ElementMixin(HTMLElement))))) {
  /**
   * The value of the slider.
   */
  value: number[];

  addEventListener<K extends keyof RangeSliderEventMap>(
    type: K,
    listener: (this: RangeSlider, ev: RangeSliderEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof RangeSliderEventMap>(
    type: K,
    listener: (this: RangeSlider, ev: RangeSliderEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-range-slider': RangeSlider;
  }
}

export { RangeSlider };
