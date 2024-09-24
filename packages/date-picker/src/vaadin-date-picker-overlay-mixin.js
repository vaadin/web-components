/**
 * @license
 * Copyright (c) 2015 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isElementFocusable } from '@vaadin/a11y-base/src/focus-utils.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';

/**
 * @polymerMixin
 * @mixes OverlayMixin
 * @mixes PositionMixin
 */
export const DatePickerOverlayMixin = (superClass) =>
  class DatePickerOverlayMixin extends PositionMixin(OverlayMixin(superClass)) {
    /**
     * Override method inherited from `OverlayMixin` to not close on input click.
     * Needed to ignore date-picker's own input in the mousedown listener below.
     *
     * @param {Event} event
     * @return {boolean}
     * @protected
     */
    _shouldCloseOnOutsideClick(event) {
      const eventPath = event.composedPath();
      return !eventPath.includes(this.positionTarget);
    }

    /**
     * @protected
     * @override
     */
    _mouseDownListener(event) {
      super._mouseDownListener(event);

      // Prevent global mousedown event to avoid losing focus on outside click,
      // unless the clicked element is also focusable (e.g. in date-time-picker).
      if (this._shouldCloseOnOutsideClick(event) && !isElementFocusable(event.composedPath()[0])) {
        event.preventDefault();
      }
    }
  };
