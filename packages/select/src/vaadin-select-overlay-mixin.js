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
    /**
     * Override getter from `OverlayMixin` to customize renderer root.
     * @override
     * @protected
     */
    get _rendererRoot() {
      if (!this.__savedRoot) {
        const root = document.createElement('div');
        root.setAttribute('slot', 'overlay');
        this.owner.appendChild(root);
        this.__savedRoot = root;
      }

      return this.__savedRoot;
    }

    /** @protected */
    _attachOverlay() {
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

    /** @protected */
    _getMenuElement() {
      return (
        this.owner.querySelector('vaadin-select-list-box') ||
        Array.from(this._rendererRoot.children).find((el) => el.localName !== 'style' && el.localName !== 'slot')
      );
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
