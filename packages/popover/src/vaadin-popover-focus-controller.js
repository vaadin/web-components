/**
 * @license
 * Copyright (c) 2024 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { getActiveTrappingNode } from '@vaadin/a11y-base/src/focus-trap-controller.js';
import { getDeepActiveElement, getFocusableElements, isElementFocused } from '@vaadin/a11y-base/src/focus-utils.js';

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
  constructor(host) {
    this.host = host;
    this.__onKeyDown = this.__onKeyDown.bind(this);
  }

  activate() {
    document.addEventListener('keydown', this.__onKeyDown, true);
  }

  deactivate() {
    document.removeEventListener('keydown', this.__onKeyDown, true);
  }

  /** @private */
  __handleTab(event) {
    const host = this.host;
    const targetFocusable = this.__getTargetFocusable();

    if (targetFocusable && isElementFocused(targetFocusable)) {
      event.preventDefault();
      host.focus();
      return;
    }

    const lastPopoverFocusable = this.__getLastPopoverFocusable();
    if (isElementFocused(lastPopoverFocusable)) {
      this.__moveLogicalNext(event, host);
      return;
    }

    // Native Tab would land on the popover when DOM order places it right
    // after the current element. Skip past it via the logical list.
    const activeElement = getDeepActiveElement();
    const scopeFocusables = this.__getScopeFocusables();
    const activeIdx = scopeFocusables.indexOf(activeElement);
    if (activeIdx >= 0 && scopeFocusables[activeIdx + 1] === host) {
      this.__moveLogicalNext(event, activeElement, scopeFocusables);
    }
  }

  /** @private */
  __handleShiftTab(event) {
    const host = this.host;
    const targetFocusable = this.__getTargetFocusable();

    // Clear the flag so native Shift+Tab from the target doesn't reopen. Fall
    // through to the redirect logic: when the popover is DOM-prev of the target,
    // case 5 steers focus away from it instead of letting the browser land on
    // the popover host or its content.
    if (targetFocusable && isElementFocused(targetFocusable) && host.__shouldRestoreFocus) {
      host.__shouldRestoreFocus = false;
    }

    if (isElementFocused(host)) {
      event.preventDefault();
      targetFocusable.focus();
      return;
    }

    // Browser handles Shift+Tab inside popover content.
    const activeElement = getDeepActiveElement();
    if (host.contains(activeElement)) {
      return;
    }

    const scopeFocusables = this.__getScopeFocusables();
    const logicalFocusables = this.__buildLogicalList(scopeFocusables);
    const activeLogicalIdx = logicalFocusables.indexOf(activeElement);
    const prevFocusable = activeLogicalIdx > 0 ? logicalFocusables[activeLogicalIdx - 1] : null;

    // When the logical previous is the popover, move focus into the popover tail.
    if (prevFocusable === host) {
      event.preventDefault();
      this.__getLastPopoverFocusable().focus();
      return;
    }

    // Native Shift+Tab would land on the popover: skip it and redirect to the
    // true logical previous, or wrap when at the logical start inside a trap.
    const activeScopeIdx = scopeFocusables.indexOf(activeElement);
    if (activeScopeIdx > 0 && scopeFocusables[activeScopeIdx - 1] === host) {
      if (prevFocusable) {
        event.preventDefault();
        prevFocusable.focus();
      } else if (getActiveTrappingNode(host)) {
        this.__wrapToLogicalLast(event, logicalFocusables);
      }
      return;
    }

    // At the logical start of a trap: wrap to the logical last. When the
    // popover is the logical last (target is last), this lands on the popover tail.
    if (!prevFocusable && getActiveTrappingNode(host)) {
      this.__wrapToLogicalLast(event, logicalFocusables);
    }
  }

  /** @private */
  __onKeyDown(event) {
    // Modal popovers rely on the overlay's focus trap.
    if (this.host.modal) {
      return;
    }
    if (event.key !== 'Tab') {
      return;
    }
    if (event.shiftKey) {
      this.__handleShiftTab(event);
    } else {
      this.__handleTab(event);
    }
  }

  /** @private */
  __getTargetFocusable() {
    const target = this.host.target;
    if (!target) {
      return null;
    }
    return target.focusElement || target;
  }

  /**
   * The popover's tail element: the last focusable inside the popover's content
   * area, or the popover itself when it has no focusable content.
   * @private
   */
  __getLastPopoverFocusable() {
    const lastContent = getFocusableElements(this.host._overlayElement.$.content).pop();
    return lastContent || this.host;
  }

  /**
   * DOM-ordered focusables in the current scope (active focus trap, or document
   * body), with popover light-DOM descendants excluded but the popover itself
   * retained. Used to detect DOM adjacency to the popover.
   * @private
   */
  __getScopeFocusables() {
    const host = this.host;
    const scope = getActiveTrappingNode(host) || document.body;
    return getFocusableElements(scope).filter((el) => el === host || !host.contains(el));
  }

  /**
   * Scope focusables in *logical* tab order: the popover is moved from its DOM
   * position to right after the target focusable. The popover is left out of
   * the list entirely when there is no target.
   * @private
   */
  __buildLogicalList(scopeFocusables = this.__getScopeFocusables()) {
    const host = this.host;
    const targetFocusable = this.__getTargetFocusable();
    const logicalFocusables = scopeFocusables.filter((el) => el !== host);

    if (targetFocusable && targetFocusable !== host) {
      const targetIdx = logicalFocusables.indexOf(targetFocusable);
      if (targetIdx >= 0) {
        logicalFocusables.splice(targetIdx + 1, 0, host);
      }
    }
    return logicalFocusables;
  }

  /** @private */
  __moveLogicalNext(event, from, scopeFocusables) {
    const host = this.host;
    const logicalFocusables = this.__buildLogicalList(scopeFocusables);
    const fromIdx = logicalFocusables.indexOf(from);
    if (fromIdx < 0) {
      return;
    }

    // The popover sits right after the target in the logical list, so it can
    // be the logical next only when `from` is the target. Skip it: the popover
    // is Tab-reachable only from its target (handled in __handleTab case 1).
    let nextIdx = fromIdx + 1;
    if (logicalFocusables[nextIdx] === host) {
      nextIdx += 1;
    }

    // Past the end inside a trap: wrap to the first element. The popover
    // never sits at position 0 (it only follows a target), so list[0] is real.
    let focusable = logicalFocusables[nextIdx];
    if (!focusable && getActiveTrappingNode(host)) {
      focusable = logicalFocusables[0];
    }

    if (focusable) {
      event.preventDefault();
      focusable.focus();
    }
  }

  /** @private */
  __wrapToLogicalLast(event, logicalFocusables) {
    const logicalLast = logicalFocusables.at(-1);
    if (!logicalLast) {
      return;
    }
    // When the popover is the logical last, land on the popover tail instead.
    const focusable = logicalLast === this.host ? this.__getLastPopoverFocusable() : logicalLast;
    event.preventDefault();
    focusable.focus();
  }
}
