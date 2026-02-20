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
  constructor() {
    /** @private */
    this._hasLastPosition = false;
    /** @private */
    this._lastX = 0;
    /** @private */
    this._lastY = 0;
    /** @private */
    this._invalidCount = 0;
    /** @private */
    this._active = false;
    /** @private */
    this._lastMoveTime = 0;
    /** @private */
    this._submenuElement = null;
    /** @private */
    this._parentItemElement = null;
    /** @private */
    this._pendingSwitch = null;
    /** @private */
    this._pendingTimeout = null;
    /** @private */
    this._boundOnPointerMove = this._onPointerMove.bind(this);
  }

  /**
   * Activate the safe triangle tracking for the given submenu overlay.
   * Should be called when a submenu opens.
   *
   * @param {HTMLElement} submenuOverlay - The submenu overlay element
   * @param {HTMLElement} parentItem - The parent menu item that triggered the submenu
   */
  activate(submenuOverlay, parentItem) {
    this._submenuElement = submenuOverlay;
    this._parentItemElement = parentItem;
    this._invalidCount = 0;
    this._lastMoveTime = 0;
    this._hasLastPosition = false;
    this._lastX = 0;
    this._lastY = 0;

    if (!this._active) {
      this._active = true;
      document.addEventListener('pointermove', this._boundOnPointerMove);
    }
  }

  /**
   * Deactivate the safe triangle tracking.
   * Should be called when a submenu closes.
   */
  deactivate() {
    if (this._active) {
      this._active = false;
      document.removeEventListener('pointermove', this._boundOnPointerMove);
    }
    this._submenuElement = null;
    this._parentItemElement = null;
    this._invalidCount = 0;
    this._cancelPendingSwitch();
  }

  /**
   * Check whether the submenu should be kept open based on pointer movement.
   * Returns true if the user appears to be aiming at the submenu.
   *
   * @return {boolean}
   */
  shouldKeepOpen() {
    if (!this._active || !this._submenuElement) {
      return false;
    }
    // Only block switches if we've actually tracked pointer movement.
    // Without movement data, we can't determine intent.
    if (this._lastMoveTime === 0) {
      return false;
    }
    return this._invalidCount < INVALID_THRESHOLD;
  }

  /**
   * Schedule a deferred submenu switch. If the user moves outside the safe
   * triangle before the callback fires, the callback will execute.
   *
   * @param {Function} callback - The function to call when the switch should happen
   */
  scheduleSwitch(callback) {
    this._cancelPendingSwitch();
    this._pendingSwitch = callback;
    // Fallback: if the user stops moving entirely, execute the switch
    // after a timeout so the submenu doesn't stay stuck indefinitely.
    this._pendingTimeout = setTimeout(() => {
      this._executePendingSwitch();
    }, FALLBACK_TIMEOUT_MS);
  }

  /** @private */
  _cancelPendingSwitch() {
    this._pendingSwitch = null;
    if (this._pendingTimeout) {
      clearTimeout(this._pendingTimeout);
      this._pendingTimeout = null;
    }
  }

  /** @private */
  _executePendingSwitch() {
    const callback = this._pendingSwitch;
    this._pendingSwitch = null;
    this._pendingTimeout = null;
    if (callback) {
      callback();
    }
  }

  /** @private */
  _onPointerMove(event) {
    // Only handle mouse pointer, not touch or pen
    if (event.pointerType === 'touch' || event.pointerType === 'pen') {
      return;
    }

    const now = performance.now();
    if (now - this._lastMoveTime < THROTTLE_MS) {
      return;
    }
    this._lastMoveTime = now;

    const x = event.clientX;
    const y = event.clientY;

    if (!this._hasLastPosition) {
      this._hasLastPosition = true;
      this._lastX = x;
      this._lastY = y;
      return;
    }

    if (!this._submenuElement) {
      this._lastX = x;
      this._lastY = y;
      return;
    }

    const submenuRect = this._submenuElement.$.overlay.getBoundingClientRect();

    // Skip if submenu is not visible
    if (submenuRect.width === 0 || submenuRect.height === 0) {
      this._lastX = x;
      this._lastY = y;
      return;
    }

    // Determine submenu direction from actual position, not RTL flag
    const parentRect = this._parentItemElement.getBoundingClientRect();
    const submenuIsRight = submenuRect.left >= parentRect.left;

    const dx = x - this._lastX;

    // Early exit: moving horizontally away from the submenu
    if ((submenuIsRight && dx < -1) || (!submenuIsRight && dx > 1)) {
      this._invalidCount += 1;
    } else {
      // Compute the near edge corners of the submenu
      const nearX = submenuIsRight ? submenuRect.left : submenuRect.right;
      const topY = submenuRect.top;
      const bottomY = submenuRect.bottom;

      // Angle from previous cursor position to the two submenu corners
      const thetaTop = Math.atan2(topY - this._lastY, nearX - this._lastX);
      const thetaBottom = Math.atan2(bottomY - this._lastY, nearX - this._lastX);

      // Angle of cursor movement vector
      const dy = y - this._lastY;
      const thetaPointer = Math.atan2(dy, dx);

      // Determine the angular bounds (top and bottom may swap depending on direction)
      const minAngle = Math.min(thetaTop, thetaBottom);
      const maxAngle = Math.max(thetaTop, thetaBottom);

      if (thetaPointer >= minAngle - TOLERANCE_RAD && thetaPointer <= maxAngle + TOLERANCE_RAD) {
        // Cursor is aimed at the submenu
        this._invalidCount = 0;
      } else {
        this._invalidCount += 1;
      }
    }

    this._lastX = x;
    this._lastY = y;

    // If the user has moved outside the safe triangle enough times, execute pending switch
    if (this._invalidCount >= INVALID_THRESHOLD && this._pendingSwitch) {
      this._executePendingSwitch();
    }
  }
}
