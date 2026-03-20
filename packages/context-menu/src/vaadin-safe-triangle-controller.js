/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const TOLERANCE_RAD = 15 * (Math.PI / 180);
const INVALID_THRESHOLD = 2;
const THROTTLE_MS = 16;
const FALLBACK_TIMEOUT_MS = 400;

/**
 * A controller that implements the "safe triangle" pattern for submenu navigation.
 *
 * When a submenu is open, moving the mouse diagonally from a parent item toward the
 * submenu can cause the cursor to pass over sibling items, which would normally close
 * the current submenu. This controller detects whether the cursor is aimed at the open
 * submenu using atan2 angle comparison, and prevents premature submenu switching.
 *
 * The approach is based on React Aria's pointer-friendly submenu implementation:
 * - Computes angles from cursor position to the near corners of the submenu
 * - If the cursor movement angle falls within the cone (with tolerance), the user
 *   is aiming at the submenu
 * - Requires multiple consecutive "miss" movements before allowing a switch
 *   (accommodates motor impairments and tremors)
 * - Only active for pointer/mouse input; ignored for touch and pen
 */
export class SafeTriangleController {
  #lastX = 0;

  #lastY = 0;

  #invalidCount = 0;

  #lastMoveTime = 0;

  #submenuElement = null;

  #parentItemElement = null;

  #pendingSwitch = null;

  #pendingTimeout = null;

  #parentContainer = null;

  #onPointerMove = (event) => {
    // Only handle mouse pointer, not touch or pen
    if (event.pointerType === 'touch' || event.pointerType === 'pen') {
      return;
    }

    if (event.timeStamp - this.#lastMoveTime < THROTTLE_MS) {
      return;
    }

    const x = event.clientX;
    const y = event.clientY;

    if (this.#lastMoveTime === 0) {
      this.#lastMoveTime = event.timeStamp;
      this.#lastX = x;
      this.#lastY = y;
      return;
    }
    this.#lastMoveTime = event.timeStamp;

    if (!this.#submenuElement) {
      this.#lastX = x;
      this.#lastY = y;
      return;
    }

    const submenuRect = this.#submenuElement.$.overlay.getBoundingClientRect();

    // Skip if submenu is not visible
    if (submenuRect.width === 0 || submenuRect.height === 0) {
      this.#lastX = x;
      this.#lastY = y;
      return;
    }

    // Determine submenu direction from actual position, not RTL flag
    const parentRect = this.#parentItemElement.getBoundingClientRect();
    const submenuIsRight = submenuRect.left >= parentRect.left;

    const dx = x - this.#lastX;

    // Early exit: moving horizontally away from the submenu
    if ((submenuIsRight && dx < -1) || (!submenuIsRight && dx > 1)) {
      this.#invalidCount += 1;
    } else {
      // Compute the near edge corners of the submenu
      const nearX = submenuIsRight ? submenuRect.left : submenuRect.right;
      const topY = submenuRect.top;
      const bottomY = submenuRect.bottom;

      // Angle from previous cursor position to the two submenu corners
      const thetaTop = Math.atan2(topY - this.#lastY, nearX - this.#lastX);
      const thetaBottom = Math.atan2(bottomY - this.#lastY, nearX - this.#lastX);

      // Angle of cursor movement vector
      const dy = y - this.#lastY;
      const thetaPointer = Math.atan2(dy, dx);

      // Determine the angular bounds (top and bottom may swap depending on direction)
      const minAngle = Math.min(thetaTop, thetaBottom);
      const maxAngle = Math.max(thetaTop, thetaBottom);

      if (thetaPointer >= minAngle - TOLERANCE_RAD && thetaPointer <= maxAngle + TOLERANCE_RAD) {
        // Cursor is aimed at the submenu
        this.#invalidCount = 0;
      } else {
        this.#invalidCount += 1;
      }
    }

    this.#lastX = x;
    this.#lastY = y;

    // If the user has moved outside the safe triangle enough times, execute pending switch
    if (this.#invalidCount >= INVALID_THRESHOLD && this.#pendingSwitch) {
      this.#executePendingSwitch();
    }
  };

  /**
   * Activate the safe triangle tracking for the given submenu overlay.
   * Should be called when a submenu opens.
   *
   * @param {HTMLElement} submenuOverlay - The submenu overlay element
   * @param {HTMLElement} parentItem - The parent menu item that triggered the submenu
   * @param {HTMLElement} [parentContainer] - Optional container element to set safe-triangle-active attribute on
   */
  activate(submenuOverlay, parentItem, parentContainer) {
    this.#cancelPendingSwitch();
    const wasActive = this.#submenuElement !== null;
    this.#submenuElement = submenuOverlay;
    this.#parentItemElement = parentItem;
    this.#invalidCount = 0;
    this.#lastMoveTime = 0;
    this.#lastX = 0;
    this.#lastY = 0;

    if (this.#parentContainer && this.#parentContainer !== parentContainer) {
      this.#parentContainer.removeAttribute('safe-triangle-active');
    }
    if (parentContainer) {
      this.#parentContainer = parentContainer;
      parentContainer.setAttribute('safe-triangle-active', '');
    }

    if (!wasActive) {
      document.addEventListener('pointermove', this.#onPointerMove);
    }
  }

  /**
   * Deactivate the safe triangle tracking.
   * Should be called when a submenu closes.
   */
  deactivate() {
    if (this.#parentContainer) {
      this.#parentContainer.removeAttribute('safe-triangle-active');
      this.#parentContainer = null;
    }
    if (this.#submenuElement) {
      document.removeEventListener('pointermove', this.#onPointerMove);
    }
    this.#submenuElement = null;
    this.#parentItemElement = null;
    this.#invalidCount = 0;
    this.#cancelPendingSwitch();
  }

  /**
   * Check whether the submenu should be kept open based on pointer movement.
   * Returns true if the user appears to be aiming at the submenu.
   *
   * @return {boolean}
   */
  shouldKeepOpen() {
    if (!this.#submenuElement) {
      return false;
    }
    // Only block switches if we've actually tracked pointer movement.
    // Without movement data, we can't determine intent.
    if (this.#lastMoveTime === 0) {
      return false;
    }
    return this.#invalidCount < INVALID_THRESHOLD;
  }

  /**
   * Schedule a deferred submenu switch. If the user moves outside the safe
   * triangle before the callback fires, the callback will execute.
   *
   * @param {Function} callback - The function to call when the switch should happen
   */
  scheduleSwitch(callback) {
    this.#cancelPendingSwitch();
    this.#pendingSwitch = callback;
    // Fallback: if the user stops moving entirely, execute the switch
    // after a timeout so the submenu doesn't stay stuck indefinitely.
    this.#pendingTimeout = setTimeout(() => {
      this.#executePendingSwitch();
    }, FALLBACK_TIMEOUT_MS);
  }

  #cancelPendingSwitch() {
    const callback = this.#pendingSwitch;
    this.#pendingSwitch = null;
    clearTimeout(this.#pendingTimeout);
    this.#pendingTimeout = null;
    return callback;
  }

  #executePendingSwitch() {
    const callback = this.#cancelPendingSwitch();
    if (callback) {
      callback();
    }
  }
}
