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
 *
 * ```html
 * <button id="confirm">Confirm</button>
 * <vaadin-tooltip text="Click to save changes" for="confirm"></vaadin-tooltip>
 * ```
 *
 * ### Styling
 *
 * `<vaadin-tooltip>` uses `<vaadin-tooltip-overlay>` internal
 * themable component as the actual visible overlay.
 *
 * See [`<vaadin-overlay>`](#/elements/vaadin-overlay) documentation
 * for `<vaadin-tooltip-overlay>` parts.
 *
 * The following state attributes are available for styling:
 *
 * Attribute        | Description
 * -----------------|----------------------------------------
 * `position`       | Reflects the `position` property value.
 *
 * Note: the `theme` attribute value set on `<vaadin-tooltip>` is
 * propagated to the internal `<vaadin-tooltip-overlay>` component.
 *
 * ### Custom CSS Properties
 *
 * The following custom CSS properties are available on the `<vaadin-tooltip>` element:
 *
 * Custom CSS property              | Description
 * ---------------------------------|-------------
 * `--vaadin-tooltip-offset-top`    | Used as an offset when the tooltip is aligned vertically below the target
 * `--vaadin-tooltip-offset-bottom` | Used as an offset when the tooltip is aligned vertically above the target
 * `--vaadin-tooltip-offset-start`  | Used as an offset when the tooltip is aligned horizontally after the target
 * `--vaadin-tooltip-offset-end`    | Used as an offset when the tooltip is aligned horizontally before the target
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 */
declare class Tooltip extends ThemePropertyMixin(ElementMixin(HTMLElement)) {
  /**
   * Sets the default focus delay to be used by all tooltip instances,
   * except for those that have focus delay configured using property.
   */
  static setDefaultFocusDelay(focusDelay: number): void;

  /**
   * Sets the default hide delay to be used by all tooltip instances,
   * except for those that have hide delay configured using property.
   */
  static setDefaultHideDelay(hideDelay: number): void;

  /**
   * Sets the default hover delay to be used by all tooltip instances,
   * except for those that have hover delay configured using property.
   */
  static setDefaultHoverDelay(delay: number): void;

  /**
   * Object with properties passed to `generator` and
   * `shouldShow` functions for generating tooltip text
   * or detecting whether to show the tooltip or not.
   */
  context: Record<string, unknown>;

  /**
   * The delay in milliseconds before the tooltip
   * is opened on keyboard focus, when not in manual mode.
   * @attr {number} focus-delay
   */
  focusDelay: number;

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
   * The delay in milliseconds before the tooltip
   * is opened on hover, when not in manual mode.
   * @attr {number} hover-delay
   */
  hoverDelay: number;

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
   * Function used to detect whether to show the tooltip based on a condition,
   * called every time the tooltip is about to be shown on hover and focus.
   * The function takes two parameters: `target` and `context`, which contain
   * values of the corresponding tooltip properties at the time of calling.
   * The tooltip is only shown when the function invocation returns `true`.
   */
  shouldShow: (target: HTMLElement, context?: Record<string, unknown>) => boolean;

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
  generator: (context: Record<string, unknown>) => string;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-tooltip': Tooltip;
  }
}

export { Tooltip };
