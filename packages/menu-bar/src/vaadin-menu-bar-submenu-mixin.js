/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { ContextMenuMixin } from '@vaadin/context-menu/src/vaadin-context-menu-mixin.js';

/**
 * @polymerMixin
 * @mixes ContextMenuMixin
 * @mixes OverlayClassMixin
 */
export const SubMenuMixin = (superClass) =>
  class SubMenuMixinClass extends ContextMenuMixin(OverlayClassMixin(superClass)) {
    constructor() {
      super();

      this.openOn = 'opensubmenu';
    }

    /**
     * Tag name prefix used by overlay, list-box and items.
     * @protected
     * @return {string}
     */
    get _tagNamePrefix() {
      return 'vaadin-menu-bar';
    }

    /**
     * Overriding the observer to not add global "contextmenu" listener.
     */
    _openedChanged(opened) {
      this._overlayElement.opened = opened;
    }

    /**
     * Overriding the public method to reset expanded button state.
     */
    close() {
      super.close();

      // Only handle 1st level submenu
      if (this.hasAttribute('is-root')) {
        this.getRootNode().host._close();
      }
    }
  };
