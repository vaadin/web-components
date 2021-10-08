/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { KeyboardMixin } from '@vaadin/component-base/src/keyboard-mixin.js';
import { TabindexMixin } from '@vaadin/component-base/src/tabindex-mixin.js';
import { DelegateFocusMixin } from './delegate-focus-mixin.js';

/**
 * A mixin to forward focus to an element in the shadow DOM.
 *
 * @polymerMixin
 * @mixes DelegateFocusMixin
 * @mixes KeyboardMixin
 * @mixes TabindexMixin
 */
export const ShadowFocusMixin = (superClass) =>
  class ShadowFocusMixinClass extends TabindexMixin(DelegateFocusMixin(KeyboardMixin(superClass))) {
    /**
     * Override an event listener from `KeyboardMixin`
     * to prevent setting `focused` on Shift Tab.
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      super._onKeyDown(event);

      // When focus moves with Shift + Tab, do not mark host as focused.
      // The flag set here will be later used in focusin event listener.
      if (!event.defaultPrevented && event.keyCode === 9 && event.shiftKey) {
        this._isShiftTabbing = true;
        HTMLElement.prototype.focus.apply(this);
        this._setFocused(false);
        setTimeout(() => (this._isShiftTabbing = false), 0);
      }
    }

    /**
     * Override method inherited from `FocusMixin`
     * to support focusElement in Shadow DOM.
     * @param {Event} event
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldSetFocus(event) {
      if (!this.disabled && this.focusElement) {
        const path = event.composedPath();

        // When focus moves from outside and not with Shift + Tab, delegate it to focusElement.
        if (path[0] === this && !this.contains(event.relatedTarget) && !this._isShiftTabbing) {
          this.focusElement.focus();
          return true;
        }

        if (path.includes(this.focusElement)) {
          return true;
        }
      }

      return false;
    }

    /**
     * Override an observer from `TabindexMixin`.
     * Do not call super to remove tabindex attribute
     * from host when disabled by setting undefined.
     * @param {string} tabindex
     * @protected
     * @override
     */
    _tabindexChanged(tabindex) {
      if (tabindex !== undefined) {
        this.focusElement.tabIndex = tabindex;
      }

      if (this.disabled && tabindex) {
        // If tabindex attribute was changed while component was disabled
        if (tabindex !== -1) {
          this.__lastTabIndex = tabindex;
        }
        this.tabindex = undefined;
      }
    }
  };
