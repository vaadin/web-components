/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { StepperMixin } from './vaadin-stepper-mixin.js';

/**
 * `<vaadin-stepper>` is a web component for displaying a step-by-step workflow.
 *
 * ```html
 * <vaadin-stepper>Example</vaadin-stepper>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `label`   | The label element
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `disabled`   | Set when the element is disabled
 * `focused`    | Set when the element is focused
 * `focus-ring` | Set when the element is keyboard focused
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class Stepper extends StepperMixin(ElementMixin(ThemableMixin(HTMLElement))) {
  addEventListener<K extends keyof StepperEventMap>(
    type: K,
    listener: (this: Stepper, ev: StepperEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof StepperEventMap>(
    type: K,
    listener: (this: Stepper, ev: StepperEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

/**
 * Interface for event map (for TypeScript users).
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StepperEventMap {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-stepper': Stepper;
  }
}

export { Stepper };
