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
 * Fired when the `invalid` property changes.
 */
export type SliderInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type SliderValueChangedEvent = CustomEvent<{ value: number }>;

/**
 * Fired whenever the slider is validated.
 */
export type SliderValidatedEvent = CustomEvent<{ valid: boolean }>;

export interface SliderCustomEventMap {
  'invalid-changed': SliderInvalidChangedEvent;

  'value-changed': SliderValueChangedEvent;

  validated: SliderValidatedEvent;
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
