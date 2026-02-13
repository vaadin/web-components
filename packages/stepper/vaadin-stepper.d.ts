/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export type StepperOrientation = 'horizontal' | 'vertical';

/**
 * `<vaadin-stepper>` is a Web Component for displaying a step-by-step process.
 *
 * ```html
 * <vaadin-stepper>
 *   <vaadin-step href="/step1">Step 1</vaadin-step>
 *   <vaadin-step href="/step2">Step 2</vaadin-step>
 *   <vaadin-step>Step 3</vaadin-step>
 * </vaadin-stepper>
 * ```
 */
declare class Stepper extends ElementMixin(ThemableMixin(HTMLElement)) {
  /**
   * The orientation of the stepper
   * @attr {string} orientation
   */
  orientation: StepperOrientation;

  /**
   * Sets the state of a specific step
   */
  setStepState(state: string, stepIndex: number): void;

  /**
   * Marks steps up to the specified index as completed
   */
  completeStepsUntil(untilIndex: number): void;

  /**
   * Gets the current active step
   */
  getActiveStep(): any | null;

  /**
   * Resets all steps to inactive state
   */
  reset(): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-stepper': Stepper;
  }
}

export { Stepper };
