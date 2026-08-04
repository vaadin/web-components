/**
 * @license
 * Copyright (c) 2015 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isElementFocusable } from '@vaadin/a11y-base/src/focus-utils.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';

export const ComboBoxOverlayMixin = (superClass) =>
  class ComboBoxOverlayMixin extends PositionMixin(superClass) {
    constructor() {
      super();

      this.requiredVerticalSpace = 200;
    }

    /** @protected */
    willUpdate(props) {
      super.willUpdate(props);

      // Update width here so that `PositionMixin` uses correct width in `updated()`.
      if ((props.has('opened') || props.has('positionTarget')) && this.opened && this.positionTarget) {
        this._updateOverlayWidth();
      }
    }

    /**
     * Override method inherited from `Overlay`
     * to not close on position target click.
     *
     * @param {Event} event
     * @return {boolean}
     * @protected
     */
    _shouldCloseOnOutsideClick(event) {
      const eventPath = event.composedPath();
      return !eventPath.includes(this.positionTarget) && !eventPath.includes(this);
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

    /** @protected */
    _updateOverlayWidth() {
      this.style.setProperty(`--_${this.localName}-default-width`, `${this.positionTarget.offsetWidth}px`);
    }
  };
