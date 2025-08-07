/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ContextMenuMixin } from '@vaadin/context-menu/src/vaadin-context-menu-mixin.js';

/**
 * @polymerMixin
 * @mixes ContextMenuMixin
 * @param {function(new:HTMLElement)} superClass
 */
export const SubMenuMixin = (superClass) =>
  class SubMenuMixinClass extends ContextMenuMixin(superClass) {
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
    _openedChanged() {
      // Do nothing
    }

    /**
     * Overriding the public method to reset expanded button state.
     */
    close() {
      super.close();

      // Only handle 1st level submenu
      if (this.hasAttribute('is-root')) {
        this.parentElement._close();
      }
    }

    /**
     * Override method from `ContextMenuMixin` to prevent closing
     * sub-menu on the same click event that was used to open it.
     *
     * @param {Event} event
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldCloseOnOutsideClick(event) {
      if (this.hasAttribute('is-root') && event.composedPath().includes(this.listenOn)) {
        return false;
      }

      return super._shouldCloseOnOutsideClick(event);
    }
  };
