/**
 * @license
 * Copyright (c) 2015 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
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

    /** @private */
    _setOverlayWidth(positionTarget, opened) {
      if (positionTarget && opened) {
        const propPrefix = this.localName;
        this.style.setProperty(`--_${propPrefix}-default-width`, `${positionTarget.clientWidth}px`);

        const customWidth = getComputedStyle(this._comboBox).getPropertyValue(`--${propPrefix}-width`);

        if (customWidth === '') {
          this.style.removeProperty(`--${propPrefix}-width`);
        } else {
          this.style.setProperty(`--${propPrefix}-width`, customWidth);
        }

        this._updatePosition();
      }
    }
  };
