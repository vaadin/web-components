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
      return ['_updateOverlayWidth(opened, owner)'];
    }

    /** @protected */
    _attachOverlay() {
      this.setAttribute('popover', 'manual');
      this.showPopover();
    }

    /** @protected */
    _detachOverlay() {
      this.hidePopover();
    }

    /**
     * @protected
     * @override
     */
    _shouldRestoreFocus() {
      // Default implementation checks for element to be either in body
      // or a child of the overlay, but in select it's actually slotted
      // so we override the check here to always restore focus on close
      // except for Tab key, when `restoreFocusOnClose` is set to false.
      return true;
    }

    /** @protected */
    _getMenuElement() {
      return (
        this.owner.querySelector('vaadin-select-list-box') ||
        Array.from(this.children).find((el) => el.localName !== 'style' && el.localName !== 'slot')
      );
    }

    /** @private */
    _updateOverlayWidth(opened, owner) {
      if (opened && owner) {
        const widthProperty = '--vaadin-select-overlay-width';
        const customWidth = getComputedStyle(owner).getPropertyValue(widthProperty);

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
