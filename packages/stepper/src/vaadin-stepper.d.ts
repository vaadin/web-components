/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';

export type StepperOrientation = 'horizontal' | 'vertical';

export interface StepperI18n {
  completed?: string;
  invalid?: string;
}

/**
 * `<vaadin-stepper>` is a Web Component that shows the user's progress
 * through a linear, multi-step process such as a checkout or a wizard.
 *
 * ```html
 * <vaadin-stepper>
 *   <vaadin-step completed path="/checkout/cart">Shopping cart</vaadin-step>
 *   <vaadin-step current>Shipping & billing</vaadin-step>
 *   <vaadin-step>Payment method</vaadin-step>
 *   <vaadin-step>Confirmation</vaadin-step>
 * </vaadin-stepper>
 * ```
 *
 * The stepper numbers its visible steps automatically. The application
 * marks steps as `current`, `completed` or `invalid`.
 *
 * ### Styling
 *
 * The following state attributes are available for styling:
 *
 * Attribute     | Description
 * --------------|------------
 * `orientation` | The orientation of the stepper, `horizontal` or `vertical`.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                          |
 * :--------------------------------------------|
 * | `--vaadin-stepper-accent-color`            |
 * | `--vaadin-stepper-accent-contrast-color`   |
 * | `--vaadin-stepper-completed-icon`          |
 * | `--vaadin-stepper-connector-color`         |
 * | `--vaadin-stepper-connector-width`         |
 * | `--vaadin-stepper-error-color`             |
 * | `--vaadin-stepper-error-contrast-color`    |
 * | `--vaadin-stepper-font-size`               |
 * | `--vaadin-stepper-gap`                     |
 * | `--vaadin-stepper-indicator-background`    |
 * | `--vaadin-stepper-indicator-border-color`  |
 * | `--vaadin-stepper-indicator-border-radius` |
 * | `--vaadin-stepper-indicator-font-size`     |
 * | `--vaadin-stepper-indicator-size`          |
 * | `--vaadin-stepper-invalid-icon`            |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class Stepper extends ElementMixin(I18nMixin<typeof HTMLElement, StepperI18n>(HTMLElement)) {
  /**
   * The orientation of the stepper, `horizontal` (default) or `vertical`.
   */
  orientation: StepperOrientation;

  /**
   * The object used to localize this component. To change the default
   * localization, set this to an object that provides all properties, or
   * just the individual properties you want to change.
   *
   * The object has the following JSON structure and default values:
   *
   * ```
   * {
   *   // Text announced to assistive technology for completed steps.
   *   completed: 'Completed',
   *
   *   // Text announced to assistive technology for invalid steps.
   *   invalid: 'Error'
   * }
   * ```
   */
  i18n: StepperI18n;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-stepper': Stepper;
  }
}

export { Stepper };
