/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller that manages the slotted tooltip element.
 */
export class HelperController extends SlotController {
  /**
   * The delay in milliseconds before the tooltip
   * is closed, when not using manual mode.
   */
  cooldown: number | null | undefined;

  /**
   * The delay in milliseconds before the tooltip
   * is opened, when not using manual mode.
   */
  delay: number | null | undefined;

  /**
   * When true, the tooltip is controlled manually
   * instead of reacting to focus and mouse events.
   */
  manual: boolean;

  /**
   * When true, the tooltip is opened programmatically.
   * Only works if `manual` is set to `true`.
   */
  opened: boolean;

  /**
   * An HTML element to attach the tooltip to.
   */
  target: HTMLElement;

  /**
   * String used for the helper text.
   */
  tooltipText: string | undefined;

  /**
   * Set the delay in milliseconds before the tooltip
   * is closed, when not using manual mode.
   */
  setCooldown(cooldown: number | null | undefined): void;

  /**
   * Set the delay in milliseconds before the tooltip
   * is opened, when not using manual mode.
   */
  setDelay(delay: number | null | undefined): void;

  /**
   * Toggle opened state for the tooltip.
   */
  setOpened(opened: boolean): void;

  /**
   * Toggle manual mode for the tooltip.
   */
  setManual(manual: boolean): void;

  /**
   * Set an HTML element to attach the tooltip to.
   */
  setTarget(target: HTMLElement): void;

  /**
   * Set tooltip text based on corresponding host property.
   */
  setTooltipText(tooltipText: string): void;
}
