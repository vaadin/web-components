/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isElementFocusable } from '@vaadin/a11y-base/src/focus-utils.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';

/**
 * @polymerMixin
 * @mixes PositionMixin
 */
export const ComboBoxOverlayMixin = (superClass) =>
  class ComboBoxOverlayMixin extends PositionMixin(superClass) {
    static get observers() {
      return ['_setOverlayWidth(positionTarget, opened)'];
    }

    constructor() {
      super();

      this.requiredVerticalSpace = 200;
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      const comboBox = this._comboBox;

      const hostDir = comboBox && comboBox.getAttribute('dir');
      if (hostDir) {
        this.setAttribute('dir', hostDir);
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
      const propPrefix = this.localName;
      this.style.setProperty(`--_${propPrefix}-default-width`, `${this.positionTarget.clientWidth}px`);

      const customWidth = getComputedStyle(this._comboBox).getPropertyValue(`--${propPrefix}-width`);

      if (customWidth === '') {
        this.style.removeProperty(`--${propPrefix}-width`);
      } else {
        this.style.setProperty(`--${propPrefix}-width`, customWidth);
      }
    }

    /** @private */
    _setOverlayWidth(positionTarget, opened) {
      if (positionTarget && opened) {
        this._updateOverlayWidth();

        this._updatePosition();
      }
    }
  };
