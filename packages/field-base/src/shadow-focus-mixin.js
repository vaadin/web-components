/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { KeyboardMixin } from '@vaadin/component-base/src/keyboard-mixin.js';
import { DelegateFocusMixin } from './delegate-focus-mixin.js';

/**
 * A mixin to forward focus to an element in the shadow DOM.
 *
 * @polymerMixin
 * @mixes DelegateFocusMixin
 * @mixes KeyboardMixin
 */
export const ShadowFocusMixin = (superClass) =>
  class ShadowFocusMixinClass extends DelegateFocusMixin(KeyboardMixin(superClass)) {
    static get properties() {
      return {
        /**
         * Indicates whether the element can be focused and where it participates in sequential keyboard navigation.
         *
         * @override
         * @protected
         */
        tabindex: {
          type: Number,
          value: 0
        }
      };
    }

    /**
     * Override an event listener from `KeyboardMixin`
     * to prevent focusing the host element on Shift Tab.
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      super._onKeyDown(event);

      // When focus moves with Shift + Tab, skip focusing the host element
      // by focusing it before the default browser focus handling runs
      if (!event.defaultPrevented && event.keyCode === 9 && event.shiftKey) {
        HTMLElement.prototype.focus.apply(this);
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

        // When focus moves to the host element itself, then delegate it to the focusElement
        // This should only move focus when using keyboard navigation, for clicks we don't want to interfere,
        // for example when the user tries to select some text
        if (path[0] === this && this._keyboardActive) {
          this.focusElement.focus();
        }
        if (path[0] === this || path.includes(this.focusElement)) {
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
          this._lastTabIndex = tabindex;
        }
        this.tabindex = undefined;
      }
    }
  };
