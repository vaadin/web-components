/**
 * @license
 * Copyright (c) 2022 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { TooltipMixin } from './vaadin-tooltip-mixin.js';

export { TooltipPosition } from './vaadin-tooltip-mixin.js';

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
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class Tooltip extends TooltipMixin(ThemePropertyMixin(ControllerMixin(ElementMixin(HTMLElement)))) {
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
  static setDefaultHoverDelay(hoverDelay: number): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-tooltip': Tooltip;
  }
}

export { Tooltip };
