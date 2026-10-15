/**
 * @license
 * Copyright (c) 2024 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Popover } from './vaadin-popover.js';

/**
 * Controller that routes Tab and Shift+Tab when a non-modal popover is opened.
 * The controller's host element is the popover itself.
 *
 * The popover is reachable via Tab only from its target, and its content comes
 * logically right after the target — regardless of the popover's DOM position.
 * When the popover lives inside a focus trap (e.g. a dialog), the controller
 * cooperates with the active `FocusTrapController` so the trap never lands
 * focus on the popover itself.
 *
 * Modal popovers rely on the overlay's own focus trap; this controller bails
 * out early in that case.
 */
export class PopoverFocusController {
  host: Popover;

  constructor(host: Popover);

  /**
   * Starts listening for Tab keystrokes. Called when the popover opens.
   */
  activate(): void;

  /**
   * Stops listening for Tab keystrokes. Called when the popover closes.
   */
  deactivate(): void;
}
