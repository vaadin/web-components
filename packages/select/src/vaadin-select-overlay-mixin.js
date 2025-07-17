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
     * @override
     * @protected
     */
    get _contentRoot() {
      if (!this.__savedRoot) {
        const root = document.createElement('div');
        root.setAttribute('slot', 'overlay');
        this.owner.appendChild(root);
        this.__savedRoot = root;
      }

      return this.__savedRoot;
    }

    /**
     * @protected
     * @override
     */
    _attachOverlay() {
      this.showPopover();
    }

    /**
     * @protected
     * @override
     */
    _detachOverlay() {
      this.hidePopover();
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
      return Array.from(this._contentRoot.children).find((el) => el.localName !== 'style');
    }

    /** @private */
    _updateOverlayWidth(opened, positionTarget) {
      if (opened && positionTarget) {
        this.style.setProperty('--_vaadin-select-overlay-default-width', `${positionTarget.offsetWidth}px`);
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
