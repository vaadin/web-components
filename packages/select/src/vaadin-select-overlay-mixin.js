/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
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
    ready() {
      super.ready();

      this.restoreFocusOnClose = true;
    }

    /** @protected */
    _getMenuElement() {
      return Array.from(this.children).find((el) => el.localName !== 'style');
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
  };
