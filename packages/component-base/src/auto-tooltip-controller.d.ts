/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TooltipController } from './tooltip-controller.js';

export interface AutoTooltipControllerOptions {
  /**
   * Override how the auto tooltip text is read from the host.
   * Defaults to joining the textContent of the default slot's
   * assigned nodes and trimming the result.
   */
  getText?(host: HTMLElement): string;
}

/**
 * A controller that extends `TooltipController` to lazily create and
 * maintain an auto-generated `<vaadin-tooltip>` mirroring the host's
 * visible text. The auto tooltip is created with `ariaTarget = null`
 * to avoid adding `aria-describedby` to the host.
 */
export class AutoTooltipController extends TooltipController {
  constructor(host: HTMLElement, options?: AutoTooltipControllerOptions);

  /**
   * Toggle whether the auto tooltip should exist. Re-evaluates immediately.
   */
  setEnabled(enabled: boolean): void;
}
