/**
 * @license
 * Copyright (c) 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from './slot-controller.js';

type TooltipPosition =
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
   * Position of the tooltip with respect to its target.
   */
  position: TooltipPosition;

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
   * Set position on the slotted tooltip.
   */
  setPosition(position: TooltipPosition): void;

  /**
   * Set an HTML element to attach the tooltip to.
   */
  setTarget(target: HTMLElement): void;
}
