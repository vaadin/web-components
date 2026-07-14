/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { getFlattenedElements } from '@vaadin/component-base/src/dom-utils.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';

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
     * Override method from OverlayFocusMixin to use slotted div as content root.
     * @protected
     * @override
     */
    get _contentRoot() {
      return this._rendererRoot;
    }

    /**
     * Override method from OverlayMixin to use slotted div as a renderer root.
     * @protected
     * @override
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
      const slot = this.owner.shadowRoot.querySelector('slot[name="overlay"]');
      // The list-box is either slotted directly or rendered into the renderer root.
      return getFlattenedElements(slot).find((el) => el._hasVaadinListMixin);
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
