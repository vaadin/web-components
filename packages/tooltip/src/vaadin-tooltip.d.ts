/**
 * @license
 * Copyright (c) 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

export type TooltipPosition =
  | 'bottom-end'
  | 'bottom-start'
  | 'bottom'
  | 'end-bottom'
  | 'end-top'
  | 'end'
  | 'start-bottom'
  | 'start-top'
  | 'start'
  | 'top-end'
  | 'top-start'
  | 'top';

/**
 * `<vaadin-tooltip>` is a Web Component for creating tooltips.
 */
declare class Tooltip extends ThemePropertyMixin(ElementMixin(HTMLElement)) {
  /**
   * Sets the default delay to be used by all tooltip instances,
   * except for those that have delay configured using property.
   */
  static setDefaultDelay(delay: number): void;

  /**
   * Sets the default hide delay to be used by all tooltip instances,
   * except for those that have hide delay configured using property.
   */
  static setDefaultHideDelay(hideDelay: number): void;

  /**
   * Object with properties passed to `textGenerator`
   * function to be used for generating tooltip text.
   */
  context: Record<string, unknown>;

  /**
   * The delay in milliseconds before the tooltip
   * is opened on hover, when not in manual mode.
   * On focus, the tooltip is opened immediately.
   */
  delay: number;

  /**
   * The id of the element used as a tooltip trigger.
   * The element should be in the DOM by the time when
   * the attribute is set, otherwise a warning is shown.
   */
  for: string | undefined;

  /**
   * The delay in milliseconds before the tooltip
   * is closed on losing hover, when not in manual mode.
   * On blur, the tooltip is closed immediately.
   * @attr {number} hide-delay
   */
  hideDelay: number;

  /**
   * When true, the tooltip is controlled programmatically
   * instead of reacting to focus and mouse events.
   */
  manual: boolean;

  /**
   * When true, the tooltip is opened programmatically.
   * Only works if `manual` is set to `true`.
   */
  opened: boolean;

  /**
   * Position of the tooltip with respect to its target.
   * Supported values: `top-start`, `top`, `top-end`,
   * `bottom-start`, `bottom`, `bottom-end`, `start-top`,
   * `start`, `start-bottom`, `end-top`, `end`, `end-bottom`.
   */
  position: TooltipPosition;

  /**
   * Reference to the element used as a tooltip trigger.
   * The target must be placed in the same shadow scope.
   * Defaults to an element referenced with `for`.
   */
  target: HTMLElement | undefined;

  /**
   * String used as a tooltip content.
   */
  text: string | null | undefined;

  /**
   * Function used to generate the tooltip content.
   * When provided, it overrides the `text` property.
   * Use the `context` property to provide argument
   * that can be passed to the generator function.
   */
  textGenerator: (context: Record<string, unknown>) => string;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-tooltip': Tooltip;
  }
}

export { Tooltip };
