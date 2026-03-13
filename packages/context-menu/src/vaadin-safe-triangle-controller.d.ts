/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A controller that implements the "safe triangle" pattern for submenu navigation.
 *
 * When a submenu is open, moving the mouse diagonally from a parent item toward the
 * submenu can cause the cursor to pass over sibling items, which would normally close
 * the current submenu. This controller detects whether the cursor is aimed at the open
 * submenu using atan2 angle comparison, and prevents premature submenu switching.
 */
export class SafeTriangleController {
  /**
   * Activate the safe triangle tracking for the given submenu overlay.
   * Should be called when a submenu opens.
   */
  activate(submenuOverlay: HTMLElement, parentItem: HTMLElement): void;

  /**
   * Deactivate the safe triangle tracking.
   * Should be called when a submenu closes.
   */
  deactivate(): void;

  /**
   * Check whether the submenu should be kept open based on pointer movement.
   * Returns true if the user appears to be aiming at the submenu.
   */
  shouldKeepOpen(): boolean;

  /**
   * Schedule a deferred submenu switch. If the user moves outside the safe
   * triangle before the callback fires, the callback will execute.
   */
  scheduleSwitch(callback: () => void): void;
}
