/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';

/**
 * @polymerMixin
 * @mixes DirMixin
 * @mixes OverlayMixin
 * @mixes PositionMixin
 */
export const SelectOverlayMixin = (superClass) =>
  class SelectOverlayMixin extends PositionMixin(OverlayMixin(DirMixin(superClass))) {
    static get observers() {
      return ['_updateOverlayWidth(opened, positionTarget)'];
    }

    /** @protected */
    ready() {
      super.ready();

      this.restoreFocusOnClose = true;
    }

    /**
     * Override method inherited from `Overlay` to always close on outside click,
     * in order to avoid problem when using inside of the modeless dialog.
     *
     * @param {Event} event
     * @return {boolean}
     * @protected
     */
    _shouldCloseOnOutsideClick(_event) {
      return true;
    }

    /**
     * @protected
     * @override
     */
    _mouseDownListener(event) {
      super._mouseDownListener(event);

      // Prevent global mousedown event to avoid losing focus on outside click
      event.preventDefault();
    }

    /** @protected */
    _getMenuElement() {
      return Array.from(this.children).find((el) => el.localName !== 'style');
    }

    /** @private */
    _updateOverlayWidth(opened, positionTarget) {
      if (opened && positionTarget) {
        this.style.setProperty('--_vaadin-select-overlay-default-width', `${positionTarget.offsetWidth}px`);

        const widthProperty = '--vaadin-select-overlay-width';
        const customWidth = getComputedStyle(this.owner).getPropertyValue(widthProperty);

        if (customWidth === '') {
          this.style.removeProperty(widthProperty);
        } else {
          this.style.setProperty(widthProperty, customWidth);
        }
      }
    }

    requestContentUpdate() {
      super.requestContentUpdate();

      if (this.owner) {
        // Ensure menuElement reference is correct.
        const menuElement = this._getMenuElement();
        this.owner._assignMenuElement(menuElement);
      }
    }
  };
