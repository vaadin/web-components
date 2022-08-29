/**
 * @license
 * Copyright (c) 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller that manages the slotted tooltip element.
 */
export class TooltipController extends SlotController {
  /**
   * Object with properties passed to `textGenerator`
   * function to be used for generating tooltip text.
   */
  context: Record<string, unknown>;

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
   * An HTML element to attach the tooltip to.
   */
  target: HTMLElement;

  /**
   * Set a context object to be used by text generator.
   */
  setContext(context: Record<string, unknown>): void;

  /**
   * Toggle manual state on the slotted tooltip.
   */
  setManual(manual: boolean): void;

  /**
   * Toggle opened state on the slotted tooltip.
   */
  setOpened(opened: boolean): void;

  /**
   * Set an HTML element to attach the tooltip to.
   */
  setTarget(target: HTMLElement): void;
}
